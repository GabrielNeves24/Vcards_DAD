<template>
  <div>
    <Chart
      :size="{ width: 500, height: 400 }"
      :data="data"
      :margin="margin"
      :direction="direction">
      <template #layers>
        <Grid strokeDasharray="2,2" />
        <Bar :dataKeys="['paymentType', 'total']">
          <Label v-slot="{ datum }">{{ datum.total }}</Label>
        </Bar>
      </template>
    </Chart>
  </div>
</template>



<script setup>
import { ref, onMounted } from 'vue';
import { Chart, Grid, Bar } from 'vue3-charts';
import axios from 'axios';

const data = ref([]);
const margin = { left: 0, top: 20, right: 20, bottom: 0 };
const direction = 'horizontal';

const fetchData = async () => {
    try {
        const response = await axios.get(`transactions/info/totalTransactionByTypeCredit`);
        data.value = response.data.data.map(item => {
            let modifiedPaymentType = item.payment_type;
            if (modifiedPaymentType) {
                modifiedPaymentType = item.payment_type+ ' ('+parseFloat(item.total) + ')' ;
            }
            return {
                paymentType: modifiedPaymentType,
                total: parseFloat(item.total)
            };
        }).sort((a, b) => b.total - a.total);
    } catch (error) {
        console.error('Error fetching debit transaction data:', error);
    }
};

onMounted(() => {
    fetchData();
});
</script>


  
<style>
.top-categories {
margin-top: 20px;
}
</style>
