import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Lock, Loader2, LogIn, User, Eye, EyeOff } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, role, userName } = response.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('userName', userName);

      toast.success(`Welcome back, ${userName}!`);
      navigate('/');
    } catch (error) {
      console.error('Login error:', error);
      const message = error.response?.data?.message || 'Invalid credentials. Please try again.';
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex font-['Inter']">
      {/* Left side: Image and Branding */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img 
          src="https://img.freepik.com/premium-photo/genicologic-chair-equipment-medicine-medical-furniture-hospital-genicology-women-s-consultation-chair-genicology_548821-23632.jpg?semt=ais_hybrid&w=740&q=80" 
          alt="Medical Facility"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-16">
          <h2 className="text-4xl font-bold text-white mb-4 leading-tight">
            Innovative Healthcare <br /> Management Solutions
          </h2>
          <p className="text-gray-200 text-lg max-w-md leading-relaxed">
            Experience professional care and streamlined operations with Clinova's advanced medical system.
          </p>
        </div>
      </div>
 
      {/* Right side: Login Form */}
      <div className="w-full lg:w-1/2 flex flex-col justify-center items-center bg-white p-8 md:p-16">
        <div className="max-w-md w-full">
          {/* Logo */}
          <div className="flex justify-center mb-10">
            <div className="w-48 h-16 overflow-hidden">
              <img 
                src="https://res.cloudinary.com/dflsnes44/image/upload/v1770889283/ChatGPT_Image_Feb_12_2026_09_12_01_AM_fl4aod.png" 
                alt="Clinova Logo" 
                className="w-full h-full object-contain" 
              />
            </div>
          </div>

          <div className="text-center mb-10">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Login to your account</h1>
            <p className="text-gray-500 text-sm">Enter your credentials to access the management panel.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Username / Email</label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <User size={20} />
                </div>
                <input 
                  type="email" 
                  placeholder="Enter your email"
                  className="w-full pl-12 pr-4 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none   focus:border-primary transition-all placeholder:text-gray-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-sm font-semibold text-gray-700">Password</label>
                <button type="button" className="text-xs font-bold text-primary hover:underline">Forgot Password?</button>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors">
                  <Lock size={20} />
                </div>
                <input 
                  type={showPassword ? "text" : "password"} 
                  placeholder="Enter your password"
                  className="w-full pl-12 pr-12 py-4 bg-gray-50/50 border border-gray-100 rounded-2xl text-sm focus:bg-white focus:outline-none   focus:border-primary transition-all placeholder:text-gray-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-primary transition-colors"
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 ml-1">
              <input 
                type="checkbox" 
                id="remember" 
                className="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary focus:ring-offset-0" 
              />
              <label htmlFor="remember" className="text-sm text-gray-500 font-medium cursor-pointer">Remember Me</label>
            </div>

            <button 
              type="submit" 
              disabled={loading}
              className="w-full bg-primary text-white py-4 rounded-2xl font-bold text-sm  shadow-primary/20 hover:bg-primary/90 transition-all active:scale-[0.98] disabled:opacity-70 flex items-center justify-center gap-2 mt-8"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <span>Sign in</span>
              )}
            </button>
          </form>

          <footer className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account? <button className="text-primary font-bold hover:underline">Contact Admin</button>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
};


export default Login;
