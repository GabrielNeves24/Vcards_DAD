<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import RecentTransactions from '../components/transactions/RecentTransactions.vue';
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
    errors.value = "Failed to load data"; 
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
          <div class="user-info">
            <h3 class="user-name">Bem Vindo de Volta, {{ vcards?.name }}</h3>
            <p class="user-details">Vcard #{{ vcards?.phone_number }}</p>
          </div>
        </div>
        <div class="vcard-section-right">
          <div class="balance-info">
            <h4 class="balance-title">Saldo Disponível</h4>
            <p class="balance-amount">{{ vcards?.balance }} €</p>
          </div>
        </div>
      </div>

      <div class="vcard-section">
        
        <div class="vcard-list">
          <div class="vcard">
            <h2 class="section-title">Balanço da conta nos ultimos 30 dias</h2>
            <Last30DaysSpending />

          </div>
          <div class="vcard">
            <h2 class="section-title">Ultimas Transações</h2>
            <RecentTransactions />

          </div>
        </div>
       
        <div class="vcard-list">
          <h2 class="section-title">Top 5 categorias gastos </h2>
          <div class="vcard">
            <CategorySpendingChart />

          </div>
        </div>
      </div>
      <div v-if="errors">{{ errors }}</div>
    </section>
</template>

<style scoped>
.dashboard-content {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  background-color: #f4f4f4;
  padding: 20px;
}

.vcard-container {
  display: flex;
  justify-content: space-between;
  gap: 20px;
  margin-bottom: 20px;
}

.vcard-section {
  background-color: white;
  padding: 20px;
  border-radius: 12px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  text-align: left;
}

.vcard-section-left, .vcard-section-right {
  flex: 1;
}

.section-title {
  color: #2C3E50;
  margin-bottom: 20px;
  font-size: 20px;
  font-weight: bold;
  text-align: center;
}

.vcard {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  text-align: center;
}

.vcard-2 {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
  text-align: center;

}

.vcard:last-child {
  border-bottom: none;
}

h3, h4 {
  margin: 10px 0;
  color: #34495E;
}


.user-info {
  text-align: center;
}

.user-name {
  font-size: 24px;
  color: #2C3E50;
  margin-bottom: 5px;
}

.user-details {
  font-size: 16px;
  color: #34495E;
  margin-bottom: 20px;
}

.balance-info {
  text-align: center;
  background-color: #E8F0FE; 
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.balance-title {
  font-size: 18px;
  color: #2C3E50;
  margin-bottom: 5px;
}

.balance-amount {
  font-size: 22px;
  font-weight: bold;
  color: #27AE60; 
}
</style>