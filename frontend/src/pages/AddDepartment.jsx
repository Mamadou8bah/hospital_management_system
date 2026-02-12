import React, { useState, useEffect } from "react";
import { ChevronLeft, Save, X, Heart, Brain, Baby, Activity, BriefcaseMedical } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";
import api from "../services/api";

const icons = [
  { name: 'Heart', component: <Heart size={20} /> },
  { name: 'Brain', component: <Brain size={20} /> },
  { name: 'Baby', component: <Baby size={20} /> },
  { name: 'Pulse', component: <Activity size={20} /> },
  { name: 'BriefcaseMedical', component: <BriefcaseMedical size={20} /> },
];

const AddDepartment = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    headOfDepartment: "",
    icon: "BriefcaseMedical",
  });

  useEffect(() => {
    if (id) {
      const fetchDepartment = async () => {
        try {
          const response = await api.get(`/departments/${id}`);
          setFormData({
            name: response.data.name,
            description: response.data.description,
            headOfDepartment: response.data.headOfDepartment,
            icon: response.data.icon || "BriefcaseMedical",
          });
        } catch (error) {
          console.error("Error fetching department:", error);
        }
      };
      fetchDepartment();
    }
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (id) {
        await api.put(`/departments/${id}`, formData);
      } else {
        await api.post("/departments", formData);
      }
      navigate("/departments");
    } catch (error) {
      console.error("Error saving department:", error);
      alert("Failed to save department");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link to="/departments" className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <ChevronLeft size={24} className="text-gray-600" />
          </Link>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">{id ? "Edit Department" : "Add New Department"}</h2>
            <p className="text-sm text-gray-500">{id ? "Update department details" : "Create a new specialized medical unit"}</p>
          </div>
        </div>
      </div>

      <div className="card">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Department Name</label>
              <input
                type="text"
                required
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="e.g. Cardiology"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Head of Department</label>
              <input
                type="text"
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all"
                placeholder="Dr. Name"
                value={formData.headOfDepartment}
                onChange={(e) => setFormData({ ...formData, headOfDepartment: e.target.value })}
              />
            </div>
            
            <div className="md:col-span-2 space-y-4">
              <label className="text-xs font-bold text-gray-400 uppercase">Select Icon</label>
              <div className="flex flex-wrap gap-4">
                {icons.map((ico) => (
                  <button
                    key={ico.name}
                    type="button"
                    onClick={() => setFormData({ ...formData, icon: ico.name })}
                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${
                      formData.icon === ico.name 
                        ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110" 
                        : "bg-gray-50 text-gray-400 hover:bg-gray-100"
                    }`}
                  >
                    {ico.component}
                  </button>
                ))}
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase">Description</label>
              <textarea
                className="w-full p-3 rounded-xl border border-gray-100 bg-gray-50 focus:bg-white focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all min-h-[120px]"
                placeholder="Enter department specialty description..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              ></textarea>
            </div>
          </div>

          <div className="flex gap-4 pt-4 border-t border-gray-50">
            <button
              type="button"
              onClick={() => navigate("/departments")}
              className="px-6 py-2.5 rounded-xl border border-gray-100 font-bold text-sm text-gray-500 hover:bg-gray-50 transition-all flex items-center gap-2"
            >
              <X size={18} /> Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-primary text-white font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all flex items-center gap-2 disabled:opacity-50"
            >
              <Save size={18} /> {loading ? "Saving..." : (id ? "Update Department" : "Save Department")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddDepartment;
