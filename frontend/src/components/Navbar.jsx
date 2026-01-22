import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const Navbar = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="fixed w-full bg-black/20 backdrop-blur-lg z-50 border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2">
            <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">CC</span>
            </div>
            <span className="text-orange-400 font-bold text-2xl">Grievio</span>
          </Link>
          
          <div className="hidden md:flex space-x-8">
            <a href="#features" className="text-white/80 hover:text-white transition">Features</a>
            <a href="#about" className="text-white/80 hover:text-white transition">About</a>
            <a href="#contact" className="text-white/80 hover:text-white transition">Contact</a>
          </div>

          <div className="hidden md:flex space-x-4">
            <button 
              onClick={() => navigate('/login')}
              className="px-4 py-2 text-white hover:bg-white/10 rounded-lg transition cursor-pointer"
            >
              Login
            </button>
            <button 
              onClick={() => navigate('/signup')}
              className="px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-lg hover:shadow-lg hover:scale-105 transition cursor-pointer"
            >
              Get Started
            </button>
          </div>

          <button className="md:hidden text-white" onClick={() => setIsMenuOpen(!isMenuOpen)}>
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-black/40 backdrop-blur-lg border-t border-white/10">
          <div className="px-4 py-4 space-y-3">
            <a href="#features" className="block text-white/80 hover:text-white">Features</a>
            <a href="#about" className="block text-white/80 hover:text-white">About</a>
            <a href="#contact" className="block text-white/80 hover:text-white">Contact</a>
            <button onClick={() => navigate('/login')} className="block w-full text-left text-white/80 hover:text-white">Login</button>
            <button onClick={() => navigate('/signup')} className="block w-full text-left text-yellow-400">Get Started</button>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
