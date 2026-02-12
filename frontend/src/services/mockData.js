// Mock data store
let doctors = [
  { 
    id: 'D001', 
    name: 'Jenny Wilson', 
    title: 'Doctor', 
    age: 27, 
    specialty: 'Cardiologist', 
    status: 'Active', 
    shift: '08:00AM- 04:00PM',
    email: 'jenny.wilson@clinova.com',
    phone: '+(555) 123-4567',
    rating: 4.8,
    about: 'Dr. Jenny Wilson is a highly experienced cardiologist specializing in non-invasive treatments.'
  },
  { 
    id: 'D002', 
    name: 'Sarah Johnson', 
    title: 'Nurse', 
    age: 35, 
    specialty: 'General Medicine', 
    status: 'Active', 
    shift: '08:00AM- 04:00PM',
    email: 'sarah.j@clinova.com',
    phone: '+(555) 234-5678',
    rating: 4.9,
    about: 'Sarah is a lead nurse with over 10 years of experience in emergency care.'
  },
  { 
    id: 'D003', 
    name: 'Esther Howard', 
    title: 'Doctor', 
    age: 37, 
    specialty: 'Neurosurgeon', 
    status: 'Active', 
    shift: '10:00AM- 06:00PM',
    email: 'esther.h@clinova.com',
    phone: '+(555) 345-6789',
    rating: 4.7,
    about: 'Dr. Esther Howard is known for her precision in complex neurosurgery.'
  }
];

let patients = [
  { 
    id: 'P001', 
    name: 'Leslie Alexander', 
    type: 'Cardiology', 
    email: 'lesliealexander@mail.com', 
    phone: '+(555) 657-2036', 
    address: '23 New Work Street, New York, USA',
    gender: 'Female',
    bloodGroup: 'O+',
    age: 24,
    weight: 125,
    height: 165
  },
  { 
    id: 'P002', 
    name: 'Annette Black', 
    type: 'Cardiology', 
    email: 'annette.b@mail.com', 
    phone: '+(555) 987-6543', 
    address: '45 Green Avenue, Boston, USA',
    gender: 'Female',
    bloodGroup: 'A-',
    age: 32,
    weight: 140,
    height: 170
  }
];

let appointments = [
  { id: 1, patientId: 'P001', doctorId: 'D001', title: 'Post-Surgical Care', date: '2023-10-12', time: '10:00 AM', status: 'Upcoming', type: 'Consultation' },
  { id: 2, patientId: 'P001', doctorId: 'D001', title: 'Routine Checkup', date: '2023-09-12', time: '02:30 PM', status: 'Completed', type: 'Follow-up' }
];

let departments = [
  { id: 'DP001', name: 'Cardiology', head: 'Dr. Jenny Wilson', employees: 12, status: 'Active', description: 'Specialized care for heart conditions and cardiovascular health.' },
  { id: 'DP002', name: 'Neurology', head: 'Dr. Esther Howard', employees: 8, status: 'Active', description: 'Advanced treatment for disorders of the nervous system.' },
  { id: 'DP003', name: 'Emergency', head: 'Dr. Sarah Johnson', employees: 25, status: 'Active', description: '24/7 immediate care for critical and life-threatening conditions.' }
];

export const mockService = {
  getDoctors: () => [...doctors],
  getDoctorById: (id) => doctors.find(d => d.id === id),
  addDoctor: (doctor) => {
    const newDoc = { ...doctor, id: `D00${doctors.length + 1}` };
    doctors = [newDoc, ...doctors];
    return newDoc;
  },
  deleteDoctor: (id) => {
    doctors = doctors.filter(d => d.id !== id);
  },

  getPatients: () => [...patients],
  getPatientById: (id) => patients.find(p => p.id === id),
  addPatient: (patient) => {
    const newPatient = { ...patient, id: `P00${patients.length + 1}` };
    patients = [newPatient, ...patients];
    return newPatient;
  },
  deletePatient: (id) => {
    patients = patients.filter(p => p.id !== id);
  },

  getAppointments: () => [...appointments],
  getAppointmentById: (id) => appointments.find(a => a.id === parseInt(id)),
  addAppointment: (appointment) => {
    const newAppointment = { ...appointment, id: appointments.length + 1 };
    appointments = [newAppointment, ...appointments];
    return newAppointment;
  },
  updateAppointmentStatus: (id, status) => {
    appointments = appointments.map(a => a.id === id ? { ...a, status } : a);
  },

  getDepartments: () => [...departments],
  getDepartmentById: (id) => departments.find(d => d.id === id),
  addDepartment: (department) => {
    const newDept = { ...department, id: `DP00${departments.length + 1}` };
    departments = [newDept, ...departments];
    return newDept;
  },
  deleteDepartment: (id) => {
    departments = departments.filter(d => d.id !== id);
  }
};
