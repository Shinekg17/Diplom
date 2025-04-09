// src/components/AdminCreateUser.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';


const AdminCreateUser = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: 'user'
  });
  const [message, setMessage] = useState({ type: '', text: '' });
  const { user } = useContext(AuthContext);
  
  const { username, email, password, role } = formData;

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    
    if (!username || !email || !password) {
      setMessage({ type: 'error', text: 'Please fill in all required fields' });
      return;
    }
    
    try {
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      const res = await axios.post(
        'http://localhost:5000/api/users/create', 
        formData,
        config
      );
      
      setFormData({
        username: '',
        email: '',
        password: '',
        role: 'user'
      });
      
      setMessage({ 
        type: 'success', 
        text: `User ${res.data.username} created successfully` 
      });
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: error.response?.data?.message || 'Failed to create user' 
      });
    }
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-6 mb-6">
      <h3 className="text-xl font-bold mb-4">Шинэ хэрэглэгч үүсгэх</h3>
      
      {message.text && (
        <div 
          className={`p-3 mb-4 rounded ${
            message.type === 'error' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
          }`}
        >
          {message.text}
        </div>
      )}
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          <div>
            <label className="block text-gray-700 mb-1">Хэрэглэгч нэр *</label>
            <input
              type="text"
              name="username"
              placeholder="Хэрэглэгч нэр"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">И-мэйл *</label>
            <input
              type="email"
              name="email"
              placeholder="И-мэйл"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Нууц үг *</label>
            <input
              type="password"
              name="password"
              placeholder="Нууц үг"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={password}
              onChange={handleChange}
              required
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-1">Төрөл</label>
            <select
              name="role"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={handleChange}
            >
              <option value="user">Хэрэглэгч</option>
              <option value="admin">Админ</option>
            </select>
          </div>
        </div>
        
        <div className="mt-6">
          <button
            type="submit"
            className="px-6 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700"
          >
            Хэрэглэгч үүсгэх
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminCreateUser;