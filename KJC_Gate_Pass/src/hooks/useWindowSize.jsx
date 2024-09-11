// src/hooks/useWindowSize.js
import { useState, useEffect } from "react";

const useWindowSize = () => {
  const [width, setWidth] = useState(window.innerWidth);
  const [height, setHeight] = useState(window.innerHeight);
  const [sidebarVisible, setSidebarVisible] = useState(width > 420);

  const handleResize = () => {
    setWidth(window.innerWidth);
    setHeight(window.innerHeight);
    setSidebarVisible(window.innerWidth > 420);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    console.log("EVENT LISTENER ADDED");

    // Cleanup listener on unmount
    return () => {
      window.removeEventListener("resize", handleResize);
      console.log("EVENT LISTENER REMOVED");
    };
  }, []);

  return { width, height, sidebarVisible };
};

export default useWindowSize;
