// Constant for the API base URL
const API_BASE_URL = "http://172.18.2.9:3001";
// replace <localhost> with this device's IP address to access the website in your network

function padZero(value) {
  return value.toString().padStart(2, "0");
}

const formatDateWithPadding = (date) => {
  if (!date) return "N/A";

  date = new Date(date);

  const day = padZero(date.getDate());
  const month = padZero(date.getMonth() + 1); // Months are 0-based
  const year = date.getFullYear();

  let hours = date.getHours();
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());
  const ampm = hours >= 12 ? "PM" : "AM";

  // Convert 24-hour time to 12-hour time
  hours = hours % 12;
  hours = hours ? hours : 12; // Convert '0' to '12'
  hours = padZero(hours);

  return `${day}/${month}/${year} ${hours}:${minutes} ${ampm}`;
};

module.exports = formatDateWithPadding;
