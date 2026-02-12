import React, { useState, useEffect } from "react";
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  AreaChart, Area
} from "recharts";
import { Search, MoreVertical, Edit2, Mail, Phone, MapPin, Calendar, Clock, Download, FileText, Activity, User2 } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const bpData = [
    { name: "Jun", s: 120, d: 80 },
    { name: "Jul", s: 130, d: 85 },
    { name: "Aug", s: 115, d: 75 },
    { name: "Sep", s: 140, d: 90 },
    { name: "Oct", s: 125, d: 82 },
    { name: "Nov", s: 135, d: 88 },
    { name: "Dec", s: 132, d: 84 },
];

const PatientProfile = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [patient, setPatient] = useState(null);
    const [allPatients, setAllPatients] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [patientRes, allPatientsRes] = await Promise.all([
                    api.get(`/patients/${id}`),
                    api.get("/patients")
                ]);
                setPatient(patientRes.data);
                setAllPatients(allPatientsRes.data);
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, [id]);

    if (loading) {
        return <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">Loading patient profile...</div>;
    }

    if (!patient) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Patient Not Found</h2>
                <p className="text-gray-500 mb-6">The patient you are looking for doesn't exist in our records.</p>
                <Link to="/patients" className="text-primary font-bold hover:underline">Back to Patient List</Link>
            </div>
        );
    }

    const fullName = `${patient.firstName} ${patient.lastName}`;

    return (
        <div className="grid grid-cols-12 gap-6 pb-12">
            {/* Sidebar - Other Patients */}
            <div className="col-span-12 lg:col-span-3 card h-[calc(100vh-100px)] sticky top-6">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-bold">Other Patients</h3>
                    <Search size={18} className="text-gray-400" />
                </div>
                <div className="space-y-3 overflow-y-auto max-h-[calc(100%-60px)] pr-2">
                    {allPatients.map((p) => (
                        <Link 
                            key={p.id} 
                            to={"/patients/profile/" + p.id} 
                            className={"p-3 rounded-xl border flex gap-3 items-center transition-all " + (p.id.toString() === id ? "border-primary bg-primary/5 ring-1 ring-primary/20" : "border-gray-100 hover:border-primary/50")}
                        >
                            <div className="w-10 h-10 rounded-full bg-gray-100 overflow-hidden shrink-0">
                                <img src={"https://ui-avatars.com/api/?name=" + p.firstName + "+" + p.lastName + "&background=random"} alt="" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-bold truncate">{p.firstName} {p.lastName}</p>
                                <p className="text-[10px] text-gray-400 uppercase tracking-tighter">Patient #{p.id}</p>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Main Content */}
            <div className="col-span-12 lg:col-span-9 grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Basic Info */}
                <div className="card text-center relative flex flex-col items-center justify-center py-10">
                    <button 
                        onClick={() => navigate(`/patients/edit/${patient.id}`)}
                        className="absolute right-4 top-4 p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"
                    >
                        <Edit2 size={16} />
                    </button>
                    <div className="w-32 h-32 rounded-3xl mb-6 overflow-hidden shadow-xl border-4 border-white rotate-3 group-hover:rotate-0 transition-transform">
                        <img src={"https://ui-avatars.com/api/?name=" + fullName + "&background=056B3A&color=fff&size=128"} className="w-full h-full object-cover" alt="" />
                    </div>
                    <h2 className="text-2xl font-bold mb-1">{fullName}</h2>
                    <p className="text-xs text-primary font-bold uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full mb-8">{patient.type || 'General Patient'}</p>

                    <div className="grid grid-cols-2 gap-x-12 gap-y-6 text-left w-full max-w-sm">
                        <ProfileInfo label="Phone" value={patient.phone} icon={<Phone size={14} />} />
                        <ProfileInfo label="Email" value={patient.email} icon={<Mail size={14} />} />
                        <div className="col-span-2">
                           <ProfileInfo label="Address" value={patient.address || "No address provided"} icon={<MapPin size={14} />} />
                        </div>
                        <ProfileInfo label="Gender" value={patient.gender} icon={<User2 size={14} />} />
                        <ProfileInfo label="Age" value={patient.age + " Years"} icon={<Calendar size={14} />} />
                        <ProfileInfo label="Blood Group" value={patient.bloodGroup} icon={<Activity size={14} />} />
                        <ProfileInfo label="Status" value={patient.status} icon={<Clock size={14} />} />
                    </div>
                </div>

                {/* Health Vitals & Stats */}
                <div className="space-y-6">
                    <div className="card">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold flex items-center gap-2"><Activity className="text-primary" size={20}/> Health Vitals</h3>
                            <button className="p-2 hover:bg-gray-50 rounded-lg text-gray-400"><MoreVertical size={16}/></button>
                        </div>
                        <div className="grid grid-cols-3 gap-4 mb-8">
                            <MetricBox label="Pulse" value={patient.pulseRate} unit="bpm" color="bg-red-50 text-red-600" />
                            <MetricBox label="BP" value={patient.bloodPressure} unit="mmHg" color="bg-blue-50 text-blue-600" />
                            <MetricBox label="Oxygen" value={patient.bloodOxygen} unit="%" color="bg-green-50 text-green-600" />
                        </div>
                        <div className="h-48">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={bpData}>
                                    <defs>
                                        <linearGradient id="colorVitals" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#056B3A" stopOpacity={0.1}/>
                                            <stop offset="95%" stopColor="#056B3A" stopOpacity={0}/>
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f3f5" />
                                    <XAxis dataKey="name" axisLine={false} tickLine={false} style={{fontSize: 10}} />
                                    <Tooltip />
                                    <Area type="monotone" dataKey="s" stroke="#056B3A" strokeWidth={2} fillOpacity={1} fill="url(#colorVitals)" />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    <div className="card">
                        <h3 className="text-lg font-bold mb-6">Medical History</h3>
                        <div className="space-y-4 max-h-[300px] overflow-y-auto pr-2">
                            {patient.medicalRecords && patient.medicalRecords.length > 0 ? (
                                patient.medicalRecords.map((record) => (
                                    <div key={record.id} className="p-4 rounded-2xl border border-gray-100 flex gap-4 items-start hover:border-primary/50 transition-all cursor-pointer bg-white group">
                                        <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                            <FileText size={20} />
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-bold group-hover:text-primary transition-colors">{record.diagnosis}</p>
                                            <p className="text-[10px] text-gray-400 mb-2">{record.date}</p>
                                            <p className="text-[11px] text-gray-600 line-clamp-2">{record.prescription}</p>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-8">
                                    <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-3 text-gray-300">
                                        <FileText size={24} />
                                    </div>
                                    <p className="text-xs text-gray-400">No medical records available</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Recent Appointments */}
                <div className="card md:col-span-2">
                    <div className="flex justify-between items-center mb-8">
                        <h3 className="text-lg font-bold">Recent Appointments</h3>
                        <button className="text-primary text-xs font-bold hover:underline">Book New</button>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        {patient.appointments && patient.appointments.length > 0 ? (
                            patient.appointments.map((apt) => (
                                <div key={apt.id} className="p-4 rounded-2xl border border-gray-100 hover:border-primary/30 transition-all bg-gray-50/50">
                                    <div className="flex justify-between items-start mb-4">
                                        <div className="p-2 bg-white rounded-xl shadow-sm"><Calendar size={18} className="text-primary"/></div>
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                            apt.status === 'Completed' ? 'bg-green-100 text-green-600' : 'bg-primary/10 text-primary'
                                        }`}>{apt.status}</span>
                                    </div>
                                    <p className="text-xs font-bold text-gray-800 mb-1">{apt.doctorSpecialty}</p>
                                    <p className="text-[11px] text-gray-500 mb-3">with {apt.doctorName}</p>
                                    <p className="text-[10px] font-bold text-gray-400 flex items-center gap-1"><Clock size={12}/> {apt.date}</p>
                                </div>
                            ))
                        ) : (
                            <div className="col-span-3 py-12 text-center text-gray-400">
                                <p className="text-sm">No upcoming or recent appointments</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

const ProfileInfo = ({ label, value, icon }) => (
    <div className="flex gap-3 items-start">
        <div className="p-2 bg-gray-50 text-gray-400 rounded-lg shrink-0">{icon}</div>
        <div className="min-w-0">
            <p className="text-[10px] text-gray-400 font-bold mb-0.5 uppercase tracking-tight">{label}</p>
            <p className="text-sm font-bold text-gray-800 truncate">{value || 'N/A'}</p>
        </div>
    </div>
);

const MetricBox = ({ label, value, unit, color }) => (
    <div className={`${color} p-4 rounded-2xl flex flex-col items-center justify-center`}>
        <p className="text-[10px] uppercase font-bold opacity-70 mb-1">{label}</p>
        <p className="text-xl font-bold">{value || '--'}</p>
        <p className="text-[10px] font-medium opacity-70">{unit}</p>
    </div>
);

export default PatientProfile;
