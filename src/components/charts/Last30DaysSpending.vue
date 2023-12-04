<template>
    <div class="spending-chart-container">
      <Chart
        :size="{ width: 300, height: 200 }"
        :data="spendingData"
        :margin="{ top: 10, right: 10, bottom: 10, left: 10 }">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Line :dataKeys="['date', 'old_balance']" />
        </template>
      </Chart>
    </div>
  </template>
  
  <script setup>
import { ref, onMounted } from 'vue';
import { Chart, Grid, Line } from 'vue3-charts';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const spendingData = ref([]);

const fetchLast30DaysSpending = async () => {
  try {
    const response = await axios.get(`vcards/${userStore.userId}/transactions/last30days`);
    const data = response.data.data;

    // Process the received data
    spendingData.value = data.map(transaction => ({
      date: transaction.date, // Date already in 'day/month' format
      old_balance: parseFloat(transaction.daily_sum) // Use the daily sum
    }));
  } catch (error) {
    console.error('Error fetching last 30 days spending data:', error);
  }
};

onMounted(() => {
  fetchLast30DaysSpending();
});
</script>

<style>
.spending-chart-container {
  padding: 10px;
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}
</style>
