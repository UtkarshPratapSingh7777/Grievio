import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Users, Shield, Briefcase } from 'lucide-react';
import Navbar from '../components/Navbar';
import FeatureCard from '../components/FeatureCard';
import StepCard from '../components/StepCard';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900">
      <Navbar />

      <div className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
            Keep The Show Running<br/>
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 text-transparent bg-clip-text">
              Smooth & Seamless
            </span>
          </h1>
          <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
            A modern grievance redressal system for the Circus of Wonders. Report issues, track resolutions, and ensure our traveling city thrives.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={() => navigate('/signup')}
              className="px-8 py-4 bg-gradient-to-r from-yellow-400 to-orange-500 text-white rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition cursor-pointer"
            >
              Report an Issue
            </button>
            <button className="px-8 py-4 bg-white/10 backdrop-blur-lg text-white rounded-xl text-lg font-semibold border border-white/20 hover:bg-white/20 transition cursor-pointer">
              Learn More
            </button>
          </div>
        </div>
      </div>

      <div id="features" className="py-20 px-4 bg-black/20">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">Platform Features</h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard 
              icon={<Users className="text-yellow-400" size={40} />}
              title="For Citizens"
              description="Report issues instantly with photos and location. Track your complaints from submission to resolution."
            />
            <FeatureCard 
              icon={<Briefcase className="text-blue-400" size={40} />}
              title="For Staff"
              description="Assign yourself to issues, update progress, and resolve complaints efficiently with our streamlined dashboard."
            />
            <FeatureCard 
              icon={<Shield className="text-purple-400" size={40} />}
              title="For Admins"
              description="Comprehensive oversight with analytics, staff management, and detailed reporting capabilities."
            />
          </div>
        </div>
      </div>

      <div className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-white text-center mb-16">How It Works</h2>
          <div className="grid md:grid-cols-4 gap-6">
            <StepCard number="1" title="Report" description="Citizen logs in and submits a complaint" />
            <StepCard number="2" title="Assign" description="Admin of that city gets the issue and assigns that to a staff" />
            <StepCard number="3" title="Resolve" description="Issue is resolved and marked resolved by staff" />
            <StepCard number="4" title="Review" description="Admin reviews the complaint,analytics and generates reports" />
          </div>
        </div>
      </div>

      <div className="py-20 px-4 bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-y border-white/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">Ready to Get Started?</h2>
          <p className="text-xl text-white/80 mb-8">Join Grievio and help keep our traveling city running smoothly.</p>
          <button 
            onClick={() => navigate('/signup')}
            className="px-8 py-4 bg-white text-purple-900 rounded-xl text-lg font-semibold hover:shadow-2xl hover:scale-105 transition cursor-pointer"
          >
            Create Your Account
          </button>
        </div>
      </div>

      <footer className="py-12 px-4 bg-black/40">
        <div className="max-w-7xl mx-auto text-center text-white/60">
          <p>&copy; 2025 Grievio. All rights reserved.</p>
          <p className="mt-2">Built for the Circus of Wonders traveling community.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
