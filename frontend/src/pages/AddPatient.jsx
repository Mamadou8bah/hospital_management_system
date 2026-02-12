import React, { useState, useEffect } from 'react';
import { Camera, Mail, Phone, MapPin, X, User, Heart, Scale, Ruler, Activity } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../services/api';
import toast from 'react-hot-toast';

const AddPatient = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    type: 'General Checkup',
    phone: '',
    address: '',
    email: '',
    gender: 'Male',
    bloodGroup: 'O+',
    age: '',
    weight: '',
    height: '',
    pulseRate: 75,
    bloodPressure: '120/80',
    bloodOxygen: 98,
    status: 'Outpatient'
  });

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (id) {
      const fetchPatient = async () => {
        setLoading(true);
        try {
          const res = await api.get(`/patients/${id}`);
          setFormData(res.data);
        } catch (error) {
          console.error('Error fetching patient:', error);
          toast.error('Failed to load patient data');
        } finally {
          setLoading(false);
        }
      };
      fetchPatient();
    }
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.lastName || !formData.email) {
      toast.error('Please fill in required fields (First Name, Last Name, Email)');
      return;
    }
    try {
      if (id) {
        await api.put(`/patients/${id}`, formData);
        toast.success('Patient updated successfully');
      } else {
        await api.post('/patients', formData);
        toast.success('Patient registered successfully');
      }
      navigate('/patients');
    } catch (error) {
      console.error('Error saving patient:', error);
      toast.error(id ? 'Error updating patient' : 'Error registering patient');
    }
  };

  if (loading) {
    return <div className="p-12 text-center bg-white rounded-2xl border border-dashed border-gray-200">Loading patient data...</div>;
  }

  return (
    <div className="max-w-2xl mx-auto pb-12">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">{id ? 'Edit Patient Information' : 'Register New Patient'}</h2>
        <button onClick={() => navigate(-1)} className="p-2 hover:bg-white rounded-lg transition-colors"><X/></button>
      </div>

      <form onSubmit={handleSubmit} className="card space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <InputGroup label="First Name" name="firstName" value={formData.firstName} onChange={handleChange} placeholder="Enter First Name" />
          <InputGroup label="Last Name" name="lastName" value={formData.lastName} onChange={handleChange} placeholder="Enter Last Name" />
          
          <InputGroup label="Gender" name="gender" value={formData.gender} onChange={handleChange} isSelect options={['Male', 'Female', 'Other']} />
          <InputGroup label="Blood Group" name="bloodGroup" value={formData.bloodGroup} onChange={handleChange} isSelect options={['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']} icon={<Heart size={16}/>} />

          <InputGroup label="Email" name="email" value={formData.email} onChange={handleChange} placeholder="Enter email" icon={<Mail size={16}/>} />
          <InputGroup label="Phone" name="phone" value={formData.phone} onChange={handleChange} placeholder="Enter phone" icon={<Phone size={16}/>} />
          
          <div className="md:col-span-2">
            <InputGroup label="Address" name="address" value={formData.address} onChange={handleChange} placeholder="Full Address" icon={<MapPin size={16}/>} />
          </div>
          
          <InputGroup label="Age" name="age" value={formData.age} onChange={handleChange} placeholder="Years" />
          <InputGroup label="Status" name="status" value={formData.status} onChange={handleChange} isSelect options={['Outpatient', 'Inpatient', 'Emergency']} />
          
          <InputGroup label="Weight (kg)" name="weight" value={formData.weight} onChange={handleChange} placeholder="Weight" icon={<Scale size={16}/>} />
          <InputGroup label="Height (cm)" name="height" value={formData.height} onChange={handleChange} placeholder="Height" icon={<Ruler size={16}/>} />
          
          {/* Medical Vitals */}
          <div className="md:col-span-2 pt-4 border-t border-gray-50">
            <h4 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2"><Activity size={16}/> Medical Vitals</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <InputGroup label="Pulse Rate (bpm)" name="pulseRate" value={formData.pulseRate} onChange={handleChange} placeholder="Pulse" />
               <InputGroup label="Blood Pressure" name="bloodPressure" value={formData.bloodPressure} onChange={handleChange} placeholder="120/80" />
               <InputGroup label="Blood Oxygen (%)" name="bloodOxygen" value={formData.bloodOxygen} onChange={handleChange} placeholder="98" />
            </div>
          </div>

          <div className="md:col-span-2 pt-4 border-t border-gray-50">
            <InputGroup label="Initial Diagnosis / Reason" name="type" value={formData.type} onChange={handleChange} placeholder="e.g. Fever, Consultation" />
          </div>
        </div>

        <div className="flex gap-4 pt-4">
          <button type="button" onClick={() => navigate(-1)} className="flex-1 py-3 border rounded-xl font-bold text-sm hover:bg-gray-50 transition-colors">Cancel</button>
          <button type="submit" className="flex-1 py-3 bg-primary text-white rounded-xl font-bold text-sm hover:bg-primary/90 shadow-lg shadow-primary/20 transition-all">
            {id ? 'Update Patient' : 'Register Patient'}
          </button>
        </div>
      </form>
    </div>
  );
};

const InputGroup = ({ label, name, value, onChange, placeholder, isSelect, options, icon }) => (
  <div className="space-y-2">
    <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider">{label}</label>
    <div className="relative">
      {icon && <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">{icon}</div>}
      {isSelect ? (
        <select 
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 text-sm outline-none transition-all appearance-none cursor-pointer"
        >
          {options.map(opt => <option key={opt} value={opt}>{opt}</option>)}
        </select>
      ) : (
        <input 
          type="text"
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          className={`w-full ${icon ? 'pl-11' : 'px-4'} py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-primary/50 text-sm outline-none transition-all`}
        />
      )}
    </div>
  </div>
);

export default AddPatient;