import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { useFormik } from "formik";
import { userValidationSchema } from "../validation/validation";

export default function UserList() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    const user = localStorage.getItem("user");
    if (!user) {
      navigate("/login");
    }
    fetchUsers();
  }, []);

  // FETCH USERS
  const fetchUsers = async () => {
    try {
      const res = await api.get("/users");
      if (res.data.success && Array.isArray(res.data.users)) {
        setUsers(res.data.users);
      } else {
        alert(res.data.message || "Failed to fetch users.");
        setUsers([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching users");
    }
  };

  // Formik SETUP - create and update
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: userValidationSchema,
    onSubmit: async (values) => {
      try {
        if (editing) {
          // Update user
          await api.put(`/users/${editing}`, values);
          setEditing(null);
        } else {
          // Create user
          await api.post("/auth/register", values);
        }
        formik.resetForm();
        setFormVisible(false);
        fetchUsers();
      } catch (err) {
        alert(err.response?.data?.message || "Error saving user");
      }
    },
    enableReinitialize: true,
  });

  // EDIT USER -  set Formik values
  const handleEdit = (user) => {
    setFormVisible(true);
    setEditing(user._id);
    formik.setValues({
      name: user.name,
      email: user.email,
      password: "", 
      role: user.role,
    });
  };

  // DELETE USER
  const handleDelete = async (id) => {
    try {
      await api.delete(`/users/${id}`);
      fetchUsers();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // FILTER USERS
  const filteredUsers = users.filter((user) => {
    const search = searchTerm.toLowerCase();
    return (
      user.name.toLowerCase().includes(search) ||
      user.email.toLowerCase().includes(search) ||
      user.role.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen mx-auto p-6 text-white bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {/* Add User button */}
      {!formVisible && isAdmin && (
        <div className="text-right">
          <button
            className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded transition cursor-pointer"
            onClick={() => {
              setFormVisible(true);
              setEditing(null);
              formik.resetForm();
            }}
          >
            + Add User
          </button>
        </div>
      )}

      {/* Form Section */}
      {formVisible && (
        <form
          onSubmit={formik.handleSubmit}
          className="bg-gray-800 shadow-md p-6 rounded-lg mb-6 space-y-4 border border-gray-700"
        >
          <input
            className="bg-gray-900 border border-gray-600 p-2 w-full rounded text-white"
            name="name"
            placeholder="Name"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          <input
            className="bg-gray-900 border border-gray-600 p-2 w-full rounded text-white"
            name="email"
            placeholder="Email"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <input
            className="bg-gray-900 border border-gray-600 p-2 w-full rounded text-white"
            name="password"
            placeholder="Password"
            type="password"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <select
            className="bg-gray-900 border border-gray-600 p-2 w-full rounded text-white"
            name="role"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.role}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm">{formik.errors.role}</p>
          )}

          <div className="flex justify-between">
            <button
              type="submit"
              className={`${
                editing
                  ? "bg-blue-600 hover:bg-blue-800"
                  : "bg-green-600 hover:bg-green-700"
              } text-white px-4 py-2 rounded transition cursor-pointer`}
            >
              {editing ? "Update User" : "Create User"}
            </button>
            <button
              type="button"
              onClick={() => {
                setFormVisible(false);
                setEditing(null);
                formik.resetForm();
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
            >
              Cancel
            </button>
          </div>
        </form>
      )}

      {/* Search Bar */}
      <div className="flex justify-center">
        <input
          type="text"
          placeholder="🔍  Search by name, email, or role..."
          className="w-full max-w-md p-2 rounded border border-gray-400 bg-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* User Table */}
      <h3 className="text-xl font-semibold mb-6 text-black underline">User List</h3>
      <div className="overflow-x-auto rounded-md">
        <table className="min-w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border border-gray-700 rounded">
          <thead>
            <tr className="bg-gray-00 text-left text-white">
              <th className="px-4 py-2 border-b border-r border-gray-600">ID</th>
              <th className="px-4 py-2 border-b border-r border-gray-600">Name</th>
              <th className="px-4 py-2 border-b border-r border-gray-600">Email</th>
              <th className="px-4 py-2 border-b border-r border-gray-600">Role</th>
              <th className="px-4 py-2 border-b border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user, index) => (
                <tr key={user._id} className="hover:bg-gray-700 text-white">
                  <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800">
                    {user.name}
                  </td>
                  <td className="px-4 py-2 text-sm border-b border-r border-gray-700 bg-gray-800 text-gray-400">
                    {user.email}
                  </td>
                  <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800 capitalize text-sm">
                    {user.role}
                  </td>
                  <td className="px-4 py-2 border-b border-gray-700 bg-gray-800">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user)}
                        className="bg-blue-500 hover:bg-blue-800 text-white text-sm px-3 py-1 rounded cursor-pointer transition duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(user._id)}
                        className="bg-red-500 hover:bg-red-800 text-white text-sm px-3 py-1 rounded cursor-pointer transition duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-4 text-gray-400 bg-gray-800 text-2xl">
                  User Not Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
