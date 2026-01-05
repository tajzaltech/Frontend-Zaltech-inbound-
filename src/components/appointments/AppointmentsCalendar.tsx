import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { CalendarAppointment } from '../../types/appointment';
import { CalendarDay } from './CalendarDay';

interface AppointmentsCalendarProps {
  appointments: CalendarAppointment[];
  currentDate: Date;
  onDateChange: (date: Date) => void;
  onAppointmentClick?: (id: string) => void;
}

export const AppointmentsCalendar = ({ 
  appointments, 
  currentDate, 
  onDateChange,
  onAppointmentClick 
}: AppointmentsCalendarProps) => {
  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const prevMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    onDateChange(newDate);
  };

  const nextMonth = () => {
    const newDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);
    onDateChange(newDate);
  };

  const calendarDays = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    const numDays = daysInMonth(year, month);
    const startDay = firstDayOfMonth(year, month);
    
    const prevMonthNumDays = daysInMonth(year, month - 1);
    
    const days = [];
    
    // Previous month padding
    for (let i = startDay - 1; i >= 0; i--) {
      days.push({
        day: prevMonthNumDays - i,
        isCurrentMonth: false,
        date: new Date(year, month - 1, prevMonthNumDays - i)
      });
    }
    
    // Current month days
    for (let i = 1; i <= numDays; i++) {
        days.push({
            day: i,
            isCurrentMonth: true,
            date: new Date(year, month, i)
        });
    }
    
    // Next month padding
    const remaining = 42 - days.length; // 6 rows of 7 days
    for (let i = 1; i <= remaining; i++) {
        days.push({
            day: i,
            isCurrentMonth: false,
            date: new Date(year, month + 1, i)
        });
    }
    
    return days;
  }, [currentDate]);

  const appointmentsByDay = useMemo(() => {
    const map: Record<string, CalendarAppointment[]> = {};
    appointments.forEach(appt => {
      const date = new Date(appt.scheduled_date);
      const key = `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
      if (!map[key]) map[key] = [];
      map[key].push(appt);
    });
    return map;
  }, [appointments]);

  const weekDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-4">
        <h2 className="text-lg font-bold text-gray-900">
          {currentDate.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex space-x-1">
            <button 
              onClick={prevMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 sm:border-transparent"
            >
              <ChevronLeft className="w-5 h-5 text-gray-600" />
            </button>
            <button 
              onClick={nextMonth}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors border border-gray-100 sm:border-transparent"
            >
              <ChevronRight className="w-5 h-5 text-gray-600" />
            </button>
          </div>
          <button 
            onClick={() => onDateChange(new Date())}
            className="px-4 py-2 sm:px-3 sm:py-1 text-sm font-medium text-blue-600 hover:bg-blue-50 border border-blue-100 sm:border-transparent rounded-lg transition-colors"
          >
            Today
          </button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 bg-gray-50 border-b border-gray-100">
        {weekDays.map(day => (
          <div key={day} className="py-2 text-center text-[10px] sm:text-xs font-bold text-gray-500 uppercase tracking-wider">
            <span className="hidden sm:inline">{day}</span>
            <span className="sm:hidden">{day.charAt(0)}</span>
          </div>
        ))}
      </div>
      
      <div className="grid grid-cols-7 divide-x divide-y divide-gray-100 border-l border-t border-gray-100">
        {calendarDays.map((dayObj, index) => {
          const key = `${dayObj.date.getFullYear()}-${dayObj.date.getMonth()}-${dayObj.date.getDate()}`;
          const isToday = new Date().toDateString() === dayObj.date.toDateString();
          
          return (
            <CalendarDay 
              key={index}
              day={dayObj.day}
              isToday={isToday}
              isCurrentMonth={dayObj.isCurrentMonth}
              appointments={appointmentsByDay[key] || []}
              onAppointmentClick={onAppointmentClick}
            />
          );
        })}
      </div>
    </div>
  );
};
