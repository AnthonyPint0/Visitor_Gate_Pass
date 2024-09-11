import React, { createContext, useEffect, useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronFirst, ChevronLast, icons, LogOut } from "lucide-react";
import circleLogo from "../../assets/KJC_Logo.svg";
import "./Sidebar.css"; // Import the CSS file for styling

const SidebarContext = createContext();
export const Sidebar = ({ children, user }) => {
  const navigate = useNavigate();
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const checkScreenSize = () => {
      setExpanded(window.matchMedia("(max-width: 420px)").matches);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => {
      window.removeEventListener("resize", checkScreenSize);
    };
  }, []);

  const handleLogout = () => {
    {
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const getInitials = (name) => {
    const words = name.split(" ").filter(Boolean); // Split the name by spaces and filter out any empty strings

    // Check if there are at least two words
    if (words.length > 1) {
      const firstInitial = words[0][0]; // First word's first character
      const lastInitial = words[words.length - 1][0]; // Last word's first character
      return `${firstInitial}${lastInitial}`.toUpperCase(); // Combine and convert to uppercase
    }

    // If there's only one word, just return its initial
    return words[0][0].toUpperCase();
  };

  return (
    <aside className="sidebar">
      <nav className={`sidebar-nav${expanded ? "" : "-collapsed"}`}>
        <div className="sidebar-header">
          <img
            src={circleLogo}
            alt="KJC_logo.svg"
            className={`logo${expanded ? "" : "-collapsed"}`}
          />
          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="collapse-button hidden sm:block"
          >
            {expanded ? (
              <ChevronFirst className="collapse-icon" />
            ) : (
              <ChevronLast className="collapse-icon" />
            )}
          </button>
        </div>

        <SidebarContext.Provider value={{ expanded }}>
          <ul className="links-children">{children}</ul>
        </SidebarContext.Provider>

        <div className={`user-profile${expanded ? "" : "-collapsed"}`}>
          <div className="flex flex-1 justify-center items-center text-xl bg-blue-600 h-10 rounded-md text-white min-w-10">
            {getInitials(user.name)}
          </div>
          <div
            className={`user-profile-details${expanded ? "" : "-collapsed"}`}
          >
            <div className="user-profile-details-texts text-sm">
              <h4>{user.name}</h4>
              <div className="user-profile-details-texts-email">
                {user.email}
              </div>
            </div>
            <button onClick={() => handleLogout()} className="logout-button">
              <LogOut size={20} className="logout-icon" />
            </button>
          </div>
        </div>
      </nav>
    </aside>
  );
};

export function SidebarItem({ icon, text, active, alert, naviLink }) {
  const navigate = useNavigate();

  const { expanded } = useContext(SidebarContext);

  return (
    <li
      className={`sidebar-item group ${active ? "sidebar-item-active" : ""}`}
      onClick={() => navigate(`/${naviLink}`)}
    >
      {icon}
      <span
        className={`sidebar-item-text${expanded ? "-expanded" : "-collapsed"}`}
      >
        {text}
      </span>
      {alert && (
        <div className={`sidebar-item-alert${expanded ? "" : "-collapsed"}`} />
      )}

      {!expanded && (
        <div
          className={`
        absolute left-full rounded-md px-2 py-1 ml-6 w-fit
        bg-indigo-100 text-indigo-800 text-sm
        invisible opacity-20 -translate-x-3 transition-all z-50
        group-hover:visible group-hover:opacity-100 group-hover:translate-x-0
        `}
        >
          {text}
        </div>
      )}
    </li>
  );
}
