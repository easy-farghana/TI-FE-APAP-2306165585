import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';
import type { Statistic } from '@/interfaces/response/statistic.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';

const baseUrl = import.meta.env.VITE_API_URL
const baseStatisticsUrl = import.meta.env.VITE_API_URL + '/statistics';

export interface IncomeStatistic {
  propertyName: string;
  income: number;
}

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    statistics: null as Statistic | null,
    incomeStatistics: [] as IncomeStatistic[],
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

        if (!this.statistics) toast.warning('Data statistik kosong');

        return this.statistics;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Gagal memuat statistik: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchIncomeStatistics(month: number, year: number) {
      this.loading = true;
      this.error = null;

      try {
        const url = `${baseUrl}/chart?month=${month}&year=${year}`;
        const response = await axios.get<CommonResponseInterface<IncomeStatistic[]>>(url);

        this.incomeStatistics = response.data.data || [];

        if (!this.incomeStatistics.length) {
          toast.warning('Tidak ada data income untuk bulan & tahun ini');
        }

        return this.incomeStatistics;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Gagal memuat income statistics: ${this.error}`);
        return [];
      } finally {
        this.loading = false;
      }
    },
  },
});
