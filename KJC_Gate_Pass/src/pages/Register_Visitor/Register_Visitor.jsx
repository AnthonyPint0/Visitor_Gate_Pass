import "./Register_Visitor.css";
import {
  StyledFormControl,
  StyledInputLabel,
  StyledTextField,
  StyledMenuItem,
  StyledSelect,
} from "../../components/StyledComponents/StyledComponents.js";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useState, useRef } from "react";
import { ToastContainer, toast, Slide } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import useWindowSize from "../../hooks/useWindowSize.jsx";
import axios from "axios";
import CustomDropdown from "../../components/CustomDropDown/CustomDropDown.jsx";
import { useNavigate } from "react-router-dom";
import { API_BASE_URL } from "../../library/helper.js";
import CompleteSidebar from "../../components/SideBarNavi/CompleteSidebar.jsx";
import Footer from "../../components/Footer/Footer.jsx";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

function Register_Visitor() {
  const { width, height } = useWindowSize();
  const [visitorExists, setVisitorExists] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [name, setName] = useState("");
  const [purposeOfVisit, setPurposeOfVisit] = useState("");
  const [entryGate, setEntryGate] = useState("Gate 1"); // Default entry gate
  const [vehicleNo, setVehicleNo] = useState("");
  const [groupSize, setGroupSize] = useState(1);
  const [timeLimit, setTimeLimit] = useState(1);
  const [currentDateTime, setCurrentDateTime] = useState("");

  const [selectedCamera, setSelectedCamera] = useState("");
  const [availableCameras, setAvailableCameras] = useState([]);
  const [isCameraON, setIsCameraON] = useState(false);
  const [photoDataUrl, setPhotoDataUrl] = useState(null);
  const [hasPhoto, setHasPhoto] = useState(false);

  const videoRef = useRef(null);
  const photoRef = useRef(null);
  const streamRef = useRef(null); // Reference to hold the media stream
  const NameInputRef = useRef(null);
  const [options, setOptions] = useState([
    { value: "Campus Tour", label: "Campus Tour" },
    { value: "Meeting", label: "Meeting" },
    { value: "Event", label: "Event" },
  ]); // Initial options
  const [filteredOptions, setFilteredOptions] = useState(options); // Define filteredOptions state
  const [idCards, setIdCards] = useState(["", "", "", "", ""]);
  const [filteredICards, setFilteredICards] = useState([]);
  const API_URL = API_BASE_URL;
  const [shouldReload, setShouldReload] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Convert all elements in idCards to strings
    const idCardsAsStrings = idCards.map((id) => String(id));

    // console.log(
    //   `idCards: ${idCardsAsStrings} arraySize: ${idCardsAsStrings.length}`
    // );

    // Log each element with pipes around them to clearly show the boundaries of each string
    // idCardsAsStrings.map((id) => console.log(`|${id}|`));
  }, [idCards]);

  useEffect(() => {
    fetchAvailableCards("").then((initialOptions) => {
      setFilteredICards(
        initialOptions.map((item) => ({ value: item, label: item }))
      );
    });
  }, []);

  useEffect(() => {
    const cardInputs = idCards.filter((val) => val);
    fetchAvailableCards("").then((responseValues) => {
      const uniqueResponseValues = responseValues.filter(
        (item) => !cardInputs.includes(item)
      );
      const newOptions = uniqueResponseValues.map((item) => ({
        value: item,
        label: item,
      }));
      setFilteredICards(newOptions);
    });
  }, [idCards]);

  useEffect(() => {
    document.title = `Register_Visitor: ${width} x ${height}`;
  }, [width, height]);

  useEffect(() => {
    const updateCurrentDateTime = () => {
      const now = new Date();
      const day = now.getDate().toString().padStart(2, "0");
      const month = (now.getMonth() + 1).toString().padStart(2, "0"); // Month is zero-indexed
      const year = now.getFullYear();
      let hours = now.getHours();
      const minutes = now.getMinutes().toString().padStart(2, "0");
      const seconds = now.getSeconds().toString().padStart(2, "0");
      const ampm = hours >= 12 ? "PM" : "AM";

      // Convert hours to 12-hour format
      hours = hours % 12;
      hours = hours ? hours : 12; // Handle midnight (0 hours)

      const formattedDateTime = `${day}/${month}/${year} ${hours}:${minutes}:${seconds} ${ampm}`;
      setCurrentDateTime(formattedDateTime);
    };

    // Update the date and time immediately on mount
    updateCurrentDateTime();

    // Update the date and time every second
    const intervalId = setInterval(updateCurrentDateTime, 1000);

    // Clean up the interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const notifyExists = (phone_number, name) => {
    toast.info(`Visitor '${name}' with ${phone_number} exists`, {
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

  const fetchAvailableCards = async (query) => {
    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return [];
      }

      const response = await axios.get(
        `${API_URL}/visitor-groups/search-available-cards`,
        {
          params: { query },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // console.log(response.data);
      return response.data.map((item) => String(item));
    } catch (error) {
      console.error("Error fetching options:", error);
      return [];
    }
  };

  const filterAndSetOptions = (inputValue, cardInputs, index) => {
    const newIdCards = [...idCards];
    newIdCards[index] = inputValue.value;
    setIdCards(newIdCards);

    if (!inputValue.value) {
      setFilteredICards([...filteredICards]); // Reset to initial options if input is empty
      return;
    }

    fetchAvailableCards(inputValue.value).then((responseValues) => {
      const uniqueResponseValues = responseValues.filter(
        (item) => !cardInputs.includes(item)
      );
      const idsArray = filteredICards ? filteredICards.map((f) => f.value) : [];
      let totalResponse = [...idsArray, ...uniqueResponseValues];
      totalResponse = [...new Set(totalResponse)];
      const newOptions = totalResponse.map((item) => ({
        value: item,
        label: item,
      }));
      setFilteredICards(newOptions);
    });
  };

  const handleIdCardChange = (inputValue, index) => {
    const cardInputs = idCards.filter((val) => val);
    filterAndSetOptions(inputValue, cardInputs, index);
  };

  const handlePhonenoChange = async (event) => {
    const input = event.target.value;
    NameInputRef.current.readOnly = false;
    const sanitizedInput = input.replace(/\D/g, ""); // Remove non-digit characters
    const phonenum = sanitizedInput.slice(0, 10); // Ensure the input length is no more than 10

    setPhoneNumber(phonenum); // Update the phone number state

    if (phonenum.length === 10) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return;
        }

        const response = await axios.get(
          `${API_URL}/visitors/lookup-by-phone`,
          {
            params: { phone_number: phonenum },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data === "") {
          setName(""); // Clear the name if visitor does not exist
          setVisitorExists(false);
        } else {
          setName(response.data); // Update the name state with the returned name
          setVisitorExists(true);
          notifyExists(phonenum, response.data);
          if (NameInputRef) {
            NameInputRef.current.readOnly = true;
          }
        }
      } catch (error) {
        console.error("Error fetching name by phone number:", error);
        // Optionally set an error state here
      }
    } else {
      setName(""); // Clear the name state if phone number length is less than 10
    }
  };

  useEffect(() => {
    // Use this effect to do something when purposeOfVisit updates
    // console.log("Updated purposeOfVisit:", purposeOfVisit);
  }, [purposeOfVisit]);

  const handlePurposeChange = async (inputValue) => {
    setPurposeOfVisit(inputValue.value);

    if (!inputValue.value) {
      setFilteredOptions(options); // Reset to initial options if input is empty
      return;
    }

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return;
      }

      const response = await axios.get(
        `${API_URL}/visitor-groups/search-purpose`,
        {
          params: { query: inputValue.value },
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const newOptions = response.data.map((item) => ({
        value: String(item),
        label: String(item),
      }));
      setFilteredOptions(newOptions);
      // console.log(newOptions);
    } catch (error) {
      console.error("Error fetching options:", error);
    }
  };

  const handleEntryChange = (event) => {
    setEntryGate(event.target.value);
  };

  const handleVehicleNoChange = (event) => {
    setVehicleNo(event.target.value);
  };

  const handleGroupSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    setGroupSize(newSize);
  };

  const handleNameChange = (event) => {
    setName(event.target.value);
  };

  const handleTimeLimitChange = (event) => {
    setTimeLimit(event.target.value);
  };

  // Reset idCards when groupSize decreases
  useEffect(() => {
    setIdCards((prevIdCards) => prevIdCards.slice(0, groupSize));
  }, [groupSize]);

  // Function to get available cameras
  useEffect(() => {
    const getAvailableCameras = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(
          (device) => device.kind === "videoinput"
        );
        setAvailableCameras(videoDevices);
        if (videoDevices.length > 0) {
          setSelectedCamera(videoDevices[0].deviceId); // Set first camera as default
        }
      } catch (error) {
        console.error("Error accessing cameras", error);
      }
    };

    getAvailableCameras();
  }, []);

  // Get the video stream from the selected camera
  const getVideo = (cameraId) => {
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia({
          video: {
            deviceId: cameraId ? { exact: cameraId } : undefined,
            width: 1920,
            height: 1080,
          },
        })
        .then((stream) => {
          let video = videoRef.current;
          video.srcObject = stream;
          video.play();
          streamRef.current = stream; // Store the stream reference
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
        });
    } else {
      console.error("getUserMedia is not supported by this browser.");
    }
  };

  useEffect(() => {
    if (isCameraON && videoRef.current && selectedCamera) {
      getVideo(selectedCamera);
    }
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCameraON, selectedCamera]);

  // Function to turn camera on
  const onCamera = async () => {
    if (!isCameraON) {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: {
            deviceId: selectedCamera ? { exact: selectedCamera } : undefined,
          },
        });
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        setIsCameraON(true);
      } catch (err) {
        console.error("Error accessing camera: ", err);
      }
    } else {
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const tracks = videoRef.current.srcObject.getTracks();
      tracks.forEach((track) => track.stop());
    }
    setIsCameraON(false);
  };

  const capturePhoto = (event) => {
    const width = 290;
    const height = width / (16 / 9);
    let video = videoRef.current;
    let photo = photoRef.current;
    photo.width = width;
    photo.height = height;
    const context = photo.getContext("2d");
    context.drawImage(video, 0, 0, width, height);

    // Save the captured image as a data URL
    const dataUrl = photo.toDataURL("image/png");
    setPhotoDataUrl(dataUrl);
    setHasPhoto(true); // Set the photo state to true once a photo is captured
  };

  const clearPhoto = (event) => {
    const context = photoRef.current.getContext("2d");
    context.clearRect(0, 0, photoRef.current.width, photoRef.current.height);
    setHasPhoto(false);
    setPhotoDataUrl("");
  };

  const handleCameraChange = (event) => {
    setSelectedCamera(event.target.value);
  };

  const checkArrayFilled = async () => {
    if (groupSize !== idCards.length) {
      notifyErr("IDs are not assigned");
      return false;
    } else if (idCards.some((id) => id === false)) {
      notifyErr("All ID slots must be filled");
      return false;
    } else if (!idCards.every((id) => /^\d{3}$/.test(id))) {
      notifyErr("Each ID must be a string of exactly 3 numeric characters");
      return false;
    } else {
      // Check if all IDs are unique
      const uniqueIds = new Set(idCards);
      if (uniqueIds.size !== idCards.length) {
        notifyErr("Each ID must be unique");
        return false;
      }
      // Check if all IDs are between 001 and 500
      if (idCards.some((id) => id < "001" || id > "500")) {
        notifyErr("Each ID must be between 001 and 500");
        return false;
      }
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return false;
        }

        const response = await axios.get(
          `${API_URL}/visitor-groups/verify-id-availability`,
          {
            params: { ID_Array: idCards },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.data.checking) {
          notifyErr(response.data.msg);
          return false;
        }
      } catch (error) {
        console.error("Error checking ID availability:", error);
        notifyErr("Error checking ID availability");
        return false;
      }

      notifySuccess("All ID slots are filled");
      return true;
    }
  };

  const checkVisitorAccessibility = async () => {
    if (visitorExists) {
      try {
        const token = localStorage.getItem("token");

        if (!token) {
          console.error("No token found");
          return false;
        }

        const response = await axios.get(
          `${API_URL}/visitor-groups/verify-visitor-accessibility`,
          {
            params: { phone_number: phoneNumber },
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (response.data.checking) {
          notifySuccess("Visitor is accessible");
          return true;
        } else {
          notifyErr(response.data.msg);
          return false;
        }
      } catch (error) {
        console.error("Error checking visitor accessibility:", error);
        notifyErr("Error checking visitor accessibility");
        return false;
      }
    } else {
      return true;
    }
  };

  const handleSubmit = async (event) => {
    // console.log(visitorExists);

    if (phoneNumber.length !== 10) {
      notifyErr("Please fill Phone number appropriately");
      return;
    }

    if (!name) {
      notifyErr("Please provide a name");
      return;
    }

    if (!purposeOfVisit) {
      notifyErr("Please provide a purpose of visit");
      return;
    }

    if (!entryGate) {
      notifyErr("Please provide an entry gate");
      return;
    }

    if (entryGate === "Gate 2" && !vehicleNo) {
      notifyErr("Please provide a vehicle number for Gate 2");
      return;
    }

    if (!groupSize) {
      notifyErr("Please provide a group size");
      return;
    }

    if (!currentDateTime) {
      notifyErr("Please provide the current date and time");
      return;
    }

    if (!photoDataUrl) {
      notifyErr("Please provide a photo");
      return;
    }

    if (!timeLimit) {
      notifyErr("Please provide the time limit");
      return;
    }

    const idArrayFilled = await checkArrayFilled();
    const accessibleVisitor = await checkVisitorAccessibility();

    if (!idArrayFilled) {
      return;
    }

    if (!accessibleVisitor) {
      return;
    }

    const finalData = {
      PhoneNumber: phoneNumber,
      Name: name,
      PurposeOfVisit: purposeOfVisit,
      EntryGate: entryGate,
      VehicleNo: vehicleNo || null,
      GroupSize: groupSize,
      TimeLimit: timeLimit,
      Checkin_time: new Date(),
      IdCards: idCards,
      Photo: photoDataUrl,
    };

    // console.log(finalData);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.error("No token found");
        return false;
      }

      console.log("Hello");
      const response = await axios.post(
        `${API_URL}/visitors/checkin-visitor`,
        { VisitorSessionInfo: finalData },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.data.checking) {
        notifySuccess(response.data.msg);
        handleClear();
        setTimeout(() => {
          window.location.reload();
        }, 3000);
      } else {
        notifyErr(response.data.msg);
      }
    } catch (error) {
      console.error("Error Register/Checkin Visitor:", error);
      notifyErr("Error Register/Checkin Visitor");
      return false;
    }
  };

  const handleClear = (event) => {
    setVisitorExists(false);
    setPhoneNumber("");
    setName("");
    setPurposeOfVisit("");
    setEntryGate("Gate 1"); // Default entry gate
    setVehicleNo(""); // New state variable to hold the vehicle number
    setGroupSize(1);
    setTimeLimit(1);
    // const [currentDateTime, setCurrentDateTime] = useState('');
    setHasPhoto(false);
    setIsCameraON(false);
    setPhotoDataUrl(""); // New state variable to hold the photo data URL
    setOptions([
      { value: "Campus Tour", label: "Campus Tour" },
      { value: "Meeting", label: "Meeting" },
      { value: "Event", label: "Event" },
    ]); // Initial options
    setFilteredOptions(options); // Define filteredOptions state
    setIdCards(["", "", "", "", ""]);
    setFilteredICards([]);
    clearPhoto();
    stopCamera();
    setSelectedCamera(availableCameras[0]?.deviceId || "");
  };

  // Import other necessary components and hooks

  return (
    <div className="fakeBody">
      <div className="totalContent">
        <div className="content">
          <Box sx={{ display: "flex" }}>
            {/* Keep Sidebar and ToastContainer as they are */}
            <CompleteSidebar isActive="registerVisitor" />
            <ToastContainer />
            <main className="mainContent">
              <div className="register-form">
                {/* <Box
                  component="main"
                  flex="1"
                  display="flex"
                  flexDirection="column"
                > */}
                <Box
                  sx={{
                    p: 1,
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
                    Visitor Registration
                  </h2>
                  <form>
                    <Box
                      display="flex"
                      flexDirection={{ xs: "column", md: "row" }}
                      justifyContent="space-between"
                      mb={2}
                    >
                      {/* Left Section */}
                      <Box
                        sx={{
                          flexBasis: "65%",
                          "& > :not(style)": {
                            m: 1,
                            pl: 2,
                            width: { xs: "85%", sm: "260px" },
                          },
                          height: { xs: "auto", sm: "200px", md: "300px" },
                        }}
                      >
                        <StyledFormControl>
                          <StyledInputLabel>Phone Number</StyledInputLabel>
                          <StyledTextField
                            type="tel"
                            variant="outlined"
                            id="phoneno"
                            value={phoneNumber}
                            onChange={handlePhonenoChange}
                          />
                        </StyledFormControl>

                        <StyledFormControl>
                          <StyledInputLabel htmlFor="name">
                            Full Name
                          </StyledInputLabel>
                          <StyledTextField
                            type="text"
                            variant="outlined"
                            id="name"
                            name="name"
                            ref={NameInputRef}
                            value={name}
                            onChange={handleNameChange}
                          />
                        </StyledFormControl>

                        <StyledFormControl>
                          <StyledInputLabel htmlFor="purpose">
                            Purpose of Visit
                          </StyledInputLabel>
                          <CustomDropdown
                            id="purpose"
                            name="purpose"
                            widths={217}
                            value={purposeOfVisit}
                            onChange={handlePurposeChange}
                            options={filteredOptions}
                            placeholder="Select..."
                          />
                        </StyledFormControl>

                        <StyledFormControl>
                          <StyledInputLabel id="time-limit-label">
                            Time Limit
                          </StyledInputLabel>
                          <StyledSelect
                            name="timeLimit"
                            id="timeLimit"
                            value={timeLimit}
                            onChange={handleTimeLimitChange}
                          >
                            {Array.from({ length: 6 }, (_, i) => (
                              <StyledMenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                              </StyledMenuItem>
                            ))}
                          </StyledSelect>
                        </StyledFormControl>
                        <StyledFormControl>
                          <StyledInputLabel id="entry">
                            Entry Gate
                          </StyledInputLabel>
                          <StyledSelect
                            name="entry"
                            id="entry"
                            value={entryGate}
                            onChange={handleEntryChange}
                          >
                            <StyledMenuItem value="Gate 1">
                              Gate 1
                            </StyledMenuItem>
                            <StyledMenuItem value="Gate 2">
                              Gate 2
                            </StyledMenuItem>
                          </StyledSelect>
                        </StyledFormControl>

                        {entryGate === "Gate 2" && (
                          <StyledFormControl>
                            <StyledInputLabel htmlFor="vehicle_no">
                              Vehicle Number
                            </StyledInputLabel>
                            <StyledTextField
                              type="text"
                              variant="outlined"
                              id="vehicle_no"
                              name="vehicle_no"
                              value={vehicleNo}
                              onChange={handleVehicleNoChange}
                            />
                          </StyledFormControl>
                        )}

                        <StyledFormControl>
                          <StyledInputLabel htmlFor="group">
                            Group Size
                          </StyledInputLabel>
                          <StyledSelect
                            type="number"
                            variant="outlined"
                            id="group"
                            value={groupSize}
                            onChange={handleGroupSizeChange}
                          >
                            {[1, 2, 3, 4, 5].map((size) => (
                              <StyledMenuItem key={size} value={size}>
                                {size}
                              </StyledMenuItem>
                            ))}
                          </StyledSelect>
                        </StyledFormControl>

                        <StyledFormControl>
                          <StyledInputLabel htmlFor="datetime">
                            Check-in Time
                          </StyledInputLabel>
                          <StyledTextField
                            type="text"
                            variant="outlined"
                            id="datetime"
                            name="datetime"
                            value={currentDateTime}
                            fullWidth
                            aria-readonly
                          />
                        </StyledFormControl>

                        <StyledFormControl>
                          <StyledInputLabel>Select IDs</StyledInputLabel>
                          {Array.from({ length: groupSize }, (_, index) => (
                            <Box key={index} sx={{ mb: 2 }}>
                              <CustomDropdown
                                // isTop={true}
                                id={`id${index + 1}`}
                                name={`id${index + 1}`}
                                widths={217}
                                option_width={50}
                                search_box_width={135}
                                types="number"
                                value={idCards[index]}
                                onChange={(inputValue) =>
                                  handleIdCardChange(inputValue, index)
                                }
                                options={filteredICards}
                                placeholder="ID"
                                Fcolour="white"
                                BGcolor="#1eb33b"
                                Fweight="700"
                              />
                            </Box>
                          ))}
                        </StyledFormControl>
                      </Box>
                      {/* Right Section */}
                      <Box
                        sx={{
                          flexBasis: "35%",
                          minWidth: "310px",
                          width: "100%",
                          display: "flex",
                          flexDirection: "column",
                          alignItems: "center",
                          flex: 1,
                        }}
                      >
                        {/* Camera Selection Dropdown */}
                        <FormControl
                          sx={{ minWidth: 120, marginBottom: 2, mt: 2 }}
                        >
                          <InputLabel id="camera-select-label">
                            Select Camera
                          </InputLabel>
                          <Select
                            labelId="camera-select-label"
                            id="camera-select"
                            value={selectedCamera}
                            label="Select Camera"
                            onChange={handleCameraChange}
                          >
                            {availableCameras.map((camera) => (
                              <MenuItem
                                key={camera.deviceId}
                                value={camera.deviceId}
                              >
                                {camera.label || `Camera ${camera.deviceId}`}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>

                        <Box
                          className="photo-frame"
                          sx={{
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            minWidth: "100%",
                            width: "90%",
                            height: "fit-content",
                          }}
                        >
                          <Box
                            className="live-videos"
                            sx={{
                              width: "300px",
                              minWidth: "300px",
                              height: "auto",
                              minHeight: "150px",
                              maxWidth: "400px",
                              border: "1px solid #000",
                              borderRadius: "5px",
                              backgroundColor: "#282828",
                            }}
                          >
                            <video
                              ref={videoRef}
                              style={{
                                display: isCameraON ? "block" : "none",
                                width: "100%",
                                height: "auto",
                              }}
                            />
                          </Box>

                          <Stack spacing={2} direction="column" sx={{ mt: 2 }}>
                            {!isCameraON && (
                              <Button
                                variant="contained"
                                onClick={onCamera}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                              >
                                Turn Camera On
                              </Button>
                            )}
                            {isCameraON && (
                              <Button
                                variant="contained"
                                onClick={onCamera}
                                color="error"
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                }}
                              >
                                Turn Camera Off
                              </Button>
                            )}
                            {isCameraON && (
                              <Button
                                variant="contained"
                                onClick={() => capturePhoto()}
                                sx={{
                                  textTransform: "none",
                                  borderRadius: 2,
                                  backgroundColor: "#239700",
                                }}
                              >
                                Capture Photo
                              </Button>
                            )}
                          </Stack>
                        </Box>

                        <Box
                          className="resulter"
                          sx={{
                            mt: 2,
                            width: "100%",
                            display: "flex",
                            justifyContent: "center",
                            position: "relative",
                          }}
                        >
                          <Box
                            sx={{
                              display: "flex",
                              justifyContent: "center",
                              alignItems: "start",
                              mr: -4,
                            }}
                            className={"result " + (hasPhoto ? "hasPhoto" : "")}
                          >
                            <canvas
                              ref={photoRef}
                              style={{
                                display: "none",
                              }}
                            />
                            {photoDataUrl && (
                              <img src={photoDataUrl} alt="Captured" />
                            )}
                            {hasPhoto && (
                              <IconButton
                                type="button"
                                onClick={clearPhoto}
                                sx={{ mt: -1.5, ml: -1 }}
                              >
                                <CancelOutlinedIcon color="error" />
                              </IconButton>
                            )}
                          </Box>
                        </Box>
                      </Box>
                    </Box>
                  </form>

                  {/* Footer Buttons */}
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
                        }}
                        onClick={() => {
                          handleClear();
                          navigate("/dashboard");
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
                        }}
                        onClick={() => handleClear()}
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
                        }}
                        onClick={() => handleSubmit()}
                      >
                        Submit
                      </Button>
                    </Stack>
                  </Box>
                </Box>
                {/* </Box> */}
              </div>
            </main>
          </Box>
        </div>
        <Footer />
      </div>
    </div>
  );
}

export default Register_Visitor;
