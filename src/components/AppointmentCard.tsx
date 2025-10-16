import { Appointment } from "@/types";
import { AppointmentService } from "@/services/appointmentService";
import { getAppointmentColor } from "@/hooks/useAppointments";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

interface AppointmentCardProps {
  appointment: Appointment;
  className?: string;
}

export function AppointmentCard({ appointment, className }: AppointmentCardProps) {
  const patient = AppointmentService.getPatientById(appointment.patientId);
  const colors = getAppointmentColor(appointment.type);
  
  const startTime = new Date(appointment.startTime);
  const endTime = new Date(appointment.endTime);
  const duration = Math.round((endTime.getTime() - startTime.getTime()) / (1000 * 60));

  return (
    <div
      className={cn(
        "p-2 rounded-md border-l-4 transition-all hover:shadow-md",
        colors.bg,
        colors.border,
        className
      )}
    >
      <div className="flex flex-col gap-1">
        <div className="flex items-start justify-between gap-2">
          <span className="font-medium text-sm text-foreground line-clamp-1">
            {patient?.name || "Unknown Patient"}
          </span>
          <span className="text-xs text-muted-foreground whitespace-nowrap">
            {duration} min
          </span>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span className={cn("font-medium capitalize", colors.text)}>
            {appointment.type}
          </span>
          <span className="text-muted-foreground">
            {format(startTime, "h:mm a")}
          </span>
        </div>
        {appointment.notes && (
          <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
            {appointment.notes}
          </p>
        )}
      </div>
    </div>
  );
}
