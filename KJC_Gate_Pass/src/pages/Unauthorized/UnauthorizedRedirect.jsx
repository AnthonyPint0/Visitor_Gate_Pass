// src/pages/UnauthorizedRedirect.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const UnauthorizedRedirect = () => {
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(5); // Initial countdown time in seconds

  useEffect(() => {
    // Handle countdown
    const countdownTimer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(countdownTimer); // Clear the interval before redirecting
          return 0;
        }
        return prev - 1;
      });
    }, 1000); // Update countdown every second

    // Navigate after the countdown reaches 0
    const redirectTimer = setTimeout(() => {
      navigate("/login");
    }, 5000); // Redirect after 5 seconds

    // Cleanup the interval and timeout when the component unmounts
    return () => {
      clearInterval(countdownTimer);
      clearTimeout(redirectTimer);
    };
  }, [navigate]);

  return (
    <div>
      <h1>Unauthorized</h1>
      <p>You will be redirected to the login page in {countdown} seconds...</p>
    </div>
  );
};

export default UnauthorizedRedirect;
