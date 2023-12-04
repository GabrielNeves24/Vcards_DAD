<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import RecentTransactions from '../components/transactions/RecentTransactions.vue';
//import SpendingChart from '../components/transactions/SpendingChart.vue'
import CategorySpendingChart from './charts/CategorySpendingChart.vue'
import Last30DaysSpending from './charts/Last30DaysSpending.vue'


const toast = useToast()
const router = useRouter()
const userStore = useUserStore()


const vcards = ref(null)
const errors = ref(null)


const loadVcard = async () => {
  try {
    const response = await axios.get('vcards/' + userStore.userId)
    vcards.value = response.data.data
    console.log(vcards.value)
  } catch (error) {
    errors.value = "Failed to load data"; // Set error message
    console.log(error)
  }
}

onMounted(() => {
  loadVcard()
  console.log(vcards.value)
})

</script>

<template>
    <section class="dashboard-content">
      <div class="vcard-container">
        <div class="vcard-section-left">
          <!-- Content of left section -->
          <h3 class="section-title">Bem Vindo de Volta, {{ vcards?.name }}</h3>
          <!-- <h2 class="section-title"></h2> -->
          <h4 class="section-title">Saldo Disponível {{ vcards?.balance }} €</h4>
          
        </div>
        <div class="vcard-section-right">
          <Last30DaysSpending />
        </div>
      </div>
      <!-- Additional sections can be added here -->
      <div class="vcard-section">
        <h2 class="section-title">Ultimas Transações</h2>
        <div class="vcard-list">
          <div class="vcard">
            <RecentTransactions />
            <!-- Add more card details here -->
          </div>
        </div>
      </div>
      <div class="vcard-section">
        <h2 class="section-title">Top 5 categorias gastos </h2>
        <div class="vcard-list">
          <div class="vcard-2">
            <CategorySpendingChart />
            <!-- Add more card details here -->
          </div>
        </div>
      </div>
      <div v-if="errors">{{ errors }}</div>
    </section>
</template>

<style scoped>

.vcard-section {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.vcard-section-left {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}

.vcard-section-right {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  width: 50%;
}
.vcard-container {
  display: flex;
  justify-content: space-between ;
  border-radius: 20;
  
}

.vcard-section-left,
.vcard-section-right {
  width: 50%;
  /* Rest of your styles */
  /* background-color: aquamarine; */
}

.section-title {
  color: #555;
  margin-bottom: 15px;
  text-align: center;
}

.vcard {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}
.vcard-2 {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  text-align: center;
}

.vcard:last-child {
  border-bottom: none;
}

</style>

  