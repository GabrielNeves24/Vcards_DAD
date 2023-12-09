<template>
  <div class="spending-chart-container">
    <Chart
      :size="{ width: 650, height: 200 }"
      :data="spendingDataCombined"
      :margin="{ top: 10, right: 10, bottom: 10, left: 10 }">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Line :dataKeys="['date', 'total']" stroke="green" />
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
const spendingDataCombined = ref([]);

const fetchLast30DaysSpending = async () => {
  try {
    const response = await axios.get(`vcards/${userStore.userId}/transactions/last30days`);
    const data = response.data.data;

    // Process the received data
    spendingDataCombined.value = data.map(transaction => ({
      date: transaction.date,
      total: transaction.running_balance // This combines the two
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
  padding: 20px;
  background-color: #fff;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  margin: 20px auto;
  width: 90%;
  max-width: 700px;
  box-sizing: border-box;
}

.chart-title {
  text-align: center;
  color: #2C3E50;
  font-size: 20px;
  font-weight: 600;
  margin-bottom: 20px;
}

/* Style for the line representing the balance */
.line-balance {
  stroke: #005cc5;
  stroke-width: 3;
  fill: none; /* Ensures the area under the line isn't filled */
}

/* Enhance dots on the line for better visibility */
.dot {
  fill: #005cc5;
  stroke: #fff;
  stroke-width: 2;
}

/* Style for the chart axes */
.axis {
  font-size: 14px;
  color: #666;
}

/* Hide grid lines */
.grid-line {
  display: none;
}

@media (max-width: 768px) {
  .spending-chart-container {
    width: 95%;
    padding: 15px;
  }
}

</style>
