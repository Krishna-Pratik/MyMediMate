import { Doctor, Patient, Appointment } from "@/types";

export const doctors: Doctor[] = [
  {
    id: "d1",
    name: "Dr. Sarah Chen",
    specialty: "Cardiology",
    workingHours: { start: "08:00", end: "18:00" },
  },
  {
    id: "d2",
    name: "Dr. Michael Rodriguez",
    specialty: "Pediatrics",
    workingHours: { start: "09:00", end: "17:00" },
  },
  {
    id: "d3",
    name: "Dr. Emily Johnson",
    specialty: "Orthopedics",
    workingHours: { start: "08:00", end: "16:00" },
  },
];

// Generate 50 patients
export const patients: Patient[] = Array.from({ length: 50 }, (_, i) => ({
  id: `p${i + 1}`,
  name: `Patient ${i + 1}`,
  email: `patient${i + 1}@example.com`,
  phone: `555-${String(i + 1).padStart(4, "0")}`,
}));

// Helper to generate appointments for a specific date range
const generateAppointments = (): Appointment[] => {
  const appointments: Appointment[] = [];
  const today = new Date();
  const types: Appointment["type"][] = ["checkup", "consultation", "followup", "procedure"];

  // Generate appointments for the next 14 days
  for (let day = 0; day < 14; day++) {
    const currentDate = new Date(today);
    currentDate.setDate(today.getDate() + day);

    // Generate non-overlapping appointments for each doctor per day
    doctors.forEach((doctor) => {
      const startHour = parseInt(doctor.workingHours.start.split(":")[0], 10);
      const startMinute = parseInt(doctor.workingHours.start.split(":")[1], 10);
      const endHour = parseInt(doctor.workingHours.end.split(":")[0], 10);
      const endMinute = parseInt(doctor.workingHours.end.split(":")[1], 10);
      const appointmentsPerDay = Math.floor(Math.random() * 5) + 8;
      let current = new Date(currentDate);
      current.setHours(startHour, startMinute, 0, 0);
      for (let i = 0; i < appointmentsPerDay; i++) {
        // Logical duration: 30, 45, or 60 min, but must fit before end of working hours
        const maxEnd = new Date(currentDate);
        maxEnd.setHours(endHour, endMinute, 0, 0);
        const possibleDurations = [30, 45, 60].filter(d => {
          const testEnd = new Date(current);
          testEnd.setMinutes(testEnd.getMinutes() + d);
          return testEnd <= maxEnd;
        });
        if (possibleDurations.length === 0) break;
        const duration = possibleDurations[Math.floor(Math.random() * possibleDurations.length)];
        const startTime = new Date(current);
        const endTime = new Date(startTime);
        endTime.setMinutes(endTime.getMinutes() + duration);
        const type = types[(i + day) % types.length];
        appointments.push({
          id: `a${appointments.length + 1}`,
          doctorId: doctor.id,
          patientId: patients[Math.floor(Math.random() * patients.length)].id,
          startTime: startTime.toISOString(),
          endTime: endTime.toISOString(),
          type,
          notes: Math.random() > 0.5 ? "Follow-up required" : undefined,
        });
        // Add a logical gap: 10–30 min
        const gap = [10, 15, 20, 30][Math.floor(Math.random() * 4)];
        current = new Date(endTime);
        current.setMinutes(current.getMinutes() + gap);
        // Stop if next appointment would go past working hours
        if (current > maxEnd) break;
      }
    });
  }

  return appointments.sort((a, b) => 
    new Date(a.startTime).getTime() - new Date(b.startTime).getTime()
  );
};

export const appointments: Appointment[] = generateAppointments();
