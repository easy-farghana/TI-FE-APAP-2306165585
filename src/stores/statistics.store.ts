import { defineStore } from 'pinia';
import api from '@/utils/api';             
import { toast } from 'vue-sonner';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';

const baseUrl = import.meta.env.VITE_API_URL;

export interface PropertyStatistic {
  propertyName: string;
  propertyIncomes: number;
}

export interface IncomeStatisticsDTO {
  propertyStatistics: PropertyStatistic[];
  totalIncome: number;
}

export const useStatisticsStore = defineStore('statistics', {
  state: () => ({
    incomeStatistics: [] as PropertyStatistic[],
    totalIncome: 0,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchIncomeStatistics(month: number, year: number) {
      this.loading = true;
      this.error = null;

      try {
        const url = `${baseUrl}/booking/chart?month=${month}&year=${year}`;
        const response = await api.get<CommonResponseInterface<IncomeStatisticsDTO>>(url);

        const data = response.data.data;
        if (!data || !data.propertyStatistics.length) {
          toast.warning('Tidak ada data income untuk bulan & tahun ini');
          this.incomeStatistics = [];
          this.totalIncome = 0;
        } else {
          this.incomeStatistics = data.propertyStatistics;
          this.totalIncome = data.totalIncome;
        }

        return this.incomeStatistics;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Gagal memuat income statistics: ${this.error}`);
        this.incomeStatistics = [];
        this.totalIncome = 0;
        return [];
      } finally {
        this.loading = false;
      }
    },
  },
});
