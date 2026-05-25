import { defineStore } from 'pinia';
import api from '@/utils/api'; 
import { toast } from 'vue-sonner';
import type {
  AllProperty,
  PropertyResponseDTO,
} from '@/interfaces/response/property.interface';
import type { CommonResponseInterface } from '@/interfaces/common.response.interface';
import type { PropertyTransactionRequest } from '@/interfaces/request/add.property.interface';
import router from '@/router';
import { isCustomer } from '@/utils/rbac';

const baseUrl = import.meta.env.VITE_API_URL + '/property';

export const usePropertiesStore = defineStore('properties', {
  state: () => ({
    properties: null as AllProperty[] | null,
    loading: false,
    error: null as string | null,
  }),

  actions: {
    async fetchPropertiesFiltered(filters: {
      name?: string;
      type?: number;
      province?: number;
    }) {
      this.loading = true;
      this.error = null;

      try {
        const params = new URLSearchParams();
        var propertyUrl = baseUrl;
        if (filters.name) params.append('name', filters.name);
        if (filters.type) params.append('type', String(filters.type));
        if (filters.province) params.append('province', String(filters.province));
        if (isCustomer()) propertyUrl += '-active'; 
        const res = await api.get<CommonResponseInterface<AllProperty[]>>(propertyUrl, {
          params,
        });

        this.properties = res.data.data ?? [];
        return this.properties;
      } catch (err: any) {
        this.error = err.message || 'Unknown error';
        toast.error(`Failed to fetch properties: ${this.error}`);
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

        const response = await api.get<CommonResponseInterface<PropertyResponseDTO>>(
          `${baseUrl}/${propertyId}`,
          { params }
        );

        return response.data.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to load details';

        toast.error(message);
      } finally {
        this.loading = false;
      }
    },

    async createProperty(payload: PropertyTransactionRequest) {
      try {
        const response = await api.post<CommonResponseInterface<PropertyResponseDTO>>(
          `${baseUrl}/create`,
          payload
        );

        return response.data.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to create property';

        toast.error(message);
        throw error
      }
    },

    async addRoomType(propertyId: string, payload: { roomTypes: any[] }) {
      try {
        const response = await api.post(
          `${baseUrl}/add-room-type/${propertyId}`,
          payload
        );

        return response.data;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to add room type';

        toast.error(message);
      }
    },

    async deleteProperty(propertyId: string) {
      try {
        await api.delete<CommonResponseInterface<void>>(
          `${baseUrl}/delete/${propertyId}`
        );

        // Refresh list after deletion
        await this.fetchPropertiesFiltered({});
        toast.success("Succesfully deleted property");
        router.push("/property");
        return true;
      } catch (error: any) {
        const message =
          error.response?.data?.message ||
          error.message ||
          'Failed to delete property';

        toast.error(message);
        return null;
      }
    },

    async updateProperty(payload: {
      property: {
        propertyId: string;
        type: number;
        province: number;
        propertyName: string;
        address: string;
        description: string;
      };
      roomTypes: any[];
    }) {
      try {
        const response = await api.put<CommonResponseInterface<void>>(
          `${baseUrl}/update`,
          payload
        );

        return response.data;
      } catch (error: any) {
        throw error;
      }
    },
  },
});
