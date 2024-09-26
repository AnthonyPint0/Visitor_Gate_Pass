import React from 'react';
import { Dashboard, PersonAdd, ExitToApp, Info } from '@mui/icons-material';
import PowerSettingsNewIcon from '@mui/icons-material/PowerSettingsNew';
import './taskbar.css'; // Import the CSS file
import kjcLogo from './kjcLogo.svg'

const Taskbar = () => {
  
  const handleClick = (page) => {
    console.log(`Navigating to ${page}`);
  };

  const handleLogout = () => {
    alert('Logout clicked');
  };

  return (
    <div className="taskbar">
      <div className="taskbar-logo">
          <img src={kjcLogo} alt="KJC logo" />
      </div>

      <ul>
        <li>
          <a href="#" onClick={() => handleClick('Dashboard')}>
            <Dashboard />
              Dashboard
          </a>
        </li>
        <li>
          <a href="#" onClick={() => handleClick('Register Visitor')}>
            <PersonAdd />
            Register Visitor
          </a>
        </li>
        <li>
          <a href="#" onClick={() => handleClick('Checkout')}>
            <ExitToApp />
            Checkout
          </a>
        </li>
        <li>
          <a href="#"  onClick={() => handleClick('Visitor Details')}>
            <Info />
            Visitor Details
          </a>
        </li>

      </ul>

      <button onClick={handleLogout} className='logout-button'>
            <PowerSettingsNewIcon/>
              Logout
        </button>
      
    </div>
  );
};

export default Taskbar;


