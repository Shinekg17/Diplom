import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <div className="flex items-center space-x-6">
      <div className="flex items-center">
        <div className="w-8 h-8 mr-2 overflow-hidden bg-gray-200 rounded-full">
          {/* User avatar placeholder - replace with actual user avatar if available */}
          <div className="flex items-center justify-center w-full h-full text-gray-500">
            {user?.username?.charAt(0).toUpperCase()}
          </div>
        </div>
        <span className="font-medium text-gray-700">
          Сайн байна уу, <span className="text-indigo-600">{user?.username}</span>
        </span>
      </div>
     
      <button 
        onClick={logout}
        className="px-4 py-2 font-medium text-white transition duration-300 ease-in-out bg-red-500 rounded-lg hover:bg-red-600 hover:shadow-md"
      >
        Гарах
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link 
        to="/login" 
        className="px-6 py-2 font-medium text-white transition duration-300 ease-in-out bg-indigo-600 rounded-lg hover:bg-indigo-700 hover:shadow-md"
      >
        Нэвтрэх
      </Link>
      <Link 
        to="/register" 
        className="px-6 py-2 font-medium text-indigo-600 transition duration-300 ease-in-out bg-white border-2 border-indigo-600 rounded-lg hover:bg-indigo-50 hover:shadow-md"
      >
        Бүртгүүлэх
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow-lg">
      <div className="container flex items-center justify-between px-6 py-4 mx-auto">
        <Link to="/" className="flex items-center space-x-2">
          {/* Logo placeholder - you can replace with your actual logo */}
          <div className="flex items-center justify-center w-10 h-10 text-white bg-indigo-600 rounded-lg">
            <span className="text-xl font-bold">ХС</span>
          </div>
          <span className="text-xl font-bold text-gray-800">Хэрэглэгчийн Систем</span>
        </Link>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;