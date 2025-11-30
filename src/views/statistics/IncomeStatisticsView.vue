<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';
import Chart from 'chart.js/auto';
import { useStatisticsStore } from '@/stores/statistics.store';

const statisticsStore = useStatisticsStore();

const months = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December',
];
const selectedMonth = ref<number>(new Date().getMonth() + 1);
const selectedYear = ref<number>(new Date().getFullYear());
const availableYears = ref<number[]>(Array.from({ length: 6 }, (_, i) => selectedYear.value - i));

let chartInstance: Chart | null = null;

// Simple number formatter
const formatNumber = (value: number) => value.toLocaleString('en-US');

// Safe chart render
const renderChart = async () => {
  if (chartInstance) {
    chartInstance.destroy();
    chartInstance = null;
  }

  // Wait until canvas is fully re-rendered in DOM
  await nextTick();

  const canvas = document.getElementById('incomeChart') as HTMLCanvasElement | null;
  if (!canvas) {
    console.warn('Canvas not found — skipping render');
    return;
  }

  const labels = statisticsStore.incomeStatistics.map((i) => i.propertyName);
  const values = statisticsStore.incomeStatistics.map((i) => i.propertyIncomes);

  chartInstance = new Chart(canvas, {
    type: 'bar',
    data: {
      labels,
      datasets: [
        {
          label: 'Income',
          data: values,
          backgroundColor: 'rgba(59, 130, 246, 0.7)',
          borderColor: 'rgba(59, 130, 246, 1)',
          borderWidth: 1,
        },
      ],
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            callback: (v) => formatNumber(Number(v)),
          },
        },
      },
      plugins: {
        tooltip: {
          callbacks: {
            label: (context) =>
              `${context.dataset.label}: ${formatNumber(Number(context.parsed.y))}`,
          },
        },
      },
    },
  });
};

// Fetch + render data
const loadData = async () => {
  try {
    await statisticsStore.fetchIncomeStatistics(selectedMonth.value, selectedYear.value);
    await renderChart();
  } catch (e) {
    console.error('Error loading chart:', e);
  }
};

onMounted(loadData);
</script>

<template>
  <div class="p-6">
    <h1 class="text-2xl font-bold mb-6">📊 Income Statistics</h1>

    <div class="flex flex-wrap gap-4 items-end mb-6">
      <div>
        <label class="block text-sm font-medium mb-1">Month</label>
        <select
          v-model="selectedMonth"
          class="border rounded-lg p-2 w-40 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option v-for="(name, i) in months" :key="i" :value="i + 1">{{ name }}</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium mb-1">Year</label>
        <select
          v-model="selectedYear"
          class="border rounded-lg p-2 w-40 focus:outline-none focus:ring focus:ring-blue-300"
        >
          <option v-for="year in availableYears" :key="year" :value="year">{{ year }}</option>
        </select>
      </div>

      <button
        @click="loadData"
        class="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
      >
        Apply
      </button>
    </div>

    <div class="bg-white p-6 rounded-lg shadow-md" style="height: 400px;">
      <canvas id="incomeChart"></canvas>
    </div>
  </div>
</template>

<style scoped>
canvas {
  width: 100% !important;
}
</style>
