import { useEffect, useState } from "react";
import api from "../services/api";
import { useNavigate } from "react-router-dom";

export default function CartList() {
  const navigate = useNavigate();
  const [carts, setCarts] = useState([]);
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin" || user?.role === "superadmin";

  useEffect(() => {
    if (!user) {
      navigate("/login");
      return;
    }
    fetchCarts();
  }, []);

  const fetchCarts = async () => {
    try {
      const endpoint = isAdmin ? "/carts/all" : "/carts/cart";
      const res = await api.get(endpoint);
      if (isAdmin) {
        setCarts(res.data.carts || []);
      } else {
        setCarts(res.data.cart ? [res.data.cart] : []);
      }
    } catch (err) {
      alert("Error fetching carts");
      console.error(err);
    }
  };

  const handleQuantityChange = async (productId, newQty) => {
    if (newQty < 1) return;
    try {
      await api.put("/carts/update", {
        productId,
        quantity: Number(newQty),
      });
      fetchCarts();
    } catch (err) {
      alert("Failed to update quantity");
      console.error(err);
    }
  };

  const handleRemoveProduct = async (productId) => {
    try {
      await api.delete(`/carts/remove/${productId}`);
      fetchCarts();
    } catch (err) {
      alert("Failed to remove product");
      console.error(err);
    }
  };

  const allProducts = carts.flatMap((cart) =>
    (cart?.products || []).map((item) => ({
      ...item,
      userName: cart.user?.name || "Unknown",
      userId: cart.user?._id || "",
    }))
  );

  return (
    <div className="min-h-screen p-6 bg-gradient-to-br from-indigo-100 via-purple-100 to-pink-100">
      <h2 className="text-xl font-semibold my-10 underline">Cart List</h2>

      <div className="rounded-md overflow-x-auto">
        <table className="min-w-full text-left bg-gray-800 text-white">
          <thead>
            <tr className="bg-gray-700 text-sm">
              <th className="px-4 py-2 border border-gray-600">ID</th>
              <th className="px-4 py-2 border border-gray-600">User</th>
              <th className="px-4 py-2 border border-gray-600">Product</th>
              <th className="px-4 py-2 border border-gray-600">Price</th>
              <th className="px-4 py-2 border border-gray-600">Quantity</th>
              <th className="px-4 py-2 border border-gray-600">Total</th>
              <th className="px-4 py-2 border border-gray-600">Actions</th>
            </tr>
          </thead>
          <tbody>
            {allProducts.length === 0 ? (
              <tr>
                <td
                  colSpan="7"
                  className="text-center py-6 text-gray-400 border-t border-gray-700"
                >
                  🛒 Product not found.
                </td>
              </tr>
            ) : (
              allProducts.map((item, index) => {
                const isUserItem = item.userId === user.id;
                return (
                  <tr
                    key={item.product?._id || item._id}
                    className="border-t border-gray-600"
                  >
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                      {index + 1}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                      {item.userName}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-sm text-gray-400">
                      {item.product?.name}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800 text-sm text-gray-400">
                      ${item.product?.price}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                      <input
                        type="number"
                        value={item.quantity}
                        min="1"
                        className={`w-16 px-2 py-1 rounded-md text-sm font-medium outline-none transition duration-200 ${
                          isUserItem
                            ? "bg-white text-gray-800 border-2 border-green-500 focus:border-blue-600 focus:ring-1 focus:ring-blue-400 shadow-md"
                            : "bg-gray-200 text-gray-500 border border-gray-300 cursor-not-allowed opacity-70"
                        }`}
                        disabled={!isUserItem}
                        onChange={(e) =>
                          handleQuantityChange(
                            item.product?._id,
                            e.target.value
                          )
                        }
                      />
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                      ${(item.product?.price * item.quantity).toFixed(2)}
                    </td>
                    <td className="px-4 py-2 border border-gray-700 bg-gray-800">
                      {isUserItem ? (
                        <button
                          onClick={() => handleRemoveProduct(item.product?._id)}
                          className="bg-red-600 hover:bg-red-800 text-white px-3 py-1 rounded-md text-sm font-medium shadow-md transition duration-200 cursor-pointer"
                        >
                          Remove
                        </button>
                      ) : (
                        <button
                          disabled
                          className="bg-gray-300 text-gray-500 px-3 py-1 rounded-md text-sm font-medium cursor-not-allowed opacity-70"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
