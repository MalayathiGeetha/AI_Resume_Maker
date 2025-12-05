import React, { useState } from "react";
import { loginUser } from "../api/AuthService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const res = await loginUser(form);

      localStorage.setItem("token", res.token); // save JWT
      toast.success("Login Successful");
      nav("/"); // redirect to home
    } catch (err) {
      toast.error("Invalid credentials!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Login</h2>

        <input
          className="input input-bordered w-full mb-4"
          placeholder="Email"
          name="email"
          value={form.email}
          onChange={handleChange}
        />

        <input
          className="input input-bordered w-full mb-4"
          placeholder="Password"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
        />

        <button
          className="btn btn-primary w-full"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? <span className="loading loading-spinner"></span> : "Login"}
        </button>

        <p className="text-center mt-4">
          Don't have an account?{" "}
          <a href="/signup" className="text-blue-600 font-semibold">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

export default Login;

