import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { registerValidationSchema } from "../validation/validation";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    role: "",
    password: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const saved = localStorage.getItem("user");
 
    
    if (!saved) {
       return navigate("/login"); 
    }
 
    let parsedSaved;
    try {
       parsedSaved = JSON.parse(saved);
    } catch (error) {
       console.error("Failed to parse user data from localStorage:", error);
       return navigate("/login");
    }
 
    if (!parsedSaved._id && parsedSaved.id) {
       parsedSaved = { ...parsedSaved, _id: parsedSaved.id };
    }
 
    setUser(parsedSaved);
    setForm({
       name: parsedSaved.name,
       email: parsedSaved.email,
       role: parsedSaved.role,
       password: "",
    });
 }, [navigate]);
 

  const handleEditClick = () => setIsEditing(true);

  const handleCancelClick = () => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      password: "",
    });
    setImageFile(null);
    setErrors({});
    setIsEditing(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});

    const validationData = {
      name: form.name,
      email: form.email,
      role: form.role,
    };
    if (form.password.trim() !== "") {
      validationData.password = form.password;
    }

    try {
      await registerValidationSchema.validate(validationData, {
        abortEarly: false,
      });

      setLoading(true);

      const token = localStorage.getItem("token");

      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("email", form.email);
      if (form.password.trim() !== "") {
        formData.append("password", form.password);
      }
      if (user.role === "superadmin") {
        formData.append("role", form.role);
      }
      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await api.put(`/users/${user._id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });

      if (res.data.success) {
        alert("Profile Updated Successfully!");

        const updatedUser = {
          _id: res.data.user._id || res.data.user.id,
          name: res.data.user.name,
          email: res.data.user.email,
          role: res.data.user.role,
          image: res.data.user.image,
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
        setImageFile(null);
      } else {
        alert(res.data.message || "Update failed");
      }
    } catch (validationError) {
      if (validationError.name === "ValidationError") {
        const newErrors = {};
        validationError.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });
        setErrors(newErrors);
      } else {
        alert(
          validationError.response?.data?.message || "Something went wrong"
        );
      }
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="max-w-lg bg-white p-7 rounded-3xl shadow-2xl border border-gray-200">
        <h2 className="text-3xl font-extrabold text-gray-800 mb-4 text-center tracking-wide">
          Welcome, <span className="text-indigo-600">{user.name}</span>
        </h2>

        {user.image && (
          <div className="mb-3 text-center">
            <img
              src={`http://localhost:1212/${user.image}`}
              alt="Profile"
              className="w-17 h-17 object-cover rounded-full border-2 border-indigo-500 mx-auto"
            />
          </div>
        )}

        {!isEditing ? (
          <>
            <div className="my-3 space-y-2 text-gray-700 text-center">
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
          <form onSubmit={handleSubmit} className="space-y-3 text-gray-700">
            <div>
              <label className="block mb-1 font-medium text-sm">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files[0])}
                className="w-full px-2 py-1 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Name</label>
              <input
                type="text"
                value={form.name}
                onChange={(e) =>
                  setForm({ ...form, name: e.target.value })
                }
                className={`w-full px-3 py-1 text-md border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.name
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Email</label>
              <input
                type="email"
                value={form.email}
                onChange={(e) =>
                  setForm({ ...form, email: e.target.value })
                }
                className={`w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.email
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">
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
                className={`w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  errors.password
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
                placeholder="Enter new password"
              />
              {errors.password && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.password}
                </p>
              )}
            </div>

            <div>
              <label className="block mb-1 font-medium text-sm">Role</label>
              <input
                type="text"
                value={form.role}
                onChange={(e) =>
                  setForm({ ...form, role: e.target.value })
                }
                disabled={user.role !== "superadmin"}
                className={`w-full px-3 py-1 border rounded-lg focus:outline-none focus:ring-2 ${
                  user.role !== "superadmin"
                    ? "bg-gray-100 cursor-not-allowed border-gray-300"
                    : errors.role
                    ? "border-red-500 focus:ring-red-400"
                    : "border-gray-300 focus:ring-indigo-300"
                }`}
              />
              {errors.role && (
                <p className="text-red-500 text-sm mt-1">{errors.role}</p>
              )}
            </div>

            <div className="flex space-x-4 pt-2">
              <button
                type="submit"
                disabled={loading}
                className="flex-1  bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-800 text-white py-3 rounded-lg shadow-md disabled:opacity-50 transition duration-300 cursor-pointer"
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
        )}
      </div>
    </div>
  );
}
