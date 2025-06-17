import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/header";
import Register from "./components/register";
import Login from "./components/login";
import UserList from "./components/userList";
import Profile from "./components/profile";
import ProductList from "./components/productList";
import CartList from "./components/cartList";
import OrderList from "./components/orderList";
import Dashboard from "./components/dashboard";
import { ProtectedRoute, RedirectIfLoggedInRoute } from "./components/protectedroute";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="">
        <Routes>

          <Route
            path="/register"
            element={
              <RedirectIfLoggedInRoute>
                <Register />
              </RedirectIfLoggedInRoute>
            }
          />
          <Route
            path="/login"
            element={
              <RedirectIfLoggedInRoute>
                <Login />
              </RedirectIfLoggedInRoute>
            }
          />

          {/* Protected routes */}
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            }
          />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/users"
            element={
              <ProtectedRoute>
                <UserList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/products"
            element={
              <ProtectedRoute>
                <ProductList />
              </ProtectedRoute>
            }
          />
          <Route
            path="/carts"
            element={
              <ProtectedRoute>
                <CartList />
              </ProtectedRoute>
            }
          />
            <Route
            path="/orders"
            element={
              <ProtectedRoute>
                <OrderList />
              </ProtectedRoute>
            }
          />

          {/* redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
