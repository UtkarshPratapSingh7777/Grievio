import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock } from 'lucide-react';
import UserTypeSelector from '../components/UserTypeSelector';
import { apiCall } from '../utils/api';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('citizen');
  const [formData, setFormData] = useState({ email: '', password: '' });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    
    try {
      const endpoint = userType === 'citizen' ? '/citizen/login' : 
                      userType === 'staff' ? '/staff/login' : 
                      '/admin/login';
      
      const response = await apiCall(endpoint, 'POST', {
        email: formData.email,
        password: formData.password
      });

      const data = await response.json();
      if (response.ok) {
        alert(`Welcome back, ${userType}!`);
        localStorage.setItem('token', data.token);
        
        if(userType === 'citizen') navigate('/dashboard/citizen', { state: { userData: data.Citizen } });
        if(userType === 'staff') navigate('/dashboard/staff', { state: { staffData: data } });
        if(userType === 'admin') navigate('/dashboard/admin', { state: { adminData: data } });
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login error:', error);
      alert('Network error. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <button 
            onClick={() => navigate('/')}
            className="mb-6 text-white/60 hover:text-white transition cursor-pointer"
          >
            ← Back to Home 
          </button>
          <h2 className="text-4xl font-bold text-white mb-2">Welcome Back</h2>
          <p className="text-white/60">Sign in to your account</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <UserTypeSelector userType={userType} setUserType={setUserType} />

          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition"
                  placeholder="your.email@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center text-white/60">
                <input type="checkbox" className="mr-2 cursor-pointer" />
                Remember me
              </label>
              <a href="#" className="text-yellow-400 hover:text-yellow-300">Forgot password?</a>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Sign In as {userType.charAt(0).toUpperCase() + userType.slice(1)}
            </button>
          </form>

          <div className="mt-6 text-center text-white/60 text-sm">
            Don't have an account?{' '}
            <button 
              onClick={() => navigate('/signup')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold cursor-pointer"
            >
              Sign up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;