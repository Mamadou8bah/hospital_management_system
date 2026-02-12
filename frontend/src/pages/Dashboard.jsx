import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { useNavigate } from 'react-router-dom';
import { Users, FileText, Download, Plus, Filter, SortAsc } from 'lucide-react';
import { StatCard, ChartContainer } from '../components/DashboardComponents';
import api from '../services/api';
import { exportToCSV } from '../services/exportUtils';

const Dashboard = () => {
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.get('/dashboard/stats');
        setData(response.data);
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboardData();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
        <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
        <p className="text-gray-500 font-bold animate-pulse">Synchronizing with Clinova Cloud...</p>
      </div>
    );
  }

  // Fallback data structure if API is partially empty
  const stats = data || {
    doctorStats: { total: 0, active: 0, shiftOngoing: 0 },
    patientStats: { total: 0, growth: 0.0, inpatients: 0 },
    appointmentStats: { total: 0, upcoming: 0, completed: 0 },
    arrivalData: [],
    departmentData: [],
    recentPatients: []
  };

  const totalPatientsCount = stats.departmentData.reduce((sum, item) => sum + item.value, 0);

  const handleExport = () => {
    const exportData = [
      { Category: 'Total Doctors', Value: stats.doctorStats.total },
      { Category: 'Active Doctors', Value: stats.doctorStats.active },
      { Category: 'Total Patients', Value: stats.patientStats.total },
      { Category: 'Patient Growth', Value: stats.patientStats.growth },
      { Category: 'Inpatients', Value: stats.patientStats.inpatients },
      { Category: 'Total Appointments', Value: stats.appointmentStats.total },
      { Category: 'Upcoming Appointments', Value: stats.appointmentStats.upcoming },
      { Category: 'Completed Appointments', Value: stats.appointmentStats.completed }
    ];
    exportToCSV(exportData, 'dashboard_summary');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center gap-2 text-sm text-gray-500">
          <FileText size={16} />
          <span>Last Update: {new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
        </div>
        <div className="flex gap-3">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
          >
            <Download size={16} /> Export to CSV
          </button>
          <button className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl border border-primary hover:bg-primary/90 transition-colors text-sm font-semibold shadow-lg shadow-primary/20">
            Generate Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard 
          title="Total Doctors" 
          value={stats.doctorStats.total.toString()} 
          icon={Users}
          details={[
            { label: 'Active', value: stats.doctorStats.active.toString() },
            { label: 'Shift Ongoing', value: stats.doctorStats.shiftOngoing.toString() }
          ]}
        />
        <StatCard 
          title="Patient Records" 
          value={stats.patientStats.total.toString()} 
          change={stats.patientStats.growth.toString() + "%"} 
          isPositive={true}
          icon={Users}
          details={[
            { label: 'Inpatients', value: stats.patientStats.inpatients.toString() },
            { label: 'Total Capacity', value: '500' }
          ]}
        />
        <StatCard 
          title="Appointments" 
          value={stats.appointmentStats.total.toString()} 
          icon={Plus}
          details={[
            { label: 'Upcoming', value: stats.appointmentStats.upcoming.toString() },
            { label: 'Completed', value: stats.appointmentStats.completed.toString() }
          ]}
          color="green"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartContainer title="Patient Arrival Statistics" extra={<span className="text-xs text-gray-400 border px-2 py-1 rounded-lg">Last 8 Months</span>}>
          <LineChart data={stats.arrivalData}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F3F5" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} dy={10} />
            <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94A3B8'}} />
            <Tooltip 
              contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
            />
            <Line type="monotone" dataKey="in" stroke="#056B3A" strokeWidth={3} dot={{ r: 4, fill: '#056B3A', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
            <Line type="monotone" dataKey="out" stroke="#F8C244" strokeWidth={3} dot={{ r: 4, fill: '#F8C244', strokeWidth: 2, stroke: '#fff' }} activeDot={{ r: 6 }} />
          </LineChart>
        </ChartContainer>

        <ChartContainer title="Patients by Department">
          <div className="relative h-full w-full">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.departmentData}
                  innerRadius="65%"
                  outerRadius="85%"
                  paddingAngle={5}
                  dataKey="value"
                  stroke="none"
                  cx="50%"
                  cy="45%"
                >
                  {stats.departmentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                />
                <Legend verticalAlign="bottom" align="center" iconType="circle" />
              </PieChart>
            </ResponsiveContainer>
            <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-3xl font-bold">{totalPatientsCount}</span>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-tighter">Total Capacity</span>
            </div>
          </div>
        </ChartContainer>
      </div>

      <div className="card">
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-bold">Recent Patients</h3>
          <div className="flex gap-2">
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-gray-50"><SortAsc size={14} /> Sort by</button>
            <button className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold hover:bg-gray-50"><Filter size={14} /> Filter</button>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-left border-b border-gray-100 pb-4">
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Patient Name</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">ID Number</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Age</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Diagnosis</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Room</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {stats.recentPatients.length > 0 ? (
                stats.recentPatients.map((patient) => (
                  <tr 
                    key={patient.id} 
                    className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                    onClick={() => navigate(`/patients/profile/${patient.id}`)}
                  >
                    <td className="py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gray-100 overflow-hidden shadow-sm">
                        <img src={`https://ui-avatars.com/api/?name=${patient.name}&background=056B3A&color=fff`} alt="" />
                      </div>
                      <span className="font-semibold text-sm group-hover:text-primary transition-colors">{patient.name}</span>
                    </td>
                    <td className="py-4 text-xs font-medium text-gray-500">#{patient.id}</td>
                    <td className="py-4 text-xs font-medium text-gray-500">{patient.age}</td>
                    <td className="py-4 text-xs font-medium text-gray-500">{patient.diagnosis}</td>
                    <td className="py-4">
                      <span className="px-2 py-0.5 rounded-full bg-primary/5 text-primary text-[10px] font-bold border border-primary/10 flex items-center w-fit gap-1">
                        <div className="w-1 h-1 rounded-full bg-primary animate-pulse"></div>
                        {patient.status}
                      </span>
                    </td>
                    <td className="py-4 text-xs font-bold text-gray-700">{patient.room}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-sm italic">
                    No recent patient records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

