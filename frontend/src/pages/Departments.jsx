import React, { useState, useEffect } from 'react';
import { Plus, MoreVertical, FileText, Heart, Brain, Baby, PlusSquare, BriefcaseMedical, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { exportToCSV } from '../services/exportUtils';

const Departments = () => {
    const navigate = useNavigate();
    const [departments, setDepartments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await api.get('/departments');
                setDepartments(response.data);
            } catch (error) {
                console.error("Error fetching departments:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchDepartments();
    }, []);

    const handleExport = () => {
        const exportData = departments.map(dept => ({
            'Name': dept.name,
            'Head': dept.headOfDepartment,
            'Doctors': dept.doctorCount,
            'Patients': dept.patientCount,
            'Status': dept.status
        }));
        exportToCSV(exportData, 'department_list');
    };

    const getIcon = (name) => {
        switch(name) {
            case 'Cardiology': return <Heart />;
            case 'Neurology': return <Brain />;
            case 'Pediatrics': return <Baby />;
            case 'Emergency': return <PlusSquare />;
            default: return <BriefcaseMedical />;
        }
    };

    const getColor = (name) => {
        switch(name) {
            case 'Cardiology': return { color: '#DCFCE7', text: '#15803d' };
            case 'Neurology': return { color: '#E0F2FE', text: '#0369a1' };
            case 'Emergency': return { color: '#FEFCE8', text: '#a16207' };
            default: return { color: '#F8FAFC', text: '#475569' };
        }
    };

    if (loading) return <div className="p-12 text-center text-primary font-bold">Loading departments...</div>;

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                    <FileText size={16} />
                    <span>Total Departments: {departments.length}</span>
                </div>
                <div className="flex gap-2">
                    <button 
                      onClick={handleExport}
                      className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-sm font-semibold"
                    >
                        <Download size={16} /> Export
                    </button>
                    <button 
                      onClick={() => navigate('/departments/add')}
                      className="bg-primary text-white flex items-center gap-2 px-4 py-2 rounded-xl border border-primary hover:bg-primary/90 transition-colors text-sm font-semibold shadow-primary/20"
                    >
                        <Plus size={16} /> Add Department
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {departments.map((dept) => {
                    const styling = getColor(dept.name);
                    return (
                        <div key={dept.id} className="card group hover:border-primary/50 transition-all cursor-pointer" onClick={() => navigate(`/departments/details/${dept.id}`)}>
                            <div className="flex justify-between items-start mb-6">
                                <div className="w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform" style={{ backgroundColor: styling.color, color: styling.text }}>
                                    {getIcon(dept.name) && React.cloneElement(getIcon(dept.name), { size: 24 })}
                                </div>
                                <button className="text-gray-300 hover:text-gray-600"><MoreVertical size={20}/></button>
                            </div>
                            <h4 className="text-sm font-bold mb-2 group-hover:text-primary transition-colors">{dept.name}</h4>
                            <p className="text-xs text-gray-400 mb-6 line-clamp-2 leading-relaxed">{dept.description}</p>
                            
                            <div className="flex justify-between items-center pt-4 border-t border-gray-50">
                                <div className="flex -space-x-2">
                                    {(dept.doctors || []).slice(0, 3).map((doc, idx) => (
                                        <div key={idx} className="w-6 h-6 rounded-full border-2 border-white bg-gray-200 overflow-hidden">
                                            <img src={`https://ui-avatars.com/api/?name=${doc.name}&background=056B3A&color=fff`} alt="" />
                                        </div>
                                    ))}
                                    <div className="w-6 h-6 rounded-full border-2 border-white bg-primary/10 text-primary text-[8px] font-bold flex items-center justify-center">
                                        +{dept.doctorCount}
                                    </div>
                                </div>
                                <button className="text-[10px] font-bold text-gray-400 hover:text-primary transition-colors">See Details</button>
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default Departments;
