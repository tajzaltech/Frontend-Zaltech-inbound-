import type { CalendarAppointment } from '../../types/appointment';
import { AppointmentCard } from './AppointmentCard';

interface CalendarDayProps {
  day: number;
  isToday: boolean;
  isCurrentMonth: boolean;
  appointments: CalendarAppointment[];
  onAppointmentClick?: (id: string) => void;
}

export const CalendarDay = ({ 
  day, 
  isToday, 
  isCurrentMonth, 
  appointments,
  onAppointmentClick 
}: CalendarDayProps) => {
  return (
    <div className={`min-h-[80px] sm:min-h-[120px] p-1 sm:p-2 hover:bg-gray-50/50 transition-colors ${
      !isCurrentMonth ? 'bg-gray-50/50' : 'bg-white'
    }`}>
      <div className="flex justify-between items-start mb-1 sm:mb-2">
        <span className={`text-[10px] sm:text-sm font-bold rounded-lg w-5 h-5 sm:w-7 sm:h-7 flex items-center justify-center transition-all ${
          isToday 
            ? 'bg-red-600 text-white shadow-md shadow-red-900/20' 
            : isCurrentMonth ? 'text-gray-700' : 'text-gray-300'
        }`}>
          {day}
        </span>
        {appointments.length > 0 && (
          <span className="text-[8px] sm:text-[10px] bg-red-50 text-red-600 px-1 sm:px-1.5 py-0.5 rounded-md font-bold border border-red-100/50">
            {appointments.length}
          </span>
        )}
      </div>
      <div className="space-y-1 max-h-[60px] sm:max-h-[100px] overflow-y-auto hidden sm:block">
        {appointments.map(appt => (
          <AppointmentCard 
            key={appt.appointment_id} 
            appointment={appt} 
            onClick={onAppointmentClick}
          />
        ))}
      </div>
      {/* Mobile Dot Indicator */}
      <div className="flex flex-wrap gap-0.5 mt-1 sm:hidden">
        {appointments.slice(0, 3).map((_, i) => (
          <div key={i} className="w-1 h-1 rounded-full bg-red-400" />
        ))}
        {appointments.length > 3 && (
          <div className="w-1 h-1 rounded-full bg-gray-300" />
        )}
      </div>
    </div>
  );
};
