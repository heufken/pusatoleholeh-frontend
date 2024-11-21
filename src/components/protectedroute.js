import React, { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../components/context/AuthContext";
import { ThreeDots } from "react-loader-spinner";

const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useContext(AuthContext);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <ThreeDots
          height="50"
          width="50"
          color="#F87171" // You can customize the color here
          ariaLabel="three-dots-loading"
          visible={true}
        />

      </div>
    );
  }

  // Jika belum login, arahkan ke login
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Jika sudah login tetapi role tidak diizinkan, arahkan ke halaman utama
  if (!allowedRoles.includes(user?.role)) {
    return <Navigate to="/" replace />;
  }

  // Jika semua valid, render halaman anak
  return <Outlet />;
};

export default ProtectedRoute;
