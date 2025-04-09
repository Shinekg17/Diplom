import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { isAuthenticated, user, logout } = useContext(AuthContext);

  const authLinks = (
    <div className="flex items-center space-x-4">
      <span className="text-gray-700">Welcome, {user?.username}</span>
      <Link to={user?.role === 'admin' ? '/admin' : '/dashboard'} className="text-blue-600 hover:text-blue-800">
        Dashboard
      </Link>
      <button 
        onClick={logout}
        className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
      >
        Logout
      </button>
    </div>
  );

  const guestLinks = (
    <div className="flex items-center space-x-4">
      <Link to="/login" className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
        Login
      </Link>
      <Link to="/register" className="px-4 py-2 font-bold text-white bg-green-500 rounded hover:bg-green-700">
        Register
      </Link>
    </div>
  );

  return (
    <nav className="bg-white shadow-md">
      <div className="container flex items-center justify-between px-6 py-3 mx-auto">
        <Link to="/" className="text-xl font-bold text-gray-800">User Role Auth</Link>
        {isAuthenticated ? authLinks : guestLinks}
      </div>
    </nav>
  );
};

export default Navbar;