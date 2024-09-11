import React from "react";
import { Navigate } from "react-router-dom";
import { isAuthenticated, getUserRole } from "./utils/auth";

const RoleBasedRoute = ({ element, allowedRoles }) => {
  const role = getUserRole();
  const authenticated = isAuthenticated();

  if (!authenticated) {
    return <Navigate to="/login" />;
  }

  if (!allowedRoles.includes(role)) {
    return <Navigate to="/login" />; // Or a "Not Authorized" page
  }

  return element;
};

export { RoleBasedRoute };
