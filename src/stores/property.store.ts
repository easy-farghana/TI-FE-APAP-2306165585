import { defineStore } from 'pinia';
import axios from 'axios';
import { toast } from 'vue-sonner';
import type { AllProperty, PropertyResponseDTO } from '@/interfaces/response/property.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { PropertyTransactionRequest } from '@/interfaces/request/add.property.interface';

const baseUrl = import.meta.env.VITE_API_URL + '/property';

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: null as AllProperty[] | null,
    loading: false,
    error: null as string | null,
  }),
  actions: {
    async fetchProperties() {
      this.loading = true;
      this.error = null;
      try {
        const res = await axios.get<CommonResponseInterface<AllProperty[]>>(baseUrl);
        this.properties = res.data.data ?? [];
        if (!this.properties || this.properties.length === 0) {
          toast.warning('Tidak ada properti ditemukan');
        }
        return this.properties;
      } catch (err: any) {
        this.error = err instanceof Error ? err.message : 'Unknown error';
        toast.error(`Gagal memuat properti: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async fetchPropertyById(propertyId: string, checkIn?: string, checkOut?: string) {
      this.loading = true;
      this.error = null;
      try {
        const params = new URLSearchParams();
        if (checkIn) params.append('checkIn', checkIn);
        if (checkOut) params.append('checkOut', checkOut);
        const response = await axios.get<CommonResponseInterface<PropertyResponseDTO>>(`${baseUrl}/${propertyId}`, { params });
        return response.data.data;
      } catch (error: any) {
        this.error = error instanceof Error ? error.message : 'Unknown error';
        toast.error(`Failed to load property: ${this.error}`);
        return null;
      } finally {
        this.loading = false;
      }
    },

    async createProperty(payload: PropertyTransactionRequest) {
      try {
        const response = await axios.post<CommonResponseInterface<PropertyResponseDTO>>(
          `${baseUrl}/create`,
          payload
        );
        return response.data.data;
      } catch (error: any) {
        throw error;
      }
    },

    async deleteProperty(propertyId: string) {
      try {
        await axios.delete<CommonResponseInterface<void>>(`${baseUrl}/delete/${propertyId}`);
        // Refresh the properties list after deletion
        await this.fetchProperties();
        return true;
      } catch (error: any) {
        throw error;
      }
    }
  },
});