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

const filteredTransactions = computed( () => {
  return transactions.value.filter(t =>
      (props.onlyCurrentTasks && !t.completed)
      ||
      (!props.onlyCurrentTasks && (
        (filterByTransactionId.value == -1
          || filterByTransactionId.value == t.transaction_id
        ) &&
        (filterByCompleted.value == -1
          || filterByCompleted.value == 0 && !t.completed
          || filterByCompleted.value == 1 && t.completed
        ))))

})

const totalTransactions = computed( () => {
  return transactions.value.reduce((c, t) =>
      (props.onlyCurrentTasks && !t.completed)
        ||
        (!props.onlyCurrentTasks && (
          (filterByTransactionId.value == -1
            || filterByTransactionId.value == t.project_id
          ) &&
          (filterByCompleted.value == -1
            || filterByCompleted.value == 0 && !t.completed
            || filterByCompleted.value == 1 && t.completed
          ))) ? c + 1 : c, 0)
  
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
        for="selectCompleted"
        class="form-label"
      >Filter by completed:</label>
      <select
        class="form-select"
        id="selectCompleted"
        v-model="filterByCompleted"
      >
        <option value="-1">Any</option>
        <option value="0">Pending Tasks</option>
        <option value="1">Completed Tasks</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="selectProject"
        class="form-label"
      >Filter by project:</label>
      <select
        class="form-select"
        id="selectProject"
        v-model="filterByProjectId"
      >
        <option value="-1">Any</option>
        <option :value="null">-- No project --</option>
        <option
          v-for="trs in transactionsStore.transactions"
          :key="trs.id"
          :value="trs.id"
        >{{trs.name}}</option>
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
