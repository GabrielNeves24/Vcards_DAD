<template>
    <div v-if="isRecentTransactionsOpen" class="recent-transactions">
    <!-- Grouped transactions by date -->
    <div v-for="(groupedTransactions, date) in groupedTransactionsByDate" :key="date" class="transaction-date-group">
      <div class="transaction-date">{{ formatDate(date) }}</div>
      <div class="transaction-list">
        <!-- Transaction list for each date -->
        <div v-for="transaction in groupedTransactions" :key="transaction.id" class="transaction-card">
          <!-- Transaction Card Content -->
          <div class="transaction-card-content">
            <div class="transaction-card-info">
              <div class="transaction-payment_reference">{{ transaction.payment_reference }}</div>
              <div class="transaction-category">{{ transaction.category }}</div>
            </div>
            <div class="transaction-description">{{ transaction.description }}</div>
            <div class="transaction-card-info">
              <div class="transaction-type">
                {{ transaction.type === 'D' ? (transaction.value * -1) : transaction.value }}
              </div>
              <div class="transaction-old_balance">{{ transaction.old_balance }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>No recent transactions found.</div>
  </template>
  
  <script setup>
  import { ref, onMounted, computed } from 'vue';
  import axios from 'axios';
  import { useUserStore } from "../../stores/user.js";
  
  
  const userStore = useUserStore();
  const transactions = ref([]);
  const categoriesAll = ref([]);
  const isRecentTransactionsOpen = ref(true); // or whatever logic you use to toggle this
  
  onMounted(async () => {
    try {
      const response = await axios.get('vcards/' + userStore.userId + '/transactions/all');
      transactions.value = response.data.data.slice(0, 10);
      const responseCategories = await axios.get('vcards/' + userStore.userId + '/categories');
      categoriesAll.value = responseCategories.data.data;
      transactions.value.forEach((transaction) => {
        const category = categoriesAll.value.find((category) => category.id === transaction.category_id);
        if (category) {
          transaction.category = category.name;
        }
      });
    } catch (error) {
      console.error('Error fetching transactions:', error);
    }
  });
  
  const groupedTransactionsByDate = computed(() => {
    const grouped = {};
    transactions.value.forEach((transaction) => {
      const date = transaction.date.split('T')[0]; // Assuming 'date' is in ISO format
      if (!grouped[date]) {
        grouped[date] = [];
      }
      grouped[date].push(transaction);
    });
    return grouped;
  });
  
  const formatDate = (date) => {
    // Format date as needed
    return new Date(date).toLocaleDateString();
  };
  </script>
  
  <style scoped>
  .recent-transactions {
    /* your styles here */
  }
  
  .transaction-date-group {
    margin-bottom: 1rem;
  }
  
  .transaction-date {
    font-weight: bold;
    margin-bottom: 0.5rem;
  }
  
  .transaction-card {
    border: 1px solid #eee;
    padding: 0.5rem;
    margin-bottom: 0.5rem;
    border-radius: 0.25rem;
  }
  
  .transaction-card-content {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  
  .transaction-card-info {
    display: flex;
    flex-direction: column;
  }
  
  .transaction-payment_reference,
  .transaction-category,
  .transaction-description,
  .transaction-type,
  .transaction-old_balance {
    margin-bottom: 0.25rem;
  }
  </style>
  