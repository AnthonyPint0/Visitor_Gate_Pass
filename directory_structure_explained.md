Folder PATH listing
+---Visitor_Gate_Pass-Sources
    |   README.md
    |   
    +---Documents
    |   |   .gitignore
    |   |   pom.xml
    |   |   
    |   +---.idea
    |   |       .gitignore
    |   |       encodings.xml
    |   |       misc.xml
    |   |       uiDesigner.xml
    |   |       vcs.xml
    |   |       
    |   +---src
    |       +---main
    |           +---java
    |               +---org
    |                   +---example
    |                           Loading_Database.java
    |                           
    +---KJC_Gate_Pass
    |   |   .eslintrc.cjs
    |   |   .gitignore
    |   |   index.html
    |   |   package-lock.json
    |   |   package.json
    |   |   README.md
    |   |   tailwind.config.js
    |   |   vite.config.js
    |   |   
    |   +---public
    |   |       vite.svg
    |   |       
    |   +---src
    |       |   App.jsx
    |       |   index.css
    |       |   main.jsx
    |       |   
    |       +---assets
    |       |   |   BG_Ldark.svg
    |       |   |   BG_SVG.svg
    |       |   |   eye_Hide.svg
    |       |   |   eye_Show.svg
    |       |   |   Image_LoginPage.svg
    |       |   |   KJC_CircLe_Logo_Blu.svg
    |       |   |   KJC_CircLe_Logo_Whi.svg
    |       |   |   KJC_Logo.svg
    |       |   |   KJC_Logo_White.svg
    |       |   |   react.svg
    |       |   |   
    |       |   +---Icons
    |       |           CheckinBlack_Icon.svg
    |       |           CheckinCount_Icon.svg
    |       |           CheckoutBlack_Icon.svg
    |       |           CheckoutCount_Icon.svg
    |       |           HomeBlack_Icon.svg
    |       |           LogoutVectorRed_Icon.svg
    |       |           RegisterBlack_Icon.svg
    |       |           RegisterFormIcon.svg
    |       |           TotalVisitoirBlack_Icon.svg
    |       |           
    |       +---components
    |       |   +---CustomDropDown
    |       |   |       CustomDropDown.css
    |       |   |       CustomDropDown.jsx
    |       |   |       
    |       |   +---DataGrid
    |       |   |       DataGrid.css
    |       |   |       StatusBadge.jsx
    |       |   |       TableHeader.jsx
    |       |   |       TableRow.jsx
    |       |   |       TotalVisitorTable.jsx
    |       |   |       
    |       |   +---SideBarNavi
    |       |   |       SideBarNavi.css
    |       |   |       SideBarNavi.jsx
    |       |   |       
    |       |   +---VisitorTable
    |       |           StatusBadge.jsx
    |       |           TableHeader.jsx
    |       |           TableRow.jsx
    |       |           VisitorTable.css
    |       |           VisitorTable.jsx
    |       |           
    |       +---hooks
    |       |       useWindowSize.jsx
    |       |       
    |       +---library
    |       |       helper.js
    |       |       
    |       +---pages
    |           +---Checkout_Visitor
    |           |       Checkout_Visitor.css
    |           |       Checkout_Visitor.jsx
    |           |       
    |           +---LoginPage_KJC
    |           |       Footer.jsx
    |           |       Header.jsx
    |           |       LoginForm.jsx
    |           |       LoginPage.css
    |           |       LoginPage.jsx
    |           |       TextImage.jsx
    |           |       
    |           +---Main_Dashboard
    |           |       Dashboard.css
    |           |       Dashboard.jsx
    |           |       DashboardWidget.css
    |           |       DashboardWidget.jsx
    |           |       
    |           +---Register_Visitor
    |                   Register_Visitor.css
    |                   Register_Visitor.jsx
    |                   
    +---PIctures
    |       BG_SVG.svg
    |       Database_VGP.pdf
    |       eye_Hide.svg
    |       eye_Show.svg
    |       Image_LoginPage.svg
    |       KJC_Logo.svg
    |       KJC_Logo_Blue.svg
    |       KJC_Logo_White.svg
    |       
    +---server
        |   .env
        |   package-lock.json
        |   package.json
        |   server.js
        |   
        +---assets
        |       Passport_photo.png
        |       
        +---config
        |       db.js
        |       session.js
        |       
        +---models
        |       MongoDB_Commands.js
        |       users.js
        |       visitors.js
        |       visitor_cards.js
        |       visitor_groups.js
        |       visitor_sessions.js
        |       
        +---node_modules
        |   |   .package-lock.json
        |   |   
        |   +---.bin
        |
        +---routes
                auth.js               

Sure, I can help explain the structure of your project directory to your team. Here's a detailed breakdown of the folders and files:

### Project Directory: `Visitor_Gate_Pass-Sources`

#### 1. Root Level
- **README.md**: The main documentation file for the project.

#### 2. Documents
- **.gitignore**: Specifies files and directories to be ignored by Git.
- **pom.xml**: Configuration file for Maven projects.

##### .idea
- **.gitignore**: Git ignore file for IDEA project files.
- **encodings.xml**: Contains encoding settings for the IDEA project.
- **misc.xml**: Contains miscellaneous settings for the IDEA project.
- **uiDesigner.xml**: Settings related to UI Designer.
- **vcs.xml**: Version control settings.

##### src
- **main**: Main source directory.
  - **java**: Java source directory.
    - **org**
      - **example**
        - **Loading_Database.java**: Java class for loading the database.

