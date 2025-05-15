"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");  
  const router = useRouter();

  const handleRegister = (e) => {
    e.preventDefault();

    localStorage.setItem("registeredUsername", username);
    localStorage.setItem("registeredPassword", password);

    alert("Registration successful! Please login.");
    router.push("/login");
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-300 dark:border-gray-700 rounded-lg shadow-md bg-white dark:bg-gray-900">
      <h1 className="text-2xl font-bold mb-6 text-center text-gray-800 dark:text-gray-100 underline">Register</h1>
      <form onSubmit={handleRegister} className="space-y-7">
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Username</label>
          <input
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="Enter username"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <div>
          <label className="block mb-2 font-medium text-gray-700 dark:text-gray-300">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter password"
            required
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 dark:bg-gray-800 dark:text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded hover:bg-blue-800 focus:outline-none focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-700 transition duration-200 cursor-pointer"
        >
          Register
        </button>
      </form>
    </div>
  );
}
