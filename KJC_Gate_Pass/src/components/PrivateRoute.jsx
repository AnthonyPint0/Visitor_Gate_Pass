import React from "react";
import { Navigate } from "react-router-dom";

// Helper function to decode JWT and get the payload
const decodeToken = (token) => {
  try {
    return JSON.parse(atob(token.split(".")[1])); // Decode token payload
  } catch (e) {
    return null;
  }
};

// Helper function to check for authentication using JWT
const isAuthenticated = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = decodeToken(token);
    const expiry = payload.exp * 1000; // Token expiration in milliseconds
    return Date.now() < expiry; // Check if token is expired
  } catch (e) {
    return false;
  }
};

// Helper function to get the user's role from JWT
const getUserRole = () => {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const payload = decodeToken(token);
  return payload?.role || null; // Return role from payload, or null if it doesn't exist
};

// PrivateRoute component that checks both authentication and role
const PrivateRoute = ({ element, roles }) => {
  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  const userRole = getUserRole();

  if (!roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return element;
};

export default PrivateRoute;
