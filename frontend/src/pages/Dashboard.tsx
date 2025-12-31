import { useEffect, useState } from "react";
import api from "../api/axios";
import AnimatedLayout from "../components/AnimatedLayout";
import StarBackground from "../components/StarBackground";
import { useNavigate } from "react-router-dom";
import {
  useQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { socket } from "../socket";

/* ------------------ TYPES ------------------ */
type Task = {
  id: string;
  title: string;
  status: string;
  priority?: "LOW" | "MEDIUM" | "HIGH" | "URGENT";
  dueDate?: string;

  creatorId?: string;
  assignedToId?: string | null;

  creator?: {
    id: string;
    name: string;
    email: string;
  };

  assignedTo?: {
    id: string;
    name: string;
    email: string;
  } | null;
};

type User = {
  id: string;
  name: string;
  email: string;
};


type ViewMode = "ALL" | "CREATED" | "ASSIGNED" | "OVERDUE";

function Dashboard() {
  const [title, setTitle] = useState("");
  const [view, setView] = useState<ViewMode>("ALL");

  /* STEP 3 STATE */
  const [priority, setPriority] = useState<"LOW" | "MEDIUM" | "HIGH" | "URGENT">("MEDIUM");
  const [dueDate, setDueDate] = useState("");

  const [statusFilter, setStatusFilter] = useState("ALL");
  const [priorityFilter, setPriorityFilter] = useState("ALL");
  const [sortOrder, setSortOrder] = useState<"ASC" | "DESC">("ASC");

  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const userId = localStorage.getItem("userId");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  

  /* ------------------ FETCH TASKS ------------------ */
  const { data: tasks = [], isLoading } = useQuery<Task[]>({
    queryKey: ["tasks"],
    queryFn: async () => {
      const res = await api.get("/tasks");
      return res.data;
    },
  });

  /* ------------------ FETCH USERS ------------------ */
const { data: users = [] } = useQuery<User[]>({
  queryKey: ["users"],
  queryFn: async () => {
    const res = await api.get("/users");
    return res.data;
  },
});


const { data: notifications = [] } = useQuery({
  queryKey: ["notifications"],
  queryFn: () => api.get("/notifications").then(res => res.data),
});



  /* ------------------ FILTER + SORT ------------------ */
  const filteredTasks = tasks
    .filter((task) => {
      if (!userId) return true;

      if (view === "CREATED" && task.creatorId !== userId) return false;
      if (view === "ASSIGNED" && task.assignedToId !== userId) return false;
      if (
        view === "OVERDUE" &&
        (!task.dueDate ||
          new Date(task.dueDate) >= new Date() ||
          task.status === "COMPLETED")
      )
        return false;

      if (statusFilter !== "ALL" && task.status !== statusFilter)
        return false;

      if (priorityFilter !== "ALL" && task.priority !== priorityFilter)
        return false;

      return true;
    })
    .sort((a, b) => {
      if (!a.dueDate || !b.dueDate) return 0;
      const diff =
        new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
      return sortOrder === "ASC" ? diff : -diff;
    });

  /* ------------------ MUTATIONS ------------------ */
  const createTaskMutation = useMutation({
    mutationFn: (data: any) => api.post("/tasks", data),
    onSuccess: () => {
      setTitle("");
      setToast({ message: "Task added successfully", type: "success" });
    },
  });

  const updateTaskMutation = useMutation({
  mutationFn: ({ id, status }: { id: string; status: string }) =>
    api.put(`/tasks/${id}`, { status }),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setToast({ message: "Task updated successfully", type: "success" });
  },

  onError: () => {
    setToast({ message: "Update failed", type: "error" });
  },
});


  const deleteTaskMutation = useMutation({
  mutationFn: (id: string) => api.delete(`/tasks/${id}`),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setToast({ message: "Task deleted successfully", type: "success" });
  },

  onError: () => {
    setToast({ message: "Delete failed", type: "error" });
  },
});


  const assignTaskMutation = useMutation({
  mutationFn: ({ taskId, userId }: { taskId: string; userId: string }) =>
    api.patch(`/tasks/${taskId}/assign`, { userId }),

  onSuccess: () => {
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
    setToast({ message: "Task assigned successfully", type: "success" });
  },

  onError: () => {
    setToast({ message: "Assignment failed", type: "error" });
  },
});


  /* ------------------ HANDLERS ------------------ */
  const createTask = (e: React.FormEvent) => {
  e.preventDefault();

  if (title.length < 3) {
    setToast({ message: "Title must be at least 3 characters", type: "error" });
    return;
  }

  createTaskMutation.mutate({
    title,
    description: "Task created from dashboard",
    priority,
    dueDate: dueDate
      ? new Date(dueDate).toISOString()
      : new Date().toISOString(),
    status: "TODO",
  });
};


  const updateTask = (id: string, status: string) => {
  updateTaskMutation.mutate({ id, status });
};

