import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage_KJC/LoginPage.jsx";
import Dashboard from "./pages/Main_Dashboard/Dashboard.jsx";
import Register_Visitor from "./pages/Register_Visitor/Register_Visitor.jsx";
import Checkout_Visitor from "./pages/Checkout_Visitor/Checkout_Visitor.jsx";
import Visitor_Details from "./pages/Visitor_Details/Visitor_Details.jsx";
import Pre_Approve from "./pages/Pre_Approve/Pre_Approve.jsx";
import PrivateRoute from "./components/PrivateRoute"; // Make sure the path is correct
import UnauthorizedRedirect from "./pages/Unauthorized/UnauthorizedRedirect.jsx";
import Checkin_Guest from "./pages/Checkin_Guest/Checkin_Guest.jsx";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Routes accessible only by users with "security" role */}
        <Route
          path="/dashboard"
          element={
            <PrivateRoute element={<Dashboard />} roles={["security"]} />
          }
        />
        <Route
          path="/register_visitor"
          element={
            <PrivateRoute element={<Register_Visitor />} roles={["security"]} />
          }
        />
        <Route
          path="/checkout_visitor"
          element={
            <PrivateRoute element={<Checkout_Visitor />} roles={["security"]} />
          }
        />
        <Route
          path="/visitor_details"
          element={
            <PrivateRoute element={<Visitor_Details />} roles={["security"]} />
          }
        />
        <Route
          path="/checkin_guest"
          element={
            <PrivateRoute element={<Checkin_Guest />} roles={["security"]} />
          }
        />

        {/* Routes accessible only by users with "HOD" role */}
        <Route
          path="/pre_approved_guest"
          element={<PrivateRoute element={<Pre_Approve />} roles={["HOD"]} />}
        />

        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/unauthorized" element={<UnauthorizedRedirect />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
