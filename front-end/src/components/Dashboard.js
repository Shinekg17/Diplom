// src/components/Dashboard.js
import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import IndustrialProcessDiagram from './IndustrialProcessDiagram';


const Dashboard = () => {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-white shadow-lg">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex justify-between">
            <div className="flex space-x-7">
              <div className="flex items-center py-4">
                <span className="font-semibold text-gray-700 text-lg">Хэрэглэгчийн хяналтын самбар</span>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <span className="py-4 px-2">Сайн байна уу, {user?.username}</span>
              <button
                onClick={logout}
                className="py-2 px-4 bg-red-500 text-white rounded hover:bg-red-600 transition duration-300"
              >
                Гарах
              </button>
            </div>
          </div>
        </div>
      </nav>
      
      <div className="container mx-auto px-4 py-8">
          <IndustrialProcessDiagram />
      </div>
    </div>
  );
};

export default Dashboard;