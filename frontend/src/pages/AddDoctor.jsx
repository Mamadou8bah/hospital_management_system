import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, FileText, Upload, X, Lock, Loader2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';

const AddDoctor = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    speciality: '',
    department: '',
    phone: '',
    about: '',
    address: ''
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await api.get('/departments');
        setDepartments(response.data.map(d => d.name));
        if (response.data.length > 0) {
          setFormData(prev => ({ ...prev, department: response.data[0].name }));
        }
      } catch (error) {
        console.error("Error fetching departments:", error);
      }
    };
    fetchDepartments();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.department) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      await api.post('/doctors', formData);
      toast.success('Doctor added successfully');
      navigate('/doctors');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to add doctor');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Add New Doctor</h2>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg transition-colors"><X/></button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="John" />
          <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Doe" />
          <InputGroup label="Email Address" name="email" value={formData.email} onChange={handleChange} placeholder="doctor@clinova.com" icon={<Mail size={16}/>} />
          <InputGroup label="Password" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="••••••••" icon={<Lock size={16}/>} />
          
          <InputGroup label="Phone Number" name="phone" value={formData.phone} onChange={handleChange} placeholder="+1 (555) 000-0000" icon={<Phone size={16}/>} />
          <InputGroup label="Department" name="department" value={formData.department} onChange={handleChange} isSelect options={departments} />
          
          <InputGroup label="Speciality" name="speciality" value={formData.speciality} onChange={handleChange} placeholder="e.g. Cardiologist" />
          <InputGroup label="Work Address" name="address" value={formData.address} onChange={handleChange} placeholder="123 Medical St, City" icon={<MapPin size={16}/>} />
          
          <div className="md:col-span-2">
            <InputGroup label="About / Biography" name="about" value={formData.about} onChange={handleChange} placeholder="Enter doctor's biography and experience..." isTextarea />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t border-gray-50">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 border rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <button 
            type="submit" 
            disabled={loading}
            className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" size={20} /> : 'Save Doctor Profile'}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, isSelect, options, isTextarea, icon, type = "text" }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      {isTextarea ? (
        <textarea 
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 text-sm outline-none transition-all min-h-[120px] resize-none"
        />
      ) : isSelect ? (
        <select 
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 text-sm outline-none transition-all appearance-none cursor-pointer"
        >
          <option value="" disabled>Select Department</option>
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type={type}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 text-sm outline-none transition-all`}
        />
      )}
    </div>
  </div>
);

export default AddDoctor;


