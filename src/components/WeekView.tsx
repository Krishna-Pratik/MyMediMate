import { Appointment, TimeSlot } from "@/types";
import { AppointmentService } from "@/services/appointmentService";
import { AppointmentCard } from "./AppointmentCard";
import { ScrollArea } from "@/components/ui/scroll-area";
import { format, addDays, isSameDay } from "date-fns";

interface WeekViewProps {
  weekStart: Date;
  timeSlots: TimeSlot[];
  appointments: Appointment[];
  currentTime?: Date;
}

export function WeekView({ weekStart, timeSlots, appointments, currentTime }: WeekViewProps) {
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));

  return (
    <ScrollArea className="h-[600px] w-full rounded-md border bg-card">
      <div className="min-w-[900px]">
        <div className="sticky top-0 z-10 bg-calendar-header border-b">
          <div className="flex">
            <div className="w-20 flex-shrink-0 border-r border-calendar-grid px-3 py-3">
              <span className="text-xs font-medium text-muted-foreground">Time</span>
            </div>
            {days.map((day) => (
              <div
                key={day.toISOString()}
                className="flex-1 px-2 py-3 border-r border-calendar-grid last:border-r-0 text-center"
              >
                <div className="text-xs font-medium text-muted-foreground">
                  {format(day, "EEE")}
                </div>
                <div className="text-sm font-semibold text-foreground mt-1">
                  {format(day, "MMM d")}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          {timeSlots.map((slot, index) => (
            <div key={index} className="flex border-b border-calendar-grid min-h-[60px]">
              <div className="w-20 flex-shrink-0 px-3 py-2 bg-calendar-slot border-r border-calendar-grid">
                <span className="text-xs font-medium text-muted-foreground">
                  {slot.label}
                </span>
              </div>

              {days.map((day) => {
                const dayAppointments = appointments.filter((apt) =>
                  isSameDay(new Date(apt.startTime), day)
                );

                // Align slot range to this specific day
                const daySlotStart = new Date(day);
                daySlotStart.setHours(slot.start.getHours(), slot.start.getMinutes(), 0, 0);
                const daySlotEnd = new Date(daySlotStart);
                daySlotEnd.setMinutes(daySlotEnd.getMinutes() + 30);

                const slotAppointments = AppointmentService.getAppointmentsStartingInTimeSlot(
                  dayAppointments,
                  daySlotStart,
                  daySlotEnd
                );

                return (
                  <div
                    key={day.toISOString()}
                    className="flex-1 p-1 border-r border-calendar-grid last:border-r-0 space-y-1 relative"
                  >
                    {currentTime && isSameDay(currentTime, day) && currentTime >= daySlotStart && currentTime < daySlotEnd && (
                      <div
                        className="absolute left-0 right-0 h-px bg-red-500"
                        style={{
                          top: `${((currentTime.getTime() - daySlotStart.getTime()) / (daySlotEnd.getTime() - daySlotStart.getTime())) * 100}%`,
                        }}
                      />
                    )}
                    <div className="flex gap-1">
                      {slotAppointments.map((appointment) => (
                        <div key={appointment.id} className="flex-1 min-w-0">
                          <AppointmentCard
                            appointment={appointment}
                            className="text-xs"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
