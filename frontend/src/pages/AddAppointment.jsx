import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, X, Calendar, Clock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AddAppointment = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [doctors, setDoctors] = useState([]);
  const [loading, setLoading] = useState(true);

  const [formData, setFormData] = useState({
    patientId: "",
    doctorId: "",
    reason: "",
    date: "",
    time: "",
    visitType: "Consultation",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [patientsRes, doctorsRes] = await Promise.all([
        api.get("/patients"),
        api.get("/doctors")
      ]);
      setPatients(patientsRes.data);
      setDoctors(doctorsRes.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const appointmentDate = new Date(`${formData.date}T${formData.time}`);
      await api.post('/appointments', {
        patientId: parseInt(formData.patientId),
        doctorId: parseInt(formData.doctorId),
        reason: formData.reason,
        visitType: formData.visitType,
        appointmentDate: appointmentDate.toISOString()
      });
      navigate("/appointments");
    } catch (error) {
      console.error("Error booking appointment:", error);
      alert("Failed to book appointment");
    }
  };

  if (loading) return <div className="p-12 text-center text-primary font-bold">Loading form data...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/appointments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Book Appointment</h2>
            <p className="text-sm text-gray-500">Schedule a new visit for a patient</p>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Patient</label>
              <select
                required
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                value={formData.patientId}
                onChange={(e) => setFormData({ ...formData, patientId: e.target.value })}
              >
                <option value="">Select Patient</option>
                {patients.map(p => (
                  <option key={p.id} value={p.id}>{p.firstName} {p.lastName}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Doctor</label>
              <select
                required
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                value={formData.doctorId}
                onChange={(e) => setFormData({ ...formData, doctorId: e.target.value })}
              >
                <option value="">Select Doctor</option>
                {doctors.map(d => (
                  <option key={d.id} value={d.id}>{d.firstName} {d.lastName} ({d.specialty})</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Appointment Date</label>
              <div className="relative">
                <input
                  type="date"
                  required
                  className="w-full p-3 pl-10 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.date}
                  onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                />
                <Calendar size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Preferred Time</label>
              <div className="relative">
                <input
                  type="time"
                  required
                  className="w-full p-3 pl-10 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                  value={formData.time}
                  onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                />
                <Clock size={18} className="absolute left-3 top-3.5 text-gray-400" />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Visit Type</label>
              <select
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                value={formData.visitType}
                onChange={(e) => setFormData({ ...formData, visitType: e.target.value })}
              >
                <option value="Consultation">Consultation</option>
                <option value="Follow-up">Follow-up</option>
                <option value="Surgery">Surgery</option>
                <option value="Emergency">Emergency</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Reason for Visit</label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all font-bold text-sm"
                placeholder="e.g. Chest pain, Routine checkup"
                value={formData.reason}
                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => navigate("/appointments")}
              className="px-6 py-2.5 rounded-xl border border-gray-100 font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2"
            >
              <Save size={18} /> Book Appointment
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAppointment;
