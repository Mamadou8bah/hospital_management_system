import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  UserRound, 
  Users, 
  Calendar, 
  Building2, 
  Contact, 
  Settings, 
  Puzzle,
  Plus,
  LogOut
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Sidebar = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'ADMIN'; // Default to ADMIN for now or redirect

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  const menuItems = [
    { icon: <LayoutDashboard size={20} />, label: 'Dashboard', path: '/', roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { icon: <UserRound size={20} />, label: 'Doctor', path: '/doctors', roles: ['ADMIN'] },
    { icon: <Users size={20} />, label: 'Patient', path: '/patients', roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { icon: <Calendar size={20} />, label: 'Appointment', path: '/appointments', roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
    { icon: <Building2 size={20} />, label: 'Departments', path: '/departments', roles: ['ADMIN'] },
  ];

  const recordItems = [
    { icon: <Contact size={20} />, label: 'Contacts', path: '/contacts', roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
  ];

  const otherItems = [
    { icon: <Settings size={20} />, label: 'Settings', path: '/settings', roles: ['ADMIN', 'RECEPTIONIST', 'DOCTOR'] },
  ];

  const filterByRole = (items) => items.filter(item => item.roles.includes(userRole));

  return (
    <div className="w-64 bg-[#F9FBFA] h-screen border-r border-[#EDF2F0] flex flex-col fixed left-0 top-0">
      <div className="flex items-center justify-center w-full ">
        <div className="w-full h-30 overflow-hidden rounded-xl">
          <img 
            src="https://res.cloudinary.com/dflsnes44/image/upload/v1770889283/ChatGPT_Image_Feb_12_2026_09_12_01_AM_fl4aod.png" 
            alt="Clinova Logo" 
            className="w-full h-full object-contain object-center" 
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        <div>
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Main Menu</p>
          <div className="space-y-1">
            {filterByRole(menuItems).map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        {filterByRole(recordItems).length > 0 && (
          <div>
            <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Record</p>
            <div className="space-y-1">
              {filterByRole(recordItems).map((item) => (
                <NavLink
                  key={item.label}
                  to={item.path}
                  className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>
          </div>
        )}

        <div>
          <p className="px-4 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Other</p>
          <div className="space-y-1">
            {filterByRole(otherItems).map((item) => (
              <NavLink
                key={item.label}
                to={item.path}
                className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
              >
                {item.icon}
                <span>{item.label}</span>
              </NavLink>
            ))}
          </div>
        </div>

        <div className="mt-auto pt-4 border-t border-gray-100">
          <button 
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 text-red-500 hover:bg-red-50 rounded-xl transition-all font-bold text-sm"
          >
            <LogOut size={20} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
