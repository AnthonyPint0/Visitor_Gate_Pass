# Visitor Gate Pass Setup Instructions

Follow these steps to set up and run the Visitor Gate Pass project on your system.

## Prerequisites

Before you begin, ensure you have the following installed on your system:

1. **MongoDB**: Install [MongoDB](https://www.mongodb.com/try/download/community) along with [MongoDB Compass](https://www.mongodb.com/try/download/compass) and [mongosh](https://www.mongodb.com/try/download/shell).
2. **Visual Studio Code (VSCode)**: Install [VSCode](https://code.visualstudio.com/Download) and the following optional extensions for a better development experience:
   - ES7+ React/Redux/React-Native snippets
   - HTML CSS Support
   - IntelliCode
   - IntelliCode API Usage Examples
   - MongoDB for VS Code
   - Tailwind CSS IntelliSense
3. **Node.js**: Install [Node.js](https://nodejs.org/en/download/).
4. **Java Development Kit (JDK)**: Install [JDK 21](https://www.oracle.com/java/technologies/javase/jdk21-archive-downloads.html).
5. **IntelliJ IDEA Community Edition**: Install [IntelliJ IDEA Community Edition](https://www.jetbrains.com/idea/download/).

## Cloning the Repository

1. Open a terminal and clone the repository:
   ```bash
   git clone <repository-url> Visitor_Gate_Pass
   ```
2. Open the cloned repository in VSCode:
   ```bash
   code Visitor_Gate_Pass
   ```

## Setting Up the Server and Client

1. **Start the Server**:
   - Open a terminal in VSCode and navigate to the `server` folder:
     ```bash
     cd server
     ```
   - Start the server:
     ```bash
     npm start
     ```

2. **Start the Client**:
   - Open another terminal in VSCode by clicking the plus button (`+`) in the terminal tab.
   - Navigate to the `KJC_Gate_Pass` folder:
     ```bash
     cd KJC_Gate_Pass
     ```
   - Start the client:
     ```bash
     npm run dev
     ```

   If this is the first time you are loading the project, you might encounter some errors. Use ChatGPT or refer to the project's documentation to resolve them.

If everything is working fine, the frontend setup is complete. Note that you will not be able to log in because the database is not set up yet.

## Setting Up the Database

1. **Start MongoDB**:
   - Open MongoDB Compass and connect to your local MongoDB server. This step will start the MongoDB server if it is not already running.

2. **Load the Database**:
   - Open IntelliJ IDEA and open the `Documents` folder within the `Visitor_Gate_Pass` repository as a project.
   - Locate and run the `Loading_Database.java` file. This will create a database named `visitor_management` on your local MongoDB server with the collections `visitors`, `visitor_sessions`, `visitor_groups`, `visitor_cards`, and `users`, and populate them with initial data/documents.

## Final Steps

Your website is now set up and ready for further development. Good luck!

---

Feel free to modify this README to suit your project's specific needs.

## Do not edit, push or do any changes to Sources branch!!!!
**Sources Branch managed by Anthony Pinto.**
