import React from 'react';
import { Search, Bell, Mail, ChevronDown } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Header = ({ title }) => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'ADMIN';
  const userName = localStorage.getItem('userName') || 'Admin User';

  return (
    <div className="h-16 bg-[#F8F9FA] flex items-center justify-between px-8 fixed top-0 right-0 left-64 z-10">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input
            type="text"
            placeholder="Search..."
            className="pl-10 pr-4 py-2 bg-white border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/20 w-64"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 text-[10px] font-bold text-gray-400 bg-gray-50 px-1.5 py-0.5 rounded border border-gray-200">
            <span>⌘</span>
            <span>K</span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => navigate('/coming-soon')}
            className="p-2 text-gray-400 hover:bg-white hover:text-primary transition-colors rounded-lg"
          >
            <Mail size={20} />
          </button>
          <button 
            onClick={() => navigate('/coming-soon')}
            className="p-2 text-gray-400 hover:bg-white hover:text-primary transition-colors rounded-lg relative"
          >
            <Bell size={20} />
            <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-[#F8F9FA]"></span>
          </button>
        </div>

        <div className="flex items-center gap-3 border-l pl-6 border-gray-200">
          <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden ring-2 ring-white">
            <img src={`https://ui-avatars.com/api/?name=${userName}&background=056B3A&color=fff`} alt="User" />
          </div>
          <div className="hidden lg:block">
            <p className="text-sm font-semibold">{userName}</p>
            <p className="text-[10px] text-gray-400">{userRole.charAt(0) + userRole.slice(1).toLowerCase()}</p>
          </div>
          <ChevronDown size={16} className="text-gray-400" />
        </div>
      </div>
    </div>
  );
};

export default Header;
