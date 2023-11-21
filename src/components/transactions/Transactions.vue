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
    const response = await axios.get('vcards/' + userStore.userId + '/transactions/all')
    transactions.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

const addTransaction = () => {
    router.push({ name: 'NewTransaction' })
}

const editTransaction = (transaction) => {
    router.push({ name: 'Transaction', params: { id: transaction.id } })
}

const deletedTransaction = (deletedTransaction) => {
    let idx = transactions.value.findIndex((t) => t.id === deletedTransaction.id)
    if (idx >= 0) {
        transactions.value.splice(idx, 1)
    }
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
const filterByTransactionId = ref(-1)
const filterByCompleted = ref(-1)
const filterByType = ref(''); // 'Debit', 'Credit', or '' for all
const sortBy = ref('date'); // 'date' or 'description'
const filterByDescription = ref('')


const filteredTransactions = computed(() => {
  let filtered = transactions.value;

  // Filter by transaction type
  if (filterByType.value) {
    filtered = filtered.filter(t => t.type === filterByType.value);
  }
  if (filterByDescription.value) {
    filtered = filtered.filter(t =>
      t.description && t.description.toString().includes(filterByDescription.value)
    );
  }

  // Sort by date or description
  // filtered = filtered.sort((a, b) => {
  //   if (sortBy.value === 'date') {
  //     return new Date(a.date) - new Date(b.date);
  //   } else if (sortBy.value === 'description') {
  //     return a.description.localeCompare(b.description);
  //   }
  //   return 0;
  // });

  return filtered;
});

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
        <option value="">All Types</option>
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
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addtask"
        @click="addTransaction"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Nova Transação</button>
    </div>
  </div>
  <transaction-table
    :transactions="filteredTransactions"
    :showId="true"
    :showOwner="false"
    @edit="editTransaction"
    @deleted="deletedTransaction"
  ></transaction-table>
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
</style>
