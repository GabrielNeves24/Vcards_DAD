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

    // Process the transactions to get the data for the chart
    let chartLabels = [];
    let chartValues = [];

    transactions.forEach(transaction => {
      let date = transaction.date;
      let value = parseFloat(transaction.value);

      if (transaction.type === 'D') {
        value = -value; // If it's a debit, make the value negative
      }

      if (chartLabels.includes(date)) {
        // If the date is already in the labels, add the value to existing value
        let index = chartLabels.indexOf(date);
        chartValues[index] += value;
      } else {
        // If it's a new date, add it to the labels and values
        chartLabels.push(date);
        chartValues.push(value);
      }
    });

    // Update the chart data
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
  