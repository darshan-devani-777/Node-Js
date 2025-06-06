import { useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Login error");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
  <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
    <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 underline">
      Login
    </h2>
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="email"
        placeholder="Email"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setForm({ ...form, email: e.target.value })}
      />
      <input
        type="password"
        placeholder="Password"
        required
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        onChange={(e) => setForm({ ...form, password: e.target.value })}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 transition cursor-pointer"
      >
        Login
      </button>

      <p className="text-center text-sm text-gray-600 mt-4">
        Don’t have an account?{" "}
        <Link
          to="/register"
          className="text-blue-600 hover:underline font-medium"
        >
          Register
        </Link>
      </p>
    </form>
  </div>
</div>

  );
}
