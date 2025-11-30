<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill.store';
import VButton from '@/components/common/VButton.vue';
import VBillsChip from '@/components/common/VBillsChip.vue';
import type { Bill } from '@/interfaces/response/bill.interface';

const billStore = useBillStore();
const { bills, loading } = storeToRefs(billStore);
const router = useRouter();
const route = useRoute();

// Detect if it's customer view
const isCustomerView = route.path.includes('/customer');

// Filters
const searchStatus = ref<number | ''>('');
const sortBy = ref('createdAt');
const sortDir = ref<'asc' | 'desc'>('desc');

// For normal view
const searchCustomerID = ref('');
const searchServiceName = ref('');

// Watch filters for auto fetch
watch([searchStatus, sortBy, sortDir], fetchBillFiltered);
if (!isCustomerView) {
  watch([searchCustomerID, searchServiceName], fetchBillFiltered);
}

function fetchBillFiltered() {
  if (isCustomerView) {
    billStore.fetchBills({
      status: searchStatus.value !== '' ? searchStatus.value : undefined,
      sortBy: sortBy.value,
      sortDir: sortDir.value,
    }, true);
  } else {
    billStore.fetchBills({
      customerID: searchCustomerID.value || undefined,
      serviceName: searchServiceName.value || undefined,
      status: searchStatus.value !== '' ? searchStatus.value : undefined,
    }, false);
  }
}

// Initial fetch
onMounted(() => fetchBillFiltered());

// Navigate to bill detail page
const goToDetail = (billId: string) => router.push(`/bill/${billId}`);
</script>


<template>
  <div class="p-6 mt-16">
    <h1 class="text-2xl font-semibold mb-6">All Bills</h1>

    <!-- Filters -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <!-- Customer path: only show status, sort -->
      <template v-if="isCustomerView">
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Status</label>
          <input
            type="number"
            v-model.number="searchStatus"
            placeholder="Filter by Status..."
            class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Sort By</label>
          <select v-model="sortBy" class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="createdAt">Created At</option>
            <option value="amount">Amount</option>
          </select>
        </div>

        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Sort Direction</label>
          <select v-model="sortDir" class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </div>
      </template>

      <!-- Normal view -->
      <template v-else>
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Customer ID</label>
          <input type="text" v-model="searchCustomerID" placeholder="Search by Customer ID..." class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Service Name</label>
          <input type="text" v-model="searchServiceName" placeholder="Search by Service Name..." class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div class="flex flex-col">
          <label class="mb-2 text-sm font-medium text-gray-700">Status</label>
          <input type="number" v-model.number="searchStatus" placeholder="Filter by Status..." class="px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"/>
        </div>
      </template>
    </div>


    <div v-if="loading" class="text-gray-600">Loading bills...</div>
    <div v-if="!loading && bills.length === 0" class="text-gray-500">No bills found.</div>

    <div v-if="bills.length > 0" class="overflow-x-auto bg-white rounded-lg shadow">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
          <tr>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reference ID</th>
            <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer ID</th>
            <th class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Amount</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Status</th>
            <th class="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase">Actions</th>
          </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
          <tr v-for="bill in bills" :key="bill.billID" class="hover:bg-gray-50">
            <td class="px-6 py-4 text-sm text-gray-900">{{ bill.serviceName }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ bill.serviceReferenceID }}</td>
            <td class="px-6 py-4 text-sm text-gray-900">{{ bill.customerID }}</td>
            <td class="px-6 py-4 text-sm text-right">{{ bill.amount }}</td>
            <td class="px-6 py-4 text-sm text-center">
              <VBillsChip :activeStatus="bill.status" />
            </td>
            <td class="px-6 py-4 text-sm text-center">
              <VButton variant="info" size="sm" @click="goToDetail(bill.billID)">
                Details
              </VButton>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
