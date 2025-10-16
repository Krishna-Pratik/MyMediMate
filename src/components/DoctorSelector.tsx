import { AppointmentService } from "@/services/appointmentService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface DoctorSelectorProps {
  selectedDoctorId: string;
  onDoctorChange: (doctorId: string) => void;
  disabled?: boolean;
}

export function DoctorSelector({ selectedDoctorId, onDoctorChange, disabled }: DoctorSelectorProps) {
  const doctors = AppointmentService.getAllDoctors();
  const selectedDoctor = AppointmentService.getDoctorById(selectedDoctorId);

  return (
    <div className="space-y-2">
      <Select value={selectedDoctorId} onValueChange={onDoctorChange}>
        <SelectTrigger className="w-full md:w-[300px]" disabled={disabled}>
          <SelectValue placeholder="Select a doctor" />
        </SelectTrigger>
        <SelectContent>
          {doctors.map((doctor) => (
            <SelectItem key={doctor.id} value={doctor.id}>
              <div className="flex flex-col items-start">
                <span className="font-medium">{doctor.name}</span>
                <span className="text-xs text-muted-foreground">{doctor.specialty}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      {selectedDoctor && (
        <div className="text-sm text-muted-foreground">
          Working hours: {selectedDoctor.workingHours.start} - {selectedDoctor.workingHours.end}
        </div>
      )}
    </div>
  );
}
