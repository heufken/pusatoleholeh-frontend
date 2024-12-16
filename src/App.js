import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth";
import RegisterPage from "./pages/register";
import RegisterSellerPage from "./pages/registerseller";
import DashboardSeller from "./pages/dashboardseller/dashboardseller";
import AddProduct from "./pages/dashboardseller/addproduct";
import Search from "./pages/search";
import ProductDetail from "./pages/productdetail";
import Shop from "./pages/shop";
import ProtectedRoute from "./components/protectedroute";
import ArticlePage from "./pages/articlehomepage";
import Article from "./pages/article";
import CartPage from "./pages/CartPage";
import './styles/custom.css';

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Routes>
          {/* Rute terbuka */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-seller" element={<RegisterSellerPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/shop/:shopName" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/articlehomepage" element={<ArticlePage />} />
          <Route path="/article" element={<Article />} />
          <Route path="/cart" element={<CartPage />} />

          {/* Rute terproteksi */}
          <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
            <Route path="/dashboard-seller/*" element={<DashboardSeller />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Route>
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;