#### 3. KJC_Gate_Pass
- **.eslintrc.cjs**: ESLint configuration file.
- **.gitignore**: Git ignore file.
- **index.html**: Main HTML file.
- **package-lock.json**: Automatically generated for any operations where npm modifies `node_modules` or `package.json`.
- **package.json**: Contains metadata about the project and its dependencies.
- **README.md**: Documentation specific to the KJC Gate Pass application.
- **tailwind.config.js**: Configuration file for Tailwind CSS.
- **vite.config.js**: Configuration file for Vite.

##### public
- **vite.svg**: Vite logo.

##### src
- **App.jsx**: Main React component.
- **index.css**: Global CSS file.
- **main.jsx**: Entry point for the React application.

###### assets
- **BG_Ldark.svg**, **BG_SVG.svg**, **eye_Hide.svg**, **eye_Show.svg**, **Image_LoginPage.svg**, **KJC_CircLe_Logo_Blu.svg**, **KJC_CircLe_Logo_Whi.svg**, **KJC_Logo.svg**, **KJC_Logo_White.svg**, **react.svg**: Various image assets.
  - **Icons**
    - **CheckinBlack_Icon.svg**, **CheckinCount_Icon.svg**, **CheckoutBlack_Icon.svg**, **CheckoutCount_Icon.svg**, **HomeBlack_Icon.svg**, **LogoutVectorRed_Icon.svg**, **RegisterBlack_Icon.svg**, **RegisterFormIcon.svg**, **TotalVisitoirBlack_Icon.svg**: Icon assets.

###### components
- **CustomDropDown**
  - **CustomDropDown.css**: CSS file for custom dropdown.
  - **CustomDropDown.jsx**: React component for custom dropdown.
- **DataGrid**
  - **DataGrid.css**: CSS file for data grid.
  - **StatusBadge.jsx**, **TableHeader.jsx**, **TableRow.jsx**, **TotalVisitorTable.jsx**: React components for data grid.
- **SideBarNavi**
  - **SideBarNavi.css**: CSS file for sidebar navigation.
  - **SideBarNavi.jsx**: React component for sidebar navigation.
- **VisitorTable**
  - **StatusBadge.jsx**, **TableHeader.jsx**, **TableRow.jsx**, **VisitorTable.css**, **VisitorTable.jsx**: React components for visitor table.

###### hooks
- **useWindowSize.jsx**: Custom React hook to get window size.

###### library
- **helper.js**: Helper functions and variables.

###### pages
- **Checkout_Visitor**
  - **Checkout_Visitor.css**: CSS file for visitor checkout.
  - **Checkout_Visitor.jsx**: React component for visitor checkout.
- **LoginPage_KJC**
  - **Footer.jsx**, **Header.jsx**, **LoginForm.jsx**, **LoginPage.css**, **LoginPage.jsx**, **TextImage.jsx**: React components and styles for login page.
- **Main_Dashboard**
  - **Dashboard.css**, **Dashboard.jsx**, **DashboardWidget.css**, **DashboardWidget.jsx**: React components and styles for the main dashboard.
- **Register_Visitor**
  - **Register_Visitor.css**, **Register_Visitor.jsx**: React components and styles for registering a visitor.

#### 4. Pictures
- **BG_SVG.svg**, **Database_VGP.pdf**, **eye_Hide.svg**, **eye_Show.svg**, **Image_LoginPage.svg**, **KJC_Logo.svg**, **KJC_Logo_Blue.svg**, **KJC_Logo_White.svg**: Various image and document files.

#### 5. Server
- **.env**: Environment variables.
- **package-lock.json**: Automatically generated for any operations where npm modifies `node_modules` or `package.json`.
- **package.json**: Contains metadata about the project and its dependencies.
- **server.js**: Main server file.

##### assets
- **Passport_photo.png**: Sample passport photo.

##### config
- **db.js**: Database configuration.
- **session.js**: Session management configuration.

##### models
- **MongoDB_Commands.js**, **users.js**, **visitors.js**, **visitor_cards.js**, **visitor_groups.js**, **visitor_sessions.js**: Mongoose models for the application.

##### node_modules
- **.package-lock.json**: Automatically generated lock file for node modules.
  - **.bin**: Binary files for npm packages.

##### routes
- **auth.js**: Express routes for authentication.

### Explanation

1. **Visitor_Gate_Pass-Sources**: The root directory containing the overall project files.
2. **Documents**: Contains project configuration files and source code for Java components.
   - **.idea**: Configuration files for the IntelliJ IDEA project.
   - **src/main/java/org/example**: Contains Java classes for backend processes.
3. **KJC_Gate_Pass**: The front-end part of the project built with React and Tailwind CSS.
   - **public**: Contains public assets like logos.
   - **src**: Main source directory for the React application.
     - **assets**: Contains image assets and icons.
     - **components**: Reusable React components.
     - **hooks**: Custom hooks for the React application.
     - **library**: Helper functions and variables.
     - **pages**: Different pages of the application.
4. **Pictures**: Directory for storing images and documents related to the project.
5. **server**: Contains server-side code, configurations, models, and routes for the Express.js server.
   - **assets**: Assets for the server.
   - **config**: Configuration files for the server.
   - **models**: Mongoose models for MongoDB.
   - **routes**: Express routes for handling different HTTP requests.

This structure separates the front-end (KJC_Gate_Pass) and back-end (server) components clearly, while also organizing assets, configurations, and reusable components logically. This should help your team understand where each part of the project resides and how to navigate the codebase.