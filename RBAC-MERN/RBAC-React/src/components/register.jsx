import { useFormik } from "formik";
import { registerValidationSchema } from "../validation/validation"; 
import { useNavigate, Link } from "react-router-dom";
import api from "../services/api"; 

export default function Register() {
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      role: "user",
    },
    validationSchema: registerValidationSchema,
    onSubmit: async (values) => {
      try {
        const res = await api.post("/auth/register", values);
        if (res.data.success) {
          alert("Registration successful! Please login.");
          navigate("/login");
        } else {
          alert(res.data.message || "Registration failed.");
        }
      } catch (error) {
        alert(error.response?.data?.message || "Something went wrong.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-700 underline">Register</h2>
        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <input
            type="text"
            name="name"
            placeholder="Name"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
          />
          {formik.touched.name && formik.errors.name && (
            <p className="text-red-500 text-sm">{formik.errors.name}</p>
          )}

          <input
            type="email"
            name="email"
            placeholder="Email"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.email}
          />
          {formik.touched.email && formik.errors.email && (
            <p className="text-red-500 text-sm">{formik.errors.email}</p>
          )}

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.password}
          />
          {formik.touched.password && formik.errors.password && (
            <p className="text-red-500 text-sm">{formik.errors.password}</p>
          )}

          <select
            name="role"
            value={formik.values.role}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
          >
            <option value="user">User</option>
            <option value="admin">Admin</option>
          </select>
          {formik.touched.role && formik.errors.role && (
            <p className="text-red-500 text-sm">{formik.errors.role}</p>
          )}

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-800 transition cursor-pointer"
          >
            Register
          </button>

          <p className="text-center text-sm text-gray-600 mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-600 hover:underline font-medium">
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
