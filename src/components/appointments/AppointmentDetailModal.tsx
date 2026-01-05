import { useState, useEffect } from 'react';
import { X, Calendar, Clock, Phone, Mail, CheckCircle2, XCircle, Trash2, Edit2, ArrowRight } from 'lucide-react';
import type { Appointment, UpdateAppointmentRequest, AppointmentStatus } from '../../types/appointment';
import { appointmentApi } from '../../api/appointments';

interface AppointmentDetailModalProps {
  appointmentId: string | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: (id: string, data: UpdateAppointmentRequest) => Promise<void>;
  onCancel: (id: string) => Promise<void>;
  onComplete: (id: string) => Promise<void>;
  loading?: boolean;
}

const STATUS_CONFIG: Record<AppointmentStatus, { label: string; color: string; bg: string }> = {
  confirmed: { label: 'Confirmed', color: 'text-green-600', bg: 'bg-green-50' },
  pending: { label: 'Pending', color: 'text-amber-600', bg: 'bg-amber-50' },
  cancelled: { label: 'Cancelled', color: 'text-red-600', bg: 'bg-red-50' },
  completed: { label: 'Completed', color: 'text-blue-600', bg: 'bg-blue-50' },
  no_show: { label: 'No Show', color: 'text-gray-600', bg: 'bg-gray-50' },
};

export const AppointmentDetailModal = ({ 
  appointmentId, 
  isOpen, 
  onClose, 
  onUpdate, 
  onCancel, 
  onComplete,
  loading: actionLoading 
}: AppointmentDetailModalProps) => {
  const [appointment, setAppointment] = useState<Appointment | null>(null);
  const [loading, setLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState<UpdateAppointmentRequest>({});

  useEffect(() => {
    if (isOpen && appointmentId) {
      fetchAppointment();
    } else {
        setAppointment(null);
        setIsEditing(false);
    }
  }, [isOpen, appointmentId]);

  const fetchAppointment = async () => {
    if (!appointmentId) return;
    setLoading(true);
    try {
      const data = await appointmentApi.getById(appointmentId);
      setAppointment(data);
      setEditData({
        scheduled_date: new Date(data.scheduled_date).toISOString().slice(0, 16),
        notes: data.notes || '',
        status: data.status
      });
    } catch (err) {
      console.error('Failed to fetch appointment', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdate = async () => {
    if (!appointmentId) return;
    await onUpdate(appointmentId, editData);
    setIsEditing(false);
    fetchAppointment();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" onClick={onClose} />
      
      <div className="relative bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl border border-gray-100 overflow-hidden animate-in zoom-in-95 duration-200">
        {loading ? (
          <div className="p-20 flex flex-col items-center justify-center">
            <div className="w-10 h-10 border-4 border-red-100 border-t-red-600 rounded-full animate-spin" />
            <p className="mt-4 text-gray-500 font-medium">Loading details...</p>
          </div>
        ) : appointment ? (
          <div className="flex flex-col h-full">
            {/* Header */}
            <div className={`p-8 pb-6 flex justify-between items-start border-b border-gray-50 ${STATUS_CONFIG[appointment.status].bg}`}>
              <div>
                <div className="flex items-center gap-3 mb-2">
                    <span className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${STATUS_CONFIG[appointment.status].bg} ${STATUS_CONFIG[appointment.status].color} border border-current opacity-70`}>
                        {STATUS_CONFIG[appointment.status].label}
                    </span>
                    <span className="text-xs text-gray-500 font-medium tracking-wide">ID: {appointment.appointment_id.slice(-6)}</span>
                </div>
                <h2 className="text-3xl font-black text-gray-900 leading-none">{appointment.customer_name}</h2>
                <div className="flex items-center gap-2 mt-3 text-gray-500">
                    <CheckCircle2 className={`w-4 h-4 ${STATUS_CONFIG[appointment.status].color}`} />
                    <span className="text-sm font-medium">{appointment.service_name}</span>
                </div>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/50 rounded-full transition-colors">
                <X className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <div className="p-8 space-y-8 overflow-y-auto max-h-[60vh]">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Contact Information</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg"><Phone className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold">{appointment.customer_phone}</span>
                    </div>
                    {appointment.customer_email && (
                      <div className="flex items-center gap-3 text-gray-600">
                        <div className="p-2 bg-gray-50 rounded-lg"><Mail className="w-4 h-4" /></div>
                        <span className="text-sm font-semibold truncate">{appointment.customer_email}</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Schedule</h3>
                  <div className="space-y-3">
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg"><Calendar className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold">
                        {new Date(appointment.scheduled_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 text-gray-600">
                      <div className="p-2 bg-gray-50 rounded-lg"><Clock className="w-4 h-4" /></div>
                      <span className="text-sm font-semibold">
                        {new Date(appointment.scheduled_date).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} ({appointment.duration_minutes}m)
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Clinical / Interaction Notes</h3>
                    <button 
                        onClick={() => setIsEditing(!isEditing)} 
                        className="text-xs font-bold text-[#9D1111] hover:opacity-80 flex items-center gap-1.5 transition-all"
                    >
                        {isEditing ? 'Cancel Edit' : <><Edit2 className="w-3 h-3" /> Edit Notes</>}
                    </button>
                </div>
                {isEditing ? (
                  <textarea
                    className="w-full p-4 bg-gray-50 border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500/20 focus:border-red-500 transition-all min-h-[120px]"
                    value={editData.notes}
                    onChange={e => setEditData({ ...editData, notes: e.target.value })}
                    placeholder="Add notes about the session..."
                  />
                ) : (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-100 min-h-[60px]">
                    <p className="text-sm text-gray-600 italic">
                      {appointment.notes || 'No notes available for this appointment.'}
                    </p>
                  </div>
                )}
              </div>

              {/* Quick Actions (If not editing session details) */}
              {!isEditing && appointment.status !== 'cancelled' && appointment.status !== 'completed' && (
                <div className="space-y-4 pt-4">
                  <h3 className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.2em]">Quick Status Update</h3>
                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => onComplete(appointment.appointment_id)}
                      className="flex items-center justify-center gap-2 p-4 bg-green-600 text-white rounded-2xl font-bold shadow-lg shadow-green-900/10 hover:bg-green-700 transition-all active:scale-95"
                    >
                      <CheckCircle2 className="w-5 h-5" />
                      Complete
                    </button>
                    <button
                      onClick={() => onCancel(appointment.appointment_id)}
                      className="flex items-center justify-center gap-2 p-4 bg-gray-100 text-gray-600 rounded-2xl font-bold hover:bg-[#9D1111]/5 hover:text-[#9D1111] transition-all active:scale-95"
                    >
                      <XCircle className="w-5 h-5" />
                      Cancel
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="p-8 bg-gray-50 flex items-center justify-between">
              {appointment.lead_id ? (
                <button className="flex items-center gap-2 text-sm font-bold text-blue-600 hover:text-blue-700">
                    <ArrowRight className="w-4 h-4" />
                    View Associated Lead
                </button>
              ) : <div />}
              
              <div className="flex gap-3">
                {isEditing ? (
                  <button
                    onClick={handleUpdate}
                    disabled={actionLoading}
                    className="btn-primary px-8 py-2.5"
                  >
                    Save Changes
                  </button>
                ) : (
                  <button className="p-2.5 text-[#9D1111] hover:bg-red-50 rounded-xl transition-colors">
                    <Trash2 className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
};
