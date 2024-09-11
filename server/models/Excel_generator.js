const fs = require("fs");
const path = require("path");
const xlsx = require("xlsx");

/**
 * Generates a visitor report Excel file.
 * @param {Array} result - The result data from the database query.
 * @returns {Promise<string>} - A promise that resolves to the file path of the generated Excel file.
 */
const generateExcel = (result) => {
  return new Promise((resolve, reject) => {
    try {
      // Define the Excel file path
      const filePath = path.join(__dirname, "Visitor_Report.xlsx");

      // Prepare data for Excel
      const headers = [
        "Name",
        "Phone Number",
        "Purpose of Visit",
        "Entry Gate",
        "Check-in",
        "Exit Gate",
        "Check-out",
        "Group Size",
        "Card IDs",
      ];

      // Create an array of arrays, starting with the headers
      const data = [headers];

      // Populate data with result from database query
      result.forEach((session) => {
        const rowData = [
          session.name,
          session.phone_number,
          session.purpose_of_visit,
          session.entry_gate,
          new Date(session.check_in_time).toLocaleString(),
          session.exit_gate || "N/A",
          session.check_out_time
            ? new Date(session.check_out_time).toLocaleString()
            : "N/A",
          session.group_size,
          session.group_info.group_members
            .map((member) => member.card_id)
            .join(", "),
        ];

        data.push(rowData);
      });

      // Convert data array to a worksheet
      const worksheet = xlsx.utils.aoa_to_sheet(data);

      // Create a new workbook and append the worksheet
      const workbook = xlsx.utils.book_new();
      xlsx.utils.book_append_sheet(workbook, worksheet, "Visitor Report");

      // Write the Excel file to disk
      xlsx.writeFile(workbook, filePath);

      resolve(filePath);
    } catch (error) {
      reject(error);
    }
  });
};

module.exports = generateExcel;
