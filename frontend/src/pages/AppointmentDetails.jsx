import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical, Edit2, Calendar, Clock, User, Activity, CheckCircle2, XCircle } from "lucide-react";
import api from "../services/api";
import toast from "react-hot-toast";

const AppointmentDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAppointment();
    }, [id]);

    const fetchAppointment = async () => {
        try {
            const response = await api.get(`/appointments/${id}`);
            setAppointment(response.data);
        } catch (error) {
            console.error("Error fetching appointment:", error);
            toast.error("Failed to load appointment details");
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <div className="p-12 text-center text-primary font-bold">Loading appointment details...</div>;

    if (!appointment) {
        return (
            <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
                <h2 className="text-xl font-bold text-gray-800 mb-2">Appointment Not Found</h2>
                <p className="text-gray-500 mb-6">The appointment details you are looking for are not available.</p>
                <Link to="/appointments" className="text-primary font-bold hover:underline">Back to Appointments</Link>
            </div>
        );
    }

    const handleStatusUpdate = async (status) => {
        try {
            await api.patch(`/appointments/${appointment.id}/status?status=${status}`);
            toast.success(`Appointment marked as ${status.toLowerCase()}`);
            fetchAppointment();
        } catch (error) {
            console.error("Error updating status:", error);
            toast.error("Failed to update status");
        }
    };

    const aptDate = new Date(appointment.appointmentDate);

    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button onClick={() => navigate(-1)} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
                        <ChevronLeft size={24} className="text-gray-600" />
                    </button>
                    <div>
                        <h2 className="text-2xl font-bold text-gray-800">Appointment Details</h2>
                        <p className="text-sm text-gray-500">View and manage appointment information</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <button className="px-4 py-2 rounded-xl border border-gray-100 font-bold text-sm text-gray-500 hover:bg-gray-50 flex items-center gap-2">
                        <Edit2 size={16} /> Edit
                    </button>
                    <button className="p-2 rounded-xl border border-gray-100 text-gray-400 hover:bg-gray-50"><MoreVertical size={20}/></button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 pb-12">
                <div className="md:col-span-8 space-y-6">
                    <div className="card">
                        <div className="flex justify-between items-start mb-8">
                            <div>
                                <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase ${
                                    appointment.status === 'COMPLETED' ? 'bg-primary/20 text-primary' : 
                                    appointment.status === 'CANCELLED' ? 'bg-red-100 text-red-600' : 'bg-primary/10 text-primary'
                                }`}>
                                    {appointment.status}
                                </span>
                                <h3 className="text-xl font-bold mt-3">{appointment.visitType}</h3>
                                <p className="text-sm text-gray-400 mt-1">{appointment.reason || "Common consultation and checkup"}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-[10px] text-gray-400 font-bold uppercase">Ticket ID</p>
                                <p className="text-sm font-bold text-gray-700">#APT-{appointment.id.toString().padStart(4, '0')}</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-8 py-6 border-y border-gray-50">
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                                    <Calendar size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Date</p>
                                    <p className="text-sm font-bold text-gray-700">{aptDate.toLocaleDateString()}</p>
                                </div>
                            </div>
                            <div className="flex gap-4 items-center">
                                <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-primary">
                                    <Clock size={20} />
                                </div>
                                <div>
                                    <p className="text-[10px] text-gray-400 font-bold uppercase">Time Slot</p>
                                    <p className="text-sm font-bold text-gray-700">{aptDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                                </div>
                            </div>
                        </div>

                        <div className="pt-8 space-y-4">
                            <h4 className="text-sm font-bold">Actions</h4>
                            <div className="flex gap-4">
                                <button 
                                    onClick={() => handleStatusUpdate('COMPLETED')}
                                    disabled={appointment.status !== 'BOOKED'}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <CheckCircle2 size={18} /> Mark as Completed
                                </button>
                                <button 
                                    onClick={() => handleStatusUpdate('CANCELLED')}
                                    disabled={appointment.status !== 'BOOKED'}
                                    className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-red-50 text-red-500 font-bold text-sm hover:bg-red-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <XCircle size={18} /> Cancel Appointment
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="md:col-span-4 space-y-6">
                    {/* Patient Card */}
                    <div className="card">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Patient Info</h4>
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 rounded-2xl bg-gray-50 border border-gray-100 overflow-hidden mb-4">
                                <img src={`https://ui-avatars.com/api/?name=${appointment.patientName}&background=random`} className="w-full h-full object-cover" alt="" />
                            </div>
                            <h5 className="font-bold text-gray-800">{appointment.patientName}</h5>
                            <p className="text-[10px] text-gray-400 font-bold uppercase mb-6">ID: #{appointment.patientId}</p>
                            
                            <Link to={`/patients/profile/${appointment.patientId}`} className="w-full py-2.5 rounded-xl border border-gray-100 text-center font-bold text-xs text-gray-600 hover:bg-gray-50 transition-all flex items-center justify-center gap-2">
                                <User size={14}/> View Full Profile
                            </Link>
                        </div>
                    </div>

                    {/* Doctor Card */}
                    <div className="card">
                        <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-6">Attending Doctor</h4>
                        <div className="flex items-center gap-4 mb-6">
                            <img src={`https://ui-avatars.com/api/?name=${appointment.doctorName}&background=056B3A&color=fff`} className="w-12 h-12 rounded-xl object-cover" alt="" />
                            <div>
                                <h5 className="text-sm font-bold text-gray-800">{appointment.doctorName}</h5>
                                <p className="text-[10px] text-primary font-bold uppercase">{appointment.doctorSpecialty}</p>
                            </div>
                        </div>
                        <button 
                            onClick={() => navigate(`/doctors/profile/${appointment.doctorId}`)}
                            className="w-full py-2.5 rounded-xl bg-gray-50 text-center font-bold text-xs text-gray-400 hover:bg-gray-100 transition-all flex items-center justify-center gap-2"
                        >
                            <Activity size={14}/> Doctor Details
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AppointmentDetails;