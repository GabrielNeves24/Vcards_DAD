<template>
    <Chart
      :size="{ width: 500, height: 400 }"
      :data="transactionsData"
      :margin="margin"
      :direction="direction">
  
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Line :dataKeys="['name', 'pl']" />
      </template>
    </Chart>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue'
  import { Chart, Grid, Line } from 'vue3-charts'
  import axios from 'axios'
  
  const transactionsData = ref([]);
  const direction = ref('horizontal');
  const margin = ref({
    left: 0,
    top: 20,
    right: 20,
    bottom: 0
  });
  
  const fetchTransactionsData = async () => {
    console.log('Fetching transactions data...');
    try {
      const response = await axios.get('transactions/info/transacionsByDay');
      console.log('API Response:', response.data);
      // Assuming the data is nested under the 'date' key
      transactionsData.value = response.data.date.map(item => ({
        ...item,
        pl: parseFloat(item.pl),
        avg: parseFloat(item.avg)
        }));
      console.log('Formatted Data:', transactionsData.value);
      
    } catch (error) {
      console.error('Error fetching transactions data:', error);
    }
  };
  
  onMounted(() => {
    fetchTransactionsData();
  });
  </script>
  
  
  <style>
    .chart-container {
        width: 100%;
        height: 100%;
    }

  </style>
  