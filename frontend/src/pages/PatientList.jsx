import React, { useState, useMemo, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  Radar, RadarChart, PolarGrid, PolarAngleAxis
} from "recharts";
import { Plus, SortAsc, Filter, Download, User2, ChevronRight, Search, Trash2, ArrowUpRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { exportToCSV } from "../services/exportUtils";

const summaryData = [
  { name: "Jan", in: 15, out: 10, dis: 5 },
  { name: "Feb", in: 20, out: 12, dis: 8 },
  { name: "Mar", in: 25, out: 15, dis: 10 },
  { name: "Apr", in: 35, out: 21, dis: 15 },
  { name: "May", in: 30, out: 18, dis: 12 },
  { name: "Jun", in: 28, out: 16, dis: 11 },
];

const diagnosisData = [
    { subject: "Diabetes", A: 120, fullMark: 150 },
    { subject: "Asthma", A: 98, fullMark: 150 },
    { subject: "Epilepsy", A: 86, fullMark: 150 },
    { subject: "Cancer", A: 99, fullMark: 150 },
    { subject: "Allergies", A: 85, fullMark: 150 },
    { subject: "Heart Disease", A: 65, fullMark: 150 },
    { subject: "Depression", A: 70, fullMark: 150 },
    { subject: "Hypertension", A: 110, fullMark: 150 },
];

const PatientList = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const userRole = localStorage.getItem('role') || 'ADMIN';
  const [stats, setStats] = useState({
    ageStats: { child: 0, teen: 0, adult: 0, older: 0 },
    summaryData: [],
    diagnosisData: []
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("name");
  const [filterGender, setFilterGender] = useState("All Genders");
  const [filterStatus, setFilterStatus] = useState("All Status");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, statsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/patients/stats")
      ]);
      setPatients(patientsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching patient data:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredPatients = useMemo(() => {
    let result = patients.filter(p => 
      (p.firstName + " " + p.lastName).toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.id.toString().includes(searchTerm)
    );

    if (filterGender !== "All Genders") {
      result = result.filter(p => p.gender === filterGender);
    }

    if (filterStatus !== "All Status") {
      result = result.filter(p => p.status === filterStatus);
    }

    return result.sort((a, b) => {
      if (sortBy === "name") return (a.firstName + " " + a.lastName).localeCompare(b.firstName + " " + b.lastName);
      if (sortBy === "age") return a.age - b.age;
      if (sortBy === "recent") return new Date(b.admissionDate) - new Date(a.admissionDate);
      return 0;
    });
  }, [patients, searchTerm, sortBy, filterGender, filterStatus]);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (window.confirm("Are you sure you want to delete this patient?")) {
      try {
        await api.delete(`/patients/${id}`);
        fetchData();
      } catch (error) {
        console.error("Error deleting patient:", error);
        alert("Failed to delete patient");
      }
    }
  };

  const handleExport = () => {
    const exportData = filteredPatients.map(p => ({
      'Name': `${p.firstName} ${p.lastName}`,
      'ID Number': p.patientId || p.id,
      'Email': p.email,
      'Phone': p.phone,
      'Age': p.age,
      'Gender': p.gender,
      'Admission Date': p.admissionDate,
      'Status': p.status,
      'Diagnosis': p.diagnosis
    }));
    exportToCSV(exportData, 'patient_list');
  };

  if (loading) return <div className="p-12 text-center text-primary font-bold">Loading records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex items-center gap-2 text-sm text-gray-400">
          <Search size={18} />
          <input 
            type="text" 
            placeholder="Search patients by name or ID..." 
            className="outline-none min-w-[300px] text-gray-700"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          {['ADMIN', 'RECEPTIONIST'].includes(userRole) && (
            <button 
              onClick={() => navigate("/patients/add")}
              className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl border border-primary hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              <Plus size={16} /> Add Patient
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <AgeStatCard type="Child" count={stats.ageStats.child} change="7.52%" />
        <AgeStatCard type="Teen" count={stats.ageStats.teen} change="7.52%" />
        <AgeStatCard type="Adult" count={stats.ageStats.adult} change="7.52%" />
        <AgeStatCard type="Older" count={stats.ageStats.older} change="7.52%" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 card">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-lg font-bold">Patient Summary</h3>
            <div className="flex items-center gap-4">
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-primary"></div> Inpatient</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-yellow-400"></div> Outpatient</div>
               <div className="flex items-center gap-1.5 text-[10px] font-bold text-gray-500"><div className="w-2 h-2 rounded-full bg-red-400"></div> Discharged</div>
               <button className="flex items-center gap-1 text-[10px] font-bold border px-2 py-1 rounded-lg"><Filter size={12}/> Monthly</button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.summaryData}>
               <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
               <XAxis dataKey="name" axisLine={false} tickLine={false} />
               <YAxis axisLine={false} tickLine={false} />
               <Tooltip />
               <Bar dataKey="in" fill="#056B3A" radius={[4, 4, 0, 0]} />
               <Bar dataKey="out" fill="#F8C244" radius={[4, 4, 0, 0]} />
               <Bar dataKey="dis" fill="#FF7D7D" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="card">
           <h3 className="text-lg font-bold mb-6">Diagnosis Breakdown</h3>
           <ResponsiveContainer width="100%" height={300}>
             <RadarChart cx="50%" cy="50%" outerRadius="80%" data={stats.diagnosisData}>
                <PolarGrid stroke="#f1f3f5" />
                <PolarAngleAxis dataKey="subject" tick={{fontSize: 8}} />
                <Radar name="Count" dataKey="A" stroke="#056B3A" fill="#056B3A" fillOpacity={0.4} />
             </RadarChart>
           </ResponsiveContainer>
        </div>
      </div>

      <div className="card">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <h3 className="text-lg font-bold">Patient list ({filteredPatients.length})</h3>
          <div className="flex flex-wrap gap-2">
            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
              <SortAsc size={14} className="text-gray-400" />
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
              >
                <option value="name">Sort by Name</option>
                <option value="age">Sort by Age</option>
                <option value="recent">Recent Admission</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={filterGender} 
                onChange={(e) => setFilterGender(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
              >
                <option value="All Genders">All Genders</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
              </select>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
              <Filter size={14} className="text-gray-400" />
              <select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
              >
                <option value="All Status">All Status</option>
                <option value="Inpatient">Inpatient</option>
                <option value="Outpatient">Outpatient</option>
                <option value="Discharged">Discharged</option>
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
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Patient Name</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">ID Number</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Admission Date</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Age</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Status</th>
                <th className="pb-4 font-semibold text-gray-400 text-xs uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filteredPatients.map((patient) => (
                <tr 
                  key={patient.id} 
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group" 
                  onClick={() => navigate(`/patients/profile/${patient.id}`)}
                >
                  <td className="py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center">
                        <User2 size={16} />
                      </div>
                      <span className="font-bold text-sm text-gray-700">{patient.firstName} {patient.lastName}</span>
                    </div>
                  </td>
                  <td className="py-4 text-xs font-semibold text-gray-500">#{patient.id}</td>
                  <td className="py-4 text-xs font-semibold text-gray-500">{new Date().toLocaleDateString()}</td>
                  <td className="py-4 text-xs font-semibold text-gray-500">{patient.age} Years</td>
                  <td className="py-4">
                    <span className={`px-2 py-1 rounded-md text-[10px] font-bold ${
                      patient.status === 'Inpatient' ? 'bg-primary/10 text-primary' : 
                      patient.status === 'Emergency' ? 'bg-red-100 text-red-600' : 
                      'bg-green-100 text-green-600'
                    }`}>
                      {patient.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-4">
                    <div className="flex gap-2">
                      {['ADMIN', 'RECEPTIONIST', 'DOCTOR'].includes(userRole) && (
                        <button 
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/patients/edit/${patient.id}`);
                          }}
                          className="p-2 text-gray-400 hover:text-primary transition-colors"
                        >
                          <Plus size={16} className="rotate-45" /> {/* Using Plus rotated as a proxy for edit if Edit icon not available, but I'll check others */}
                        </button>
                      )}
                      {userRole === 'ADMIN' && (
                        <button 
                          onClick={(e) => handleDelete(e, patient.id)}
                          className="p-2 text-gray-400 hover:text-red-500 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredPatients.length === 0 && (
            <div className="py-12 text-center text-gray-500">
              No patients found matching your search.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const AgeStatCard = ({ type, count, change }) => (
    <div className="card group hover:border-primary/50 transition-all cursor-pointer">
        <div className="flex justify-between items-start mb-4">
            <div className={`p-2 rounded-lg bg-gray-50 group-hover:bg-primary/10 text-gray-400 group-hover:text-primary transition-colors`}>
                <User2 size={24} />
            </div>
            <button className="text-gray-300 group-hover:text-primary"><ChevronRight size={20} /></button>
        </div>
        <div className="flex flex-col gap-4">
            <div>
               <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">{type}</p>
               <h2 className="text-3xl font-bold">{count}</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-primary font-bold">
                <ArrowUpRight size={14} /> {change}
            </div>
            <div className="text-[10px] text-gray-400">from last month</div>
        </div>
    </div>
);

export default PatientList;
