import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

export default function Header() {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("user"));
    const storedToken = localStorage.getItem("token");
    setUser(storedUser);
    setToken(storedToken);
    setShowMobileMenu(false);
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
    <header className="bg-gray-800 text-white p-4">
      <div className="flex justify-between items-center">
        {/* 👤 Left: User Info */}
        <div className="flex items-center gap-4">
          {isLoggedIn && user && (
            <div
              className="flex items-center gap-3 cursor-pointer"
              onClick={() => navigate("/profile")}
            >
              {user.image && (
                <img
                  src={`http://localhost:1212/${user.image}`}
                  alt="User"
                  className="w-14 h-14 rounded-full border-2 border-white object-cover"
                />
              )}

              <div className="text-white">
                <p className="text-xl font-semibold text-red-300">
                  {user.name?.trim()}
                </p>
                <p className="text-sm text-blue-300 mt-1">
                  ( {user.role.charAt(0).toUpperCase() + user.role.slice(1)} )
                </p>
              </div>
            </div>
          )}
        </div>

        {/* 🧭 Center: Title */}
        <div>
          <h1 className="text-xl sm:text-2xl text-gray-200 underline text-center">
            Role Based Access
          </h1>
        </div>

        {/* ☰ Right: Hamburger for Mobile */}
        <div className="md:hidden">
          <button
            onClick={() => setShowMobileMenu(!showMobileMenu)}
            className="text-white text-2xl"
          >
            ☰
          </button>
        </div>

        {/* 🖥️ Desktop Nav */}
        <nav className="hidden md:flex gap-5 items-center">
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
              {["admin", "superadmin", "user"].includes(user.role) && (
                <>
                  <Link
                    to="/profile"
                    className={`font-medium ${
                      currentPath === "/profile"
                        ? "text-blue-300 underline underline-offset-4 decoration-2"
                        : "text-blue-300 hover:text-white"
                    }`}
                  >
                    Profile
                  </Link>
                  {user.role !== "user" && (
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
                  )}
                  {user.role !== "user" && (
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
                  )}
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
                  {user.role === "user" && (
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
                  )}
                  <Link
                    to="/orders"
                    className={`font-medium ${
                      currentPath === "/orders"
                        ? "text-blue-300 underline underline-offset-4 decoration-2"
                        : "text-blue-300 hover:text-white"
                    }`}
                  >
                    Orders
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
      </div>

      {/* 📱 Mobile Nav */}
      {showMobileMenu && (
        <nav className="flex flex-col md:hidden gap-3 mt-4">
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
              {["admin", "superadmin", "user"].includes(user.role) && (
                <>
                  <Link to="/profile" className="text-blue-300">
                    Profile
                  </Link>
                  <Link to="/users" className="text-blue-300">
                    Users
                  </Link>
                  <Link to="/products" className="text-blue-300">
                    Products
                  </Link>
                  {user.role === "user" && (
                    <Link to="/carts" className="text-blue-300">
                      Carts
                    </Link>
                  )}
                  <Link to="/orders" className="text-blue-300">
                    Orders
                  </Link>
                </>
              )}
              <button
                onClick={handleLogout}
                className="bg-red-600 px-3 py-1 mt-2 rounded hover:bg-red-800"
              >
                Logout
              </button>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
