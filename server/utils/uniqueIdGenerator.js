
let currentId = 0; // Initialize a counter

function generateUnique4DigitID(generatedIDs) {
  // Increment the ID
  currentId = (currentId + 1) % 10000; // Keeps the ID within 4-digit range

  // Format the ID to ensure it's 4 digits (e.g., 0001, 0023)
  let id = currentId.toString().padStart(4, '0');

  // Ensure uniqueness
  while (generatedIDs.includes(id)) {
    currentId = (currentId + 1) % 10000; // Increment and wrap around
    id = currentId.toString().padStart(4, '0');
  }

  return id;
}

module.exports = generateUnique4DigitID;
