import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { Toaster } from 'react-hot-toast';
import LandingPage from "./pages/landing";
import LoginPage from "./pages/auth";
import RegisterPage from "./pages/register";
import RegisterSellerPage from "./pages/registerseller";
import DashboardSeller from "./pages/dashboardseller/dashboardseller";
import DashboardBuyer from "./pages/dashboardbuyer/dashboardbuyer";
import AddProduct from "./pages/dashboardseller/addproduct";
import Search from "./pages/search";
import ProductDetail from "./pages/productdetail";
import Shop from "./pages/shop";
import ArticlePage from "./pages/articlehomepage";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage.js";
import Transaction from "./pages/transaction";
import WishlistPage from "./pages/wishlist";
import ProtectedRoute from "./components/protectedroute";
import ArticleDetail from './pages/articledetail';

function App() {
  return (
    <Router>
      <div className="bg-white min-h-screen">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-seller" element={<RegisterSellerPage />} />
          <Route path="/search" element={<Search />} />
          <Route path="/shop/:shopName" element={<Shop />} />
          <Route path="/product/:productId" element={<ProductDetail />} />
          <Route path="/articlehomepage" element={<ArticlePage />} />
          <Route path="/articleview/:articleId" element={<ArticleDetail />} />

          {/* Protected Seller Routes */}
          <Route element={<ProtectedRoute allowedRoles={["seller"]} />}>
            <Route path="/dashboard-seller/*" element={<DashboardSeller />} />
            <Route path="/add-product" element={<AddProduct />} />
          </Route>

          {/* Protected Buyer Routes */}
          <Route element={<ProtectedRoute allowedRoles={["buyer"]} />}>
            <Route path="/user/*" element={<DashboardBuyer />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/transaction" element={<Transaction />} />
            <Route path="/wishlist" element={<WishlistPage />} />
          </Route>
        </Routes>
        <Toaster position="top-right" reverseOrder={false} />
      </div>
    </Router>
  );
}

export default App;
