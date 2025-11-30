import { defineStore } from 'pinia';
import api from '@/utils/api';
import type { ReviewRequest } from '@/interfaces/request/add.review.interface';
import type { ReviewResponse } from '@/interfaces/response/review.interface';
import { toast } from 'vue-sonner';

export const useReviewStore = defineStore('review', {
  state: () => ({
    reviews: [] as ReviewResponse[],
    loading: false,
    error: '' as string | null,
  }),
  actions: {
    async createReview(payload: ReviewRequest) {
      try {
        const res = await api.post('/review/create', payload);
        return res.data as ReviewResponse;
      } catch (err: any) {
        throw err.response?.data?.message || 'Failed to create review';
      }
    },

    async fetchReviewsByProperty(propertyID: string) {
      this.loading = true;
      this.error = null;
      this.reviews = []; // reset array
      try {
        const res = await api.get(`/review/property/${propertyID}`);
        this.reviews = res.data.data ?? []; // <-- gunakan .data
        console.log('Reviews:', this.reviews);
        toast.success('Reviews loaded successfully');
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to load reviews';
      } finally {
        this.loading = false;
      }
    },

    async fetchReviewsByCustomer() {
      this.loading = true;
      this.error = null;
      this.reviews = [];
      try {
        const res = await api.get('/review/customer');
        this.reviews = res.data.data ?? [];
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to load reviews';
      } finally {
        this.loading = false;
      }
    },
  }
});
