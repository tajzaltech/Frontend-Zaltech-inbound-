import { useState, useEffect } from 'react';
import { Header } from '../../components/layout/Header';
import { useAppointments } from '../../hooks/useAppointments';
import { AppointmentStatsCards } from '../../components/appointments/AppointmentStats';
import { AppointmentsCalendar } from '../../components/appointments/AppointmentsCalendar';
import { AppointmentsList } from '../../components/appointments/AppointmentsList';
import { AppointmentModal } from '../../components/appointments/AppointmentModal';
import { AppointmentDetailModal } from '../../components/appointments/AppointmentDetailModal';
import { LayoutGrid, List, Plus } from 'lucide-react';
import type { Appointment, CalendarAppointment, AppointmentStats, CreateAppointmentRequest, UpdateAppointmentRequest } from '../../types/appointment';

export function AppointmentsPage() {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [currentDate, setCurrentDate] = useState(new Date());
  const [appointments, setAppointments] = useState<CalendarAppointment[]>([]);
  const [listData, setListData] = useState<Appointment[]>([]);
  const [stats, setStats] = useState<AppointmentStats | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState<string | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  
  const { 
    loading, 
    getCalendar, 
    getStats, 
    listAppointments, 
    createAppointment,
    updateAppointment,
    cancelAppointment,
    completeAppointment 
  } = useAppointments();

  const fetchData = async () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth() + 1;
    
    if (view === 'calendar') {
      const data = await getCalendar(year, month);
      setAppointments(data);
    } else {
      const data = await listAppointments({ page: 1, page_size: 100 });
      if (data) setListData(data.appointments);
    }
  };

  const fetchStats = async () => {
    const data = await getStats();
    if (data) setStats(data);
  };

  const handleCreateAppointment = async (data: CreateAppointmentRequest) => {
    const result = await createAppointment(data);
    if (result) {
      setIsModalOpen(false);
      fetchData();
      fetchStats();
    }
  };

  const handleUpdate = async (id: string, data: UpdateAppointmentRequest) => {
    const result = await updateAppointment(id, data);
    if (result) {
      fetchData();
      fetchStats();
    }
  };

  const handleCancel = async (id: string) => {
      const result = await cancelAppointment(id);
      if (result) {
          fetchData();
          fetchStats();
      }
  };

  const handleComplete = async (id: string) => {
      await completeAppointment(id);
      fetchData();
      fetchStats();
  };

  const openDetail = (id: string) => {
      setSelectedAppointmentId(id);
      setIsDetailModalOpen(true);
  };

  useEffect(() => {
    fetchData();
  }, [currentDate, view]);

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[#FAFAFA]">
      <Header title="Appointments" />
      
      <div className="flex-1 p-4 lg:p-8 overflow-y-auto custom-scrollbar">
        <div className="max-w-7xl mx-auto">
          {/* Header Actions */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
            <AppointmentStatsCards stats={stats} />
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-6">
            <div className="flex bg-white rounded-xl p-1 border border-gray-100 shadow-sm overflow-hidden">
              <button
                onClick={() => setView('calendar')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  view === 'calendar' 
                    ? 'bg-[#9D1111]/10 text-[#9D1111] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="truncate">Calendar View</span>
              </button>
              <button
                onClick={() => setView('list')}
                className={`flex-1 sm:flex-none flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all ${
                  view === 'list' 
                    ? 'bg-[#9D1111]/10 text-[#9D1111] shadow-sm' 
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <List className="w-4 h-4" />
                <span className="truncate">List View</span>
              </button>
            </div>

            <button 
              onClick={() => setIsModalOpen(true)}
              className="btn-primary flex items-center justify-center gap-2 py-2.5 sm:py-2 text-sm"
            >
              <Plus className="w-4 h-4" />
              <span>New Appointment</span>
            </button>
          </div>

          {view === 'calendar' ? (
            <AppointmentsCalendar 
              appointments={appointments}
              currentDate={currentDate}
              onDateChange={setCurrentDate}
              onAppointmentClick={openDetail}
            />
          ) : (
            <AppointmentsList 
              appointments={listData}
              loading={loading}
              onAppointmentClick={openDetail}
            />
          )}
        </div>
      </div>

      <AppointmentModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleCreateAppointment}
        loading={loading}
      />

      <AppointmentDetailModal 
        appointmentId={selectedAppointmentId}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onUpdate={handleUpdate}
        onCancel={handleCancel}
        onComplete={handleComplete}
        loading={loading}
      />
    </div>
  );
}
