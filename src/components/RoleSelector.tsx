import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type UserRole = "frontdesk" | "doctor";

interface RoleSelectorProps {
  role: UserRole;
  onChange: (role: UserRole) => void;
}

export function RoleSelector({ role, onChange }: RoleSelectorProps) {
  return (
    <div className="space-y-2">
      <Select value={role} onValueChange={(v) => onChange(v as UserRole)}>
        <SelectTrigger className="w-[220px]">
          <SelectValue placeholder="Select role" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="frontdesk">Front Desk Staff</SelectItem>
          <SelectItem value="doctor">Doctor</SelectItem>
        </SelectContent>
      </Select>
      <p className="text-xs text-muted-foreground">
        {role === "frontdesk"
          ? "Can view schedules for all doctors."
          : "Can view only the selected doctor's schedule."}
      </p>
    </div>
  );
}
