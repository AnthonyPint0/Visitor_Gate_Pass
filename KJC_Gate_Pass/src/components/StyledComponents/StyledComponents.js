import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";

export const StyledTextField = styled(TextField)({
  margin: 0,
  width: "100px",
  height: "32px",
  "& .MuiInputBase-root": {
    height: "32px",
    boxShadow: "0px 1.47px 2.95px 0px rgba(66, 80, 102, 0.1)",
    borderColor: "#4250661A",
  },
  "& .MuiOutlinedInput-input": {
    padding: "7px 14px",
    fontSize: "13px",
    fontFamily: '"Roboto", "Poppins", Arial',
  },
});

export const StyledInputLabel = styled(InputLabel)({
  fontSize: "10px",
  fontFamily: '"Roboto", "Poppins", Arial',
  fontWeight: "500",
  color: "#000000",
  marginBottom: "4px",
  transform: "none",
  position: "static",
});

export const StyledSelect = styled(Select)({
  width: "100%",
  height: "32px",

  "& .MuiSelect-select": {
    padding: "5px 14px",
    fontSize: "13px",
    fontFamily: '"Roboto", "Poppins", Arial',
    boxShadow: "0px 1.47px 2.95px 0px rgba(66, 80, 102, 0.1)",
    borderColor: "#4250661A",
  },
});

export const StyledMenuItem = styled(MenuItem)({
  fontSize: "12px", // Example font size
  fontWeight: "600",
  padding: "8px 16px", // Example padding
  color: "#333", // Example text color
  "&:hover": {
    backgroundColor: "#f0f0f0", // Example hover background color
  },
  // Add more styles as needed
});

export const StyledFormControl = styled(FormControl)({
  width: "100px",
  "& .MuiFormControl-root": {
    width: "100%",
  },
});
