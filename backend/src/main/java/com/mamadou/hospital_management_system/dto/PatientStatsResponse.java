package com.mamadou.hospital_management_system.dto;

import java.util.List;
import java.util.Map;

public record PatientStatsResponse(
    AgeStats ageStats,
    List<SummaryData> summaryData,
    List<DiagnosisData> diagnosisData
) {
    public record AgeStats(long child, long teen, long adult, long older) {}
    public record SummaryData(String name, long in, long out, long dis) {}
    public record DiagnosisData(String subject, long A, int fullMark) {}
}
