<script setup lang="ts">
import { ref, watch } from 'vue';
import VButton from './VButton.vue';

const props = defineProps<{
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  danger?: boolean;
  enableCoupon?: boolean;         
  amount?: number | null;         
}>();

const emit = defineEmits(['confirm', 'cancel']);

const isVisible = ref(props.show);

const useCoupon = ref(false);
const couponCode = ref("");

watch(
  () => props.show,
  (value) => {
    isVisible.value = value;

    // reset when reopened
    if (value) {
      useCoupon.value = false;
      couponCode.value = "";
    }
  }
);


function confirm() {
  emit('confirm', { couponCode: useCoupon.value ? couponCode.value : "" });
}
</script>

<template>
  <Teleport to="body">
    <div v-if="isVisible" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

          <!-- Existing header (unchanged) -->
          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0"
                :class="danger ? 'bg-red-100' : 'bg-blue-100'"
              >
                <i
                  class="h-6 w-6"
                  :class="danger ? 'text-red-600' : 'text-blue-600'"
                >!</i>
              </div>
              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left">
                <h3 class="text-lg font-semibold leading-6 text-gray-900">
                  {{ title }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">{{ message }}</p>

                  <!-- New: show amount (optional) -->
                  <p v-if="amount" class="mt-1 text-base font-medium">
                    Amount: Rp{{ amount.toLocaleString() }}
                  </p>
                </div>
              </div>
            </div>

            <!-- New: coupon input (appears ONLY when user selects coupon mode) -->
            <div v-if="useCoupon" class="mt-4">
              <label class="block text-sm font-medium text-gray-700">Coupon Code</label>
              <input
                v-model="couponCode"
                type="text"
                class="mt-1 block w-full border rounded-md px-3 py-2"
                placeholder="Enter coupon code"
              />
            </div>
          </div>

          <!-- Footer -->
          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">

            <!-- Normal Confirm -->
            <VButton
              v-if="!useCoupon"
              type="button"
              :variant="danger ? 'danger' : 'primary'"
              class="sm:ml-3"
              @click="confirm"
            >
              {{ confirmLabel || 'Confirm' }}
            </VButton>

            <!-- Confirm with coupon -->
            <VButton
              v-if="useCoupon"
              type="button"
              variant="primary"
              class="sm:ml-3"
              @click="confirm"
            >
              Apply Coupon & Pay
            </VButton>

            <!-- New: button to switch to coupon mode -->
            <VButton
              v-if="enableCoupon && !useCoupon"
              type="button"
              variant="secondary"
              class="mr-2"
              @click="useCoupon = true"
            >
              Pay With Coupon
            </VButton>

            <!-- Cancel -->
            <VButton
              type="button"
              variant="secondary"
              @click="emit('cancel')"
            >
              {{ cancelLabel || 'Cancel' }}
            </VButton>

          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>
