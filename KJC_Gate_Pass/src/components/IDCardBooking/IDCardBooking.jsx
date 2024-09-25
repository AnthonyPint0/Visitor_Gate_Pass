import React, { useState } from 'react';
import './IDCardBooking.css'; // Importing the CSS file for styling

const IDCardBooking = () => {
  // State to manage the current page number
  const [currentPage, setCurrentPage] = useState(1);
  // State to manage the selected IDs
  const [selectedIDs, setSelectedIDs] = useState([]);

  // Number of IDs to display per page
  const idsPerPage = 100;
  // Total number of IDs available
  const totalIDs = 500;
  // Total number of pages, calculated based on totalIDs and idsPerPage
  const totalPages = Math.ceil(totalIDs / idsPerPage);

  // Function to get the IDs for the current page
  const getIDsForPage = (page) => {
    const startID = (page - 1) * idsPerPage + 1; // Calculate the starting ID for the page
    const endID = Math.min(page * idsPerPage, totalIDs); // Calculate the ending ID for the page
    // Create an array of IDs from startID to endID
    return Array.from({ length: endID - startID + 1 }, (_, i) => startID + i);
  };

  // Handler to go to the next page
  const handleNext = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Increment the current page by 1
    }
  };

  // Handler to go to the previous page
  const handlePrevious = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Decrement the current page by 1
    }
  };

  // Handler to toggle the selection of an ID
  const handleCheckboxChange = (id) => {
    setSelectedIDs((prevSelected) =>
      prevSelected.includes(id)
        ? prevSelected.filter((i) => i !== id) // Remove the ID if it is already selected
        : [...prevSelected, id] // Add the ID if it is not selected
    );
  };

  // Handler to clear all selected IDs
  const handleClear = () => {
    setSelectedIDs([]); // Set selectedIDs to an empty array
  };

  // Handler to alert the selected IDs in triple-digit format
  const handleOk = () => {
    if (selectedIDs.length === 0){
      alert('No IDs Selected!')
    }else{
    const tripleDigit = selectedIDs.map(id => id.toString().padStart(3, '0')); 
    alert(`Selected IDs: ${tripleDigit.join(', ')}`); // Show an alert with the selected IDs
    setSelectedIDs([]);
  }
  };

  // Calculate the starting ID and ending ID for the current page
  const startID = (currentPage - 1) * idsPerPage + 1;
  const endID = Math.min(currentPage * idsPerPage, totalIDs);

  return (
    <div className="main-container"> 
      <div className="container">
        <div className="pagination">
          <button onClick={handlePrevious} disabled={currentPage === 1}>
            Previous
          </button>
          <span>{startID}-{endID}</span>
          <button onClick={handleNext} disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
        <div className="id-list">
          {getIDsForPage(currentPage).map((id) => (
            <label key={id}
             className={`id-card ${selectedIDs.includes(id) ? 'checked' : ''} ${selectedIDs.length === 5 ? 'disabled' : ''}`}>
              <input
                type="checkbox"
                checked={selectedIDs.includes(id)}
                onChange={() => handleCheckboxChange(id)}
                disabled = {setSelectedIDs.length === 5}
              />
              {id.toString().padStart(3, '0')}
            </label>
          ))}
        </div>
      </div>
      <div className="button-group">
        <button onClick={handleClear}>Clear</button>
        <button onClick={handleOk}>Ok</button>
      </div>
    </div>
  );
};

export default IDCardBooking;
