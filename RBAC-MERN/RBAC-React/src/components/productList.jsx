import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { productValidationSchema } from "../validation/validation";

export default function ProductList() {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [allProducts, setAllProducts] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [editing, setEditing] = useState(null);
  const [formVisible, setFormVisible] = useState(false);
  const [formMode, setFormMode] = useState("");

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categories: [],
    quantity: "",
    image: null,
  });
  const [quantities, setQuantities] = useState({});
  const [errors, setErrors] = useState({});

  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
    fetchProducts();
  }, []);

  // FETCH PRODUCT
  const fetchProducts = async () => {
    try {
      const res = await api.get("/products");
      if (res.data.success && Array.isArray(res.data.products)) {
        setAllProducts(res.data.products);
        setProducts(res.data.products);
      } else {
        alert(res.data.message || "Failed to fetch products.");
        setAllProducts([]);
        setProducts([]);
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error fetching products");
    }
  };

  // SEARCH PRODUCT
  const handleSearch = (query) => {
    const lowerQuery = query.toLowerCase();
    const filtered = allProducts.filter((product) => {
      const name = product.name?.toLowerCase() || "";
      const description = product.description?.toLowerCase() || "";
      const price = product.price?.toString() || "";
      const categories = Array.isArray(product.categories)
        ? product.categories.join(", ").toLowerCase()
        : (product.categories || "").toLowerCase();

      return (
        name.includes(lowerQuery) ||
        description.includes(lowerQuery) ||
        price.includes(lowerQuery) ||
        categories.includes(lowerQuery)
      );
    });

    setProducts(filtered);
  };

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, allProducts]);

  // DELETE PRODUCT
  const handleDelete = async (id) => {
    const isConfirmed = window.confirm("Are you sure you want to delete this product?");
    
    if (isConfirmed) {
      try {
        await api.delete(`/products/${id}`);
        fetchProducts();  
      } catch (err) {
        alert("Delete failed");
        console.error(err);
      }
    } else {
      console.log("Delete operation was canceled.");
    }
  };
  
