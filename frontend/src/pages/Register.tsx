import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnimatedLayout from "../components/AnimatedLayout";
import SolarSystem from "../components/SolarSystem";
import Toast from "../components/Toast";

function Register() {
  const location = useLocation();
  const navigate = useNavigate();
  const focus = location.state?.focus;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await api.post("/auth/register", {
        name,
        email,
        password,
      });

      setToast({ message: "Registered successfully", type: "success" });

      setTimeout(() => {
        navigate("/login", { state: { focus: "earth" } });
      }, 1500);
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Email already exists",
        type: "error",
      });
    }
  };

  return (
    <AnimatedLayout>
      {/* ✅ TOAST RENDERING */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <SolarSystem focus={focus} />

      <div className="relative z-10 bg-black/40 p-8 rounded-xl w-full max-w-md border border-white/20">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            className="w-full p-3 rounded bg-white text-black placeholder-gray-500"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <input
            className="w-full p-3 rounded bg-white text-black placeholder-gray-500"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            className="w-full p-3 rounded bg-white text-black placeholder-gray-500"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button className="w-full bg-green-600 py-3 rounded">
            Register
          </button>
        </form>
      </div>
    </AnimatedLayout>
  );
}

export default Register;
