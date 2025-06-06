import { BrowserRouter, Routes, Route } from "react-router-dom";
import Header from "./components/header";
import Register from "./components/register";
import Login from "./components/login";
import UserList from "./components/userList";
import Dashboard from "./components/dashboard";
import ProductList from "./components/ProductList";
import PrivateRoute from "./components/PrivateRoute";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <div className="">
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />

          {/* Protected routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
          <Route
            path="/users"
            element={
              <PrivateRoute>
                <UserList />
              </PrivateRoute>
            }
          />
          <Route
            path="/products"
            element={
              <PrivateRoute>
                <ProductList />
              </PrivateRoute>
            }
          />

          {/* Redirect unknown paths to login */}
          <Route path="*" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
