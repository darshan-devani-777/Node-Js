import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, updateUser } from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({ name: "", email: "", image: null });

  const loadUsers = async () => {
    const res = await fetchUsers();
    setUsers(res.data);
  };

  useEffect(() => {
    loadUsers();
  }, []);

  const handleDelete = async (id) => {
    await deleteUser(id);
    loadUsers();
  };

  const handleEditClick = (user) => {
    setEditingUser(user.id);
    setForm({ name: user.name, email: user.email, image: null });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleImageChange = (e) => {
    setForm({ ...form, image: e.target.files[0] });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingUser) return;

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("email", form.email);
    if (form.image) {
      formData.append("image", form.image);
    }

    try {
      await updateUser(editingUser, formData);
      setEditingUser(null);
      setForm({ name: "", email: "", image: null });
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="max-w-3xl mx-auto mt-16 mb-10 px-6 py-8 bg-gray-900 text-white shadow-2xl rounded-2xl">
    <h2 className="text-3xl font-bold text-center mb-8 underline decoration-blue-500">
      👤 User List
    </h2>
  
    {/* Edit User Form */}
    {editingUser && (
      <form
        onSubmit={handleUpdate}
        className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md space-y-4"
      >
        <h3 className="text-xl font-semibold text-blue-400">Edit User</h3>
  
        <input
          type="text"
          name="name"
          value={form.name}
          onChange={handleFormChange}
          placeholder="Name"
          className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <input
          type="email"
          name="email"
          value={form.email}
          onChange={handleFormChange}
          placeholder="Email"
          className="w-full px-4 py-2 bg-gray-700 text-white border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
  
        <input
          type="file"
          name="image"
          accept="image/*"
          onChange={handleImageChange}
          className="w-full bg-gray-700 text-gray-300 rounded-md border border-gray-600 cursor-pointer hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 p-2"
        />
  
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-2 rounded-md transition cursor-pointer"
        >
          ✅ Update User
        </button>
      </form>
    )}
  
    {/* User List Display */}
    {users.length === 0 ? (
      <p className="text-center text-gray-400">No users found.</p>
    ) : (
      <div className="space-y-6">
        {users.map((user) => (
          <div
            key={user.id}
            className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-md space-y-4 sm:space-y-0"
          >
            {/* User Info */}
            <div className="flex items-center space-x-4">
              <img
                src={`http://localhost:5000/uploads/${user.image}`}
                alt={user.name}
                className="w-16 h-16 object-cover rounded-full border border-gray-600"
              />
              <div>
                <p className="text-lg font-semibold">{user.name}</p>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
  
            {/* Action Buttons */}
            <div className="flex space-x-3">
              <button
                onClick={() => handleEditClick(user)}
                className="bg-yellow-500 hover:bg-yellow-700 text-white px-4 py-2 rounded-md font-medium transition cursor-pointer"
              >
                ✏️ Edit
              </button>
              <button
                onClick={() => handleDelete(user.id)}
                className="bg-red-600 hover:bg-red-800 text-white px-4 py-2 rounded-md font-medium transition cursor-pointer"
              >
                🗑️ Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
  
  );
};

export default UserList;
