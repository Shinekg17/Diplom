// src/components/AdminReportPanel.js - Simplified version without external libraries
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';

const AdminReportPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, month, week
  
  // Хэрэглэгчийн мэдээлэл татах
  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Таньд нэвтрэх эрх байхгүй байна');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      // Use regular users endpoint if report endpoint isn't available
      const res = await axios.get('http://localhost:5000/api/users', config);
      
      // Add activity calculation
      const usersWithActivity = res.data.map(user => {
        const lastActive = user.lastActive ? new Date(user.lastActive) : null;
        const now = new Date();
        const activity = lastActive ? Math.floor((now - lastActive) / (1000 * 60 * 60 * 24)) : null;
        
        return {
          ...user,
          daysInactive: activity
        };
      });
      
      setUsers(usersWithActivity);
      setLoading(false);
    } catch (error) {
      console.error('Хэрэглэгчдийн мэдээлэл татахад алдаа гарлаа:', error);
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };
  
  // Component mount хийгдэхэд ачааллах
  useEffect(() => {
    fetchUsers();
  }, []);
  
  // Excel файл үүсгэх
  const exportToExcel = () => {
    const filteredUsers = getFilteredUsers();
    const worksheet = XLSX.utils.json_to_sheet(filteredUsers.map(user => ({
      'Хэрэглэгчийн нэр': user.username,
      'И-мэйл хаяг': user.email,
      'Төрөл': user.role === 'admin' ? 'Админ' : 'Хэрэглэгч',
      'Бүртгүүлсэн огноо': new Date(user.createdAt).toLocaleDateString(),
      'Сүүлд идэвхтэй': user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Мэдээлэл байхгүй',
      'Идэвхгүй өдөр': user.daysInactive || 'Мэдээлэл байхгүй'
    })));
    
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Хэрэглэгчид');
    XLSX.writeFile(workbook, 'Хэрэглэгчийн тайлан.xlsx');
  };
  
  // Шүүлтүүр хэрэглэх
  const getFilteredUsers = () => {
    if (dateFilter === 'all') return users;
    
    const now = new Date();
    let filterDate = new Date();
    
    if (dateFilter === 'month') {
      filterDate.setMonth(now.getMonth() - 1);
    } else if (dateFilter === 'week') {
      filterDate.setDate(now.getDate() - 7);
    }
    
    return users.filter(user => new Date(user.createdAt) >= filterDate);
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Хэрэглэгчийн тайлан</h2>
        <div className="flex space-x-2">
          <select
            className="px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
          >
            <option value="all">Бүх хугацаа</option>
            <option value="month">Сүүлийн сар</option>
            <option value="week">Сүүлийн 7 хоног</option>
          </select>
          
          <button
            onClick={fetchUsers}
            className="px-3 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Шинэчлэх
          </button>
        </div>
      </div>
      
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
          {error}
        </div>
      )}
      
      <div className="mb-6 flex justify-end space-x-2">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          Excel татах
        </button>
      </div>
      
      {loading ? (
        <div className="text-center py-10">
          <svg className="animate-spin h-10 w-10 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <p className="mt-2 text-gray-600">Хэрэглэгчийн мэдээлэл ачааллаж байна...</p>
        </div>
      ) : users.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          Хэрэглэгч олдсонгүй
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэрэглэгчийн нэр</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">И-мэйл</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төрөл</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Бүртгэсэн огноо</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Сүүлд нэвтэрсэн</th>
                <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Идэвхгүй өдөр</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {getFilteredUsers().map(user => (
                <tr key={user._id} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b">{user.username}</td>
                  <td className="py-3 px-4 border-b">{user.email}</td>
                  <td className="py-3 px-4 border-b">
                    <span className={`px-2 py-1 text-xs rounded-full ${
                      user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                    }`}>
                      {user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                    </span>
                  </td>
                  <td className="py-3 px-4 border-b">{new Date(user.createdAt).toLocaleDateString()}</td>
                  <td className="py-3 px-4 border-b">
                    {user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Мэдээлэл байхгүй'}
                  </td>
                  <td className="py-3 px-4 border-b">
                    {user.daysInactive !== null ? (
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        user.daysInactive > 30 ? 'bg-red-100 text-red-800' :
                        user.daysInactive > 14 ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.daysInactive} өдөр
                      </span>
                    ) : 'Мэдээлэл байхгүй'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminReportPanel;