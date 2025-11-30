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
  /**
   * Create a new review for the given booking
   * @param {ReviewRequest} payload the review data to be created
   * @returns {Promise<ReviewResponse>} the created review
   * @throws {Error} if failed to create review
   */
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


  /**
   * Fetch all reviews written by current customer
   * @returns {Promise<ReviewResponse[]>} the fetched reviews
   * @throws {Error} if failed to fetch reviews
   */
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
    
    /**
     * Fetch a single review by its ID
     * @param {string} reviewID the ID of the review to fetch
     * @returns {Promise<ReviewResponse>} the fetched review
     * @throws {Error} if failed to fetch review
     */
    async fetchReviewById(reviewID: string) {
      this.loading = true;
      this.error = null;
      try {
        const res = await api.get(`/review/${reviewID}`);
        return res.data.data as ReviewResponse; // return detail review
      } catch (err: any) {
        this.error = err.response?.data?.message || 'Failed to load review';
        throw new Error(this.error!);
      } finally {
        this.loading = false;
      }
    },

  }
});
