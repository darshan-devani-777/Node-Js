"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        router.push("/protected");
      }
    }
  }, []);
  
  const handleSubmit = (e) => {
    e.preventDefault();
    
    const storedUsername = localStorage.getItem("registeredUsername");
    const storedPassword = localStorage.getItem("registeredPassword");
    
    if (username === storedUsername && password === storedPassword) {
      localStorage.setItem("isLoggedIn", "true");
      window.dispatchEvent(new Event("storageChanged")); 
      router.push("/protected");
    } else {
      alert("Invalid credentials, Please Register...");
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 border border-gray-700 rounded-lg shadow-lg bg-gray-900">
      <h2 className="text-2xl font-semibold text-center text-white underline mb-4">Login</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="username" className="block mb-2 font-medium text-gray-300">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <div>
          <label htmlFor="password" className="block mb-2 font-medium text-gray-300">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-600 rounded-lg bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
          />
        </div>
        <button
          type="submit"
          className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition duration-200 cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}
