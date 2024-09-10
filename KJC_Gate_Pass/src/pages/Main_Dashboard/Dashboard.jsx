import "./Dashboard.css";
import DashboardWidget from "./DashboardWidget.jsx";
import ReactVisitorTable from "../../components/VisitorTable/ReactVisitorTable.jsx";
import totalVisitorIcons from "../../assets/Icons/TotalVisitoirBlack_Icon.svg";
import CheckinCountICon from "../../assets/Icons/CheckinCount_Icon.svg";
import CheckoutCountICon from "../../assets/Icons/CheckoutCount_Icon.svg";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner.jsx";
import { API_BASE_URL } from "../../library/helper.js";

import { useEffect, useState } from "react";

import useWindowSize from "../../hooks/useWindowSize";
import axios from "axios";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

function Dashboard() {
  const { width, height } = useWindowSize();
  const [visitorData, setVisitorData] = useState([]);
  const [loading, setLoading] = useState(true);
  const API_URL = API_BASE_URL;

  useEffect(() => {
    const fetchVisitorData = async () => {
      try {
        const response = await axios.get(
          `${API_URL}/visitors/visitor-sessions`
        );
        setVisitorData(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching visitor data:", error);
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

  visitorData.forEach((visitor) => {
    visitor.visitor_cards.forEach((card) => {
      if (card.status === "checked_in") {
        checkedInVisitors++;
      } else if (card.status === "checked_out") {
        checkedOutVisitors++;
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
