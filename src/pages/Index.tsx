import { useState } from "react";
import { DoctorSelector } from "@/components/DoctorSelector";
import { DayView } from "@/components/DayView";
import { WeekView } from "@/components/WeekView";
import { useAppointmentScheduler } from "@/hooks/useAppointments";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import hospitalLogo from "/hospitallogo.jpg";
import { cn } from "@/lib/utils";
import { RoleSelector, type UserRole } from "@/components/RoleSelector";
import { useEffect } from "react";

type ViewMode = "day" | "week";

const Index = () => {
  const [selectedDoctorId, setSelectedDoctorId] = useState("d1");
  const [selectedDate, setSelectedDate] = useState<Date>(new Date());
  const [viewMode, setViewMode] = useState<ViewMode>("day");
  const [role, setRole] = useState<UserRole>("frontdesk");
  const [now, setNow] = useState<Date>(new Date());

  // Ticking clock to update current time indicator every minute
  useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 60_000);
    return () => clearInterval(id);
  }, []);

  const {
    doctor,
    dayAppointments,
    weekAppointments,
    weekStart,
    timeSlots,
    loading,
  } = useAppointmentScheduler(selectedDoctorId, selectedDate);

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        <div className="mb-8 flex flex-row items-center gap-6">
          <img src={hospitalLogo} alt="Hospital Logo" className="h-20 w-auto" />
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">
              MyMediMate
            </h1>
            <p className="text-muted-foreground">
              Manage and view doctor appointments efficiently
            </p>
          </div>
        </div>

        <div className="bg-card rounded-lg border p-6 mb-6 space-y-4">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-end justify-between">
            <div className="flex-1 w-full md:w-auto space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">Role</label>
                <RoleSelector role={role} onChange={(r) => setRole(r)} />
              </div>

              <div>
                <label className="text-sm font-medium text-foreground mb-2 block">
                  {role === "frontdesk" ? "Select Doctor" : "Doctor"}
                </label>
                <DoctorSelector
                  selectedDoctorId={selectedDoctorId}
                  onDoctorChange={setSelectedDoctorId}
                  disabled={role === "doctor"}
                />
                {role === "doctor" && (
                  <p className="text-xs text-muted-foreground mt-1">Doctor role is limited to viewing only their own schedule.</p>
                )}
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="w-[200px] justify-start">
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {format(selectedDate, "PPP")}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="end">
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={(date) => date && setSelectedDate(date)}
                    initialFocus
                    className={cn("p-3 pointer-events-auto")}
                  />
                </PopoverContent>
              </Popover>

              <div className="flex gap-2">
                <Button
                  variant={viewMode === "day" ? "default" : "outline"}
                  onClick={() => setViewMode("day")}
                >
                  Day View
                </Button>
                <Button
                  variant={viewMode === "week" ? "default" : "outline"}
                  onClick={() => setViewMode("week")}
                >
                  Week View
                </Button>
              </div>
            </div>
          </div>

          {doctor && (
            <div className="pt-4 border-t">
              <h2 className="text-xl font-semibold text-foreground mb-1">
                {doctor.name}
              </h2>
              <p className="text-sm text-muted-foreground">{doctor.specialty}</p>
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex items-center justify-center h-[600px] bg-card rounded-lg border">
            <p className="text-muted-foreground">Loading appointments...</p>
          </div>
        ) : (
          <div className="bg-card rounded-lg p-6">
            {viewMode === "day" ? (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    {format(selectedDate, "EEEE, MMMM d, yyyy")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {dayAppointments.length} appointment{dayAppointments.length !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
                {dayAppointments.length === 0 ? (
                  <div className="flex items-center justify-center h-[400px] rounded-md border text-muted-foreground">
                    No appointments scheduled for this day.
                  </div>
                ) : (
                  <DayView timeSlots={timeSlots} appointments={dayAppointments} currentTime={now} />
                )}
              </>
            ) : (
              <>
                <div className="mb-4">
                  <h3 className="text-lg font-semibold text-foreground">
                    Week of {format(weekStart, "MMMM d, yyyy")}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {weekAppointments.length} appointment{weekAppointments.length !== 1 ? "s" : ""} scheduled
                  </p>
                </div>
                <div className="flex flex-wrap gap-4 text-xs mb-3">
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-appointment-checkup" /> Checkup</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-appointment-consultation" /> Consultation</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-appointment-followup" /> Follow-up</div>
                  <div className="flex items-center gap-2"><span className="w-3 h-3 rounded-sm bg-appointment-procedure" /> Procedure</div>
                </div>
                {weekAppointments.length === 0 ? (
                  <div className="flex items-center justify-center h-[400px] rounded-md border text-muted-foreground">
                    No appointments scheduled for this week.
                  </div>
                ) : (
                  <WeekView
                    weekStart={weekStart}
                    timeSlots={timeSlots}
                    appointments={weekAppointments}
                    currentTime={now}
                  />
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;
