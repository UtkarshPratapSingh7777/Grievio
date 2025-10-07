import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const StaffDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const staffData = location.state?.staffData;

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-900 via-indigo-900 to-purple-900">
      <nav className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-white">Staff Dashboard</h1>
          <button 
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition cursor-pointer"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <h2 className="text-3xl font-bold text-white mb-4">
            Welcome, Staff Member!
          </h2>
          <p className="text-white/70 mb-2">Department: {staffData?.dept || 'N/A'}</p>
          <p className="text-white/70 mb-6">Location: {staffData?.location?.city || 'N/A'}</p>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Assigned Tasks</h3>
              <p className="text-4xl font-bold text-blue-400">0</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">In Progress</h3>
              <p className="text-4xl font-bold text-yellow-400">0</p>
            </div>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-2">Completed</h3>
              <p className="text-4xl font-bold text-green-400">0</p>
            </div>
          </div>

          <div className="mt-8">
            <h3 className="text-xl font-bold text-white mb-4">Available Complaints</h3>
            <div className="bg-white/5 p-6 rounded-xl border border-white/10 text-center text-white/60">
              No complaints available at the moment
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StaffDashboard;