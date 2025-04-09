import React, { useState, useEffect } from 'react';
import axios from 'axios';

const EditUserModal = ({ user, onClose, onUpdateSuccess }) => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    role: 'user',
    password: ''
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        email: user.email || '',
        role: user.role || 'user',
        password: ''
      });
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!formData.username || !formData.email) {
      setError('Username and email are required');
      return;
    }
    
    const updateData = {
      username: formData.username,
      email: formData.email,
      role: formData.role
    };
    
    // Only include password if provided
    if (formData.password.trim() !== '') {
      updateData.password = formData.password;
    }
    
    try {
      setIsLoading(true);
      const token = localStorage.getItem('token');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          'x-auth-token': token
        }
      };
      
      await axios.put(
        `http://localhost:5000/api/users/${user._id}`, 
        updateData,
        config
      );
      
      setIsLoading(false);
      onUpdateSuccess();
    } catch (error) {
      setIsLoading(false);
      setError(error.response?.data?.message || 'Failed to update user');
      console.error('Update error:', error.response?.data);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-8 max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-xl font-bold">Хэрэглэгч засах</h3>
          <button 
            onClick={onClose} 
            className="text-gray-500 hover:text-gray-700"
            type="button"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>
        
        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Хэрэглэгч нэр *</label>
            <input
              type="text"
              name="username"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.username}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">И-мэйл *</label>
            <input
              type="email"
              name="email"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>
          
          <div className="mb-4">
            <label className="block text-gray-700 mb-1">Төрөл</label>
            <select
              name="role"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.role}
              onChange={handleChange}
            >
              <option value="user">Хэрэглэгч</option>
              <option value="admin">Админ</option>
            </select>
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 mb-1">
              Нууц үг (Нууц үгийг солихыг хүсэхгүй бол хоосон үлдээж болно.)
            </label>
            <input
              type="password"
              name="password"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={formData.password}
              onChange={handleChange}
              placeholder="New password (optional)"
            />
          </div>
          
          <div className="flex justify-end space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-100"
            >
              Цуцлах
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-blue-300"
              disabled={isLoading}
            >
              {isLoading ? 'Хадгалаж байна...' : 'Хадгалах'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditUserModal;