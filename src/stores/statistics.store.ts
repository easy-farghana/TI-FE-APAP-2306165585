import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';
import type { Statistic } from '@/interfaces/response/statistic.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';

const baseStatisticsUrl = import.meta.env.VITE_API_URL + '/statistics';

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    statistics: null as Statistic | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchStatistics() {
      this.loading = true;
      this.error = null;

      try {
        const response = await axios.get<CommonResponseInterface<Statistic>>(baseStatisticsUrl);
        this.statistics = response.data.data;

        if (!this.statistics) {
          toast.warning('Data statistik kosong');
        }

        return this.statistics;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Gagal memuat statistik: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },
  },
});
