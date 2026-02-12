import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar
} from 'recharts';
import { Users, FileText, Download, Plus, Filter, SortAsc, MoreVertical, Phone, Mail, User2, ArrowUpRight, Search, Trash2, Loader2 } from 'lucide-react';
import { StatCard, ChartContainer } from '../components/DashboardComponents';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { exportToCSV } from '../services/exportUtils';

const attendanceData = [

];

const DoctorList = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role') || 'ADMIN';
  const [doctors, setDoctors] = useState([]);
  const [doctorOfTheMonth, setDoctorOfTheMonth] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');
  const [filterSpecialty, setFilterSpecialty] = useState('All');

  const fetchDoctors = async () => {
    try {
      setLoading(true);
      const [doctorsRes, dotmRes] = await Promise.all([
        api.get('/doctors'),
        api.get('/doctors/of-the-month')
      ]);
      setDoctors(doctorsRes.data);
      setDoctorOfTheMonth(dotmRes.data);
    } catch (error) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctors();
  }, []);

  const handleDelete = async (id, e) => {
    e.stopPropagation();
    if(window.confirm('Are you sure you want to delete this doctor?')) {
      try {
        await api.delete(`/doctors/${id}`);
        toast.success('Doctor deleted');
        fetchDoctors();
      } catch (error) {
        toast.error('Failed to delete doctor');
      }
    }
  };

  const filteredDoctors = doctors
    .filter(doc => {
      const matchesSearch = `${doc.firstName} ${doc.lastName}`.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          doc.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesSpecialty = filterSpecialty === 'All' || doc.specialty === filterSpecialty;
      return matchesSearch && matchesSpecialty;
    })
    .sort((a, b) => {
      if (sortBy === 'name') return `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`);
      if (sortBy === 'experience') return b.experienceYears - a.experienceYears;
      if (sortBy === 'rating') return b.rating - a.rating;
      return 0;
    });

  const specialties = ['All', ...new Set(doctors.map(d => d.specialty))];

  const handleExport = () => {
    const exportData = filteredDoctors.map(doc => ({
      'Name': `${doc.firstName} ${doc.lastName}`,
      'ID Number': doc.employeeId || doc.id,
      'Title': doc.title || 'Doctor',
      'Age': doc.age,
      'Specialty': doc.specialty,
      'Status': doc.status,
      'Phone': doc.phone,
      'Email': doc.email,
      'Shift Timing': doc.shiftTiming
    }));
    exportToCSV(exportData, 'doctor_list');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search doctors by name or specialty..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        {userRole === 'ADMIN' && (
          <button 
            onClick={() => navigate('/doctors/add')}
            className="bg-primary text-white flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/20"
          >
            <Plus size={18} /> Add Doctor
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <StatCard 
          title="Total Doctors" 
          value={doctors.length.toString()} 
          change="2" 
          isPositive={true}
          icon={User2}
          details={[
            { label: 'Cardiologist', value: doctors.filter(d => d.specialty === 'Cardiologist').length + ' People' },
            { label: 'Neurology', value: doctors.filter(d => d.specialty === 'Neurosurgeon').length + ' People' },
            { label: 'Others', value: doctors.filter(d => !['Cardiologist', 'Neurosurgeon'].includes(d.specialty)).length + ' People' }
          ]}
        />
        
        {/* ... Charts stay same for now ... */}
        
        <ChartContainer title="Doctor attendance" extra={<div className="flex gap-2 text-[10px] font-semibold text-gray-400">
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#3B82F6]"></div> On Time</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]"></div> On Late</div>
          <div className="flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-[#EF4444]"></div> On Leave</div>
        </div>}>
          <LineChart data={attendanceData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94A3B8'}} />
            <Tooltip />
            <Line type="monotone" dataKey="OnTime" stroke="#056B3A" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Late" stroke="#F59E0B" strokeWidth={2} dot={false} />
            <Line type="monotone" dataKey="Leave" stroke="#EF4444" strokeWidth={2} dot={false} />
          </LineChart>
        </ChartContainer>

        <div className="card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Doctor of the months</h3>
            <button className="text-gray-400"><MoreVertical size={20} /></button>
          </div>
          {doctorOfTheMonth ? (
            <div className="flex flex-col items-center text-center">
              <div className="w-20 h-20 rounded-full border-4 border-gray-50 p-1 mb-4">
                <img 
                  src={`https://ui-avatars.com/api/?name=${doctorOfTheMonth.name}&background=056B3A&color=fff`} 
                  className="rounded-full w-full h-full object-cover" 
                  alt="" 
                />
              </div>
              <h4 className="text-lg font-bold">{doctorOfTheMonth.name}</h4>
              <p className="text-xs text-gray-400 mb-6">{doctorOfTheMonth.specialty}</p>
              
              <div className="grid grid-cols-3 w-full border-y border-gray-50 py-4 mb-6">
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Performance</p>
                  <p className="text-sm font-bold text-gray-800">+{doctorOfTheMonth.performance}% <ArrowUpRight size={12} className="inline text-primary" /></p>
                </div>
                <div className="border-x border-gray-50">
                  <p className="text-[10px] text-gray-400 mb-1">Attendance</p>
                  <p className="text-sm font-bold text-gray-800">+{doctorOfTheMonth.attendance}% <ArrowUpRight size={12} className="inline text-primary" /></p>
                </div>
                <div>
                  <p className="text-[10px] text-gray-400 mb-1">Patient</p>
                  <p className="text-sm font-bold text-gray-800">+{doctorOfTheMonth.patients} <ArrowUpRight size={12} className="inline text-primary" /></p>
                </div>
              </div>

              <div className="w-full space-y-3 mb-6 text-left">
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Phone size={14} className="text-gray-400" /> {doctorOfTheMonth.phone || "+1 (555) 000-0000"}
                </div>
                <div className="flex items-center gap-2 text-xs text-gray-600">
                  <Mail size={14} className="text-gray-400" /> {doctorOfTheMonth.email}
                </div>
              </div>

              <div className="flex w-full gap-3">
                <button 
                  onClick={() => navigate(`/doctors/profile/${doctorOfTheMonth.id}`)}
                  className="flex-1 py-2 rounded-xl bg-gray-50 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors"
                >
                  View
                </button>
                <button 
                  onClick={() => window.location.href = `mailto:${doctorOfTheMonth.email}`}
                  className="flex-1 py-2 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors"
                >
                  Message
                </button>
              </div>
            </div>
          ) : (
            <p className="text-center text-gray-400 text-xs py-10">No doctor of the month assigned.</p>
          )}
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Doctor list ({filteredDoctors.length})</h3>
          <div className="flex gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white ring-offset-2 focus-within:ring-2 focus-within:ring-primary/20">
              <SortAsc size={14} className="text-gray-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
              >
                <option value="name">Name</option>
                <option value="experience">Experience</option>
                <option value="rating">Rating</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white ring-offset-2 focus-within:ring-2 focus-within:ring-primary/20">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={filterSpecialty} 
                onChange={(e) => setFilterSpecialty(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
              >
                {specialties.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <button 
              onClick={handleExport}
              className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-gray-50 transition-colors"
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>
            <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left border-b border-gray-100 pb-4">
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Employee Name</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">ID Number</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Title</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Age</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Specialty</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Shift Timing</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredDoctors.map((doc) => (
                <tr key={doc.id} className="hover:bg-gray-50/50 transition-colors cursor-pointer group" onClick={() => navigate(`/doctors/profile/${doc.id}`)}>
                  <td className="py-4 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden">
                      <img src={`https://ui-avatars.com/api/?name=${doc.firstName}+${doc.lastName}&background=056B3A&color=fff`} alt="" />
                    </div>
                    <span className="font-semibold text-sm">{doc.firstName} {doc.lastName}</span>
                  </td>
                  <td className="py-4 text-xs font-medium text-gray-500">{doc.id}</td>
                  <td className="py-4 text-xs font-medium text-gray-500">{doc.departmentName}</td>
                  <td className="py-4 text-xs font-medium text-gray-500">30+</td>
                  <td className="py-4 text-xs font-medium text-gray-500">{doc.specialty}</td>
                  <td className="py-4">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border flex items-center w-fit gap-1 ${
                      doc.isAvailable ? "bg-green-100 text-green-600 border-green-200" : "bg-red-100 text-red-600 border-red-200"
                    }`}>
                      <div className={`w-1 h-1 rounded-full ${doc.isAvailable ? "bg-green-600" : "bg-red-600"}`}></div>
                      {doc.isAvailable ? "Available" : "On Leave"}
                    </span>
                  </td>
                  <td className="py-4 text-xs font-bold text-gray-700">09:00 - 17:00</td>
                  <td className="py-4 text-right">
                    <button 
                      onClick={(e) => handleDelete(doc.id, e)}
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-all opacity-0 group-hover:opacity-100"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default DoctorList;
