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
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    categories: "",
    quantity: "",
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

  // FETCH PRODUCTS
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

  // SEARCH PRODUCTS
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
    try {
      await api.delete(`/products/${id}`);
      fetchProducts();
    } catch (err) {
      alert("Delete failed");
    }
  };

  // EDIT PRODUCT
  const handleEdit = (product) => {
    setFormVisible(true);
    setEditing(product._id);
    setForm({
      name: product.name,
      description: product.description,
      price: product.price,
      categories: product.categories,
      quantity: product.quantity,
    });
  };

  // VALIDATE FORM
  const validateForm = async () => {
    try {
      await productValidationSchema.validate(form, { abortEarly: false });
      setErrors({});
      return true;
    } catch (validationErrors) {
      const newErrors = {};
      validationErrors.inner.forEach((error) => {
        newErrors[error.path] = error.message;
      });
      setErrors(newErrors);
      return false;
    }
  };

  // UPDATE PRODUCT
  const handleUpdate = async () => {
    const isValid = await validateForm();
    if (!isValid) return;
    try {
      await api.put(`/products/${editing}`, form);
      setEditing(null);
      setFormVisible(false);
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
      await api.post("/products", form);
      resetForm();
      setFormVisible(false);
      fetchProducts();
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
      categories: "",
      quantity: "",
    });
    setErrors({});
  };

  return (
    <div className="min-h-screen mx-auto p-6 text-gray-900 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      {!formVisible && isAdmin && (
        <div className="text-right mb-2">
          <button
            className="bg-green-600 hover:bg-green-800 text-white px-3 py-1 rounded transition cursor-pointer"
            onClick={() => setFormVisible(true)}
          >
            + Add Product
          </button>
        </div>
      )}

      {formVisible && isAdmin && (
        <div className="bg-gray-800 text-gray-100 shadow-md p-6 rounded-lg mb-6 space-y-4 border border-gray-300">
          <input
            className="border border-gray-400 p-2 w-full rounded"
            value={form.name}
            placeholder="Product Name"
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          {errors.name && <p className="text-red-400 text-sm">{errors.name}</p>}

          <textarea
            className="border border-gray-400 p-2 w-full rounded"
            value={form.description}
            placeholder="Description"
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
          />
          {errors.description && (
            <p className="text-red-400 text-sm">{errors.description}</p>
          )}

          <input
            className="border border-gray-400 p-2 w-full rounded"
            type="number"
            value={form.price}
            placeholder="Price"
            onChange={(e) => setForm({ ...form, price: e.target.value })}
          />
          {errors.price && (
            <p className="text-red-400 text-sm">{errors.price}</p>
          )}

          <input
            className="border border-gray-400 p-2 w-full rounded"
            value={form.categories}
            placeholder="Categories"
            onChange={(e) => setForm({ ...form, categories: e.target.value })}
          />
          {errors.categories && (
            <p className="text-red-400 text-sm">{errors.categories}</p>
          )}

          <input
            className="border border-gray-400 p-2 w-full rounded"
            type="number"
            value={form.quantity}
            placeholder="Quantity"
            onChange={(e) => setForm({ ...form, quantity: e.target.value })}
          />
          {errors.quantity && (
            <p className="text-red-400 text-sm">{errors.quantity}</p>
          )}

          <div className="flex justify-between">
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
            <button
              onClick={() => {
                setFormVisible(false);
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
      <div className="overflow-x-auto rounded-lg">
        <table className="min-w-full bg-gradient-to-r from-gray-800 via-gray-700 to-gray-600 border border-gray-700 rounded">
          <thead>
            <tr className="bg-gray-700 text-white text-left">
              <th className="px-4 py-2 border border-gray-600">ID</th>
              <th className="px-4 py-2 border border-gray-600">Name</th>
              <th className="px-4 py-2 border border-gray-600">Description</th>
              <th className="px-4 py-2 border border-gray-600">Price</th>
              <th className="px-4 py-2 border border-gray-600">Category</th>
              <th className="px-4 py-2 border border-gray-600">Quantity</th>
              <th className="px-4 py-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((product, index) => (
                <tr key={product._id} className="text-white">
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                    {index + 1}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                    {product.name}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-sm text-gray-400">
                    {product.description}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-400 text-sm">
                    ${product.price}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-400 text-sm">
                    {Array.isArray(product.categories)
                      ? product.categories.join(", ")
                      : product.categories}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-gray-400 text-sm">
                    {product.quantity}
                  </td>
                  <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                    <div className="flex gap-2 items-center">
                      <input
                        type="number"
                        min="1"
                        className="w-16 px-2 py-1 rounded bg-gray-700 text-white"
                        value={quantities[product._id] || 1}
                        onChange={(e) =>
                          setQuantities({
                            ...quantities,
                            [product._id]: parseInt(e.target.value),
                          })
                        }
                      />
                      <button
                        onClick={() =>
                          handleAddToCart(product._id, quantities[product._id] || 1)
                        }
                        className="bg-green-500 hover:bg-green-700 text-white px-3 py-1 rounded cursor-pointer text-sm transition duration-300"
                      >
                        Add to Cart
                      </button>

                      {isAdmin && (
                        <>
                          <button
                            onClick={() => handleEdit(product)}
                            className="bg-blue-500 hover:bg-blue-700 text-white px-3 py-1 rounded cursor-pointer text-sm transition duration-300"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product._id)}
                            className="bg-red-500 hover:bg-red-700 text-white px-3 py-1 rounded cursor-pointer text-sm transition duration-300"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-4 text-gray-400 bg-gray-800 text-2xl"
                >
                  Product Not Found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
