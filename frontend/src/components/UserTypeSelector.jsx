import React from 'react';
import { Users, Briefcase, Shield } from 'lucide-react';

const UserTypeSelector = ({ userType, setUserType }) => {
  return (
    <div className="flex gap-2 mb-6">
      <button
        onClick={() => setUserType('citizen')}
        className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-2 transition cursor-pointer ${
          userType === 'citizen' ? 'bg-yellow-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <Users size={20} />
        <span className="text-sm font-medium">Citizen</span>
      </button>
      <button
        onClick={() => setUserType('staff')}
        className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-2 transition cursor-pointer ${
          userType === 'staff' ? 'bg-blue-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <Briefcase size={20} />
        <span className="text-sm font-medium">Staff</span>
      </button>
      <button
        onClick={() => setUserType('admin')}
        className={`flex-1 py-3 rounded-lg flex flex-col items-center gap-2 transition cursor-pointer ${
          userType === 'admin' ? 'bg-purple-500 text-white' : 'bg-white/5 text-white/60 hover:bg-white/10'
        }`}
      >
        <Shield size={20} />
        <span className="text-sm font-medium">Admin</span>
      </button>
    </div>
  );
};

export default UserTypeSelector;