import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, User, MapPin, Briefcase, Shield } from 'lucide-react';
import UserTypeSelector from '../components/UserTypeSelector';
import { apiCall } from '../utils/api';

const SignupPage = () => {
  const navigate = useNavigate();
  const [userType, setUserType] = useState('citizen');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    dept: '',
    city: ''
  });

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }

    try {
      const endpoint = userType === 'citizen' ? '/citizen/register' : 
                      userType === 'staff' ? '/staff/register' : 
                      '/admin/register';
      
      let requestBody = {
        name: formData.name,
        email: formData.email,
        password: formData.password
      };

      if (userType === 'staff') {
        requestBody.dept = formData.dept;
        requestBody.location = { city: formData.city.toLowerCase() };
      } else if (userType === 'admin') {
        requestBody.dept = formData.dept;
        requestBody.location = { city: formData.city.toLowerCase() };
      }
      
      const response = await apiCall(endpoint, 'POST', requestBody);

      const data = await response.json();
      if (response.ok) {
        alert('Registration successful!');
        localStorage.setItem('token', data.token);
        
        if(userType === 'citizen') navigate('/dashboard/citizen', { state: { userData: data.Citizen } });
        if(userType === 'staff') navigate('/dashboard/staff', { state: { staffData: data } });
        if(userType === 'admin') navigate('/dashboard/admin', { state: { adminData: data } });
      } else {
        alert(data.message || 'Registration failed');
      }
    } catch (error) {
      console.error('Signup error:', error);
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
          <h2 className="text-4xl font-bold text-white mb-2">Create Account</h2>
          <p className="text-white/60">Join The Caravan Chronicle</p>
        </div>

        <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
          <UserTypeSelector userType={userType} setUserType={setUserType} />

          <form onSubmit={handleSignup} className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 text-sm">
                Full Name <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition"
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-white/80 mb-2 text-sm">
                Email <span className="text-red-400">*</span>
              </label>
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

            {(userType === 'staff' || userType === 'admin') && (
              <>
                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    Department <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    {userType === 'staff' ? <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} /> : <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />}
                    <select
                      name="dept"
                      value={formData.dept}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white focus:outline-none focus:border-yellow-400 transition"
                      required
                    >
                      <option value="" className="bg-gray-800">Select Department</option>
                      <option value="roads" className="bg-gray-800">Roads</option>
                      <option value="water" className="bg-gray-800">Water</option>
                      <option value="waste" className="bg-gray-800">Waste Management</option>
                      <option value="electricity" className="bg-gray-800">Electricity</option>
                      <option value="other" className="bg-gray-800">Other</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-white/80 mb-2 text-sm">
                    City <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition"
                      placeholder="e.g., Mumbai"
                      required
                    />
                  </div>
                </div>
              </>
            )}

            <div>
              <label className="block text-white/80 mb-2 text-sm">
                Password <span className="text-red-400">*</span>
              </label>
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

            <div>
              <label className="block text-white/80 mb-2 text-sm">
                Confirm Password <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/40" size={20} />
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-white/5 border border-white/20 rounded-lg py-3 pl-12 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-yellow-400 transition"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full bg-gradient-to-r from-yellow-400 to-orange-500 text-white py-3 rounded-lg font-semibold hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Create {userType.charAt(0).toUpperCase() + userType.slice(1)} Account
            </button>
          </form>

          <div className="mt-6 text-center text-white/60 text-sm">
            Already have an account?{' '}
            <button 
              onClick={() => navigate('/login')}
              className="text-yellow-400 hover:text-yellow-300 font-semibold cursor-pointer"
            >
              Sign in
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;