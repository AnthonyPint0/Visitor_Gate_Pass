import React from "react";
import { ChevronFirst } from "lucide-react";
import circleLogo from "../../assets/KJC_CircLe_Logo_Blu.svg";

function SideNavi() {
  return (
    <aside className="h-screen">
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        <div className="p-44 pb-2 flex justify-between items-center">
          <img src={circleLogo} alt="KJC_logo.svg" className="max-w-14" />
          <button>
            <ChevronFirst className="p-1.5 rounded-lg bg-gray-50 hover:bg-gray-100" />
          </button>
        </div>
      </nav>
    </aside>
  );
}

export default SideNavi;
