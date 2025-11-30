import { defineStore } from 'pinia';
import type { Bill, BillFilters } from '@/interfaces/response/bill.interface';
import { toast } from 'vue-sonner';
import api from '@/utils/api';
import { getCurrentUserRole } from '@/utils/auth';
import { UserRole } from '@/utils/rbac';

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
    async fetchBills(filters?: Record<string, any>, role = 0) {
      this.loading = true;
      let url = BASE_URL;
      if (role === 1) url += '/customer';
      if (role === 2) {
        const role = getCurrentUserRole();
        if (role == UserRole.ACCOMMODATION_OWNER) {
          url += '/Accommodation';
        } else if (role == UserRole.FLIGHT_AIRLINE) {
          url += '/Flight';
        } else if (role == UserRole.TOUR_PACKAGE) {
          url += '/TourPackage';
        } else if (role == UserRole.RENTAL_VENDOR) {
          url += '/VehicleRental';
        } else if (role == UserRole.INSURANCE_PROVIDER) {
          url += '/Insurance';
        }
      }
      try {
        const response = await api.get(url, { params: filters });
        this.bills = response.data.data || [];
        toast.success('Bills fetched successfully');
      } catch (err: any) {
        // check if it's 404
        if (err.response?.status === 404) {
          toast.error('No bills yet');
          this.bills = [];
          return;
        } else {
          this.bills = [];
          toast.error('Failed to fetch bills');
          console.error('Failed to fetch bills', err);
        }
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
        if (couponCode){
          await api.post(`${BASE_URL}/${billId}/pay`, { couponCode });
        } 
        else {
          await api.post(`${BASE_URL}/${billId}/pay`);
        }
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
