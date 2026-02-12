package com.mamadou.hospital_management_system.config;

import com.mamadou.hospital_management_system.enums.BookingStatus;
import com.mamadou.hospital_management_system.enums.Role;
import com.mamadou.hospital_management_system.model.*;
import com.mamadou.hospital_management_system.repository.*;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.Arrays;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final DoctorRepository doctorRepository;
    private final PatientRepository patientRepository;
    private final DepartmentRepository departmentRepository;
    private final ContactRepository contactRepository;
    private final AppointmentRepository appointmentRepository;
    private final DoctorScheduleRepository doctorScheduleRepository;
    private final RecordRepository recordRepository;
    private final BCryptPasswordEncoder passwordEncoder;
    private final JdbcTemplate jdbcTemplate;

    @Override
    @Transactional
    public void run(String... args) throws Exception {

        // Drop the problematic unique constraint if it exists (from potential old OneToOne mapping)
        try {
            jdbcTemplate.execute("ALTER TABLE doctor_schedule DROP CONSTRAINT IF EXISTS ukkd0hoxikmedf1koq8xo1k58it");
            System.out.println("Cleaned up old unique constraint on doctor_schedule");
        } catch (Exception e) {
            System.out.println("Constraint cleanup skipped or not needed: " + e.getMessage());
        }
    
        if (!userRepository.existsByEmail("admin@clinova.com")) {
            User admin = createUser("Admin", "User", "admin@clinova.com", "password123", "Banjul, Gambia", LocalDate.of(1985, 5, 20), Role.ADMIN);
            System.out.println("Admin user seeded: admin@clinova.com / password123");
        }

        // 2. Seed Departments
        Department cardiology = createDepartment("Cardiology", "Heart related issues", "Dr. Modou Bah", "Heart");
        Department pediatrics = createDepartment("Pediatrics", "Children healthcare", "Dr. Fatou Camara", "Baby");
        Department surgery = createDepartment("Surgery", "General and specialized surgery", "Dr. Ebrahima Jallow", "BriefcaseMedical");
        Department maternity = createDepartment("Maternity", "Mother and childcare", "Dr. Binta Sowe", "PlusSquare");
        Department orthopedics = createDepartment("Orthopedics", "Bone and joint treatments", "Dr. Alieu Sarr", "Activity");
        Department dermatology = createDepartment("Dermatology", "Skin and hair care", "Dr. Isatou Drammeh", "User2");
        Department radiology = createDepartment("Radiology", "Imaging and X-rays", "Dr. Lamin Touray", "Search");

        // 3. Seed Doctors
        Doctor doc1 = createDoctor("Modou", "Bah", "modou.bah@clinova.com", "Cardiologist", cardiology, "7012345", "Senior Cardiologist with 15 years experience.", 15, 1200);
        Doctor doc2 = createDoctor("Fatou", "Camara", "fatou.camara@clinova.com", "Pediatrician", pediatrics, "9965432", "Specialist in neonatal care.", 8, 850);
        Doctor doc3 = createDoctor("Ebrahima", "Jallow", "ebrahima.jallow@clinova.com", "Surgeon", surgery, "3301122", "Expert in orthopedic surgery.", 12, 500);
        Doctor doc4 = createDoctor("Alieu", "Sarr", "alieu.sarr@clinova.com", "Orthopedic Surgeon", orthopedics, "2201133", "Expert in bone fracture treatments.", 10, 420);
        Doctor doc5 = createDoctor("Isatou", "Drammeh", "isatou.d@clinova.com", "Dermatologist", dermatology, "4401144", "Skin cancer specialist.", 6, 300);
        Doctor doc6 = createDoctor("Lamin", "Touray", "lamin.t@clinova.com", "Radiologist", radiology, "5501155", "Expert in MRI and CT interpretation.", 9, 210);
        Doctor doc7 = createDoctor("Binta", "Sowe", "binta.sowe@clinova.com", "Obstetrician", maternity, "6601166", "High-risk pregnancy consultant.", 11, 600);
        
        doc1.setDoctorOfTheMonth(true);
        doctorRepository.save(doc1);

        // 4. Seed Patients
        Patient pat1 = createPatient("Musa", "Njie", "musa.njie@gmail.com", "Male", "O+", 45, 75.5, 1.75, "Serekunda, Gambia", "7778899", "Inpatient", "Hypertension", 85, "140/90", 98);
        Patient pat2 = createPatient("Binta", "Ceesay", "binta.ceesay@outlook.com", "Female", "A-", 28, 62.0, 1.68, "Brikama, Gambia", "6665544", "Outpatient", "Mild Fever", 72, "120/80", 99);
        Patient pat3 = createPatient("Bakary", "Touray", "bakary.touray@yahoo.com", "Male", "B+", 60, 80.0, 1.70, "Bakau, Gambia", "2221100", "Inpatient", "Diabetes Checkup", 78, "130/85", 97);
        Patient pat4 = createPatient("Mariama", "Jallow", "mariama.j@gmail.com", "Female", "O-", 32, 65.0, 1.65, "Latrikunda, Gambia", "8881122", "Outpatient", "Pregnancy Routine", 80, "115/75", 99);
        Patient pat5 = createPatient("Ousman", "Sosseh", "ousman.s@yahoo.com", "Male", "AB+", 50, 88.0, 1.80, "Kololi, Gambia", "9991133", "Inpatient", "Knee Surgery Recovery", 70, "125/80", 96);
        Patient pat6 = createPatient("Haddy", "Faye", "haddy.faye@gmail.com", "Female", "B-", 19, 55.0, 1.60, "Fajara, Gambia", "1112233", "Outpatient", "Skin Infection", 75, "110/70", 98);
        Patient pat7 = createPatient("Pa Modou", "Gaye", "pa.modou@outlook.com", "Male", "A+", 70, 72.0, 1.72, "Banjul, Gambia", "2223344", "Inpatient", "Chest Pain", 90, "150/95", 95);
        Patient pat8 = createPatient("Fatoumatta", "Dabo", "fatou.dabo@gmail.com", "Female", "O+", 4, 15.0, 1.05, "Old Jeshwang, Gambia", "3334455", "Outpatient", "Pediatric Flu", 100, "90/60", 99);
        Patient pat9 = createPatient("Abdoulie", "Ceesay", "abdoulie.c@gmail.com", "Male", "O+", 55, 82.0, 1.78, "Banjul, Gambia", "4445566", "Inpatient", "Heart Palpitations", 88, "145/95", 97);
        Patient pat10 = createPatient("Fatou", "Khan", "fatou.khan@outlook.com", "Female", "A+", 39, 68.5, 1.62, "Serekunda, Gambia", "5556677", "Outpatient", "Severe Migraine", 74, "120/80", 99);
        Patient pat11 = createPatient("Modou Lamin", "Sowe", "modou.sowe@gmail.com", "Male", "B+", 12, 42.0, 1.45, "Brikama, Gambia", "6667788", "Outpatient", "Broken Arm", 82, "110/70", 98);
        Patient pat12 = createPatient("Awa", "Njie", "awa.njie@yahoo.com", "Female", "AB-", 62, 60.0, 1.58, "Bakau, Gambia", "7778899", "Inpatient", "Asthma Attack", 95, "130/85", 92);
        Patient pat13 = createPatient("Sulayman", "Jallow", "sulayman.j@gmail.com", "Male", "O-", 24, 70.0, 1.82, "Bundung, Gambia", "8889900", "Outpatient", "Malaria Symptoms", 85, "115/75", 98);
        Patient pat14 = createPatient("Kaddyatou", "Touray", "kaddy.t@outlook.com", "Female", "B-", 31, 64.0, 1.70, "Gunjur, Gambia", "9990011", "Inpatient", "Post-Delivery", 78, "118/72", 99);
        Patient pat15 = createPatient("Alieu", "Badjie", "alieu.b@gmail.com", "Male", "A-", 48, 76.0, 1.74, "Abuko, Gambia", "1110022", "Outpatient", "Lower Back Pain", 72, "135/88", 97);

        // 5. Seed Doctor Schedules
        seedSchedule(doc1, DayOfWeek.MONDAY, LocalTime.of(9, 0), LocalTime.of(17, 0));
        seedSchedule(doc1, DayOfWeek.WEDNESDAY, LocalTime.of(9, 0), LocalTime.of(17, 0));
        seedSchedule(doc2, DayOfWeek.TUESDAY, LocalTime.of(10, 0), LocalTime.of(18, 0));
        seedSchedule(doc2, DayOfWeek.THURSDAY, LocalTime.of(10, 0), LocalTime.of(18, 0));
        seedSchedule(doc4, DayOfWeek.MONDAY, LocalTime.of(8, 0), LocalTime.of(16, 0));
        seedSchedule(doc5, DayOfWeek.FRIDAY, LocalTime.of(9, 30), LocalTime.of(15, 30));
        seedSchedule(doc7, DayOfWeek.WEDNESDAY, LocalTime.of(8, 0), LocalTime.of(20, 0));

        // 6. Seed Appointments
        if (appointmentRepository.count() == 0) {
            createAppointment(pat1, doc1, LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0), "Heart checkup", "Consultation", BookingStatus.PENDING);
            createAppointment(pat2, doc2, LocalDateTime.now().plusDays(2).withHour(11).withMinute(30).withSecond(0).withNano(0), "Child vaccination", "Follow-up", BookingStatus.CONFIRMED);
            createAppointment(pat3, doc1, LocalDateTime.now().minusDays(1).withHour(14).withMinute(0).withSecond(0).withNano(0), "Routine BP check", "Checkup", BookingStatus.COMPLETED);
            createAppointment(pat4, doc7, LocalDateTime.now().plusDays(3).withHour(9).withMinute(0).withSecond(0).withNano(0), "Antenatal checkup", "Consultation", BookingStatus.CONFIRMED);
            createAppointment(pat5, doc4, LocalDateTime.now().plusDays(1).withHour(15).withMinute(0).withSecond(0).withNano(0), "Post-op review", "Follow-up", BookingStatus.PENDING);
            createAppointment(pat6, doc5, LocalDateTime.now().plusDays(4).withHour(11).withMinute(0).withSecond(0).withNano(0), "Rash consultation", "Consultation", BookingStatus.PENDING);
            createAppointment(pat8, doc2, LocalDateTime.now().minusHours(2), "Persistent cough", "Emergency", BookingStatus.COMPLETED);
            createAppointment(pat9, doc1, LocalDateTime.now().plusDays(2).withHour(9).withMinute(0).withSecond(0).withNano(0), "Chronic heart issues", "Consultation", BookingStatus.CONFIRMED);
            createAppointment(pat10, doc1, LocalDateTime.now().plusDays(5).withHour(14).withMinute(30).withSecond(0).withNano(0), "Migraine follow-up", "Follow-up", BookingStatus.PENDING);
            createAppointment(pat11, doc4, LocalDateTime.now().plusDays(1).withHour(10).withMinute(0).withSecond(0).withNano(0), "Cast review", "Checkup", BookingStatus.CONFIRMED);
            createAppointment(pat12, doc6, LocalDateTime.now().minusDays(2).withHour(11).withMinute(0).withSecond(0).withNano(0), "Chest X-ray review", "Consultation", BookingStatus.COMPLETED);
            createAppointment(pat13, doc3, LocalDateTime.now().plusDays(3).withHour(13).withMinute(0).withSecond(0).withNano(0), "Fever and chills", "Emergency", BookingStatus.CONFIRMED);
            createAppointment(pat14, doc7, LocalDateTime.now().minusDays(5).withHour(8).withMinute(0).withSecond(0).withNano(0), "Initial prenatal", "Consultation", BookingStatus.COMPLETED);
            createAppointment(pat15, doc3, LocalDateTime.now().plusDays(1).withHour(16).withMinute(0).withSecond(0).withNano(0), "Spinal review", "Consultation", BookingStatus.PENDING);
            createAppointment(pat4, doc7, LocalDateTime.now().plusWeeks(2).withHour(10).withMinute(0).withSecond(0).withNano(0), "Second Trimester Scan", "Follow-up", BookingStatus.PENDING);
            createAppointment(pat1, doc4, LocalDateTime.now().plusWeeks(1).withHour(11).withMinute(0).withSecond(0).withNano(0), "Physical Therapy", "Checkup", BookingStatus.CONFIRMED);
        }

        // 7. Seed Medical Records
        if (recordRepository.count() == 0) {
            createMedicalRecord(pat1, doc1, "Chronic Hypertension", "Moderate", "Prescribed Lisinopril 10mg. Patient advised to reduce salt intake.", "Lisinopril 10mg once daily");
            createMedicalRecord(pat3, doc1, "Type 2 Diabetes", "Low", "Blood sugar stable. Continue current diet.", "Metformin 500mg twice daily");
            createMedicalRecord(pat5, doc4, "Post-ACL Surgery", "High", "Wound healing well. Start physiotherapy.", "Paracetamol 500mg as needed");
            createMedicalRecord(pat7, doc1, "Angina Pectoris", "High", "Admitted for observation. ECG scheduled.", "Nitroglycerin sublingual");
            createMedicalRecord(pat11, doc4, "Radius Bone Fracture", "Moderate", "Applied cast. Follow up in 6 weeks.", "Ibuprofen 400mg as needed");
            createMedicalRecord(pat12, doc6, "Bronchitis", "Low", "Chest X-ray shows minor inflammation.", "Amoxicillin 500mg (7 days)");
            createMedicalRecord(pat13, doc3, "P. Falciparum Malaria", "High", "Rapid test positive. Started Coartem.", "Coartem (3 day course)");
            createMedicalRecord(pat14, doc7, "Healthy Pregnancy", "Low", "Fetal heart rate normal at 145bpm.", "Folic Acid & Vit B12");
            createMedicalRecord(pat10, doc1, "Vascular Migraine", "Moderate", "Patient reports frequent stress. Avoid triggers.", "Sumatriptan 50mg");
            createMedicalRecord(pat9, doc1, "Atrial Fibrillation", "High", "Started Anticoagulation. Monitor closely.", "Warfarin 5mg");
            createMedicalRecord(pat15, doc3, "Lumbar Strain", "Low", "No nerve compression found. Rest and Heat.", "Muscle relaxant (Cyclobenzaprine)");
            createMedicalRecord(pat8, doc2, "Acute Bronchiolitis", "Moderate", "Nebulized in ER. Improved oxygenation.", "Salbutamol Inhaler");
        }

        // 8. Seed Contacts
        seedContacts();
    }

    private Department createDepartment(String name, String desc, String head, String icon) {
        return departmentRepository.findByName(name).orElseGet(() -> {
            Department dept = new Department();
            dept.setName(name);
            dept.setDescription(desc);
            dept.setHeadOfDepartment(head);
            dept.setIcon(icon);
            return departmentRepository.save(dept);
        });
    }

    private User createUser(String first, String last, String email, String password, String address, LocalDate birth, Role role) {
        return userRepository.findByEmail(email).orElseGet(() -> {
            User user = new User();
            user.setFirstName(first);
            user.setLastName(last);
            user.setEmail(email);
            user.setPassword(passwordEncoder.encode(password));
            user.setAddress(address);
            user.setBirthDate(birth);
            user.setRole(role);
            user.setCreatedAt(LocalDate.now());
            return userRepository.save(user);
        });
    }

    private Doctor createDoctor(String first, String last, String email, String specialty, Department dept, String phone, String about, int exp, int patients) {
        return doctorRepository.findByEmail(email).orElseGet(() -> {
            User user = createUser(first, last, email, "password123", "Medical Staff Housing", LocalDate.of(1980, 1, 1), Role.DOCTOR);
            Doctor doc = new Doctor();
            doc.setUser(user);
            doc.setSpecialty(specialty);
            doc.setDepartment(dept);
            doc.setPhone(phone);
            doc.setAbout(about);
            doc.setExperienceYears(exp);
            doc.setPatientsCount(patients);
            doc.setAvailable(true);
            doc.setWorkingHours("09:00 - 17:00");
            doc.setRating(4.8);
            return doctorRepository.save(doc);
        });
    }

    private Patient createPatient(String first, String last, String email, String gender, String blood, int age, double weight, double height, String address, String phone, String status, String type, int pulse, String bp, int oxygen) {
        return patientRepository.findByUserEmail(email).orElseGet(() -> {
            User user = createUser(first, last, email, "password123", address, LocalDate.of(LocalDate.now().getYear() - age, 1, 1), Role.PATIENT);
            Patient pat = new Patient();
            pat.setUser(user);
            pat.setGender(gender);
            pat.setBloodGroup(blood);
            pat.setAge(age);
            pat.setWeight(weight);
            pat.setHeight(height);
            pat.setAddress(address);
            pat.setPhone(phone);
            pat.setStatus(status);
            pat.setType(type);
            pat.setPulseRate(pulse);
            pat.setBloodPressure(bp);
            pat.setBloodOxygen(oxygen);
            return patientRepository.save(pat);
        });
    }

    private void seedSchedule(Doctor doc, DayOfWeek day, LocalTime start, LocalTime end) {
        if (doctorScheduleRepository.findByDoctor(doc).stream()
                .anyMatch(s -> s.getDayOfWeek() == day)) {
            return;
        }
        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctor(doc);
        schedule.setDayOfWeek(day);
        schedule.setStartTime(start);
        schedule.setEndTime(end);
        schedule.setAvailableSlots(10);
        doctorScheduleRepository.save(schedule);
    }

    private void createAppointment(Patient pat, Doctor doc, LocalDateTime date, String reason, String visitType, BookingStatus status) {
        Appointment apt = new Appointment();
        apt.setPatient(pat);
        apt.setDoctor(doc);
        apt.setAppointmentDate(date);
        apt.setReason(reason);
        apt.setVisitType(visitType);
        apt.setStatus(status);
        appointmentRepository.save(apt);
    }

    private void createMedicalRecord(Patient pat, Doctor doc, String diagnosis, String priority, String notes, String prescription) {
        MedicalRecord record = new MedicalRecord();
        record.setPatient(pat);
        record.setIssuedBy(doc);
        record.setDiagnosis(diagnosis);
        record.setPriority(priority);
        record.setNotes(notes);
        record.setIssueDate(LocalDate.now());
        record.setPrescription(prescription);
        recordRepository.save(record);
    }

    private void seedContacts() {
        if (contactRepository.count() > 0) return;
        
        Contact c1 = new Contact();
        c1.setName("General Reception");
        c1.setRole("Hospital Entry");
        c1.setPhone("+220 4461234");
        c1.setEmail("reception@clinova.com");
        c1.setType("Reception");
        c1.setLocation("Ground Floor, Main Block");

        Contact c2 = new Contact();
        c2.setName("Emergency Hotline");
        c2.setRole("Emergency Service");
        c2.setPhone("112");
        c2.setEmail("emergency@clinova.com");
        c2.setType("Service");
        c2.setLocation("Emergency Wing");

        Contact c3 = new Contact();
        c3.setName("Pharmacy");
        c3.setRole("Medical Supplies");
        c3.setPhone("+220 7781212");
        c3.setEmail("pharmacy@clinova.com");
        c3.setType("Department");
        c3.setLocation("Ground Floor, West Wing");

        Contact c4 = new Contact();
        c4.setName("Blood Bank");
        c4.setRole("Blood Donation/Supply");
        c4.setPhone("+220 3348899");
        c4.setEmail("bloodbank@clinova.com");
        c4.setType("Service");
        c4.setLocation("Basement, Block B");

        Contact c5 = new Contact();
        c5.setName("Lab Services");
        c5.setRole("Diagnostic Testing");
        c5.setPhone("+220 9901122");
        c5.setEmail("lab@clinova.com");
        c5.setType("Department");
        c5.setLocation("First Floor, East Wing");

        Contact c6 = new Contact();
        c6.setName("Security");
        c6.setRole("Safety & Security");
        c6.setPhone("+220 2200000");
        c6.setEmail("security@clinova.com");
        c6.setType("Service");
        c6.setLocation("Gate House");

        contactRepository.saveAll(Arrays.asList(c1, c2, c3, c4, c5, c6));
    }
}
