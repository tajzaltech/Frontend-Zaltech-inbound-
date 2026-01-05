export type AppointmentStatus =
    | 'confirmed'
    | 'pending'
    | 'cancelled'
    | 'completed'
    | 'no_show';

export interface CalendarAppointment {
    appointment_id: string;
    customer_name: string;
    service_name: string;
    scheduled_date: string;
    duration_minutes: number;
    status: AppointmentStatus;
    lead_id: string | null;
}

export interface Appointment extends CalendarAppointment {
    customer_phone: string;
    customer_email: string | null;
    service_id: string;
    call_id: string | null;
    assigned_user: string | null;
    confirmation_sent: boolean;
    customer_confirmed: boolean;
    notes: string | null;
    created_at: string;
    updated_at: string;
}

export interface CalendarMonthResponse {
    year: number;
    month: number;
    appointments: CalendarAppointment[];
    total_count: number;
}

export interface AppointmentStats {
    total: number;
    confirmed: number;
    pending: number;
    cancelled: number;
    completed: number;
    no_show: number;
    today_count: number;
    this_week_count: number;
    this_month_count: number;
}

export interface CreateAppointmentRequest {
    customer_name: string;
    customer_phone: string;
    customer_email?: string;
    service_id: string;
    service_name?: string;
    scheduled_date: string;
    duration_minutes?: number;
    notes?: string;
    special_requirements?: string;
    lead_id?: string;
}

export interface UpdateAppointmentRequest {
    scheduled_date?: string;
    status?: AppointmentStatus;
    notes?: string;
}
