import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Timer, ArrowLeft } from 'lucide-react';

const ComingSoon = () => {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] text-center px-4">
      <h1 className="text-4xl font-black text-gray-800 mb-2">Coming Soon</h1>
      <p className="text-gray-500 max-w-md mb-8">
        We're working hard to bring you this feature. Stay tuned for updates in the next version of Clinova!
      </p>
      <button 
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-xl font-bold hover:bg-primary/90 transition-all"
      >
        <ArrowLeft size={18} />
        Go Back
      </button>
    </div>
  );
};

export default ComingSoon;
