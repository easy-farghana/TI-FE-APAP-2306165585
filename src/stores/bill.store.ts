import { defineStore } from 'pinia';
import type { Bill, BillFilters } from '@/interfaces/response/bill.interface';
import { toast } from 'vue-sonner';
import api from '@/utils/api';

const BASE_URL = import.meta.env.VITE_API_URL + '/bill';

export const useBillStore = defineStore('bill', {
  state: () => ({
    bills: [] as Bill[],
    billDetail: null as Bill | null,
    loading: false
  }),

  actions: {
    /**
     * Fetch bills with optional filters on customer ID, service name, and status
     * 
     * @param {Record<string, any>} filters a map containing the filters
     * @param {boolean} customerOnly whether to fetch only customer bills or all bills
     * @returns {Promise<void>} 
     */
    async fetchBills(filters?: Record<string, any>, customerOnly = false) {
      this.loading = true;
      let url = BASE_URL;
      if (customerOnly) url += '/customer';
      try {
        const response = await api.get(url, { params: filters });
        this.bills = response.data.data || [];
        toast.success('Bills fetched successfully');
      } catch (err) {
        toast.error('Failed to fetch Bills');
        console.error('Failed to fetch bills', err);
        this.bills = [];
      } finally {
        this.loading = false;
      }
    },
    
    /**
     * Fetch the detail of a bill by its ID
     * 
     * @param {string} billId the ID of the bill to fetch
     * @returns {Promise<void>} 
     */
     async fetchBillDetail(billId: string) {
      this.loading = true;
      try {
        const res = await api.get(`${BASE_URL}/detail/${billId}`);
        toast.success('Bill detail fetched successfully');
        this.billDetail = res.data.data ?? null;
      } finally {
        this.loading = false;
      }
    },

    async payBill(billId: string, couponCode?: string | null) {
      this.loading = true;
      try {
        await api.post(`${BASE_URL}/${billId}/pay`);
        toast.success('Bill paid successfully');
      } catch (err) {
        toast.error('Failed to pay bill');
        console.error('Failed to pay bill', err);
      } finally {
        this.loading = false;
      }
    }
  }
});
