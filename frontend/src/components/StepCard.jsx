import React from 'react';

const StepCard = ({ number, title, description }) => (
  <div className="text-center">
    <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-full flex items-center justify-center mx-auto mb-4">
      <span className="text-white font-bold text-2xl">{number}</span>
    </div>
    <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
    <p className="text-white/70 text-sm">{description}</p>
  </div>
);

export default StepCard;