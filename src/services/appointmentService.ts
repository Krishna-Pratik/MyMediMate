import { appointments, doctors, patients } from "@/data/mockData";
import { Appointment, Doctor, Patient } from "@/types";
import { isSameDay, isWithinInterval } from "date-fns";

export class AppointmentService {
  static getAppointmentsByDoctorAndDate(
    doctorId: string,
    date: Date
  ): Appointment[] {
    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return apt.doctorId === doctorId && isSameDay(aptDate, date);
    });
  }

  static getAppointmentsByDoctorAndWeek(
    doctorId: string,
    startDate: Date
  ): Appointment[] {
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 6);

    return appointments.filter((apt) => {
      const aptDate = new Date(apt.startTime);
      return (
        apt.doctorId === doctorId &&
        isWithinInterval(aptDate, { start: startDate, end: endDate })
      );
    });
  }

  static getDoctorById(doctorId: string): Doctor | undefined {
    return doctors.find((doc) => doc.id === doctorId);
  }

  static getAllDoctors(): Doctor[] {
    return doctors;
  }

  static getPatientById(patientId: string): Patient | undefined {
    return patients.find((p) => p.id === patientId);
  }

  static getAppointmentsInTimeSlot(
    appointments: Appointment[],
    slotStart: Date,
    slotEnd: Date
  ): Appointment[] {
    return appointments.filter((apt) => {
      const aptStart = new Date(apt.startTime);
      const aptEnd = new Date(apt.endTime);

      // Check if appointment overlaps with time slot
      return aptStart < slotEnd && aptEnd > slotStart;
    });
  }

  /**
   * Returns appointments whose start time falls within the provided slot.
   * Useful to render an item only once (in its starting slot) instead of duplicating across all overlapping slots.
   */
  static getAppointmentsStartingInTimeSlot(
    appointments: Appointment[],
    slotStart: Date,
    slotEnd: Date
  ): Appointment[] {
    return appointments.filter((apt) => {
      const aptStart = new Date(apt.startTime);
      return aptStart >= slotStart && aptStart < slotEnd;
    });
  }
}
