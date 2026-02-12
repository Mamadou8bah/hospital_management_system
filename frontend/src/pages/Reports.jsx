import React, { useState, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  LineChart, Line, PieChart, Pie, Cell, AreaChart, Area
} from 'recharts';
import { Download, Filter, Calendar, FileText, ArrowUpRight, TrendingUp, Users, Activity } from 'lucide-react';
import api from '../services/api';
import { exportToCSV } from '../services/exportUtils';

const Reports = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (error) {
                console.error("Error fetching reports data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    const handleExport = () => {
      if (!stats) return;
      const exportData = [
          { 'Metric': 'Total Doctors', 'Value': stats.doctorStats.total },
          { 'Metric': 'Total Patients', 'Value': stats.patientStats.total },
          { 'Metric': 'Patient Growth', 'Value': `${stats.patientStats.growth}%` },
          { 'Metric': 'Upcoming Appointments', 'Value': stats.appointmentStats.upcoming },
          { 'Metric': 'Satisfaction', 'Value': '98%' },
          ...stats.departmentData.map(d => ({ 'Metric': `Dept: ${d.name}`, 'Value': d.value }))
      ];
      exportToCSV(exportData, 'hospital_reports');
    };

    if (loading || !stats) return <div className="p-12 text-center text-primary font-bold">Generating reports...</div>;

    const departmentData = stats.departmentData;
    const monthlyData = stats.arrivalData;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div>
          <h2 className="text-xl font-bold">Analytics & Reports</h2>
          <p className="text-xs text-gray-400">Comprehensive overview of hospital performance</p>
        </div>
        <div className="flex gap-3">
          <button className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold">
            <Filter size={16} /> Filter
          </button>
          <button 
            onClick={handleExport}
            className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl border border-primary hover:bg-primary/90 transition-colors text-sm font-semibold"
          >
            <Download size={16} /> Export Data
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <ReportStatCard title="Total Doctors" value={stats.doctorStats.total} change="+2" icon={<TrendingUp size={20}/>} color="primary" />
        <ReportStatCard title="Total Patients" value={stats.patientStats.total} change={`+${stats.patientStats.growth}%`} icon={<Users size={20}/>} color="blue" />
        <ReportStatCard title="Upcoming Apts" value={stats.appointmentStats.upcoming} change="Booked" icon={<Activity size={20}/>} color="yellow" />
        <ReportStatCard title="Satisfaction" value="98%" change="+0.5%" icon={<TrendingUp size={20}/>} color="green" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Patient Arrivals</h3>
            <select className="text-xs border-none bg-gray-50 rounded-lg px-2 py-1 outline-none font-bold">
              <option>Last 8 Months</option>
            </select>
          </div>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={monthlyData}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#056B3A" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#056B3A" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
                <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
                <Tooltip />
                <Area type="monotone" dataKey="in" stroke="#056B3A" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
                <Area type="monotone" dataKey="out" stroke="#F8C244" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="card">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold">Patients by Department</h3>
            <button className="text-gray-400"><Calendar size={18}/></button>
          </div>
          <div className="h-[300px] flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={departmentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="space-y-3 min-w-[150px]">
              {departmentData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }}></div>
                    <span className="text-xs font-bold text-gray-500">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Monthly Patient Admission</h3>
          <div className="flex gap-4">
             <div className="flex items-center gap-2 text-xs font-bold text-gray-500">
               <div className="w-3 h-3 rounded bg-primary"></div> Admissions
             </div>
          </div>
        </div>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={monthlyData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
              <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
              <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
              <Tooltip />
              <Bar dataKey="patients" fill="#056B3A" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const ReportStatCard = ({ title, value, change, icon, color }) => {
  const colors = {
    primary: 'bg-primary/10 text-primary',
    blue: 'bg-blue-500/10 text-blue-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
    green: 'bg-emerald-500/10 text-emerald-500',
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colors[color]}`}>
          {icon}
        </div>
        <div className="flex items-center gap-1 text-[10px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded-full">
           <ArrowUpRight size={10} /> {change}
        </div>
      </div>
      <div>
        <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">{title}</p>
        <h3 className="text-2xl font-bold">{value}</h3>
      </div>
    </div>
  );
};

export default Reports;
