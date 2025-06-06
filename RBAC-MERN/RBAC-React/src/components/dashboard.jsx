import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export default function Dashboard() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    let saved = JSON.parse(localStorage.getItem("user"));
    console.log("User from localStorage:", saved);
    if (!saved) return navigate("/login");

    if (!saved._id && saved.id) {
      saved = { ...saved, _id: saved.id };
    }

    setUser(saved);
    setForm({
      name: saved.name,
      email: saved.email,
      role: saved.role,
      password: "",
    });
  }, [navigate]);

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleCancelClick = () => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    console.log("User _id in handleSubmit:", user?._id);

    try {
      const token = localStorage.getItem("token");

      const payload = {
        name: form.name,
        email: form.email,
      };

      if (form.password && form.password.trim() !== "") {
        payload.password = form.password;
      }

      if (user.role === "superadmin") {
        payload.role = form.role;
      }

      const res = await api.put(`/users/${user._id}`, payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.data.success) {
        alert("Profile Updated Successfully!");

        const updatedUser = {
          _id: res.data.user._id || res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
        };

        setUser(updatedUser);
        setForm({
          name: updatedUser.name,
          email: updatedUser.email,
          role: updatedUser.role,
          password: "",
        });

        localStorage.setItem("user", JSON.stringify(updatedUser));
        setIsEditing(false);
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-lg bg-white p-7 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-10 text-center tracking-wide">
          Welcome, <span className="text-indigo-600">{user.name}</span>
        </h2>

        {!isEditing ? (
          <>
            {/* Show user details */}
            <div className="mb-8 space-y-4 text-gray-700 text-lg">
              <p>
                <strong className="text-indigo-500">Name:</strong> {user.name}
              </p>
              <p>
                <strong className="text-indigo-500">Email:</strong> {user.email}
              </p>
              <p>
                <strong className="text-indigo-500">Role:</strong>{" "}
                <span className="font-semibold text-indigo-700">
                  {user.role}
                </span>
              </p>
            </div>

            <button
              onClick={handleEditClick}
              className="w-full bg-gradient-to-r from-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-800 transition-all duration-300 text-white py-3 rounded-xl shadow-md focus:outline-none focus:ring-4 focus:ring-indigo-300 cursor-pointer"
            >
              ✏️ Update Profile
            </button>
          </>
        ) : (
          <>
            {/* Update form */}
            <form onSubmit={handleSubmit} className="space-y-6 text-gray-700">
              <div>
                <label className="block mb-1 font-medium">Name</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Email</label>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">
                  Password{" "}
                  <span className="text-sm text-gray-400">
                    (leave blank to keep unchanged)
                  </span>
                </label>
                <input
                  type="password"
                  value={form.password}
                  onChange={(e) =>
                    setForm({ ...form, password: e.target.value })
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300"
                  placeholder="Enter new password"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Role</label>
                <input
                  type="text"
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                  disabled={user.role !== "superadmin"}
                  className={`w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-300 ${
                    user.role !== "superadmin"
                      ? "bg-gray-100 cursor-not-allowed"
                      : ""
                  }`}
                />
              </div>

              <div className="flex space-x-4 pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-800 text-white py-3 rounded-lg shadow-md disabled:opacity-50 transition duration-300 cursor-pointer"
                >
                  {loading ? "Updating..." : "✅ Save"}
                </button>
                <button
                  type="button"
                  onClick={handleCancelClick}
                  disabled={loading}
                  className="flex-1 bg-gray-400 hover:bg-gray-600 text-white py-3 rounded-lg shadow-md disabled:opacity-50 transition duration-300 cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
}
