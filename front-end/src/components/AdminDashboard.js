// src/components/AdminDashboard.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import AdminCreateUser from './AdminCreateUser';
import EditUserModal from './EditUserModal';
import DeleteConfirmModal from './DeleteConfirmModal';
import AdminReportPanel from './AdminReportPanel';
import Navbar from './Navbar';

const AdminDashboard = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [showUserForm, setShowUserForm] = useState(false);
  const [editingUser, setEditingUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [deletingUser, setDeletingUser] = useState(null);
  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'reports'
  
  const fetchUsers = async () => {
    try {
      setIsLoading(true);
      setError('');
      
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      const res = await axios.get('http://localhost:5000/api/users', config);
      setUsers(res.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
      setIsLoading(false);
    }
  };
  
  useEffect(() => {
    fetchUsers();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser(user);
  };
  
  const handleDeleteUser = async (userId) => {
    try {
      setError('');
      const token = localStorage.getItem('token');
      
      if (!token) {
        throw new Error('No authentication token found');
      }
      
      const config = {
        headers: {
          'x-auth-token': token
        }
      };
      
      await axios.delete(`http://localhost:5000/api/users/${userId}`, config);
      
      // Update users list
      setUsers(users.filter(user => user._id !== userId));
      setDeletingUser(null);
    } catch (error) {
      console.error('Хэрэглэгч устгахад алдаа гарлаа:', error);
      setError(error.response?.data?.message || 'Хэрэгч устгахад алдаа гарлаа.');
    }
  };
  
  const handleUserCreated = () => {
    fetchUsers();
  };
  
  const handleUpdateSuccess = () => {
    setEditingUser(null);
    fetchUsers();
  };

  return (
    <div className="min-h-screen bg-gray-100">
     <Navbar />
      
      <div className="container mx-auto px-4 py-8">
        {/* Tab navigation */}
        <div className="flex border-b border-gray-200 mb-6">
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'users' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('users')}
          >
            Хэрэглэгчийн удирдлага
          </button>
          <button
            className={`py-2 px-4 font-medium ${
              activeTab === 'reports' 
                ? 'text-blue-600 border-b-2 border-blue-600' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
            onClick={() => setActiveTab('reports')}
          >
            Хэрэглэгчийн тайлан
          </button>

          
        </div>
        
        {activeTab === 'users' ? (
          // User management content
          <div className="bg-white shadow rounded-lg p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold">Админ удирлагын самбар</h2>
              <button 
                onClick={() => setShowUserForm(!showUserForm)}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300"
              >
                {showUserForm ? 'Хэрэглэгч бүртгэх самбарыг нуух' : 'Шинэ хэрэглэгч үүсгэх'}
              </button>
            </div>
            
            {showUserForm && <AdminCreateUser onUserCreated={handleUserCreated} />}
            
            {error && (
              <div className="mb-4 p-3 bg-red-100 text-red-700 rounded">
                {error}
              </div>
            )}
            
            <div className="mt-6">
              <h3 className="text-xl font-semibold mb-3">Хэрэглэгчийн удирдлага</h3>
              {isLoading ? (
                <div className="text-center py-10">
                  <svg className="animate-spin h-10 w-10 mx-auto text-blue-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  <p className="mt-2 text-gray-600">Loading users...</p>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Хэрэглэгч олдсонгүй. Шинэ хэрэглэгч үүсгэнэ үү.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="min-w-full bg-white border border-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Хэрэглэгч нэр</th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">И-мэйл</th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Төрөл</th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үүссэн огноо</th>
                        <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {users.map(userItem => (
                        <tr key={userItem._id} className="hover:bg-gray-50">
                          <td className="py-3 px-4 border-b">{userItem.username}</td>
                          <td className="py-3 px-4 border-b">{userItem.email}</td>
                          <td className="py-3 px-4 border-b">
                            <span className={`px-2 py-1 text-xs rounded-full ${
                              userItem.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                            }`}>
                              {userItem.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                            </span>
                          </td>
                          <td className="py-3 px-4 border-b">{new Date(userItem.createdAt).toLocaleDateString()}</td>
                          <td className="py-3 px-4 border-b">
                            <button 
                              onClick={() => handleEditUser(userItem)}
                              className="text-blue-500 hover:text-blue-700 mr-3"
                            >
                              Засах
                            </button>
                            
                            <button 
                              onClick={() => userItem._id === user?._id ? null : setDeletingUser(userItem)}
                              className={`text-red-500 hover:text-red-700 ${userItem._id === user?._id ? 'opacity-50 cursor-not-allowed' : ''}`}
                              disabled={userItem._id === user?._id}
                            >
                              {userItem._id === user?._id ? 'Одоогийн хэрэглэгч' : 'Устгах'}
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        ) : (
          // Reports tab content
          <AdminReportPanel />
        )}
      </div>
      
      {editingUser && (
        <EditUserModal 
          user={editingUser} 
          onClose={() => setEditingUser(null)}
          onUpdateSuccess={handleUpdateSuccess}
        />
      )}

      {deletingUser && (
        <DeleteConfirmModal 
          user={deletingUser}
          onDelete={handleDeleteUser}
          onCancel={() => setDeletingUser(null)}
        />
      )}
    </div>
  );
};

export default AdminDashboard;