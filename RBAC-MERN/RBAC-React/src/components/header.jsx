import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    setUser(storedUser);
    setToken(storedToken);
  }, [location]);

  // LOGOUT
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  const isLoggedIn = !!token;
  const currentPath = location.pathname;

  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        {isLoggedIn && user ? (
          <div className="text-white">
            <div className="flex items-center gap-2 text-red-300 text-xl font-medium cursor-pointer">
              <span onClick={() => navigate("/dashboard")}>👤</span>
              <p>{user.name}</p>
            </div>

            <p className="text-sm text-blue-300 mt-1">
              ( {user.role.charAt(0).toUpperCase() + user.role.slice(1)} )
            </p>
          </div>
        ) : (
          <div className="text-xl font-bold text-red-400">
            Role Based Access
          </div>
        )}
      </div>

      <div className="">
        <h1 className="text-2xl text-gray-200 underline">Role Based Access</h1>
      </div>

      <nav className="flex gap-5 items-center">
        {!isLoggedIn ? (
          <>
            <Link
              to="/login"
              className={`px-4 py-2 rounded font-medium ${
                currentPath === "/login"
                  ? "bg-white text-blue-600 border border-blue-600"
                  : "text-white hover:text-red-300"
              }`}
            >
              Login
            </Link>
            <Link
              to="/register"
              className={`px-4 py-2 rounded font-medium ${
                currentPath === "/register"
                  ? "bg-white text-blue-600 border border-blue-600"
                  : "text-white hover:text-red-300"
              }`}
            >
              Register
            </Link>
          </>
        ) : (
          <>
            {(user.role === "admin" ||
              user.role === "superadmin" ||
              user.role === "user") && (
              <>
                <Link
                  to="/dashboard"
                  className={`font-medium ${
                    currentPath === "/dashboard"
                      ? "text-blue-300 underline underline-offset-4 decoration-2"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  Dashboard
                </Link>

                <Link
                  to="/users"
                  className={`font-medium ${
                    currentPath === "/users"
                      ? "text-blue-300 underline underline-offset-4 decoration-2"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  Users
                </Link>

                <Link
                  to="/products"
                  className={`font-medium ${
                    currentPath === "/products"
                      ? "text-blue-300 underline underline-offset-4 decoration-2"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  Products
                </Link>

                <Link
                  to="/carts"
                  className={`font-medium ${
                    currentPath === "/carts"
                      ? "text-blue-300 underline underline-offset-4 decoration-2"
                      : "text-blue-300 hover:text-white"
                  }`}
                >
                  Carts
                </Link>
              </>
            )}

            <button
              onClick={handleLogout}
              className="bg-red-600 px-3 py-1 rounded hover:bg-red-800 transition duration-300 cursor-pointer"
            >
              Logout
            </button>
          </>
        )}
      </nav>
    </header>
  );
}
