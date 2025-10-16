export type AppointmentType = "checkup" | "consultation" | "followup" | "procedure";

export interface Doctor {
  id: string;
  name: string;
  specialty: string;
  workingHours: {
    start: string; // "08:00"
    end: string; // "18:00"
  };
}

export interface Patient {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface Appointment {
  id: string;
  doctorId: string;
  patientId: string;
  startTime: string; // ISO string
  endTime: string; // ISO string
  type: AppointmentType;
  notes?: string;
}

export interface TimeSlot {
  start: Date;
  end: Date;
  label: string;
}
