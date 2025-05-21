import React, { useState } from 'react';
import { createUser } from '../services/api';

const UserForm = ({ onUserAdded }) => {
  const [form, setForm] = useState({ name: '', email: '', image: null });
  const [fileName, setFileName] = useState('');

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setForm({ ...form, image: files[0] });
      setFileName(files[0]?.name || '');
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', form.name);
    formData.append('email', form.email);
    if (form.image) formData.append('image', form.image);

    await createUser(formData);
    onUserAdded();
    setForm({ name: '', email: '', image: null });
    setFileName('');
  };

  return (
    <form
    onSubmit={handleSubmit}
    className="max-w-md mx-auto my-16 p-6 bg-gray-900 text-white shadow-2xl rounded-xl space-y-6 border border-gray-700"
  >
    {/* Heading */}
    <h2 className="text-3xl font-bold text-center underline decoration-blue-500 ">
      Add New User
    </h2>
  
    {/* Name Input */}
    <input
      name="name"
      placeholder="Enter full name"
      value={form.name}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  
    {/* Email Input */}
    <input
      name="email"
      type="email"
      placeholder="Enter email address"
      value={form.email}
      onChange={handleChange}
      required
      className="w-full px-4 py-3 bg-gray-800 text-white border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
    />
  
    {/* File Upload */}
    <label className="block">
      <span className="block mb-2 text-sm font-semibold">Upload Image</span>
      <div className="flex items-center space-x-4">
        <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-md text-white transition">
          Choose File
          <input
            type="file"
            name="image"
            accept="image/*"
            onChange={handleChange}
            className="hidden"
          />
        </label>
        <span className="text-sm text-gray-400 truncate">
          {fileName || 'No file chosen'}
        </span>
      </div>
    </label>
  
    {/* Submit Button */}
    <button
      type="submit"
      className="w-full bg-green-600 hover:bg-green-700 py-3 rounded-md text-white font-medium transition duration-300 cursor-pointer"
    >
      ➕ Add User
    </button>
  </form>
  
  );
};

export default UserForm;
