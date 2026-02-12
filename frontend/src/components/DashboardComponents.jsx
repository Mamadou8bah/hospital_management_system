import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell,
  BarChart, Bar
} from 'recharts';
import { MoreVertical, ArrowUpRight, ArrowDownRight, FileText, Download, Filter } from 'lucide-react';

export const StatCard = ({ title, value, change, isPositive, details, icon: Icon, color = 'primary' }) => {
  const colorClasses = {
    primary: 'bg-primary/10 text-primary',
    green: 'bg-green-500/10 text-green-500',
    blue: 'bg-blue-500/10 text-blue-500',
    yellow: 'bg-yellow-500/10 text-yellow-500',
  };

  return (
    <div className="card">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2 rounded-lg ${colorClasses[color] || colorClasses.primary}`}>
          {Icon && <Icon size={20} />}
        </div>
        <button className="text-gray-400"><MoreVertical size={20} /></button>
      </div>
      <div className="flex items-end gap-4 mb-4">
        <h2 className="text-3xl font-bold">{value}</h2>
        {change && (
          <div className={`flex items-center text-xs ${isPositive ? 'text-green-500' : 'text-red-500'}`}>
            {isPositive ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
            <span>{change} vs last month</span>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-500">{title}</p>
        {details && details.map((detail, idx) => (
          <div key={idx} className="flex justify-between text-xs text-gray-400">
            <span>{detail.label}</span>
            <span className="font-semibold text-gray-700">{detail.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export const ChartContainer = ({ title, children, extra }) => (
  <div className="card flex flex-col h-full">
    <div className="flex justify-between items-center mb-6">
      <h3 className="text-lg font-bold">{title}</h3>
      {extra}
    </div>
    <div className="flex-1 min-h-[300px]">
      <ResponsiveContainer width="100%" height="100%">
        {children}
      </ResponsiveContainer>
    </div>
  </div>
);