const deleteTask = (id: string) => {
  deleteTaskMutation.mutate(id);
};

const assignTask = (taskId: string, targetUserId?: string) => {
  const assignTo = targetUserId || userId;

  if (!assignTo) {
    setToast({ message: "User not found", type: "error" });
    return;
  }

  assignTaskMutation.mutate({ taskId, userId: assignTo });
};



  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  /* ------------------ SOCKET.IO (STEP 4.2) ------------------ */
  useEffect(() => {
  socket.on("task:created", (task: Task) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old) =>
      old ? [...old, task] : [task]
    );
  });

  socket.on("task:updated", (updated: Task) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old) =>
      old ? old.map((t) => (t.id === updated.id ? updated : t)) : []
    );
  });

  socket.on("task:deleted", ({ id }: { id: string }) => {
    queryClient.setQueryData<Task[]>(["tasks"], (old) =>
      old ? old.filter((t) => t.id !== id) : []
    );
  });

  socket.on(
  "task:assigned",
  (data: { taskId: string; title: string; assignedToId: string }) => {
    const currentUserId = localStorage.getItem("userId");

    if (data.assignedToId === currentUserId) {
      setToast({
        message: `📌 Task "${data.title}" assigned to you`,
        type: "success",
      });
    }

    // 🔄 Refresh tasks WITHOUT page reload
    queryClient.invalidateQueries({ queryKey: ["tasks"] });
  }
);


  return () => {
    socket.off("task:created");
    socket.off("task:updated");
    socket.off("task:deleted");
    socket.off("task:assigned");
  };
}, [queryClient]);

  /* ------------------ TOAST AUTO CLOSE ------------------ */
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 2000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  /* ------------------ UI ------------------ */
  return (
    <AnimatedLayout>
      <StarBackground />

      <div className="relative z-10 p-10 text-white">
        <h1 className="text-4xl font-bold mb-6">🚀 Dashboard Control</h1>

        {/* VIEW SELECTOR */}
        <div className="flex gap-3 mb-4">
          {[
            { label: "All", value: "ALL" },
            { label: "Created by Me", value: "CREATED" },
            { label: "Assigned to Me", value: "ASSIGNED" },
            { label: "Overdue", value: "OVERDUE" },
          ].map((btn) => (
            <button
              key={btn.value}
              onClick={() => setView(btn.value as ViewMode)}
              className={`px-4 py-2 rounded-full text-sm font-semibold
                ${
                  view === btn.value
                    ? "bg-blue-600 text-white"
                    : "bg-white/10 text-gray-300"
                }`}
            >
              {btn.label}
            </button>
          ))}
        </div>

        {/* FILTERS */}
        <div className="flex flex-wrap gap-4 mb-6">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option value="ALL">All Status</option>
            <option value="TODO">TODO</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="REVIEW">REVIEW</option>
            <option value="COMPLETED">COMPLETED</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="p-2 rounded text-black"
          >
            <option value="ALL">All Priority</option>
            <option value="LOW">LOW</option>
            <option value="MEDIUM">MEDIUM</option>
            <option value="HIGH">HIGH</option>
            <option value="URGENT">URGENT</option>
          </select>

          <select
            value={sortOrder}
            onChange={(e) =>
              setSortOrder(e.target.value as "ASC" | "DESC")
            }
            className="p-2 rounded text-black"
          >
            <option value="ASC">Due Date ↑</option>
            <option value="DESC">Due Date ↓</option>
          </select>
        </div>

        {/* CREATE TASK */}
        <form onSubmit={createTask} className="mb-6 flex flex-col gap-3 max-w-2xl">

  <input
    className="p-3 rounded text-black"
    placeholder="New task title..."
    value={title}
    onChange={(e) => setTitle(e.target.value)}
  />

  <div className="flex gap-3">
    {/* PRIORITY */}
    <select
      value={priority}
      onChange={(e) =>
        setPriority(e.target.value as "LOW" | "MEDIUM" | "HIGH" | "URGENT")
      }
      className="p-2 rounded text-black"
    >
      <option value="LOW">LOW</option>
      <option value="MEDIUM">MEDIUM</option>
      <option value="HIGH">HIGH</option>
      <option value="URGENT">URGENT</option>
    </select>

    {/* DUE DATE */}
    <input
      type="date"
      value={dueDate}
      onChange={(e) => setDueDate(e.target.value)}
      className="p-2 rounded text-black"
    />
  </div>

  <button className="bg-green-600 px-6 py-2 rounded">
    Add Task
  </button>
</form>


        {/* TASK LIST */}
        {isLoading ? (
          <p>Loading tasks...</p>
        ) : filteredTasks.length === 0 ? (
          <p className="text-gray-400">No tasks found.</p>
        ) : (
          <div className="space-y-4 max-w-2xl">
            {filteredTasks.map((task) => (
              <div
                key={task.id}
                className="bg-black/40 border border-white/20 p-4 rounded-xl"
              >
                <h2 className="font-semibold">{task.title}</h2>
                

                <p className="text-xs text-gray-400 mt-1">
                  Created by: <span className="font-semibold">{task.creator?.name}</span>
                </p>

                <p className="text-sm text-gray-300">
  Status: {task.status} | Priority: {task.priority}

  {task.assignedTo?.id === userId && (
    <span className="ml-2 text-xs bg-green-700 px-2 py-1 rounded-full">
      Assigned to you
    </span>
  )}
</p>


                {task.assignedTo ? (
  <p className="text-xs text-green-400 mt-2">
    Assigned to: <span className="font-semibold">{task.assignedTo.name}</span>
  </p>
) : (
  <div className="flex gap-2 mt-2">
    <button
      onClick={() => assignTask(task.id)}
      className="bg-blue-600 px-3 py-1 rounded text-xs"
    >
      Assign to me
    </button>

    <select
      defaultValue=""
      onChange={(e) => assignTask(task.id, e.target.value)}
      className="text-black text-xs rounded p-1"
    >
      <option value="" disabled>
        Assign to user
      </option>

      {users
        .filter((u) => u.id !== userId)
        .map((user) => (
          <option key={user.id} value={user.id}>
            {user.name}
          </option>
        ))}
    </select>
  </div>
)}

<div className="fixed top-6 left-6 bg-black/60 p-4 rounded-xl text-white">
  <h3 className="font-bold mb-2">🔔 Notifications</h3>

  {notifications.length === 0 ? (
    <p className="text-gray-400 text-sm">No notifications</p>
  ) : (
    notifications.map((n: any) => (
      <div
        key={n.id}
        className={`text-sm p-2 rounded mb-1 ${
          n.isRead ? "opacity-50" : "bg-blue-600"
        }`}
      >
        {n.message}
      </div>
    ))
  )}
</div>


                <div className="flex gap-2 mt-2">
                  <select
                    value={task.status}
                    onChange={(e) =>
                      updateTask(task.id, e.target.value)
                    }
                    className="text-black rounded p-1"
                  >
                    <option value="TODO">TODO</option>
                    <option value="IN_PROGRESS">IN_PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>

                  <button
                    onClick={() => deleteTask(task.id)}
                    className="bg-red-500 px-3 rounded"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        onClick={logout}
        className="fixed bottom-6 right-6 bg-red-600 px-6 py-3 rounded-full
                   text-white font-semibold shadow-lg"
      >
        Logout
      </button>

      {toast && (
        <div
          className={`fixed top-6 right-6 z-50 px-6 py-3 rounded-xl text-white
          ${toast.type === "success" ? "bg-green-600" : "bg-red-600"}`}
        >
          {toast.message}
        </div>
      )}
    </AnimatedLayout>
  );
}

export default Dashboard;
