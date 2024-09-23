import "./Checkout_Visitor.css";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledMenuItem,
  StyledSelect,
  StyledTextField,
} from "../../components/StyledComponents/StyledComponents.js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import SyncIcon from "@mui/icons-material/Sync";
import SendIcon from "@mui/icons-material/Send";
import CustomDropdown from "../../components/CustomDropDown/CustomDropDown.jsx";
import default_photo from "../../assets/default_photo.svg";
import { useEffect, useState } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { API_BASE_URL } from "../../library/helper.js";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";

function Checkout_Visitor() {
  const { width, height } = useWindowSize();
  const [selectedValuesArray, setSelectedValuesArray] = useState([]); //array for selected ids
  const [initiallyCheckedOut, setInitiallyCheckedOut] = useState([]);
  const [checkedStates, setCheckedStates] = useState([]); //state for checked states of checkout span buttons
  const [selectedValues, setSelectedValues] = useState([]); // for selectiong ids to checkout
  const [checkedInIds, setCheckedInIds] = useState([]); // for dropdown selection
  const [selectedId, setSelectedId] = useState(""); //for selecting an id from dropdown
  const [visitorData, setVisitorData] = useState(null); // State for visitor data
  const [selectedExit, setSelectedExit] = useState("Gate 1"); // Default value for exit gate
  const [shouldReload, setShouldReload] = useState(false);
  const API_URL = API_BASE_URL;
  const navigator = useNavigate();

  useEffect(() => {
    document.title = `Checkout_Visitor: ${width} x ${height}`;
  }, [width, height]);

  const notifyExists = (id) => {
    toast.info(`Id No: ${id} Exists`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifyErr = (err) => {
    toast.error(`${err}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const notifySuccess = (text) => {
    toast.success(`${text}`, {
      position: "top-left",
      autoClose: 3000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored",
      transition: Slide,
    });
  };

  const fetchCheckedInIds = async (query) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/visitors/get-checked-in-ids`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setCheckedInIds(
        response.data.map((id) => ({ label: String(id), value: String(id) }))
      );
    } catch (error) {
      console.error("Error fetching checked-in IDs:", error);
      setCheckedInIds([]); // Clear the state in case of error
    }
  };
  useEffect(() => {
    fetchCheckedInIds(""); // Fetch all IDs initially
  }, []);

  const handleIdCardChange = (inputValue) => {
    setSelectedId(inputValue.value);
  };

  const handleFetchData = async (event) => {
    event.preventDefault();
    if (!checkSelectedIdsFormat()) {
      return false;
    }

    if (selectedId == "") {
      notifyErr("No Id Selected");
    } else {
      setSelectedValues([]);
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/visitors/retrieve-visitor-details`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
            params: { id: selectedId },
          }
        );

        if (response.status === 200) {
          const data = response.data;
          setVisitorData(data); // Set visitor data including photo
          notifyExists(selectedId);

          // Set checked states based on member_details
          const newCheckedStates = data.member_details.map(
            (member) => member.status === "checked_out"
          );
          setCheckedStates(newCheckedStates);
        } else {
          console.error("Failed to fetch data:", response.statusText);
        }
      } catch (error) {
        notifyErr("The Id Is Not Checked-In");
        console.error("Error occurred while fetching data:", error);
      }
    }
  };

  //Formated date and time
  function formatDateTime(dateString) {
    const date = new Date(dateString);

    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");

    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format
    const formattedHours = hours.toString().padStart(2, "0");

    return `${month}/${day}/${year} ${formattedHours}:${minutes}:${seconds} ${ampm}`;
  }

  useEffect(() => {
    if (visitorData?.member_details) {
      const initialCheckedStates = visitorData.member_details.map(
        (member) => member.status === "checked_in"
      );
      const initialCheckedOut = visitorData.member_details.map(
        (member) => member.status === "checked_out"
      );
      setCheckedStates(initialCheckedStates);
      setInitiallyCheckedOut(initialCheckedOut);
    }
  }, [visitorData]);

  const handleToggle = (index, card_id) => {
    if (!initiallyCheckedOut[index]) {
      setCheckedStates((prevStates) =>
        prevStates.map((state, i) => (i === index ? !state : state))
      );

      setSelectedValues((prevValues) => {
        const updatedValues = prevValues.includes(card_id)
          ? prevValues.filter((id) => id !== card_id)
          : [...prevValues, card_id];
        console.log("Selected Values:", updatedValues);
        setSelectedValuesArray(updatedValues);
        return updatedValues;
      });
    }
  };

  const checkSelectedIdsFormat = () => {
    if (!/^\d{3}$/.test(selectedId)) {
      notifyErr("Each ID must be a string of exactly 3 numeric characters");
      return false;
    } else if (selectedId < "001" || selectedId > "500") {
      notifyErr("Each ID must be between 001 and 500");
      return false;
    }
    return true;
  };

  const handleCheckout = async (event) => {
    event.preventDefault();
    if (!checkSelectedIdsFormat()) {
      return false;
    }

    if (selectedValuesArray.length < 1) {
      notifyErr("Please Select an ID to Checkout");
      return false;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.post(
        `${API_URL}/visitor-groups/process-visitor-checkout`,
        {
          selectedValues,
          selectedExit,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.status === 200) {
        notifySuccess("Checkout completed successfully.");
        handleClear();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      } else {
        notifyErr("Failed to complete checkout.");
      }
    } catch (error) {
      notifyErr("An error occurred during checkout.");
      console.error("Checkout error:", error);
    }
  };

  const handleClear = () => {
    setVisitorData(null);
  };

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <div className="content">
          <CompleteSidebar isActive="checkoutVisitor" />
          <ToastContainer />
          <main className="mainContent">
            <div className="checkout-register-form">
              <Box
                sx={{
                  p: 2,
                  display: "flex",
                  flexDirection: "column",
                  flexGrow: 1,
                  overflow: "auto",
                }}
              >
                <h2
                  style={{
                    width: "100%",
                    height: "fit-content",
                    fontFamily: "Roboto, Poppins",
                    fontSize: "16px",
                    fontWeight: 500,
                    borderBottom: "1px solid rgb(183, 183, 183)",
                  }}
                >
                  Visitor Check-out
                </h2>

                <Box
                  sx={{
                    m: 1,
                    mb: 2,
                    maxWidth: "50",
                    display: "flex",
                    flexDirection: "row",
                    flexWrap: "wrap",
                    alignItems: "end",
                    justifyContent: "start",
                    gap: 1,
                  }}
                >
                  <StyledFormControl sx={{ width: "260px" }}>
                    <StyledInputLabel htmlFor="checkoutId">
                      Visitor ID Card
                    </StyledInputLabel>
                    <CustomDropdown
                      id="checkoutId"
                      name="checkoutId"
                      types="text"
                      widths={100}
                      option_width={50}
                      search_box_width={135}
                      value={selectedId}
                      onChange={handleIdCardChange}
                      options={checkedInIds}
                      placeholder="Select ID"
                    />
                  </StyledFormControl>
                  <Button
                    variant="outlined"
                    startIcon={<SyncIcon />}
                    sx={{
                      fontSize: "11px",
                      fontWeight: 600,
                      borderRadius: 2,
                      color: "white",
                      backgroundColor: "#239700",
                      textTransform: "none",
                    }}
                    onClick={handleFetchData}
                  >
                    Fetch Details
                  </Button>
                </Box>
                <form style={{ maxWidth: "1200px" }}>
                  <Box
                    sx={{
                      "& > :not(style)": {
                        m: 1,
                        width: { xs: "85%", sm: "260px" },
                      },
                      height: { xs: "auto", sm: "200px", md: "fit-content" },
                    }}
                  >
                    <StyledFormControl>
                      <StyledInputLabel htmlFor="name">
                        Full Name
                      </StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="name"
                        name="name"
                        value={visitorData?.name || ""}
                        readOnly
                      />
                    </StyledFormControl>
                    <StyledFormControl>
                      <StyledInputLabel htmlFor="phoneno">
                        Phone Number
                      </StyledInputLabel>
                      <StyledTextField
                        type="tel"
                        variant="outlined"
                        id="phoneno"
                        name="phoneno"
                        value={visitorData?.phone_number || ""}
                        readOnly
                      />
                    </StyledFormControl>
                    <StyledFormControl>
                      <StyledInputLabel htmlFor="purpose">
                        Purpose of Visit
                      </StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="purpose"
                        name="purpose"
                        value={visitorData?.purpose_of_visit || ""}
                        readOnly
                      />
                    </StyledFormControl>
                    <StyledFormControl>
                      <StyledInputLabel htmlFor="entry">
                        Entry Gate
                      </StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="entry"
                        name="entry"
                        value={visitorData?.entry_gate || ""}
                        readOnly
                      />
                    </StyledFormControl>
                    {visitorData?.vehicle_number && (
                      <StyledFormControl>
                        <StyledInputLabel htmlFor="vehicle_no">
                          Vehicle Number
                        </StyledInputLabel>

                        <StyledTextField
                          type="text"
                          variant="outlined"
                          id="vehicle_no"
                          name="vehicle_no"
                          value={visitorData.vehicle_number}
                          readOnly
                        />
                      </StyledFormControl>
                    )}

                    <StyledFormControl>
                      <StyledInputLabel htmlFor="groupSize">
                        Group Size
                      </StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="groupSize"
                        name="groupSize"
                        value={visitorData?.group_size || ""}
                        readOnly
                      />
                    </StyledFormControl>
                    <StyledFormControl>
                      <StyledInputLabel htmlFor="checkInTime">
                        Check In Time
                      </StyledInputLabel>
                      <StyledTextField
                        type="text"
                        variant="outlined"
                        id="checkInTime"
                        name="checkInTime"
                        value={
                          visitorData
                            ? formatDateTime(visitorData.check_in_time)
                            : ""
                        }
                        readOnly
                      />
                    </StyledFormControl>
                  </Box>
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: { xs: "column", sm: "row" },
                      justifyContent: "start",
                      "& > :not(style)": {
                        m: 1,
                        width: { xs: "85%", sm: "260px" },
                      },
                      height: { xs: "auto", sm: "200px", md: "fit-content" },
                    }}
                  >
                    <StyledFormControl>
                      <StyledInputLabel>Photo</StyledInputLabel>
                      <Box
                        className="photo-frame"
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          minWidth: "fit-content",
                          width: "100%",
                          height: "fit-content",
                          maxHeight: "300px",
                          border: "1px solid #4250661A",
                          backgroundColor: "#fff",

                          borderRadius: "5px",
                        }}
                      >
                        <img
                          src={visitorData?.photos || default_photo}
                          alt="Visitor"
                        />
                      </Box>
                    </StyledFormControl>
                    <StyledFormControl
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Centers horizontally
                        margin: 2, // Centers the element horizontally within the parent container
                        width: "fit-content",
                      }}
                    >
                      <StyledInputLabel>Select IDs</StyledInputLabel>
                      <Box
                        sx={{
                          display: "flex",
                          gap: "10px",
                          flexWrap: "wrap",
                        }}
                      >
                        {visitorData?.member_details.map((member, index) => (
                          <Button
                            key={index}
                            variant="contained"
                            sx={{
                              backgroundColor: checkedStates[index]
                                ? "red"
                                : "#02e802",
                              boxShadow: checkedStates[index]
                                ? "0px 4px 10px rgba(255, 0, 0, 0.5)"
                                : "0px 4px 10px rgba(0, 0, 0, 0.2)",
                              color: checkedStates[index] ? "white" : "black",
                              border: "none",
                              borderRadius: "5px",
                              padding: "5px 5px",
                              cursor: initiallyCheckedOut[index]
                                ? "not-allowed"
                                : "pointer",
                              transition: "transform 0.2s ease",
                              transform: checkedStates[index]
                                ? "scale(1.05)"
                                : "scale(1)",
                              "&:hover": {
                                backgroundColor: checkedStates[index]
                                  ? "#d00000"
                                  : "#00cc00",
                              },
                            }}
                            onClick={() =>
                              !initiallyCheckedOut[index] &&
                              handleToggle(index, member.card_id)
                            }
                            disabled={initiallyCheckedOut[index]}
                          >
                            {member.card_id}
                          </Button>
                        ))}
                      </Box>
                    </StyledFormControl>
                    <StyledFormControl
                      sx={{
                        display: "flex",
                        justifyContent: "center", // Centers horizontally
                        margin: "0 auto", // Centers the element horizontally within the parent container
                        width: "fit-content",
                      }}
                    >
                      <StyledInputLabel id="exit">Exit Gate</StyledInputLabel>
                      <StyledSelect
                        name="exit"
                        id="exit"
                        value={selectedExit}
                        onChange={(e) => setSelectedExit(e.target.value)}
                      >
                        <StyledMenuItem value="Gate 1">Gate 1</StyledMenuItem>
                        <StyledMenuItem value="Gate 2">Gate 2</StyledMenuItem>
                      </StyledSelect>
                    </StyledFormControl>
                  </Box>
                </form>
                <Box
                  sx={{
                    mt: "auto",
                    display: "flex",
                    justifyContent: "flex-end",
                    borderTop: "1px solid rgb(183, 183, 183)",
                    pt: 2,
                    backgroundColor: "#fff",
                  }}
                >
                  <Stack direction="row" spacing={2}>
                    <Button
                      variant="contained"
                      color="error"
                      sx={{
                        color: "white",
                        textTransform: "none",
                        borderRadius: 1,
                        fontSize: { xs: "10px", sm: "14px" },
                      }}
                      onClick={() => {
                        handleClear();
                        navigator("/dashboard");
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      variant="contained"
                      color="primary"
                      sx={{
                        color: "white",
                        textTransform: "none",
                        borderRadius: 1,
                        fontSize: { xs: "10px", sm: "14px" },
                      }}
                      onClick={handleClear}
                    >
                      Clear
                    </Button>
                    <Button
                      type="submit"
                      variant="outlined"
                      endIcon={<SendIcon />}
                      sx={{
                        color: "white",
                        backgroundColor: "#239700",
                        textTransform: "none",
                        borderRadius: 1,
                        fontSize: { xs: "10px", sm: "14px" },
                      }}
                      onClick={handleCheckout}
                    >
                      Check Out
                    </Button>
                  </Stack>
                </Box>
              </Box>
            </div>
          </main>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Checkout_Visitor;
