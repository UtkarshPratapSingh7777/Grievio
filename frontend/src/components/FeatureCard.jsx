import React from 'react';

const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white/5 backdrop-blur-lg rounded-xl p-8 border border-white/10 hover:bg-white/10 transition">
    <div className="mb-4">{icon}</div>
    <h3 className="text-2xl font-bold text-white mb-3">{title}</h3>
    <p className="text-white/70">{description}</p>
  </div>
);

export default FeatureCard;