<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { storeToRefs } from 'pinia';
import { useBillStore } from '@/stores/bill.store';
import VButton from '@/components/common/VButton.vue';
import VBillsChip from '@/components/common/VBillsChip.vue';
import { format } from 'date-fns';
import { isCustomer } from '@/utils/rbac';
import VConfirmModal from '@/components/common/VConfirmModal.vue';


const showPayConfirm = ref(false);
const billStore = useBillStore();
const { billDetail, loading } = storeToRefs(billStore);
const route = useRoute();
const router = useRouter();
const billId = route.params.billId as string;

const canPay = computed(() => {
  return isCustomer() && billDetail.value?.status === 0; 
});

const handlePayment = async ({ couponCode }: { couponCode: string }) => {
  if (!billDetail.value) return;

  await billStore.payBill(billDetail.value.billID, couponCode);

  await billStore.fetchBillDetail(billDetail.value.billID);
  showPayConfirm.value = false;
};

onMounted(() => {
  if (billId) billStore.fetchBillDetail(billId);
});

const goBack = () => router.push('/bill');

const formatDateTime = (dateString: string | null) => {
  if (!dateString) return '-';
  return format(new Date(dateString), 'dd MMM yyyy, HH:mm:ss');
};

const askConfirmPay = async () => {
  console.log("yea")
  showPayConfirm.value = true;
}
</script>

<template>
  <div class="p-6 mt-16 max-w-4xl mx-auto">
    <div v-if="loading" class="text-gray-600 text-center">Loading bill details...</div>
    <div v-else-if="!billDetail" class="text-red-600 text-center">Bill not found.</div>

    <div v-else class="bg-white rounded-lg shadow-lg p-8 space-y-6">
      <!-- Header -->
      <div class="flex justify-between items-center mb-4">
        <h1 class="text-2xl font-bold">Bill Details: {{ billDetail.billID }}</h1>

        <div class="mt-4 flex gap-2">
          <VButton variant="secondary" size="sm" @click="goBack">Back</VButton>
          <VButton
            v-if="canPay"
            variant="primary"
            size="sm"
            @click="askConfirmPay"
          >
            Pay Now
          </VButton>
        </div>
      </div>

      <!-- Grid Details -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Service Name</p>
          <p class="text-base font-medium">{{ billDetail.serviceName }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Reference ID</p>
          <p class="text-base font-medium">{{ billDetail.serviceReferenceID }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Customer ID</p>
          <p class="text-base font-mono">{{ billDetail.customerID }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Amount</p>
          <p class="text-base font-medium">Rp{{ billDetail.amount.toLocaleString() }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Status</p>
          <VBillsChip :activeStatus="billDetail.status" />
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Description</p>
          <p class="text-base">{{ billDetail.description }}</p>
        </div>
        <div class="space-y-1">
          <p class="text-sm text-gray-500">Created At</p>
          <p class="text-base">{{ formatDateTime(billDetail.createdAt) }}</p>
        </div>
        <div class="space-y-1" v-if="billDetail.updatedAt">
          <p class="text-sm text-gray-500">Updated At</p>
          <p class="text-base">{{ formatDateTime(billDetail.updatedAt) }}</p>
        </div>
        <div class="space-y-1" v-if="billDetail.paymentTimestamp">
          <p class="text-sm text-gray-500">Payment Timestamp</p>
          <p class="text-base">Dibayar pada: {{ formatDateTime(billDetail.paymentTimestamp) }}</p>
        </div>
      </div>
    </div>
    <VConfirmModal
      v-show="true"
      :show="showPayConfirm"
      title="Confirm Payment"
      message="Are you sure you want to pay this bill now?"
      confirm-label="Pay"
      cancel-label="Cancel"
      :danger="false"
      @confirm="handlePayment"
      @cancel="showPayConfirm = false"
    />
  </div>

</template>
