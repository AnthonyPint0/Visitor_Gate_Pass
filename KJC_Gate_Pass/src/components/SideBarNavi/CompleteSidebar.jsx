import React, { useState, useEffect } from "react";
import { Sidebar, SidebarItem } from "./Sidebar";
import {
  ListCollapse,
  DoorOpen,
  SquareMenu,
  LayoutDashboard,
  Menu,
  Users,
} from "lucide-react"; // Import hamburger icon

function CompleteSidebar({ isActive }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSidebarVisible, setIsSidebarVisible] = useState(
    window.innerWidth > 420
  ); // State to control sidebar visibility
  const [isSmallScreen, setIsSmallScreen] = useState(window.innerWidth <= 420); // Check if the screen is small

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);

      try {
        const token = localStorage.getItem("token");

        if (!token) {
          setError("No token found.");
          return;
        }

        const payload = JSON.parse(atob(token.split(".")[1])); // Decode token payload
        setUser({
          name: payload.name,
          email: payload.email,
        });
      } catch (err) {
        console.error("Error decoding token:", err);
        setError("Failed to load user data.");
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();

    // Add event listener to track window resize and toggle sidebar based on screen width
    const handleResize = () => {
      const isCurrentSmallScreen = window.innerWidth <= 420;
      setIsSmallScreen(isCurrentSmallScreen);

      if (isCurrentSmallScreen) {
        setIsSidebarVisible(false); // Hide sidebar on small screens
      } else {
        setIsSidebarVisible(true); // Show sidebar on larger screens
      }
    };

    window.addEventListener("resize", handleResize); // Listen for window resize
    handleResize(); // Call handleResize initially to set the correct state based on the initial screen size

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  // Function to toggle sidebar visibility
  const toggleSidebar = () => {
    setIsSidebarVisible((prev) => !prev);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!user) {
    return <div>No user data available.</div>;
  }

  return (
    <>
      {isSmallScreen && (
        <div className="hamburger-menu flex justify-center items-center w-9 h-9 rounded-3xl shadow-lg ">
          <button onClick={toggleSidebar} className="">
            <Menu size={24} />
          </button>
        </div>
      )}

      {isSidebarVisible && (
        <Sidebar
          user={user}
          className={`sidebar ${isSmallScreen ? "small-screen-sidebar" : ""}`}
        >
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
          <SidebarItem
            icon={<Users size={20} />}
            text="Checkin Guest"
            active={isActive === "checkinGuest"}
            naviLink="checkin_guest"
          />
        </Sidebar>
      )}
    </>
  );
}

export default CompleteSidebar;
