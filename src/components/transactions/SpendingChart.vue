<template>
    <div class="spending-chart">
      <line :data="chartData" :options="chartOptions" />
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { Line } from 'vue3-charts';
  import axios from 'axios';
  import { useUserStore } from "../../stores/user.js";
  
  const userStore = useUserStore();
  const chartData = ref({});
  const chartOptions = ref({ /* Chart options here */ });
  
  const fetchData = async () => {
  try {
    const response = await axios.get("/vcards/"+ userStore.userId  +"/transactions/last30days");
    const transactions = response.data.data;
    let chartLabels = [];
    let chartValues = [];

    transactions.forEach(transaction => {
      let date = transaction.date;
      let value = parseFloat(transaction.value);

      if (transaction.type === 'D') {
        value = -value; 
      }

      if (chartLabels.includes(date)) {
        let index = chartLabels.indexOf(date);
        chartValues[index] += value;
      } else {
        chartLabels.push(date);
        chartValues.push(value);
      }
    });
    chartData.value = {
      labels: chartLabels,
      datasets: [
        {
          label: 'Net Spending',
          backgroundColor: '#f87979',
          data: chartValues
        }
      ]
    };

  } catch (error) {
    console.error('Error fetching chart data:', error);
  }
};

  
  onMounted(fetchData);
  </script>
  
  <style>
  .spending-chart {
    height: 400px; 
    width: 100%;}
  </style>
  