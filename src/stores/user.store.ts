import { defineStore } from 'pinia';
import type { UserInfo } from '@/interfaces/response/userinfo.inteface';
import { toast } from 'vue-sonner';
import api from '@/utils/api';

const authBaseURL = import .meta.env.VITE_AUTH_BE_URL;

export const useUserStore = defineStore('users', {
  state: () => ({
    owners: [] as UserInfo[],
    loading: false,
  }),

  actions: {
    async fetchOwners(search?: string) {
      this.loading = true;
      try {
        const response = await api.get(`${authBaseURL}/users`, {
          params: {
            role: 'ACCOMMODATION_OWNER',
            search: search || undefined
          }
        });

        this.owners = response.data.data || [];
      } catch (err) {
        toast.error('Failed to fetch owners');
        console.error('Failed to fetch owners', err);
        this.owners = [];
      } finally {
        this.loading = false;
      }
    }
  }
});
