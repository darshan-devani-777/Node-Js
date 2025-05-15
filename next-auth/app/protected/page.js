"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function ProtectedPage() {
  const router = useRouter();
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const isLoggedIn = localStorage.getItem("isLoggedIn");
      if (isLoggedIn === "true") {
        setAuthorized(true);
      } else {
        router.push("/login");
      }
    }
  }, []);

  if (!authorized) return null;

  return (
    <div className="h-auto overflow-hidden flex items-center justify-center bg-gradient-to-br from-green-100 to-green-200 dark:from-gray-900 dark:to-gray-800 transition-colors duration-300 rounded-xl">
      <div className="bg-white dark:bg-gray-900 dark:border-gray-700 p-10 rounded-2xl shadow-2xl text-center w-full max-w-lg">
        <h1 className="text-3xl font-extrabold text-green-600 dark:text-green-400 mb-4">
          🎉 Protected Page
        </h1>
        <p className="text-gray-700 dark:text-gray-300 text-lg">
          Welcome! You are <span className="font-semibold">successfully logged in</span>.
        </p>
      </div>
    </div>
  );
}
