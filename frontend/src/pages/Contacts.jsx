import React, { useState, useEffect, useMemo } from 'react';
import { Search, Phone, Mail, MapPin, Globe, MoreVertical, Plus, User2, Building2, Trash2, Download, Filter, SortAsc } from 'lucide-react';
import api from '../services/api';
import { toast } from 'react-hot-toast';
import { exportToCSV } from '../services/exportUtils';
import { useNavigate } from 'react-router-dom';

const Contacts = () => {
  const navigate = useNavigate();
  const userRole = localStorage.getItem('role');
  const [searchTerm, setSearchTerm] = useState('');
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterType, setFilterType] = useState("All Types");
  const [sortBy, setSortBy] = useState("name");

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const response = await api.get('/contacts');
      setContacts(response.data);
    } catch (error) {
      console.error("Error fetching contacts:", error);
      toast.error("Failed to load contacts");
    } finally {
      setLoading(false);
    }
  };

  const filteredContacts = useMemo(() => {
    let result = contacts.filter(contact =>
      contact.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      contact.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filterType !== "All Types") {
      result = result.filter(c => c.type === filterType);
    }

    return result.sort((a, b) => {
      if (sortBy === "name") return a.name.localeCompare(b.name);
      if (sortBy === "role") return a.role.localeCompare(b.role);
      return 0;
    });
  }, [contacts, searchTerm, filterType, sortBy]);

  const handleExport = () => {
    const exportData = filteredContacts.map(c => ({
      'Name': c.name,
      'Role': c.role,
      'Type': c.type,
      'Phone': c.phone,
      'Email': c.email,
      'Location': c.location
    }));
    exportToCSV(exportData, 'contact_list');
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this contact?")) {
      try {
        await api.delete(`/contacts/${id}`);
        toast.success("Contact deleted successfully");
        fetchContacts();
      } catch (error) {
        console.error("Error deleting contact:", error);
        toast.error("Failed to delete contact");
      }
    }
  };

  if (loading) return <div className="p-12 text-center text-primary font-bold">Loading contacts...</div>;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100 gap-4">
        <div className="flex flex-wrap items-center gap-4 flex-1">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input 
              type="text" 
              placeholder="Search contacts..." 
              className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 border rounded-lg text-xs font-semibold bg-white">
            <SortAsc size={14} className="text-gray-400" />
            <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="bg-transparent outline-none border-none cursor-pointer"
            >
                <option value="name">Name</option>
                <option value="role">Role</option>
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
                <option value="Person">Person</option>
                <option value="Institute">Institute</option>
            </select>
          </div>
        </div>
        <div className="flex gap-2">
          <button 
            onClick={handleExport}
            className="flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl text-sm font-semibold hover:bg-gray-50 transition-all text-gray-600"
          >
            <Download size={18} /> Export
          </button>
          {['ADMIN', 'RECEPTIONIST'].includes(userRole) && (
            <button 
              onClick={() => navigate('/contacts/add')} 
              className="bg-primary text-white flex items-center gap-2 px-6 py-2.5 rounded-xl border border-primary hover:bg-primary/90 transition-all font-bold text-sm shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Add Contact
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredContacts.length > 0 ? filteredContacts.map((contact) => (
          <div key={contact.id} className="card group hover:border-primary/50 transition-all">
            <div className="flex justify-between items-start mb-6">
              <div className="flex gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    {contact.type === 'Person' ? <User2 size={24} /> : <Building2 size={24} />}
                 </div>
                 <div>
                    <h3 className="font-bold text-gray-800">{contact.name}</h3>
                    <p className="text-[10px] text-primary font-bold uppercase tracking-wider">{contact.role}</p>
                 </div>
              </div>
              <div className="flex gap-2">
                {userRole === 'ADMIN' && (
                  <button 
                    onClick={() => handleDelete(contact.id)}
                    className="p-2 rounded-lg text-gray-300 hover:text-red-500 hover:bg-red-50 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                )}
                <button className="text-gray-400 group-hover:text-primary p-2"><MoreVertical size={20}/></button>
              </div>
            </div>

            <div className="space-y-3 pt-4 border-t border-gray-50">
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Phone size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{contact.phone}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <Mail size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{contact.email}</span>
               </div>
               <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-gray-50 flex items-center justify-center text-gray-400">
                    <MapPin size={14} />
                  </div>
                  <span className="text-xs font-bold text-gray-600">{contact.location || "Hospital Medical Center"}</span>
               </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button className="flex-1 py-2.5 rounded-xl bg-gray-50 text-xs font-bold hover:bg-primary/5 hover:text-primary transition-colors flex items-center justify-center gap-2">
                <Globe size={14} /> Profile
              </button>
              <button 
                onClick={() => window.location.href = `mailto:${contact.email}`}
                className="flex-1 py-2.5 rounded-xl bg-primary/10 text-primary text-xs font-bold hover:bg-primary/20 transition-colors flex items-center justify-center gap-2"
              >
                <Mail size={14} /> Email
              </button>
            </div>
          </div>
        )) : (
          <div className="col-span-full py-12 text-center text-gray-400 card border-dashed">
            <p>No contacts found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Contacts;
