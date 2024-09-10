import React, { useState, useEffect } from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import { API_BASE_URL } from "../../library/helper";
import {
  ListCollapse,
  DoorOpen,
  SquareMenu,
  LayoutDashboard,
} from "lucide-react";
import axios from "axios";

function CompleteSidebar({ isActive }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true); // Set loading state to true when starting fetch

      try {
        const token = localStorage.getItem("token"); // Ensure token is handled securely

        if (!token) {
          setError("No token found.");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        const userRole = payload.role;
        setUser({
          name: payload.name,
          email: payload.email,
        });
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false); // Set loading state to false when fetch is complete
      }
    };

    fetchUserData();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Display a loading state
  }

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!user) {
    return <div>No user data available.</div>; // Display message if user is null
  }

  return (
    <Sidebar user={user}>
      <SidebarItem
        icon={<LayoutDashboard size={20} />}
        text="Dashboard"
        active={isActive === "dashboard"}
        naviLink="dashboard"
      />
      <SidebarItem
        icon={<SquareMenu size={20} />}
        text="Register Visitor"
        active={isActive === "registerVisitor"}
        naviLink="register_visitor"
      />
      <SidebarItem
        icon={<DoorOpen size={20} />}
        text="Checkout Visitor"
        active={isActive === "checkoutVisitor"}
        naviLink="checkout_visitor"
      />
      <SidebarItem
        icon={<ListCollapse size={20} />}
        text="Visitor Details"
        active={isActive === "visitorDetails"}
        naviLink="visitor_details"
      />
    </Sidebar>
  );
}

export default CompleteSidebar;
