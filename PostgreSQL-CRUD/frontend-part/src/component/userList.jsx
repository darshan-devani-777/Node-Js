import React, { useEffect, useState } from "react";
import { fetchUsers, deleteUser, updateUser } from "../services/api";

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    image: null,
    available_days: [],
  });

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
    setForm({
      name: user.name,
      email: user.email,
      image: null,
      available_days: user.available_days || [],
    });
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
    formData.append(
      "available_days",
      JSON.stringify(form.available_days || [])
    );

    try {
      await updateUser(editingUser, formData);
      setEditingUser(null);
      setForm({ name: "", email: "", image: null, available_days: [] });
      loadUsers();
    } catch (error) {
      console.error("Error updating user:", error);
      alert("Failed to update user.");
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-6 py-10 my-14 bg-gray-900 text-white shadow-2xl rounded-2xl flex flex-col overflow-hidden">
      <h2 className="text-3xl font-bold text-center mb-5 underline decoration-blue-500">
        👤 User List
      </h2>

      <div className="flex-grow overflow-auto">
        {/* Edit User Form */}
        {editingUser && (
          <form
          onSubmit={handleUpdate}
          className="mb-8 bg-gray-800 p-6 rounded-lg shadow-md space-y-4 overflow-visible  overflow-y-auto"
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

            {/* Availability Days Checkboxes */}
            <div className="mt-4">
              <p className="text-blue-400 font-semibold mb-2">
                Select Available Days:
              </p>
              <div className="flex flex-wrap gap-3 max-h-24 overflow-y-auto">
                {[
                  "Monday",
                  "Tuesday",
                  "Wednesday",
                  "Thursday",
                  "Friday",
                  "Saturday",
                  "Sunday",
                ].map((day) => (
                  <label
                    key={day}
                    className="inline-flex items-center space-x-2 cursor-pointer"
                  >
                    <input
                      type="checkbox"
                      checked={form.available_days?.includes(day) || false}
                      onChange={() => {
                        let newDays = form.available_days
                          ? [...form.available_days]
                          : [];
                        if (newDays.includes(day)) {
                          newDays = newDays.filter((d) => d !== day);
                        } else {
                          newDays.push(day);
                        }
                        setForm({ ...form, available_days: newDays });
                      }}
                      className="form-checkbox h-5 w-5 text-blue-600"
                    />
                    <span>{day}</span>
                  </label>
                ))}
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-800 text-white font-medium py-2 rounded-md transition cursor-pointer"
            >
              Update User
            </button>
          </form>
        )}

        {/* User List Display */}
        {users.length === 0 ? (
          <p className="text-center text-gray-400">No users found.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            {users.map((user) => (
              <div
                key={user.id}
                className="flex flex-col p-4 border border-gray-700 rounded-lg bg-gray-800 shadow-md"
              >
                {/* User Info */}
                <div className="flex items-center space-x-4 mb-4">
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

                {/* Availability Days Display */}
                <div className="mb-4">
                  <p className="text-sm text-blue-400 underline my-2">
                    Available Days:
                  </p>
                  {user.available_days?.length > 0 ? (
                    <ul className="flex flex-wrap gap-2 text-sm text-gray-300">
                      {user.available_days.map((day, i) => (
                        <li
                          key={i}
                          className="bg-blue-600 px-2 py-1 rounded-full my-2"
                        >
                          {day}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="italic text-gray-500">No days selected</p>
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between">
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
    </div>
  );
};

export default UserList;
