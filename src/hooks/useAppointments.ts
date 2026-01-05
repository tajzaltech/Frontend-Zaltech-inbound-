import { useState, useCallback } from 'react';
import { appointmentApi } from '../api/appointments';
import type {
    AppointmentStatus
} from '../types/appointment';

export const useAppointments = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getCalendar = useCallback(async (year: number, month: number) => {
        setLoading(true);
        setError(null);
        try {
            const data = await appointmentApi.getCalendar(year, month);
            return data.appointments;
        } catch (err: any) {
            setError(err.message || 'Failed to fetch calendar');
            return [];
        } finally {
            setLoading(false);
        }
    }, []);

    const getStats = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.getStats();
        } catch (err: any) {
            setError(err.message || 'Failed to fetch stats');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const listAppointments = useCallback(async (params: {
        page?: number;
        page_size?: number;
        status?: AppointmentStatus;
        start_date?: string;
        end_date?: string
    }) => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.list(params);
        } catch (err: any) {
            setError(err.message || 'Failed to list appointments');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const createAppointment = useCallback(async (data: any) => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.create(data);
        } catch (err: any) {
            setError(err.message || 'Failed to create appointment');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const updateAppointment = useCallback(async (id: string, data: any) => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.update(id, data);
        } catch (err: any) {
            setError(err.message || 'Failed to update appointment');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const cancelAppointment = useCallback(async (id: string, reason?: string) => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.cancel(id, reason);
        } catch (err: any) {
            setError(err.message || 'Failed to cancel appointment');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    const completeAppointment = useCallback(async (id: string, notes?: string) => {
        setLoading(true);
        setError(null);
        try {
            return await appointmentApi.complete(id, notes);
        } catch (err: any) {
            setError(err.message || 'Failed to complete appointment');
            return null;
        } finally {
            setLoading(false);
        }
    }, []);

    return {
        loading,
        error,
        getCalendar,
        getStats,
        listAppointments,
        createAppointment,
        updateAppointment,
        cancelAppointment,
        completeAppointment,
    };
};
