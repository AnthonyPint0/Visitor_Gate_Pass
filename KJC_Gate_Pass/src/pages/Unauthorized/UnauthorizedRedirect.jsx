// src/pages/UnauthorizedRedirect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedRedirect = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Initial countdown time in seconds

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          navigate("/login");
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update countdown every second

    // Cleanup the interval when the component unmounts
    return () => clearInterval(timer);
  }, [navigate]);

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You will be redirected to the login page in {countdown} seconds...</p>
    </div>
  );
};

export default UnauthorizedRedirect;
