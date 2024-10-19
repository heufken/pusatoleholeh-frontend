import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './pages/landing'; 
import LoginPage from './pages/auth'; 
import RegisterPage from './pages/register'; 
import RegisterSellerPage from './pages/registerseller'; 
import DashboardSeller from './pages/dashboardseller'; 

function App() {
  return (
    <Router>
      <div className="bg-gray-100 min-h-screen">
        <Routes>
          
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/register-seller" element={<RegisterSellerPage />} />
          <Route path="/dashboard-seller" element={<DashboardSeller />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
