<script setup>

import { ref, onMounted,computed } from 'vue'
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'
import MonthlyTransactionsChart from './charts/MonthlyTransactionsChart.vue'
import DailyTransactionsChart from './charts/DailyTransactionsChart.vue'
import PaymentTypeChart from './charts/PaymentTypeChart.vue'
import PaymentTypeChartCredit from './charts/PaymentTypeChartCredit.vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const vcards = ref(null)
const transactions = ref(null)
const errors = ref(null)
const numberOfVcards = computed(() => {
  if (!vcards.value) {
    return 0
  }
  return vcards.value.length
})

const numberOfVcardsAtive = computed(() => {
  if (!Array.isArray(vcards.value)) {
    return 0;
  }
  return vcards.value.filter(vcard => vcard.blocked == 0).length;
});

const numberOfVcardsBlocked = computed(() => {
  if (!Array.isArray(vcards.value)) {
    return 0;
  }
  return vcards.value.filter(vcard => vcard.blocked == 1).length;
});

const numberOfTransactions = computed(() => {
  if (!transactions.value) {
    return 0
  }
  return transactions.value.length
})

const totalBalance = computed(() => {
  if (!Array.isArray(vcards.value) || vcards.value.length === 0) {
    return 0;
  }
  return vcards.value.reduce((acc, vcard) => {
    const balance = parseFloat(vcard.balance) || 0;
    return acc + balance;
  }, 0).toFixed(2); 
});

const today = new Date();
today.setHours(0, 0, 0, 0);

const sumOfDebitTransactionsToday = computed(() => {
  if (!Array.isArray(transactions.value) || transactions.value.length === 0) {
    return 0;
  }
  return transactions.value.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date); 
    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate.getTime() === today.getTime() && transaction.type === 'D') {
      return acc + parseFloat(transaction.value);
    }
    return acc;
  }, 0).toFixed(2);
});

const sumOfCreditTransactionsToday = computed(() => {
  if (!Array.isArray(transactions.value) || transactions.value.length === 0) {
    return 0;
  }
  return transactions.value.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date); 
    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate.getTime() === today.getTime() && transaction.type === 'C') {
      return acc + parseFloat(transaction.value);
    }
    return acc;
  }, 0).toFixed(2); 
});

const sumOfTransactionsToday = computed(() => {
  if (!Array.isArray(transactions.value) || transactions.value.length === 0) {
    return 0;
  }
  return transactions.value.reduce((acc, transaction) => {
    const transactionDate = new Date(transaction.date); 
    transactionDate.setHours(0, 0, 0, 0);

    if (transactionDate.getTime() === today.getTime()) {
      return acc + parseFloat(transaction.value);
    }
    return acc;
  }, 0).toFixed(2); 
});



const loadTransactions = async () => {
  try {
    const response = await axios.get('transactions')
    transactions.value = response.data.data

  } catch (error) {
    errors.value = "Failed to load data"; 
    console.log(error)
  }
}

const loadVcard = async () => {
  try {
    const response = await axios.get('vcards')
    vcards.value = response.data.data
    console.log(vcards.value)
  } catch (error) {
    errors.value = "Failed to load data"; 
    console.log(error)
  }
}


onMounted(() => {
  loadVcard()
  loadTransactions()
  console.log(vcards.value)
})

</script>

<template>
  <section class="dashboard-content">
    <div class="vcard-stats">
      <div class="info-box">
        <span class="info-title">Total Vcards</span>
        <span class="info-number">{{ numberOfVcards }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Active Vcards</span>
        <span class="info-number">{{ numberOfVcardsAtive }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Blocked Vcards</span>
        <span class="info-number">{{ numberOfVcardsBlocked }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Total Transactions</span>
        <span class="info-number">{{ numberOfTransactions }}</span>
      </div>
    </div>
    <div class="vcard-stats">
      <div class="info-box">
        <span class="info-title">Saldo Total Vcards Hoje</span>
        <span class="info-number">{{ totalBalance }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Debitos Hoje</span>
        <span class="info-number">{{ sumOfDebitTransactionsToday }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Creditos Hoje</span>
        <span class="info-number">{{ sumOfCreditTransactionsToday }}</span>
      </div>
      <div class="info-box">
        <span class="info-title">Total Transactions Hoje</span>
        <span class="info-number">{{ sumOfTransactionsToday }}</span>
      </div>
    </div>


    <div class="charts-container">
      <div class="chart">
        <h3 class="section-title">Numero Transações Mensais</h3>
        <MonthlyTransactionsChart />
      </div>
      <div class="chart">
        <h3 class="section-title">Numero Transações Diárias (Ultimos 30 dias)</h3>
        <DailyTransactionsChart />
      </div>
    </div>
    <div class="charts-container">
      <div class="chart">
        <h3 class="section-title">Numero Transações por Tipo Pagamento (Débito)</h3>
        <PaymentTypeChart />
      </div>
      <div class="chart">
        <h3 class="section-title">Numero Transações por Tipo Pagamento (Crédito)</h3>
        <PaymentTypeChartCredit />
      </div>
    </div>

  </section>
</template>


<style scoped>
.section-title {
  color: #555;
  margin-bottom: 15px;
  text-align: center;
}

.vcard-stats {
  display: flex;
  justify-content: space-around;
  padding: 10px;
  background-color: #f9f9f9;
  margin-bottom: 20px;
}

.charts-container {
  display: flex;
  justify-content: space-around;
}

.chart {
  flex: 1;
  margin-right: 10px;
  text-align: center;
}

.chart:last-child {
  margin-right: 0;
}

.vcard-stats {
  display: flex;
  justify-content: space-around;
  margin-bottom: 20px;
}

.info-box {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-align: center;
  min-width: 150px;
}

.info-title {
  font-size: 14px;
  color: #555;
  margin-bottom: 5px;
  display: block;
}

.info-number {
  font-size: 18px;
  font-weight: bold;
  color: #333;
}


</style>

  