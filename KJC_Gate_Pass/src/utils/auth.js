// utils/auth.js

export const isAuthenticated = () => {
  const token = localStorage.getItem("role");
  if (!token) return false;

  // Verify the token's validity (e.g., by checking expiration, etc.)
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
    const expiry = payload.exp * 1000; // Token expiration in milliseconds
    return Date.now() < expiry; // Check if token is expired
  } catch (e) {
    return false;
  }
};

export const getUserRole = () => {
  return localStorage.getItem("role") || "";
};
