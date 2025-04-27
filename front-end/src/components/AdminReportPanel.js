// src/components/EnhancedAdminReportPanel.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import * as XLSX from 'xlsx';
import { PieChart, Pie, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, LineChart, Line, ResponsiveContainer } from 'recharts';

const EnhancedAdminReportPanel = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [dateFilter, setDateFilter] = useState('all'); // all, month, week
  const [reportView, setReportView] = useState('table'); // table, pieChart, barChart, dashboard, timeline
  const [selectedUser, setSelectedUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    adminUsers: 0,
    regularUsers: 0,
    veryInactiveUsers: 0,
    moderatelyInactiveUsers: 0,
    activeUsers: 0,
    averageInactiveDays: 0,
    recentUsers: 0
  });
  
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
      calculateStats(usersWithActivity);
      setLoading(false);
    } catch (error) {
      console.error('Хэрэглэгчдийн мэдээлэл татахад алдаа гарлаа:', error);
      setError(error.response?.data?.message || error.message);
      setLoading(false);
    }
  };
  
  // Статистик тооцоолох
  const calculateStats = (usersData) => {
    const adminUsers = usersData.filter(user => user.role === 'admin');
    const regularUsers = usersData.filter(user => user.role === 'user');
    
    const veryInactive = usersData.filter(user => user.daysInactive > 30);
    const moderatelyInactive = usersData.filter(user => user.daysInactive > 14 && user.daysInactive <= 30);
    const active = usersData.filter(user => user.daysInactive <= 14);
    
    const averageInactiveDays = usersData.length > 0 ? 
      usersData.reduce((sum, user) => sum + (user.daysInactive || 0), 0) / usersData.length : 0;
    
    const now = new Date();
    const oneMonthAgo = new Date(now);
    oneMonthAgo.setMonth(now.getMonth() - 1);
    const recentUsers = usersData.filter(user => new Date(user.createdAt) >= oneMonthAgo);
    
    setStats({
      totalUsers: usersData.length,
      adminUsers: adminUsers.length,
      regularUsers: regularUsers.length,
      veryInactiveUsers: veryInactive.length,
      moderatelyInactiveUsers: moderatelyInactive.length,
      activeUsers: active.length,
      averageInactiveDays: averageInactiveDays.toFixed(1),
      recentUsers: recentUsers.length
    });
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
  
  // PDF файл үүсгэх - jspdf ашиглан хийх хувилбар (импортын алдаа гарвал ашиглах)
  const exportToPDF = () => {
    const filteredUsers = getFilteredUsers();
    
    const printWindow = window.open('', '_blank');
    
    printWindow.document.write(`
      <html>
        <head>
          <title>Хэрэглэгчийн тайлан</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 20px; }
            h1 { color: #333; font-size: 24px; }
            .date { color: #777; margin-bottom: 20px; }
            .stats { margin-bottom: 20px; }
            table { border-collapse: collapse; width: 100%; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            tr:nth-child(even) { background-color: #f9f9f9; }
            .admin { background-color: #e8e5ff; padding: 3px 6px; border-radius: 10px; font-size: 12px; }
            .user { background-color: #e1f0ff; padding: 3px 6px; border-radius: 10px; font-size: 12px; }
            .active { background-color: #e7ffe7; padding: 3px 6px; border-radius: 10px; font-size: 12px; }
            .moderate { background-color: #fff8e7; padding: 3px 6px; border-radius: 10px; font-size: 12px; }
            .inactive { background-color: #ffe7e7; padding: 3px 6px; border-radius: 10px; font-size: 12px; }
          </style>
        </head>
        <body>
          <h1>Хэрэглэгчийн тайлан</h1>
          <div class="date">Үүсгэсэн огноо: ${new Date().toLocaleDateString()}</div>
          
          <div class="stats">
            <p>Нийт хэрэглэгч: ${stats.totalUsers}</p>
            <p>Админ: ${stats.adminUsers} | Энгийн хэрэглэгч: ${stats.regularUsers}</p>
            <p>Идэвхтэй: ${stats.activeUsers} | Дунд зэрэг идэвхгүй: ${stats.moderatelyInactiveUsers} | Маш идэвхгүй: ${stats.veryInactiveUsers}</p>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Хэрэглэгчийн нэр</th>
                <th>И-мэйл</th>
                <th>Төрөл</th>
                <th>Бүртгэсэн огноо</th>
                <th>Сүүлд нэвтэрсэн</th>
                <th>Идэвхгүй өдөр</th>
              </tr>
            </thead>
            <tbody>
              ${filteredUsers.map(user => `
                <tr>
                  <td>${user.username}</td>
                  <td>${user.email}</td>
                  <td><span class="${user.role === 'admin' ? 'admin' : 'user'}">${user.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}</span></td>
                  <td>${new Date(user.createdAt).toLocaleDateString()}</td>
                  <td>${user.lastActive ? new Date(user.lastActive).toLocaleDateString() : 'Мэдээлэл байхгүй'}</td>
                  <td>
                    ${user.daysInactive !== null 
                      ? `<span class="${
                          user.daysInactive > 30 ? 'inactive' : 
                          user.daysInactive > 14 ? 'moderate' : 'active'
                        }">${user.daysInactive} өдөр</span>` 
                      : 'Мэдээлэл байхгүй'}
                  </td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              window.print();
            }
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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
  
  // Chart data бэлтгэх
  const prepareRoleChartData = () => {
    return [
      { name: 'Админ хэрэглэгч', value: stats.adminUsers },
      { name: 'Энгийн хэрэглэгч', value: stats.regularUsers }
    ];
  };
  
  const prepareActivityChartData = () => {
    return [
      { name: 'Идэвхтэй (<15 өдөр)', value: stats.activeUsers },
      { name: 'Дунд зэрэг (15-30 өдөр)', value: stats.moderatelyInactiveUsers },
      { name: 'Идэвхгүй (>30 өдөр)', value: stats.veryInactiveUsers }
    ];
  };
  
  const prepareMonthlyRegistrationData = () => {
    const monthlyData = {};
    
    // Last 6 months
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const monthYear = `${d.getMonth()+1}/${d.getFullYear()}`;
      monthlyData[monthYear] = 0;
    }
    
    users.forEach(user => {
      const date = new Date(user.createdAt);
      const monthYear = `${date.getMonth()+1}/${date.getFullYear()}`;
      
      if (monthlyData[monthYear] !== undefined) {
        monthlyData[monthYear]++;
      }
    });
    
    return Object.keys(monthlyData).map(month => ({
      month: month,
      count: monthlyData[month]
    }));
  };
  
  // view хэрэглэгчийн дэлгэрэнгүй
  const viewUserDetails = (user) => {
    setSelectedUser(user);
  };
  
  // view буцах
  const closeUserDetails = () => {
    setSelectedUser(null);
  };

  // Идэвхийн зэрэглэлийн тайлан
  const renderActivityLevelsReport = () => {
    const filteredUsers = getFilteredUsers();
    
    // Зэрэглэлээр ангилах
    const veryInactive = filteredUsers.filter(user => user.daysInactive > 30);
    const moderatelyInactive = filteredUsers.filter(user => user.daysInactive > 14 && user.daysInactive <= 30);
    const active = filteredUsers.filter(user => user.daysInactive <= 14);
    
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Хэрэглэгчийн идэвхийн зэрэглэл</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Идэвхтэй хэрэглэгчид */}
          <div className="bg-green-50 p-4 rounded-lg border border-green-200">
            <h4 className="text-lg font-bold text-green-800 mb-2">Идэвхтэй хэрэглэгчид</h4>
            <p className="text-sm text-gray-600 mb-4">14 хоногоос бага хугацаанд идэвхтэй</p>
            
            <div className="text-3xl font-bold text-green-600 mb-2">{active.length}</div>
            <div className="text-sm text-gray-500">Нийт хэрэглэгчийн {Math.round((active.length / filteredUsers.length) * 100) || 0}%</div>
            
            <div className="mt-4 max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {active.map(user => (
                  <li key={user._id} className="text-sm hover:bg-green-100 p-1 rounded cursor-pointer" onClick={() => viewUserDetails(user)}>
                    {user.username} ({user.daysInactive} өдөр)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Дунд зэрэг идэвхгүй */}
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
            <h4 className="text-lg font-bold text-yellow-800 mb-2">Дунд зэрэг идэвхгүй</h4>
            <p className="text-sm text-gray-600 mb-4">15-30 хоногийн хооронд идэвхгүй</p>
            
            <div className="text-3xl font-bold text-yellow-600 mb-2">{moderatelyInactive.length}</div>
            <div className="text-sm text-gray-500">Нийт хэрэглэгчийн {Math.round((moderatelyInactive.length / filteredUsers.length) * 100) || 0}%</div>
            
            <div className="mt-4 max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {moderatelyInactive.map(user => (
                  <li key={user._id} className="text-sm hover:bg-yellow-100 p-1 rounded cursor-pointer" onClick={() => viewUserDetails(user)}>
                    {user.username} ({user.daysInactive} өдөр)
                  </li>
                ))}
              </ul>
            </div>
          </div>
          
          {/* Маш идэвхгүй */}
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <h4 className="text-lg font-bold text-red-800 mb-2">Маш идэвхгүй хэрэглэгчид</h4>
            <p className="text-sm text-gray-600 mb-4">30 хоногоос дээш хугацаанд идэвхгүй</p>
            
            <div className="text-3xl font-bold text-red-600 mb-2">{veryInactive.length}</div>
            <div className="text-sm text-gray-500">Нийт хэрэглэгчийн {Math.round((veryInactive.length / filteredUsers.length) * 100) || 0}%</div>
            
            <div className="mt-4 max-h-40 overflow-y-auto">
              <ul className="space-y-1">
                {veryInactive.map(user => (
                  <li key={user._id} className="text-sm hover:bg-red-100 p-1 rounded cursor-pointer" onClick={() => viewUserDetails(user)}>
                    {user.username} ({user.daysInactive} өдөр)
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Статистик дашбоард
  const renderDashboard = () => {
    return (
      <div className="space-y-8">
        <h3 className="text-xl font-bold">Хэрэглэгчийн статистик тойм</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Нийт хэрэглэгч */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-gray-500 text-sm">Нийт хэрэглэгч</div>
            <div className="text-3xl font-bold mt-2">{stats.totalUsers}</div>
            <div className="mt-2 text-sm text-blue-500">
              {stats.recentUsers} шинэ хэрэглэгч сүүлийн сард
            </div>
          </div>
          
          {/* Админ хэрэглэгч */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-gray-500 text-sm">Админ хэрэглэгч</div>
            <div className="text-3xl font-bold mt-2">{stats.adminUsers}</div>
            <div className="mt-2 text-sm text-gray-500">
              Нийт хэрэглэгчийн {Math.round((stats.adminUsers / stats.totalUsers) * 100) || 0}%
            </div>
          </div>
          
          {/* Идэвхгүй хэрэглэгчид */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-gray-500 text-sm">Идэвхгүй хэрэглэгчид</div>
            <div className="text-3xl font-bold mt-2">{stats.veryInactiveUsers}</div>
            <div className="mt-2 text-sm text-red-500">
              Нийт хэрэглэгчийн {Math.round((stats.veryInactiveUsers / stats.totalUsers) * 100) || 0}%
            </div>
          </div>
          
          {/* Дундаж идэвхгүй өдөр */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <div className="text-gray-500 text-sm">Дундаж идэвхгүй өдөр</div>
            <div className="text-3xl font-bold mt-2">{stats.averageInactiveDays}</div>
            <div className="mt-2 text-sm text-gray-500">
              {stats.averageInactiveDays > 30 ? 'Анхаарал хандуулах шаардлагатай' : 
                stats.averageInactiveDays > 14 ? 'Хяналт хэрэгтэй' : 'Хэвийн түвшин'}
            </div>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Хэрэглэгчийн Pie Chart */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-bold mb-4">Хэрэглэгчийн төрөл</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareRoleChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareRoleChartData().map((entry, index) => (
                      <cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Идэвхийн Pie Chart */}
          <div className="bg-white p-4 rounded-lg border shadow-sm">
            <h4 className="font-bold mb-4">Хэрэглэгчийн идэвх</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={prepareActivityChartData()}
                    cx="50%"
                    cy="50%"
                    labelLine={true}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {prepareActivityChartData().map((entry, index) => (
                      <cell key={`cell-${index}`} fill={
                        index === 0 ? '#4caf50' : index === 1 ? '#ff9800' : '#f44336'
                      } />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  // Bar Chart
  const renderBarChart = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Хэрэглэгчийн бүртгэлийн диаграм</h3>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={prepareMonthlyRegistrationData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" name="Бүртгүүлсэн хэрэглэгч" fill="#3b82f6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Цаг хугацааны шугаман диаграм
  const renderTimeline = () => {
    return (
      <div className="space-y-6">
        <h3 className="text-xl font-bold">Хэрэглэгчийн нэвтрэлтийн хугацааны диаграм</h3>
        
        <div className="bg-white p-4 rounded-lg border shadow-sm">
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart
                data={prepareMonthlyRegistrationData()}
                margin={{ top: 20, right: 30, left: 20, bottom: 40 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" angle={-45} textAnchor="end" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="count" name="Шинэ хэрэглэгчид" stroke="#3b82f6" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    );
  };
  
  // Хэрэглэгчийн дэлгэрэнгүй мэдээлэл
  const renderUserDetails = () => {
    if (!selectedUser) return null;
    
    const userCreatedDate = new Date(selectedUser.createdAt);
    const userLastActive = selectedUser.lastActive ? new Date(selectedUser.lastActive) : null;
    
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl overflow-hidden">
          <div className="flex justify-between items-center border-b p-4">
            <h3 className="text-xl font-bold">Хэрэглэгчийн дэлгэрэнгүй мэдээлэл</h3>
            <button onClick={closeUserDetails} className="text-gray-500 hover:text-gray-700">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div className="p-6">
            <div className="flex items-center mb-6">
              <div className="w-20 h-20 rounded-full bg-gray-200 flex items-center justify-center mr-4">
                <span className="text-3xl font-bold text-gray-500">{selectedUser.username.charAt(0).toUpperCase()}</span>
              </div>
              
              <div>
                <h4 className="text-xl font-bold">{selectedUser.username}</h4>
                <p className="text-gray-600">{selectedUser.email}</p>
                <span className={`px-2 py-1 text-xs rounded-full ${
                  selectedUser.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                }`}>
                  {selectedUser.role === 'admin' ? 'Админ' : 'Хэрэглэгч'}
                </span>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className="border rounded-lg p-4">
                <h5 className="font-bold text-gray-500 mb-2">Бүртгүүлсэн огноо</h5>
                <p>{userCreatedDate.toLocaleDateString()} {userCreatedDate.toLocaleTimeString()}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-bold text-gray-500 mb-2">Сүүлд нэвтэрсэн</h5>
                <p>{userLastActive ? `${userLastActive.toLocaleDateString()} ${userLastActive.toLocaleTimeString()}` : 'Мэдээлэл байхгүй'}</p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-bold text-gray-500 mb-2">Идэвхгүй өдөр</h5>
                <p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedUser.daysInactive > 30 ? 'bg-red-100 text-red-800' :
                    selectedUser.daysInactive > 14 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.daysInactive} өдөр
                  </span>
                </p>
              </div>
              
              <div className="border rounded-lg p-4">
                <h5 className="font-bold text-gray-500 mb-2">Статус</h5>
                <p>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    selectedUser.daysInactive > 30 ? 'bg-red-100 text-red-800' :
                    selectedUser.daysInactive > 14 ? 'bg-yellow-100 text-yellow-800' :
                    'bg-green-100 text-green-800'
                  }`}>
                    {selectedUser.daysInactive > 30 ? 'Маш идэвхгүй' :
                     selectedUser.daysInactive > 14 ? 'Дунд зэрэг идэвхгүй' :
                     'Идэвхтэй'}
                  </span>
                </p>
              </div>
            </div>
            
            <div className="border-t pt-4 flex justify-end space-x-2">
              <button className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300" onClick={closeUserDetails}>
                Хаах
              </button>
              <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                Хэрэглэгчид имэйл илгээх
              </button>
            </div>
          </div>
        </div>
      </div>
    );
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
      
      <div className="mb-6">
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setReportView('table')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'table' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Хүснэгт
          </button>
          <button
            onClick={() => setReportView('dashboard')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'dashboard' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Дашбоард
          </button>
          <button
            onClick={() => setReportView('pieChart')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'pieChart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Хэрэглэгчийн төрөл
          </button>
          <button
            onClick={() => setReportView('barChart')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'barChart' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Бүртгэлийн график
          </button>
          <button
            onClick={() => setReportView('activityLevels')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'activityLevels' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Идэвхийн зэрэглэл
          </button>
          <button
            onClick={() => setReportView('timeline')}
            className={`px-4 py-2 rounded-md ${
              reportView === 'timeline' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'
            }`}
          >
            Хугацааны график
          </button>
        </div>
      </div>
      
      <div className="mb-6 flex justify-end space-x-2">
        <button
          onClick={exportToExcel}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
        >
          Excel татах
        </button>
        <button
          onClick={exportToPDF}
          className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
        >
          PDF татах
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
        <>
          {reportView === 'table' && (
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
                    <th className="py-3 px-4 border-b text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Үйлдэл</th>
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
                      <td className="py-3 px-4 border-b">
                        <button 
                          onClick={() => viewUserDetails(user)}
                          className="px-3 py-1 bg-blue-100 text-blue-800 text-xs rounded-full hover:bg-blue-200"
                        >
                          Дэлгэрэнгүй
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {reportView === 'dashboard' && renderDashboard()}
          
          {reportView === 'pieChart' && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold">Хэрэглэгчийн төрлийн харьцаа</h3>
              <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
                <div className="bg-white p-4 rounded-lg border shadow-sm flex-1">
                  <h4 className="font-bold mb-4">Хэрэглэгчийн төрөл</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareRoleChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareRoleChartData().map((entry, index) => (
                            <cell key={`cell-${index}`} fill={index === 0 ? '#8884d8' : '#82ca9d'} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                <div className="bg-white p-4 rounded-lg border shadow-sm flex-1">
                  <h4 className="font-bold mb-4">Хэрэглэгчийн идэвх</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={prepareActivityChartData()}
                          cx="50%"
                          cy="50%"
                          labelLine={true}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {prepareActivityChartData().map((entry, index) => (
                            <cell key={`cell-${index}`} fill={
                              index === 0 ? '#4caf50' : index === 1 ? '#ff9800' : '#f44336'
                            } />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          {reportView === 'barChart' && renderBarChart()}
          
          {reportView === 'activityLevels' && renderActivityLevelsReport()}
          
          {reportView === 'timeline' && renderTimeline()}
        </>
      )}
      
      {/* Хэрэглэгчийн дэлгэрэнгүй харах modal */}
      {selectedUser && renderUserDetails()}
    </div>
  );
};

export default EnhancedAdminReportPanel;