package com.mamadou.hospital_management_system.service;

import com.mamadou.hospital_management_system.dto.DoctorScheduleDTO;
import com.mamadou.hospital_management_system.model.Doctor;
import com.mamadou.hospital_management_system.model.DoctorSchedule;
import com.mamadou.hospital_management_system.repository.DoctorRepository;
import com.mamadou.hospital_management_system.repository.DoctorScheduleRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional
public class DoctorScheduleService {

    private final DoctorScheduleRepository doctorScheduleRepository;
    private final DoctorRepository doctorRepository;

    // Add a schedule
    public DoctorScheduleDTO addSchedule(DoctorScheduleDTO dto) {
        Doctor doctor = doctorRepository.findById(dto.doctorId())
                .orElseThrow(() -> new RuntimeException("Doctor not found"));

        DoctorSchedule schedule = new DoctorSchedule();
        schedule.setDoctor(doctor);
        schedule.setDayOfWeek(dto.dayOfWeek());
        schedule.setStartTime(dto.startTime());
        schedule.setEndTime(dto.endTime());

        DoctorSchedule saved = doctorScheduleRepository.save(schedule);

        return new DoctorScheduleDTO(
                saved.getDoctor().getId(),
                saved.getDayOfWeek(),
                saved.getStartTime(),
                saved.getEndTime()
        );
    }

    // Get all schedules
    public List<DoctorScheduleDTO> getAllSchedules() {
        return doctorScheduleRepository.findAll()
                .stream()
                .map(s -> new DoctorScheduleDTO(
                        s.getDoctor().getId(),
                        s.getDayOfWeek(),
                        s.getStartTime(),
                        s.getEndTime()
                ))
                .collect(Collectors.toList());
    }

    // Get schedules for a specific doctor
    public List<DoctorScheduleDTO> getSchedulesByDoctor(Long doctorId) {
        return doctorScheduleRepository.findById(doctorId)
                .stream()
                .map(s -> new DoctorScheduleDTO(
                        s.getDoctor().getId(),
                        s.getDayOfWeek(),
                        s.getStartTime(),
                        s.getEndTime()
                ))
                .collect(Collectors.toList());
    }
}
