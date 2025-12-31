import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AnimatedLayout from "../components/AnimatedLayout";

function Landing() {
  const navigate = useNavigate();

  const goToLogin = () => {
    navigate("/login", { state: { focus: "earth" } });
  };

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/dashboard");
    }
  }, [navigate]);

  return (
    <AnimatedLayout>
      <div className="text-center bg-black/30 p-10 rounded-2xl border border-white/20">
        <h1 className="text-5xl font-extrabold mb-6 glow-text">
          Collaborative Task Manager
        </h1>

        <p className="text-lg glow-subtext mb-8">
          Real-time collaboration across your universe
        </p>

        <div className="flex gap-6 justify-center">
          <button
            onClick={goToLogin}
            className="px-8 py-3 bg-blue-600 rounded-lg hover:scale-110 transition"
          >
            Login
          </button>

          <button
  onClick={() => navigate("/register", { state: { focus: "mars" } })}
  className="px-8 py-3 bg-green-600 rounded-lg hover:scale-110 transition"
>
  Register
</button>

        </div>
      </div>
    </AnimatedLayout>
  );
}

export default Landing;
