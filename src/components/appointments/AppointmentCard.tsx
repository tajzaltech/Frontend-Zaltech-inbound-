import type { CalendarAppointment, AppointmentStatus } from '../../types/appointment';

const statusColors: Record<AppointmentStatus, string> = {
  confirmed: 'bg-green-100 text-green-700 border-green-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  cancelled: 'bg-red-100 text-red-700 border-red-200',
  completed: 'bg-blue-100 text-blue-700 border-blue-200',
  no_show: 'bg-gray-100 text-gray-700 border-gray-200'
};

interface AppointmentCardProps {
  appointment: CalendarAppointment;
  onClick?: (id: string) => void;
}

export const AppointmentCard = ({ appointment, onClick }: AppointmentCardProps) => {
  const time = new Date(appointment.scheduled_date).toLocaleTimeString([], { 
    hour: '2-digit', 
    minute: '2-digit' 
  });

  return (
    <div 
      onClick={() => onClick?.(appointment.appointment_id)}
      className={`p-2 mb-1 rounded border text-[10px] leading-tight cursor-pointer transition-colors ${statusColors[appointment.status]} hover:opacity-80`}
    >
      <div className="font-bold truncate">{time} - {appointment.customer_name}</div>
      <div className="truncate opacity-80">{appointment.service_name}</div>
    </div>
  );
};
