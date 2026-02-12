import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { ChevronLeft, MoreVertical, Edit2, Users, User, Clock, MapPin, Activity, Trash2 } from "lucide-react";
import api from "../services/api";

const DepartmentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [department, setDepartment] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDepartment = async () => {
      try {
        const response = await api.get(`/departments/${id}`);
        setDepartment(response.data);
      } catch (error) {
        console.error("Error fetching department details:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDepartment();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this department?")) {
      try {
        await api.delete(`/departments/${id}`);
        navigate("/departments");
      } catch (error) {
        console.error("Error deleting department:", error);
        alert("Failed to delete department");
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-primary font-bold">Loading department details...</div>;

  if (!department) {
    return (
      <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">
        <h2 className="text-xl font-bold text-gray-800 mb-2">Department Not Found</h2>
        <p className="text-gray-500 mb-6">The department you are looking for doesn't exist.</p>
        <Link to="/departments" className="text-primary font-bold hover:underline">Back to Departments</Link>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/departments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{department.name}</h2>
            <p className="text-sm text-gray-500">Department Overview & Staff</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button 
            onClick={handleDelete}
            className="p-2 rounded-lg border border-red-100 text-red-400 hover:bg-red-50 transition-colors"
            title="Delete Department"
          >
            <Trash2 size={20}/>
          </button>
          <button className="p-2 rounded-lg border border-gray-100 text-gray-400 hover:bg-gray-50"><MoreVertical size={20}/></button>
        </div>
      </div>

      <div className="grid grid-cols-12 gap-6">
        <div className="col-span-12 lg:col-span-8 space-y-6">
          <div className="card">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold">About Department</h3>
              <button 
                onClick={() => navigate(`/departments/edit/${id}`)}
                className="text-primary hover:bg-primary/5 p-2 rounded-lg transition-colors"
              >
                <Edit2 size={18} />
              </button>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              {department.description || "No detailed description available for this department."}
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Head of Department</p>
                <div className="flex items-center gap-2">
                  <User size={16} className="text-primary" />
                  <p className="text-sm font-bold">{department.headOfDepartment || "Not Assigned"}</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Total Specialists</p>
                <div className="flex items-center gap-2">
                  <Users size={16} className="text-primary" />
                  <p className="text-sm font-bold">{department.doctorCount} Doctors</p>
                </div>
              </div>
              <div className="p-4 bg-gray-50 rounded-2xl">
                <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Active Patients</p>
                <div className="flex items-center gap-2">
                  <Activity size={16} className="text-primary" />
                  <p className="text-sm font-bold">{department.patientCount} Patients</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h3 className="text-lg font-bold mb-6">Specialists in {department.name}</h3>
            <div className="space-y-4">
              {(department.doctors || []).length > 0 ? department.doctors.map((doc) => (
                <div key={doc.id} className="flex items-center justify-between p-4 rounded-2xl border border-gray-50 hover:border-primary/20 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=056B3A&color=fff`} className="w-12 h-12 rounded-full" alt="" />
                    <div>
                      <h4 className="text-sm font-bold">{doc.name}</h4>
                      <p className="text-[10px] text-gray-400">{doc.specialty}</p>
                    </div>
                  </div>
                  <Link to={`/doctors/profile/${doc.id}`} className="text-xs font-bold text-primary hover:underline">View Profile</Link>
                </div>
              )) : (
                <p className="text-sm text-gray-400 py-4 text-center">No specialists assigned to this department yet.</p>
              )}
            </div>
          </div>
        </div>

        <div className="col-span-12 lg:col-span-4 space-y-6">
          <div className="card">
            <h3 className="text-lg font-bold mb-6">Emergency Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center gap-4 p-4 bg-red-50 rounded-2xl text-red-600">
                <Clock size={24} />
                <div>
                  <p className="text-xs font-bold uppercase">Emergency 24/7</p>
                  <p className="text-lg font-bold">+(555) 000-911</p>
                </div>
              </div>
              <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                <MapPin size={24} className="text-gray-400" />
                <div>
                  <p className="text-xs font-bold uppercase">Location</p>
                  <p className="text-sm font-semibold">Wing A, 2nd Floor</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DepartmentDetails;
