import React from "react";
import KJC_Logo from "../../assets/KJC_Logo.svg"; // Correct import

function Header() {
  return (
    <div className="headerLogo">
      <img src={KJC_Logo} alt="KJC Logo" /> {/* Use the imported variable */}
    </div>
  );
}

export default Header;
