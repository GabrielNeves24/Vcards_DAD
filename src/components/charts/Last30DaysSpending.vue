<template>
  <div class="spending-chart-container">
    <Chart
      :size="{ width: 700, height: 300 }"
      :data="spendingDataCombined"
      :margin="{ left: 0, top: 20, right: 20, bottom: 0 }"
      :direction="'horizontal'"
      :axis="axis"
    >
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Area 
          :dataKeys="['data', 'saldo']" 
          type="monotone" 
          :areaStyle="{ fill: 'url(#grad)' }" 
        />
        <Line 
          :dataKeys="['data', 'saldo']" 
          type="monotone" 
          :lineStyle="{ stroke: '#9f7aea' }" 
        />
        <defs>
          <linearGradient id="grad" gradientTransform="rotate(90)">
            <stop offset="0%" stop-color="#be90ff" stop-opacity="1" />
            <stop offset="100%" stop-color="white" stop-opacity="0.4" />
          </linearGradient>
        </defs>
      </template>
      <template #widgets>
        <Tooltip
          borderColor="#48CAE4"
          :config="{
            total: { color: '#9f7aea' },
            avg: { hide: true },
            inc: { hide: true }
          }"
        />
      </template>
    </Chart>
  </div>
</template>

  
<script setup>
import { ref, onMounted } from 'vue';
import { Chart, Grid, Line, Area, Tooltip } from 'vue3-charts';
import axios from 'axios';
import { useUserStore } from '../../stores/user';

const userStore = useUserStore();
const spendingDataCombined = ref([]);

const axis = ref({
  primary: {
    type: 'band'
  },
  secondary: {
    domain: ['dataMin', 'dataMax + 100'],
    type: 'linear',
    ticks: 8
  }
});

const fetchLast30DaysSpending = async () => {
  try {
    const response = await axios.get(`vcards/${userStore.userId}/transactions/last30days`);
    const data = response.data.data;
    spendingDataCombined.value = data.map(transaction => ({
      data: transaction.date,
      saldo: transaction.running_balance 
    }));
  } catch (error) {
    console.error('Error ao obter dados:', error);
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


.line-balance {
  stroke: #005cc5;
  stroke-width: 3;
  fill: none; 
}


.dot {
  fill: #005cc5;
  stroke: #fff;
  stroke-width: 2;
}


.axis {
  font-size: 14px;
  color: #666;
}


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