// EDIT PRODUCT
  const handleEdit = (product) => {
    setFormMode("edit");
    setFormVisible(true);
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categories: Array.isArray(product.categories)
        ? product.categories
        : typeof product.categories === "string"
        ? product.categories.split(",").map((c) => c.trim())
        : [],
      quantity: product.quantity,
      image: null,
    });
  };

  // VIEW PRODUCT
  const handleView = (product) => {
    setFormMode("view");
    setFormVisible(true);
    setEditing(null);
    setForm({
      _id: product._id,
      name: product.name,
      description: product.description,
      price: product.price,
      categories: Array.isArray(product.categories)
        ? product.categories
        : typeof product.categories === "string"
        ? product.categories.split(",").map((c) => c.trim())
        : [],
      quantity: product.quantity,
      image: product.image,
    });
  };

  // VALIDATE FORM
  const validateForm = async () => {
    try {
      if (typeof form.categories === "string") {
        try {
          form.categories = JSON.parse(form.categories);
        } catch {
          form.categories = [form.categories];
        }
      }

      await productValidationSchema.validate(form, { abortEarly: false });
      return true;
    } catch (err) {
      if (err.inner) {
        const errors = {};
        err.inner.forEach((e) => {
          errors[e.path] = e.message;
        });
        setErrors(errors);
      }
      return false;
    }
  };

  // UPDATE PRODUCT
  const handleUpdate = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "categories") {
          formData.append("categories", JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await api.put(`/products/${editing}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setEditing(null);
      setFormVisible(false);
      setFormMode("");
      resetForm();
      fetchProducts();
    } catch (err) {
      alert("Update failed");
    }
  };

  // CREATE PRODUCT
  const handleCreate = async () => {
    const isValid = await validateForm();
    if (!isValid) return;

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        if (key === "categories") {
          formData.append("categories", JSON.stringify(value));
        } else {
          formData.append(key, value);
        }
      });

      await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      resetForm();
      setFormVisible(false);
      setFormMode("");

      setTimeout(() => {
        fetchProducts();
      }, 500);
    } catch (err) {
      alert("Create failed");
    }
  };

  // ADD-TO-CART
  const handleAddToCart = async (productId, quantity) => {
    try {
      const res = await api.post("/carts/add", {
        productId,
        quantity,
      });
      if (res.data.success) {
        alert("Product added to cart!");
      } else {
        alert(res.data.message || "Failed to add to cart");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Error adding to cart");
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      description: "",
      price: "",
      categories: [],
      quantity: "",
      image: null,
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen mx-auto p-6 text-gray-900 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {!formVisible && isAdmin && (
        <div className="text-right mb-2">
          <button
            className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded transition cursor-pointer"
            onClick={() => {
              setFormVisible(true);
              setFormMode("create");
              setEditing(null);
              resetForm();
            }}
          >
            + Add Product
          </button>
        </div>
      )}

        {formVisible && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center px-4">
            {formMode === "view" ? (
              // View-only modal
              <div className="bg-gray-900 text-white shadow-2xl p-6 rounded-2xl w-full max-w-md space-y-5 border border-gray-700 transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-400">
                  {form.name}
                </h2>

                {/* Image with zoom  */}
                <div className="overflow-hidden rounded-lg mb-3 border border-gray-500 h-56">
                  <img
                    src={`http://localhost:1212${form.image}`}
                    alt={form.name}
                    className="w-full h-full object-contain transform transition-transform duration-300 hover:scale-110"
                  />
                </div>

                <div className="space-y-3 mt-7">
                  <p>
                    <span className="font-medium text-indigo-400">
                      Description:
                    </span>{" "}
                    <span className="text-gray-400 text-sm">
                      {form.description}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-indigo-400">Price:</span>{" "}
                    <span className="text-gray-400 text-sm">${form.price}</span>
                  </p>
                  <p>
                    <span className="font-medium text-indigo-400">
                      Categories:
                    </span>{" "}
                    <span className="text-gray-400 text-sm">
                      {form.categories?.join(", ")}
                    </span>
                  </p>
                  <p>
                    <span className="font-medium text-indigo-400">Quantity:</span>{" "}
                    <span className="text-gray-400 text-sm">{form.quantity}</span>
                  </p>
                </div>

                <div className="w-full flex flex-col gap-5 mt-6">
                  {/* Top Buttons Row */}
                  <div className="flex flex-wrap justify-between items-center gap-4 w-full">
                    {/* Quantity + Add to Cart */}
                    {!isAdmin && (
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          min="1"
                          className="w-20 px-3 py-1 rounded-md bg-gray-700 text-white text-center border border-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400"
                          value={quantities[form._id] || 1}
                          onChange={(e) =>
                            setQuantities({
                              ...quantities,
                              [form._id]: parseInt(e.target.value),
                            })
                          }
                        />
                        <button
                          onClick={() =>
                            handleAddToCart(form._id, quantities[form._id] || 1)
                          }
                          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 cursor-pointer"
                        >
                          🛒 Add to Cart
                        </button>
                      </div>
                    )}

                    {/* Edit & Delete  */}
                    {isAdmin && (
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleEdit(form)}
                          className="flex items-center gap-2 bg-blue-600 hover:bg-blue-800 active:bg-blue-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 cursor-pointer"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(form._id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-800 active:bg-red-800 text-white px-4 py-2 rounded-lg text-sm font-medium shadow-md transition-all duration-200 cursor-pointer"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Close Button */}
                  <div className="flex justify-end">
                    <button
                      onClick={() => {
                        setFormVisible(false);
                        setFormMode("");
                        setEditing(null);
                        resetForm();
                      }}
                      className="bg-gray-600 hover:bg-gray-700 active:bg-gray-800 transition duration-200 text-white font-semibold px-6 py-2 rounded-lg shadow-sm cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              // Create/Edit modal
              <div className="bg-gray-900 text-white shadow-2xl p-6 rounded-2xl w-full max-w-xl space-y-5 border border-gray-700 transition-all duration-300">
                <h2 className="text-2xl font-bold text-indigo-400 text-center">
                  {formMode === "edit" ? "Edit Product" : "Create Product"}
                </h2>

                {/* Reuse form fields */}
                <input
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                  value={form.name}
                  placeholder="Product Name"
                  readOnly={formMode === "view"}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                />
                {errors.name && (
                  <p className="text-red-400 text-sm">{errors.name}</p>
                )}

                <textarea
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                  value={form.description}
                  placeholder="Description"
                  readOnly={formMode === "view"}
                  onChange={(e) =>
                    setForm({ ...form, description: e.target.value })
                  }
                />
                {errors.description && (
                  <p className="text-red-400 text-sm">{errors.description}</p>
                )}

                <input
                  type="number"
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                  value={form.price}
                  placeholder="Price"
                  readOnly={formMode === "view"}
                  onChange={(e) => setForm({ ...form, price: e.target.value })}
                />
                {errors.price && (
                  <p className="text-red-400 text-sm">{errors.price}</p>
                )}

                <input
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                  value={
                    Array.isArray(form.categories)
                      ? form.categories.join(", ")
                      : ""
                  }
                  readOnly={formMode === "view"}
                  placeholder="Categories (e.g. Electronics, Mobile)"
                  onChange={(e) =>
                    setForm({
                      ...form,
                      categories: e.target.value
                        .split(",")
                        .map((item) => item.trim())
                        .filter((item) => item !== ""),
                    })
                  }
                />
                {errors.categories && (
                  <p className="text-red-400 text-sm">{errors.categories}</p>
                )}

                <input
                  type="number"
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                  value={form.quantity}
                  placeholder="Quantity"
                  readOnly={formMode === "view"}
                  onChange={(e) => setForm({ ...form, quantity: e.target.value })}
                />
                {errors.quantity && (
                  <p className="text-red-400 text-sm">{errors.quantity}</p>
                )}

                <input
                  type="file"
                  accept="image/*"
                  disabled={formMode === "view"}
                  onChange={(e) => setForm({ ...form, image: e.target.files[0] })}
                  className="border border-gray-500 p-2 w-full rounded bg-gray-800"
                />
                {errors.image && (
                  <p className="text-red-400 text-sm">{errors.image}</p>
                )}

                <div className="flex justify-between">
                  {formMode !== "view" && (
                    <button
                      className={`${
                        editing
                          ? "bg-blue-600 hover:bg-blue-800"
                          : "bg-green-600 hover:bg-green-700"
                      } text-white px-4 py-2 rounded transition cursor-pointer`}
                      onClick={editing ? handleUpdate : handleCreate}
                    >
                      {editing ? "Update Product" : "Create Product"}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      setFormVisible(false);
                      setFormMode("");
                      setEditing(null);
                      resetForm();
                    }}
                    className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

      <div className="flex justify-center mb-4">
        <input
          type="text"
          placeholder="🔍 Search by name, description, price, or category..."
          className="w-full max-w-md p-2 rounded border border-gray-400 bg-gray-800 text-white focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <h3 className="text-xl font-semibold mb-6 underline">Product List</h3>

      <div className="overflow-x-auto rounded-lg ">
        {products.length > 0 ? (
          isAdmin ? (
            // Table view for Admin/SuperAdmin
            <table className="min-w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border border-gray-700 rounded">
              <thead className="">
                <tr className="bg-gray-00 text-left text-white">
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Image
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Name
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Description
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Price
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Categories
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Quantity
                  </th>
                  <th className="px-4 py-2 border-b border-r border-gray-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="">
                {products.map((product) => (
                  <tr
                    key={product._id}
                    className="hover:bg-gray-700 text-white"
                  >
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800">
                      <div
                        onClick={() => handleView(product)}
                        className="cursor-pointer hover:scale-105 transition-transform duration-200 inline-block"
                      >
                        <img
                          src={`http://localhost:1212${product.image}`}
                          alt={product.name}
                          className="w-14 h-14 object-cover rounded border"
                        />
                      </div>
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800">
                      {product.name}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800 text-sm text-gray-400">
                      {product.description}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800 text-sm text-gray-400">
                      ${product.price}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800 text-sm text-gray-400">
                      {Array.isArray(product.categories)
                        ? product.categories.join(", ")
                        : product.categories}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800 text-sm text-gray-400">
                      {product.quantity}
                    </td>
                    <td className="px-4 py-2 border-b border-r border-gray-700 bg-gray-800">
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(product)}
                          className="bg-blue-500 hover:bg-blue-800 text-white text-sm px-3 py-1 rounded cursor-pointer transition duration-300"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDelete(product._id)}
                          className="bg-red-500 hover:bg-red-800 text-white text-sm px-3 py-1 rounded cursor-pointer transition duration-300"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            // Grid view for normal user
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <div
                  key={product._id}
                  className="bg-gradient-to-br from-gray-800 to-gray-700 border border-gray-600 rounded-xl shadow-lg p-4 text-white flex flex-col items-center text-center"
                >
                  <div
                    onClick={() => handleView(product)}
                    className="cursor-pointer w-full space-y-2"
                  >
                    <div className="overflow-hidden rounded-lg mb-3 border border-gray-500 h-56">
                      <img
                        src={`http://localhost:1212${product.image}`}
                        alt={product.name}
                        className="w-full h-full object-cover transform transition-transform duration-300 hover:scale-110"
                      />
                    </div>
                    <h2 className="text-lg font-bold">{product.name}</h2>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">Price:</span> $
                      {product.price}
                    </p>
                    <p className="text-sm text-gray-300">
                      <span className="font-medium text-white">Category:</span>{" "}
                      {Array.isArray(product.categories)
                        ? product.categories.join(", ")
                        : product.categories}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )
        ) : (
          <p className="text-center text-gray-700 text-2xl font-bold mt-5">
            Product Not Found.
          </p>
        )}
      </div>
    </div>
  );
}
