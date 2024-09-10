const PrivateRoute = ({ element, roles }) => {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/login" />;
  }

  let userRole;
  try {
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
    const expiry = payload.exp * 1000; // Token expiration in milliseconds
    if (Date.now() >= expiry) return <Navigate to="/login" />;

    userRole = payload.role; // Extract role from payload
  } catch (e) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(userRole)) {
    return <Navigate to="/unauthorized" />; // Define an Unauthorized page or redirect
  }

  return element;
};
