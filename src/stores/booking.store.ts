import { defineStore } from 'pinia';
import api from '@/utils/api';
import { toast } from 'vue-sonner';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { AccommodationBookingResponseDTO } from '@/interfaces/response/booking.interface';
import type { AddBookingRequest } from '@/interfaces/request/add.booking.interface';

const baseBookingUrl = import.meta.env.VITE_API_URL + '/booking';

export const useBookingStore = defineStore('booking', {
  state: () => ({
    bookings: null as AccommodationBookingResponseDTO[] | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    // Fetch all bookings
    async fetchBookings() {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get<CommonResponseInterface<AccommodationBookingResponseDTO[]>>(baseBookingUrl);
        this.bookings = res.data.data ?? [];
        if (!this.bookings || this.bookings.length === 0) {
          toast.warning('Tidak ada booking ditemukan');
        }
        return this.bookings;
      } catch (err: any) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`Gagal memuat booking: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Fetch single booking by ID
    async fetchBookingById(bookingID: string) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get<CommonResponseInterface<AccommodationBookingResponseDTO>>(
          `${baseBookingUrl}/${bookingID}`
        );
        return response.data.data;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load booking details: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Create new booking
    async createBooking(payload: AddBookingRequest) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.post<CommonResponseInterface<any>>(`${baseBookingUrl}/create`, payload);
        toast.success('Booking created successfully');
        return res.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Failed to create booking';
        this.error = message;
        toast.error(message);
        return null;
      } finally {
        this.loading = false;
      }
    },

    //  Update existing booking
    async updateBooking(bookingID: string, payload: AddBookingRequest) {
      this.loading = true;
      this.error = null;

      try {
        const res = await api.put<CommonResponseInterface<any>>(`${baseBookingUrl}/update/${bookingID}`, payload);
        toast.success('Booking updated successfully');
        return res.data.data;
      } catch (err: any) {
        const message = err.response?.data?.message || err.message || 'Failed to update booking';
        this.error = message;
        toast.error(message);
        return null;
      } finally {
        this.loading = false;
      }
    },

    // Pay booking
    async payBooking(bookingId: string) {
      try {
        const response = await api.post<CommonResponseInterface<void>>(
          `${baseBookingUrl}/pay/${bookingId}`
        );
        toast.success('Payment Succesful');
        return response.data;
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Gagal melakukan pembayaran';
        toast.error(msg);
      }
    },

    // Cancel booking
    async cancelBooking(bookingId: string) {
      try {
        const response = await api.post<CommonResponseInterface<void>>(
          `${baseBookingUrl}/cancel/${bookingId}`
        );
        toast.success('Booking cancelled');
        return response.data;
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to cancel booking';
        toast.error(msg);
      }
    },

    // Refund booking
    async refundBooking(bookingId: string) {
      try {
        const response = await api.post<CommonResponseInterface<void>>(
          `${baseBookingUrl}/refund/${bookingId}`
        );
        toast.success('Refund successful');
        return response.data;
      } catch (error: any) {
        const msg = error.response?.data?.message || 'Failed to refund';
        toast.error(msg);
      }
    },
  },
});
