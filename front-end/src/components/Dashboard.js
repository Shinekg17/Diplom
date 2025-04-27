// src/components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import IndustrialProcessDiagram from './IndustrialProcessDiagram';
import Navbar from './Navbar'; // Import the Navbar component

const Dashboard = () => {
  const { user } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Use the Navbar component instead of the inline navigation */}
      <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        <IndustrialProcessDiagram />
      </div>
    </div>
  );
};

export default Dashboard;