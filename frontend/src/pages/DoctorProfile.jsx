import React, { useMemo, useState, useEffect } from "react";
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from "recharts";
import { Search, MoreVertical, Edit2, Mail, Phone, MapPin, Calendar, Clock, ChevronLeft, ChevronRight, CheckCircle2, FileText, Globe, Download, Loader2, Save, X } from "lucide-react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../services/api";
import { toast } from "react-hot-toast";

const patientOverviewData = [
  { name: "Sat", old: 10, new: 5 },
  { name: "Sun", old: 15, new: 8 },
  { name: "Mon", old: 45, new: 30 },
  { name: "Tue", old: 20, new: 10 },
  { name: "Wed", old: 25, new: 15 },
  { name: "Thu", old: 22, new: 12 },
  { name: "Fri", old: 18, new: 9 },
];

const ScheduleItem = ({ time, name, issue, id, onClick }) => (
  <div className="flex gap-4 items-center group" onClick={onClick}>
    <div className="text-[10px] font-bold text-gray-400 w-16">{time}</div>
    <div className="flex-1 flex items-center justify-between p-3 rounded-2xl bg-gray-50 border border-transparent group-hover:border-primary/20 group-hover:bg-white transition-all cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 overflow-hidden">
          <img src={`https://ui-avatars.com/api/?name=${name}&background=random`} alt="" />
        </div>
        <div>
          <p className="text-xs font-bold">{name}</p>
          <p className="text-[10px] text-gray-400">{issue}</p>
        </div>
      </div>
      <div className="text-gray-300 group-hover:text-primary"><Clock size={16} /></div>
    </div>
  </div>
);

const InfoBox = ({ icon, title, value, className = "" }) => (
  <div className={`p-4 bg-gray-50 rounded-2xl flex gap-3 items-center ${className}`}>
    <div className="text-gray-400 bg-white p-2 rounded-lg shadow-sm">{icon}</div>
    <div>
      <p className="text-[10px] text-gray-400 font-bold uppercase">{title}</p>
      <p className="text-xs font-bold text-gray-700">{value}</p>
    </div>
  </div>
);

const DoctorProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [doctor, setDoctor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});
  
  const fetchDoctor = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/doctors/${id}`);
      setDoctor(response.data);
      setEditForm({
        specialty: response.data.specialty,
        phone: response.data.phone || "",
        about: response.data.about || "",
        isAvailable: response.data.isAvailable,
        departmentName: response.data.departmentName
      });
    } catch (error) {
      console.error("Error fetching doctor:", error);
      toast.error("Could not load doctor details");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDoctor();
  }, [id]);

  const handleUpdate = async () => {
    try {
      await api.put(`/doctors/${id}`, editForm);
      toast.success("Profile updated");
      setIsEditing(false);
      fetchDoctor();
    } catch (error) {
      toast.error("Failed to update profile");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="animate-spin text-primary" size={40} />
      </div>
    );
  }

  if (!doctor) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Doctor Not Found</h2>
        <p className="text-gray-500 mb-6">The doctor you are looking for doesn`t exist in our records.</p>
        <Link to="/doctors" className="text-primary font-bold hover:underline">Back to Doctor List</Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-12 gap-6">
      {/* Profile Details Middle Column */}
      <div className="col-span-12 lg:col-span-12 flex flex-col gap-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Main Card */}
          <div className="md:col-span-1 card text-center relative">
            <div className="absolute right-4 top-4 flex gap-2">
              {isEditing ? (
                <>
                  <button onClick={handleUpdate} className="p-2 rounded-lg bg-primary text-white hover:bg-primary/90"><Save size={16} /></button>
                  <button onClick={() => setIsEditing(false)} className="p-2 rounded-lg bg-gray-100 text-gray-600 hover:bg-gray-200"><X size={16} /></button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"><Edit2 size={16} /></button>
              )}
            </div>
            
            <div className="group relative w-24 h-24 rounded-2xl mx-auto mb-4 overflow-hidden shadow-lg border-4 border-white">
               <img 
                 src={`https://ui-avatars.com/api/?name=${doctor.firstName}+${doctor.lastName}&background=056B3A&color=fff`} 
                 className="w-full h-full object-cover" 
                 alt="" 
               />
            </div>
            
            <h2 className="text-xl font-bold mb-1">{doctor.firstName} {doctor.lastName}</h2>
            {isEditing ? (
              <input 
                className="text-xs text-center border-b border-primary/20 bg-transparent mb-8 uppercase tracking-wider font-semibold w-full focus:outline-none"
                value={editForm.specialty}
                onChange={(e) => setEditForm({...editForm, specialty: e.target.value})}
              />
            ) : (
              <p className="text-xs text-gray-400 mb-8 uppercase tracking-wider font-semibold">{doctor.specialty}</p>
            )}
            
            <div className="space-y-4 text-left border-t border-gray-50 pt-8 mt-4">
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Phone size={16} /></div>
                <div className="flex-1">
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Phone Number</p>
                  {isEditing ? (
                    <input 
                      type="text"
                      className="text-sm font-semibold text-gray-700 w-full bg-transparent border-b border-gray-100 focus:border-primary focus:outline-none"
                      value={editForm.phone}
                      onChange={(e) => setEditForm({...editForm, phone: e.target.value})}
                    />
                  ) : (
                    <p className="text-sm font-semibold text-gray-700">{doctor.phone || "Not set"}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><Mail size={16} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Email Address</p>
                  <p className="text-sm font-semibold text-gray-700">{doctor.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400"><MapPin size={16} /></div>
                <div>
                  <p className="text-[10px] text-gray-400 font-bold uppercase">Department</p>
                  <p className="text-sm font-semibold text-gray-700">{doctor.departmentName}</p>
                </div>
              </div>
            </div>
            <div className="flex gap-4 mt-8">
              <button 
                onClick={() => window.location.href = `mailto:${doctor.email}`}
                className="w-full py-3 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/95 transition-colors shadow-lg shadow-primary/20"
              >
                Send Direct Email
              </button>
            </div>
          </div>

          {/* About & Stats */}
          <div className="md:col-span-2 flex flex-col gap-6">
            <div className="card">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">About {doctor.firstName}</h3>
                <div className="flex gap-2">
                   <div className={`px-3 py-1 rounded-full text-[10px] font-bold ${doctor.isAvailable ? "bg-green-100 text-green-600" : "bg-red-100 text-red-600"}`}>
                     {doctor.isAvailable ? "AVAILABLE" : "ON LEAVE"}
                   </div>
                </div>
              </div>
              
              {isEditing ? (
                <textarea 
                  className="text-xs text-gray-500 leading-relaxed mb-6 w-full h-32 p-3 bg-gray-50 rounded-xl border border-gray-100 focus:border-primary focus:outline-none"
                  value={editForm.about}
                  onChange={(e) => setEditForm({...editForm, about: e.target.value})}
                />
              ) : (
                <p className="text-xs text-gray-500 leading-relaxed mb-6">
                  {doctor.about || "No information available."}
                </p>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <InfoBox icon={<CheckCircle2 size={16} />} title="Primary Specialist" value={doctor.specialty} />
                <div className="p-4 bg-gray-50 rounded-2xl flex gap-3 items-center">
                  <div className="text-gray-400 bg-white p-2 rounded-lg shadow-sm font-bold text-xs">{doctor.rating}</div>
                  <div>
                    <p className="text-[10px] text-gray-400 font-bold uppercase">Doctor Rating</p>
                    <p className="text-xs font-bold text-gray-700">Satisfied Clients</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="card flex-1">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold">Recent Appointments</h3>
                <button 
                  onClick={() => navigate("/appointments")}
                  className="text-xs font-bold text-primary hover:underline"
                >
                  View All
                </button>
              </div>
              <div className="space-y-4">
                 {doctor.recentAppointments && doctor.recentAppointments.length > 0 ? doctor.recentAppointments.map((apt) => (
                    <div key={apt.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-[10px]">
                          {apt.patientName.split(" ").map(n => n[0]).join("")}
                        </div>
                        <div>
                          <p className="text-xs font-bold">{apt.patientName}</p>
                          <p className="text-[10px] text-gray-400">{apt.date}</p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 rounded-lg text-[8px] font-bold uppercase ${
                        apt.status === "COMPLETED" ? "bg-green-100 text-green-600" : "bg-orange-100 text-orange-600"
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                 )) : (
                    <p className="text-xs text-gray-400 text-center py-4">No recent appointments.</p>
                 )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
