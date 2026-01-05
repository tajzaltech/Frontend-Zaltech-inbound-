import { apiClient } from './client';
import type {
    Appointment,
    AppointmentStats,
    CalendarMonthResponse,
    CreateAppointmentRequest,
    UpdateAppointmentRequest,
    AppointmentStatus
} from '../types/appointment';

export const appointmentApi = {
    getCalendar: (year: number, month: number) =>
        apiClient.get<CalendarMonthResponse>(`/ops/appointments/calendar?year=${year}&month=${month}`),

    list: (params: { page?: number; page_size?: number; status?: AppointmentStatus; start_date?: string; end_date?: string }) => {
        const query = new URLSearchParams();
        if (params.page) query.append('page', params.page.toString());
        if (params.page_size) query.append('page_size', params.page_size.toString());
        if (params.status) query.append('status', params.status);
        if (params.start_date) query.append('start_date', params.start_date);
        if (params.end_date) query.append('end_date', params.end_date);

        return apiClient.get<{ appointments: Appointment[]; total: number; page: number; page_size: number }>(
            `/ops/appointments/?${query.toString()}`
        );
    },

    getStats: () =>
        apiClient.get<AppointmentStats>('/ops/appointments/stats'),

    getById: (id: string) =>
        apiClient.get<Appointment>(`/ops/appointments/${id}`),

    create: (data: CreateAppointmentRequest) =>
        apiClient.post<Appointment>('/ops/appointments/', data),

    update: (id: string, data: UpdateAppointmentRequest) =>
        apiClient.patch<Appointment>(`/ops/appointments/${id}`, data),

    cancel: (id: string, reason?: string) =>
        apiClient.post<{ success: boolean; appointment_id: string; status: string; cancelled_at: string }>(
            `/ops/appointments/${id}/cancel${reason ? `?reason=${encodeURIComponent(reason)}` : ''}`
        ),

    complete: (id: string, notes?: string) =>
        apiClient.post<void>(`/ops/appointments/${id}/complete${notes ? `?notes=${encodeURIComponent(notes)}` : ''}`),

    markNoShow: (id: string) =>
        apiClient.post<void>(`/ops/appointments/${id}/no-show`),
};
