<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted } from 'vue'
import TransactionTable from "./TransactionTable.vue"
import * as XLSX from 'xlsx'

const router = useRouter()
const userStore = useUserStore()
const exportToExcel = () => {
  const ws = XLSX.utils.json_to_sheet(transactions.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Transactions");
  XLSX.writeFile(wb, "Transactions.xlsx");
};

const loadTransactions = async () => {
  if (userStore.userId == null) {
    return
  }
  if (userStore.userType == 'A') {
      try {
      const response = await axios.get('transactions')
      transactions.value = response.data.data
      const response2 = await axios.get('categories/all')
      categories.value = response2.data.data
        //for each category_id on transactions, show the name of the category
        transactions.value.forEach(function (v) {
          categories.value.forEach(function (c) {
            if (v.category_id == c.id) {
              v.category = c.name
            }
          });
        });
    } catch (error) {
      console.log(error)
    }
  }else{
    try {
    const response = await axios.get('vcards/' + userStore.userId + '/transactions/all')
    transactions.value = response.data.data
    const response2 = await axios.get('vcards/' + userStore.userId + '/categories')
      categories.value = response2.data.data
      transactions.value.forEach(function (v) {
        categories.value.forEach(function (c) {
          if (v.category_id == c.id) {
            v.category = c.name
          }
        });
      });
  } catch (error) {
    console.log(error)
  }
  }
}

const addTransaction = () => {
    router.push({ name: 'NewTransaction' })
}

const editTransaction = (transaction) => {
    router.push({ name: 'Transaction', params: { id: transaction.id } })
}


const props = defineProps({
TransactionsTitle: {
    type: String,
    default: 'Transações (Todas)'
  },
  onlyCurrentTransactions: {
    type: Boolean,
    default: false
  }
})
const categories = ref([])
const transactions = ref([])
const filterByType = ref(-1); 
const sortBy = ref('date'); 
const filterByDescription = ref('')
const currentPage = ref(1);
const itemsPerPage = 10;
const filterByDate = ref(null);
const sortOrder = ref('desc'); 
const filterByTypePayment = ref(-1); 
const filterByCategory = ref(-1);


const filteredTransactions = computed(() => {
  let filtered = transactions.value;
  if (filterByType.value != -1) {
    filtered = filtered.filter(t => t.type === filterByType.value);
  }
  if (filterByTypePayment.value != -1) {
    filtered = filtered.filter(t => t.payment_type === filterByTypePayment.value);
  }
  if (filterByDescription.value) {
    filtered = filtered.filter(t =>
      t.description && t.description.toString().includes(filterByDescription.value)
    );
  }
  if (filterByDate.value != null) {
    const selectedDatetime = new Date(filterByDate.value);
    filtered = filtered.filter(t => {
      const transactionDatetime = new Date(t.datetime);
      return transactionDatetime >= selectedDatetime;
    });
  }
  if (filterByCategory.value != -1) {
    filtered = filtered.filter(t => t.category_id === filterByCategory.value);
  }
  filtered = filtered.sort((a, b) => {
    const datetimeA = new Date(a.datetime); 
    const datetimeB = new Date(b.datetime);
    if (sortBy.value === 'date') {
      return sortOrder.value === 'asc' ? datetimeA - datetimeB : datetimeB - datetimeA;
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

const totalTransactions = computed(() => {
  return transactions.value.length
});


onMounted (() => {
  loadTransactions()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ TransactionsTitle }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalTransactions }}</h5>
    </div>
  </div>
  
  <hr>
  <h3>Filtos:</h3>
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
        <option value="-1">Todos</option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div" v-show="userStore.userType === 'V'">
      <label
        for="selectType"
        class="form-label"
      >Categoria:</label>
      <select
        class="form-select"
        id="selectType"
        v-model="filterByCategory"
      >
        <option value="-1">Todos</option>
        <option v-for="category in categories" :key="category.id" :value="category.id">
          {{ category.name }}
        </option>
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
        <option value="-1" >TODOS</option>
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
      <button @click="exportToExcel" class="btn btn-primary px-4 btn-addtask"> Exportar para Excel</button>
    </div>
    
  </div>
  <transaction-table
    :transactions="filteredTransactions"
    :showId="true"
    :showOwner="false"
    @edit="editTransaction"
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
