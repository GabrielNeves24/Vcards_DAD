<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { useTransactionsStore } from "../../stores/transactions.js"
import { ref, computed, onMounted } from 'vue'
import TransactionTable from "./TransactionTable.vue"

const router = useRouter()
const userStore = useUserStore()
const transactionsStore = useTransactionsStore()

const loadTransactions = async () => {
  try {
    const response = await axios.get('transactions')
    transactions.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

const addTransaction = () => {
    router.push({ name: 'NewTransactionCredit' })
}

const props = defineProps({
TransactionsTitle: {
    type: String,
    default: 'Transactions'
  },
  onlyCurrentTransactions: {
    type: Boolean,
    default: false
  }
})

const transactions = ref([])
const filterByType = ref(''); // 'Debit', 'Credit', or '' for all
const sortBy = ref('date'); // 'date' or 'description'
const filterByDescription = ref('')
const currentPage = ref(1);
const itemsPerPage = 10;
const filterByDate = ref('');
const sortOrder = ref('asc'); // 'asc' or 'desc'
const filterByTypePayment = ref(''); 

const filteredTransactions = computed(() => {
  let filtered = transactions.value;

  // Filter by transaction type
  if (filterByType.value) {
    filtered = filtered.filter(t => t.type === filterByType.value);
  }

  if (filterByTypePayment.value) {
    filtered = filtered.filter(t => t.payment_type === filterByTypePayment.value);
  }
  // Filter by description
  if (filterByDescription.value) {
    filtered = filtered.filter(t =>
      t.description && t.description.toString().includes(filterByDescription.value)
    );
  }

  // Filter by date
  if (filterByDate.value) {
    const selectedDate = new Date(filterByDate.value);
    filtered = filtered.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate >= selectedDate;
    });
  }

  // Sorting
  filtered = filtered.sort((a, b) => {
    if (sortBy.value === 'date') {
      return sortOrder.value === 'asc' ? new Date(a.date) - new Date(b.date) : new Date(b.date) - new Date(a.date);
    } else if (sortBy.value === 'description') {
      return sortOrder.value === 'asc' ? a.description.localeCompare(b.description) : b.description.localeCompare(a.description);
    }
    return 0;
  });

  const totalFiltered = filtered.length;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalFiltered);
  return filtered.slice(start, end);
});

const totalPageCount = computed(() => {
  return Math.ceil(transactions.value.length / itemsPerPage);
});

const updatePage = (direction) => {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < totalPageCount.value) {
    currentPage.value++;
    totalPageCount.value = Math.ceil(transactions.value.length / itemsPerPage);
  }
};

const totalTransactions = computed( () => {
  return transactions.value.length
  
})


onMounted (() => {
  loadTransactions()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ tasksTitle }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalTransactions }}</h5>
    </div>
  </div>
  <hr>
  <div class="filters">
    <div
    v-if="!onlyCurrentTasks"
    class="mb-3 d-flex justify-content-between flex-wrap"
  >
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="selectType"
        class="form-label"
      >Filter by completed:</label>
      <select
        class="form-select"
        id="selectType"
        v-model="filterByType"
      >
        <option value="">Todos</option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="description"
        class="form-label"
      >Decrição:</label>
      <input
        type="text"
        class="form-control"
        id="description"
        placeholder="Descrição da Transação"
        v-model="filterByDescription"
      >
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="date"
        class="form-label"
      >Data:</label>
      <input type="date" v-model="filterByDate" class="form-select"
        id="date" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="typePayment"
        class="form-label"
      >Tipo Transação:</label>
      <select class="form-select" id="typePayment" v-model="filterByTypePayment">
        <option value="" >TODOS</option>
        <option value="VCARD" >vCard</option>
        <option value="MBWAY">MBWAY</option>
        <option value="PAYPAL">PayPal</option>
        <option value="IBAN">IBAN (Bank Transfer)</option>
        <option value="MB">MB (Multibanco)</option>
        <option value="VISA">Visa</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="order"
        class="form-label"
      >OrderBy:</label>
      <select v-model="sortOrder" class="form-select"
        id="order">
        <option value="asc">Ascending</option>
        <option value="desc">Descending</option>
      </select>
    </div>
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addtask"
        @click="addTransaction"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Nova Transação</button>
    </div>
  </div>
</div>
<transaction-table
  :transactions="filteredTransactions"
></transaction-table>
<div class="pagination-controls">
    <button class="btn-pagination" @click="updatePage('prev')">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
    <button class="btn-pagination" @click="updatePage('next')">Next</button>
  </div>
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
.btn-addtask {
  margin-top: 1.85rem;
}
.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
</style>
