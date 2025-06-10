import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Navigate } from "react-router-dom";
import Header from "./components/header";
import Register from "./components/register";
import Login from "./components/login";
import UserList from "./components/userList";
import Dashboard from "./components/dashboard";
import ProductList from "./components/ProductList";
import CartList from "./components/cartList";
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

          {/* redirect unknown routes to login */}
          <Route path="*" element={<Navigate to="/login" replace />} />

        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
