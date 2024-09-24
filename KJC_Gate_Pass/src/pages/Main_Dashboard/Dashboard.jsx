import "./Dashboard.css";
import DashboardWidget from "./DashboardWidget.jsx";
import ReactVisitorTable from "../../components/VisitorTable/ReactVisitorTable.jsx";
import totalVisitorIcons from "../../assets/Icons/TotalVisitoirBlack_Icon.svg";
import CheckinCountICon from "../../assets/Icons/CheckinCount_Icon.svg";
import CheckoutCountICon from "../../assets/Icons/CheckoutCount_Icon.svg";
import ExpiredCountICon from "../../assets/Icons/ExpiredCount_Icon.svg";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import { API_BASE_URL } from "../../library/helper.js";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

import useWindowSize from "../../hooks/useWindowSize";
import axios from "axios";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { Box } from "@mui/material";

function Dashboard() {
  const { width, height } = useWindowSize();
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const fetchVisitorData = async () => {
      setLoading(true);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/visitors/visitor-sessions-today`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        setVisitorData(response.data);
        console.log(response.data);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchVisitorData();
  }, []);

  useEffect(() => {
    document.title = `Dashboard: ${width} x ${height}`;
  }, [width, height]);

  let totalVisitors = 0;
  let checkedInVisitors = 0;
  let checkedOutVisitors = 0;
  let expiredVisitors = 0;

  visitorData.forEach((visitor) => {
    visitor.visitor_cards.forEach((card) => {
      if (card.status === "checked_in") {
        checkedInVisitors++;
      } else if (card.status === "checked_out") {
        checkedOutVisitors++;
      }

      // Calculate expiration for visitors still checked in
      if (card.check_out_time === null) {
        const checkInTime = dayjs(card.check_in_time); // Parse check_in_time
        const expirationTime = checkInTime.add(visitor.time_limit, "hour"); // Add the time limit to check_in_time
        const currentTime = dayjs(); // Get the current time

        if (currentTime.isAfter(expirationTime)) {
          expiredVisitors++; // Visitor has expired
        }
      }
    });
  });

  totalVisitors = checkedInVisitors + checkedOutVisitors;

  return (
    <div className="totalContent">
      <div className="content">
        <CompleteSidebar isActive="dashboard" />
        <main className="main-content" style={{ paddingBottom: "50px" }}>
          <div className="Widgets">
            <DashboardWidget
              isCountWidget={true}
              icon={totalVisitorIcons}
              widgets="totalVisitorCount"
              title="Total Visitor"
              count={totalVisitors}
            />
            <DashboardWidget
              isCountWidget={true}
              icon={CheckinCountICon}
              widgets="checkinVisitorCount"
              title="Check-in Visitor"
              count={checkedInVisitors}
            />
            <DashboardWidget
              isCountWidget={true}
              icon={CheckoutCountICon}
              widgets="checkoutVisitorCount"
              title="Check-out Visitor"
              count={checkedOutVisitors}
            />
            <DashboardWidget
              isCountWidget={true}
              icon={ExpiredCountICon}
              widgets="expiredVisitorCount"
              title="Expired Visitor"
              count={expiredVisitors}
              isAnimate={true}
            />
          </div>
          <div className="data-grid">
            {loading ? (
              <LoadingSpinner />
            ) : (
              <ReactVisitorTable
                visitors={visitorData}
                isLoading={loading}
                totalVisitorCount={totalVisitors}
              />
            )}
          </div>
        </main>
      </div>
      <div className="footer-style">
        <Footer />
      </div>
    </div>
  );
}

export default Dashboard;
