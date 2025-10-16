import { Appointment, TimeSlot } from "@/types";
import { AppointmentService } from "@/services/appointmentService";
import { AppointmentCard } from "./AppointmentCard";
import { ScrollArea } from "@/components/ui/scroll-area";

interface DayViewProps {
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  // Optional real-time indicator (only shown if provided and falls within the day)
  currentTime?: Date;
}

export function DayView({ timeSlots, appointments, currentTime }: DayViewProps) {
  return (
    <ScrollArea className="h-[600px] w-full rounded-md border bg-card">
      <div className="min-w-[300px]">
        <div className="sticky top-0 z-10 bg-calendar-header border-b px-4 py-3">
          <span className="text-sm font-medium text-foreground">Schedule</span>
        </div>

        <div className="relative">
          {timeSlots.map((slot, index) => {
            // Render only appointments that START within this slot to avoid duplicates
            const slotAppointments = AppointmentService.getAppointmentsStartingInTimeSlot(
              appointments,
              slot.start,
              slot.end
            );

            return (
              <div
                key={index}
                className="flex border-b border-calendar-grid min-h-[60px]"
              >
                <div className="w-20 flex-shrink-0 px-3 py-2 bg-calendar-slot border-r border-calendar-grid">
                  <span className="text-xs font-medium text-muted-foreground">
                    {slot.label}
                  </span>
                </div>

                <div className="flex-1 p-2 relative">
                  {currentTime && currentTime >= slot.start && currentTime < slot.end && (
                    <div
                      className="absolute left-0 right-0 h-px bg-red-500"
                      style={{
                        top: `${((currentTime.getTime() - slot.start.getTime()) / (slot.end.getTime() - slot.start.getTime())) * 100}%`,
                      }}
                    />
                  )}
                  <div className="flex gap-1">
                    {slotAppointments.map((appointment) => (
                      <div key={appointment.id} className="flex-1 min-w-0">
                        <AppointmentCard appointment={appointment} />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </ScrollArea>
  );
}
