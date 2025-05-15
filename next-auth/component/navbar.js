"use client";
import { useEffect, useState } from "react";

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const checkLoginStatus = () => {
    const loginStatus = localStorage.getItem("isLoggedIn");
    setIsLoggedIn(loginStatus === "true");
  };

  useEffect(() => {
    checkLoginStatus();

    const handleStorageChange = () => {
      checkLoginStatus();
    };

    window.addEventListener("storageChanged", handleStorageChange);

    return () => {
      window.removeEventListener("storageChanged", handleStorageChange);
    };
  }, []);

  return (
    <nav className="bg-gray-800 shadow-lg p-4 flex justify-between items-center w-full  mx-auto">
      <a
        href="/"
        className="text-2xl font-bold text-gray-300 hover:text-blue-400 transition duration-300 ease-in-out"
      >
        Home
      </a>

      <div className="space-x-6">
        {!isLoggedIn && (
          <>
            <a
              href="/register"
              className="text-lg text-blue-300 hover:text-white hover:bg-blue-500 hover:underline py-2 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Register
            </a>
            <a
              href="/login"
              className="text-lg text-blue-300 hover:text-white hover:bg-green-500 hover:underline py-2 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Login
            </a>
          </>
        )}
        {isLoggedIn && (
          <>
            <a
              href="/protected"
              className="text-lg text-blue-300 hover:text-white hover:bg-blue-500 hover:underline py-2 px-2 rounded-md transition duration-300 ease-in-out transform hover:scale-105"
            >
              Main
            </a>

            <a
              href="/logout"
              className="text-lg text-red-500 hover:text-white hover:bg-red-700 border border-red-500 rounded-full py-2 px-6 font-semibold transition duration-300 ease-in-out transform hover:scale-105"
            >
              Logout
            </a>
          </>
        )}
      </div>
    </nav>
  );
}
