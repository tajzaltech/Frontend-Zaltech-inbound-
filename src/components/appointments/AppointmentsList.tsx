import { format } from 'date-fns';
import { Phone, Mail, Clock, MoreVertical, ExternalLink } from 'lucide-react';
import type { Appointment } from '../../types/appointment';

interface AppointmentsListProps {
  appointments: Appointment[];
  loading: boolean;
  onAppointmentClick?: (id: string) => void;
}

export const AppointmentsList = ({ appointments, loading, onAppointmentClick }: AppointmentsListProps) => {
  if (loading) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center text-gray-500">
        Loading appointments...
      </div>
    );
  }

  if (appointments.length === 0) {
    return (
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center text-gray-500">
        <Clock className="w-12 h-12 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900">No appointments found</h3>
        <p className="text-gray-500">Try adjusting your filters or check back later.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-100 text-xs font-bold text-gray-500 uppercase tracking-wider">
              <th className="px-6 py-4">Customer</th>
              <th className="px-6 py-4">Service</th>
              <th className="px-6 py-4">Scheduled Date</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {appointments.map((appt) => (
              <tr 
                key={appt.appointment_id} 
                className="hover:bg-gray-50 transition-colors cursor-pointer group"
                onClick={() => onAppointmentClick?.(appt.appointment_id)}
              >
                <td className="px-6 py-4">
                  <div>
                    <div className="font-semibold text-gray-900">{appt.customer_name}</div>
                    <div className="flex flex-col space-y-0.5 mt-1">
                      <div className="flex items-center text-xs text-gray-500">
                        <Phone className="w-3 h-3 mr-1.5" />
                        {appt.customer_phone}
                      </div>
                      {appt.customer_email && (
                        <div className="flex items-center text-xs text-gray-500">
                          <Mail className="w-3 h-3 mr-1.5" />
                          {appt.customer_email}
                        </div>
                      )}
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="text-sm text-gray-700 bg-gray-100 px-2 py-1 rounded-md">
                    {appt.service_name}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 font-medium">
                    {format(new Date(appt.scheduled_date), 'MMM dd, yyyy')}
                  </div>
                  <div className="text-sm text-gray-500">
                    {format(new Date(appt.scheduled_date), 'hh:mm a')} ({appt.duration_minutes} min)
                  </div>
                </td>
                <td className="px-6 py-4">
                  {/* Reuse existing StatusBadge or similar logic */}
                  <span className={`px-2.5 py-1 rounded-full text-xs font-bold uppercase ${
                    appt.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                    appt.status === 'pending' ? 'bg-amber-100 text-amber-700' :
                    appt.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                    appt.status === 'completed' ? 'bg-blue-100 text-blue-700' :
                    'bg-gray-100 text-gray-700'
                  }`}>
                    {appt.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex justify-end space-x-2">
                    {appt.lead_id && (
                      <button 
                        onClick={(e) => {
                          e.stopPropagation();
                          // navigate to lead
                        }}
                        className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all"
                        title="View Lead"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </button>
                    )}
                    <button className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-all">
                      <MoreVertical className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
