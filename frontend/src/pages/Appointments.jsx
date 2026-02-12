import React, { useState, useEffect, useMemo } from 'react';
import { Plus, FileText, Calendar as CalendarIcon, Clock, Search, ChevronRight, Download, Filter, SortAsc } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { exportToCSV } from '../services/exportUtils';

const Appointments = () => {
    const navigate = useNavigate();
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [loading, setLoading] = useState(true);
    const [filterStatus, setFilterStatus] = useState("All Status");
    const [filterType, setFilterType] = useState("All Types");
    const [sortBy, setSortBy] = useState("date_desc");

    useEffect(() => {
        fetchAppointments();
    }, []);

    const fetchAppointments = async () => {
        try {
            const response = await api.get('/appointments');
            setAppointments(response.data);
        } catch (error) {
            console.error("Error fetching appointments:", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredAppointments = useMemo(() => {
        let result = appointments.filter(apt => 
            apt.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.doctorName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            apt.id.toString().includes(searchTerm)
        );

        if (filterStatus !== "All Status") {
            result = result.filter(apt => apt.status === filterStatus);
        }

        if (filterType !== "All Types") {
            result = result.filter(apt => apt.visitType === filterType);
        }

        return result.sort((a, b) => {
            const dateA = new Date(a.appointmentDate);
            const dateB = new Date(b.appointmentDate);
            if (sortBy === "date_asc") return dateA - dateB;
            if (sortBy === "date_desc") return dateB - dateA;
            return 0;
        });
    }, [appointments, searchTerm, filterStatus, filterType, sortBy]);

    const handleExport = () => {
        const exportData = filteredAppointments.map(apt => ({
            'ID': apt.id,
            'Patient': apt.patientName,
            'Doctor': apt.doctorName,
            'Date': apt.date,
            'Time': apt.time,
            'Visit Type': apt.visitType,
            'Status': apt.status
        }));
        exportToCSV(exportData, 'appointment_list');
    };

    if (loading) return <div className="p-12 text-center text-primary font-bold">Loading records...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <FileText size={16} />
                        <span>Last Update: {new Date().toLocaleDateString()}</span>
                    </div>
                </div>
                <button 
                  onClick={() => navigate('/appointments/add')}
                  className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl border border-primary hover:bg-primary/90 transition-colors text-sm font-semibold shadow-primary/20"
                >
                    <Plus size={16} /> Book Appointment
                </button>
            </div>

            <div className="card">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                    <h3 className="text-lg font-bold">Upcoming Appointments ({filteredAppointments.length})</h3>
                    <div className="flex flex-wrap items-center gap-2">
                        <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
                            <SortAsc size={14} className="text-gray-400" />
                            <select 
                                value={sortBy} 
                                onChange={(e) => setSortBy(e.target.value)}
                                className="bg-transparent outline-none border-none cursor-pointer"
                            >
                                <option value="date_desc">Newest First</option>
                                <option value="date_asc">Oldest First</option>
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
                                <option value="PENDING">Pending</option>
                                <option value="COMPLETED">Completed</option>
                                <option value="CANCELLED">Cancelled</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
                            <Filter size={14} className="text-gray-400" />
                            <select 
                                value={filterType} 
                                onChange={(e) => setFilterType(e.target.value)}
                                className="bg-transparent outline-none border-none cursor-pointer"
                            >
                                <option value="All Types">All Types</option>
                                <option value="CONSULTATION">Consultation</option>
                                <option value="FOLLOW_UP">Follow-up</option>
                                <option value="EMERGENCY">Emergency</option>
                            </select>
                        </div>

                        <button 
                            onClick={handleExport}
                            className="flex items-center gap-2 px-3 py-1.5 border border-gray-100 rounded-lg text-xs font-semibold hover:bg-gray-50 transition-all ml-auto md:ml-0"
                        >
                            <Download size={14} className="text-gray-400" /> Export
                        </button>
                        <div className="relative">
                            <input 
                                type="text" 
                                placeholder="Search appointments..." 
                                className="pl-9 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-xs focus:bg-white focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <Search size={14} className="absolute left-3 top-2.5 text-gray-400" />
                        </div>
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="text-[10px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-50">
                                <th className="pb-4 font-bold">Patient</th>
                                <th className="pb-4 font-bold">Doctor</th>
                                <th className="pb-4 font-bold">Date & Time</th>
                                <th className="pb-4 font-bold">Visit Type</th>
                                <th className="pb-4 font-bold">Status</th>
                                <th className="pb-4 font-bold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {filteredAppointments.map((apt) => (
                                <tr key={apt.id} className="group hover:bg-gray-50/50 transition-colors">
                                    <td className="py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={`https://ui-avatars.com/api/?name=${apt.patientName}&background=random`} className="w-8 h-8 rounded-full" alt="" />
                                            <span className="text-xs font-bold">{apt.patientName}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs font-semibold text-gray-600">{apt.doctorName}</span>
                                            <span className="text-[10px] text-gray-400 uppercase font-bold tracking-tighter">{apt.doctorSpecialty}</span>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <div className="space-y-1">
                                            <div className="flex items-center gap-1.5 text-xs font-bold text-gray-700">
                                                <CalendarIcon size={12} className="text-primary" /> {new Date(apt.appointmentDate).toLocaleDateString()}
                                            </div>
                                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold">
                                                <Clock size={12} /> {new Date(apt.appointmentDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4">
                                        <span className="px-2 py-1 rounded-lg bg-gray-100 text-[10px] font-bold text-gray-500">{apt.visitType}</span>
                                    </td>
                                    <td className="py-4">
                                        <span className={`px-2 py-1 rounded-lg text-[10px] font-bold ${
                                            apt.status === 'COMPLETED' ? 'bg-primary/20 text-primary' : 
                                            apt.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                                        }`}>
                                            {apt.status}
                                        </span>
                                    </td>
                                    <td className="py-4 text-right">
                                        <button 
                                            onClick={() => navigate(`/appointments/details/${apt.id}`)}
                                            className="p-2 hover:bg-primary/5 text-gray-400 hover:text-primary rounded-lg transition-all"
                                        >
                                            <ChevronRight size={18} />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {appointments.length === 0 && (
                        <div className="py-12 text-center">
                            <p className="text-sm text-gray-400 font-medium">No appointments found.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Appointments;
