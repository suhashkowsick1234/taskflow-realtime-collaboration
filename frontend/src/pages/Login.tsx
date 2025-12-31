import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../api/axios";
import AnimatedLayout from "../components/AnimatedLayout";
import SolarSystem from "../components/SolarSystem";
import Toast from "../components/Toast";

function Login() {
  const location = useLocation();
  const navigate = useNavigate();
  const focus = location.state?.focus;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [toast, setToast] = useState<{
    message: string;
    type: "success" | "error";
  } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", {
        email,
        password,
      });

      // 🔥 CRITICAL FIX — clear bad old values
      localStorage.clear();
      console.log("LOGIN RESPONSE:", res.data);
      console.log("TOKEN TYPE:", typeof res.data.token);

      // ✅ STORE ONLY STRINGS
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.user.id);

      setToast({ message: "Login successful 🚀", type: "success" });

      // Smooth transition
      setTimeout(() => {
        navigate("/dashboard");
      }, 1200);
    } catch (err: any) {
      setToast({
        message: err.response?.data?.message || "Wrong email or password",
        type: "error",
      });
    }
  };

  return (
    <AnimatedLayout>
      {/* ✅ TOAST */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <SolarSystem focus={focus} />

      <div className="relative z-10 bg-black/40 p-8 rounded-xl w-full max-w-md border border-white/20">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
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

          <button className="w-full bg-blue-600 py-3 rounded hover:bg-blue-700 transition">
            Login
          </button>
        </form>
      </div>
    </AnimatedLayout>
  );
}

export default Login;
