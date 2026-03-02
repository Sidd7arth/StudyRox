import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok) {
        throw new Error(data?.message || "Login failed. Please try again.");
      }

      login(data);
      if (data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-indigo-900 to-sky-700 px-4">
      <div className="max-w-5xl w-full grid md:grid-cols-2 gap-10 items-center">
        <div className="hidden md:block text-white space-y-4">
          <h1 className="text-4xl font-bold leading-tight">
            Welcome back to <span className="text-sky-300">StudyRox</span>
          </h1>
          <p className="text-slate-200 text-sm leading-relaxed">
            Continue your learning journey with interactive lessons, real-world projects,
            and personalized progress tracking.
          </p>
          <ul className="space-y-2 text-sm text-slate-200">
            <li>• Track your course progress</li>
            <li>• Access saved lessons and quizzes</li>
            <li>• Earn certificates as you complete paths</li>
          </ul>
        </div>

        <div className="bg-white/95 backdrop-blur-md shadow-2xl rounded-2xl p-8 md:p-10">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-6 text-slate-800">
            Sign in
          </h2>

          {error && (
            <div className="bg-red-100 text-red-600 p-2 mb-4 rounded-xl text-sm">
              {error}
            </div>
          )}

          <form onSubmit={submitHandler} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Your password"
                className="w-full px-4 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 bg-gradient-to-r from-indigo-600 to-sky-500 hover:from-indigo-700 hover:to-sky-600 text-white py-2.5 rounded-xl font-semibold transition-transform duration-150 hover:scale-[1.01] shadow-lg shadow-indigo-500/30 disabled:opacity-70"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          <p className="text-center mt-6 text-sm text-slate-600">
            No account?{" "}
            <Link to="/register" className="text-indigo-600 font-semibold hover:underline">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
