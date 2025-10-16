import { useState, useMemo } from "react";
import { AppointmentService } from "@/services/appointmentService";
import { Appointment, Doctor, TimeSlot } from "@/types";
import { startOfWeek } from "date-fns";

export function useAppointmentScheduler(doctorId: string, selectedDate: Date) {
  const [loading] = useState(false);
  const [error] = useState<Error | null>(null);

  const doctor = useMemo(
    () => AppointmentService.getDoctorById(doctorId),
    [doctorId]
  );

  const dayAppointments = useMemo(
    () => AppointmentService.getAppointmentsByDoctorAndDate(doctorId, selectedDate),
    [doctorId, selectedDate]
  );

  const weekStart = useMemo(() => startOfWeek(selectedDate, { weekStartsOn: 1 }), [selectedDate]);
  
  const weekAppointments = useMemo(
    () => AppointmentService.getAppointmentsByDoctorAndWeek(doctorId, weekStart),
    [doctorId, weekStart]
  );

  const timeSlots = useMemo(() => {
    if (doctor) {
      return generateTimeSlotsForDoctor(selectedDate, doctor);
    }
    return generateTimeSlots(selectedDate);
  }, [selectedDate, doctor]);

  return {
    doctor,
    dayAppointments,
    weekAppointments,
    weekStart,
    timeSlots,
    loading,
    error,
  };
}

export function generateTimeSlots(date: Date): TimeSlot[] {
  const slots: TimeSlot[] = [];

  return generateTimeSlotsInRange(date, { startHour: 8, startMinute: 0, endHour: 18, endMinute: 0 });
}

export function getAppointmentColor(type: Appointment["type"]) {
  const colors = {
    checkup: { bg: "bg-appointment-checkup-bg", border: "border-appointment-checkup", text: "text-appointment-checkup" },
    consultation: { bg: "bg-appointment-consultation-bg", border: "border-appointment-consultation", text: "text-appointment-consultation" },
    followup: { bg: "bg-appointment-followup-bg", border: "border-appointment-followup", text: "text-appointment-followup" },
    procedure: { bg: "bg-appointment-procedure-bg", border: "border-appointment-procedure", text: "text-appointment-procedure" },
  };
  return colors[type];
}

// Helpers
function parseHHmm(hhmm: string): { hour: number; minute: number } {
  const [h, m] = hhmm.split(":").map((x) => parseInt(x, 10));
  return { hour: h, minute: m };
}

function generateTimeSlotsInRange(
  date: Date,
  range: { startHour: number; startMinute: number; endHour: number; endMinute: number }
): TimeSlot[] {
  const slots: TimeSlot[] = [];
  const startTotalMin = range.startHour * 60 + range.startMinute;
  const endTotalMin = range.endHour * 60 + range.endMinute;
  for (let total = startTotalMin; total < endTotalMin; total += 30) {
    const start = new Date(date);
    start.setHours(Math.floor(total / 60), total % 60, 0, 0);
    const end = new Date(start);
    end.setMinutes(end.getMinutes() + 30);
    const label = start.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
    slots.push({ start, end, label });
  }
  return slots;
}

export function generateTimeSlotsForDoctor(date: Date, doctor: Doctor): TimeSlot[] {
  const start = parseHHmm(doctor.workingHours.start);
  const end = parseHHmm(doctor.workingHours.end);
  return generateTimeSlotsInRange(date, {
    startHour: start.hour,
    startMinute: start.minute,
    endHour: end.hour,
    endMinute: end.minute,
  });
}
