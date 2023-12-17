<template>
    <div>
      <Chart
        :size="{ width: 500, height: 400 }"
        :data="categoryData"
        :margin="margin"
        :direction="direction">
        <template #layers>
          <Grid strokeDasharray="2,2" />
          <Bar :dataKeys="['category', 'totalSpent']" />
        </template>
      </Chart>
    </div>
  </template>
  
<script setup>
import { ref, onMounted } from 'vue';
import { Chart, Grid, Bar } from 'vue3-charts';
import axios from 'axios';
import { useRoute } from 'vue-router';
import { useUserStore } from '../../stores/user';
const categoryData = ref([]);
const topCategories = ref([]);
const margin = { left: 0, top: 20, right: 20, bottom: 0 };
const direction = 'horizontal';

const userStore = useUserStore();
const fetchCategoryData = async () => {
    try {
        const response = await axios.get(`vcards/${userStore.userId}/category-spending`);
        const data = response.data.categoryData.map(item => ({
      ...item,
      totalSpent: parseFloat(item.totalSpent)
    }));
    categoryData.value = data.sort((a, b) => b.totalSpent - a.totalSpent);
    topCategories.value = response.data.topCategories;
    } catch (error) {
        console.error('Error fetching category spending data:', error);
    }
};

onMounted(() => {
fetchCategoryData();
});
</script>

<style>
.top-categories {
margin-top: 20px;
}
</style>
