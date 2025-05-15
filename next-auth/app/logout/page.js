"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LogoutPage() {
  const router = useRouter();

  useEffect(() => {
    localStorage.removeItem("isLoggedIn");
    window.dispatchEvent(new Event("storageChanged")); 
    router.push("/login");
  }, [router]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <p className="text-lg font-semibold text-gray-700">Logging out...</p>
    </div>
  );
}
