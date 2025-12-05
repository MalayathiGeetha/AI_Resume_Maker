import React, { useState } from "react";
import { signupUser } from "../api/AuthService";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";

function Signup() {
  const [form, setForm] = useState({ fullName: "", email: "", password: "" });
  const nav = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    try {
      await signupUser(form);
      toast.success("Account created successfully!");
      nav("/login");
    } catch (err) {
      toast.error("Error signing up");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-base-200">
      <div className="card w-96 bg-base-100 shadow-xl p-6">
        <h2 className="text-3xl font-bold text-center mb-6">Sign Up</h2>

        <input
          className="input input-bordered w-full mb-4"
          placeholder="Full Name"
          name="fullName"
          value={form.fullName}
          onChange={handleChange}
        />

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

        <button className="btn btn-primary w-full" onClick={handleSubmit}>
          Sign Up
        </button>

        <p className="text-center mt-4">
          Already have an account?{" "}
          <a href="/login" className="text-blue-600 font-semibold">
            Login
          </a>
        </p>
      </div>
    </div>
  );
}

export default Signup;

