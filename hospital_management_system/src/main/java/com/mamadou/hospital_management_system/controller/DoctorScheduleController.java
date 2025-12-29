package com.mamadou.hospital_management_system.controller;

import com.mamadou.hospital_management_system.dto.DoctorScheduleDTO;
import com.mamadou.hospital_management_system.service.DoctorScheduleService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/doctor-schedule")
@RequiredArgsConstructor
public class DoctorScheduleController {
    private final DoctorScheduleService doctorScheduleService;

    @PostMapping
    public ResponseEntity<DoctorScheduleDTO> addSchedule( @RequestBody  DoctorScheduleDTO doctorScheduleDTO) {
        try{
            return ResponseEntity.ok().body(doctorScheduleService.addSchedule(doctorScheduleDTO));
        }catch(Exception e){
            return ResponseEntity.badRequest().build();
        }
    }
    @GetMapping
    public ResponseEntity<List<DoctorScheduleDTO>> getAllSchedules( @PathVariable int doctorId) {
        try{
            return ResponseEntity.ok().body(doctorScheduleService.getSchedulesByDoctor(doctorId));
        } catch (RuntimeException e) {
            return ResponseEntity.badRequest().build();
        }
    }
}
