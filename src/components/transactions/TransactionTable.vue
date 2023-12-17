<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch, computed } from "vue"
import { useUserStore } from '../../stores/user';
const userStore = useUserStore()
const props = defineProps({
  transactions: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showCompleted: {
    type: Boolean,
    default: true,
  },
  showOwner: {
    type: Boolean,
    default: true,
  },
  showProject: {
    type: Boolean,
    default: true,
  },
  showCompletedButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["completeToggled", "edit"])
const editingTransactions = ref(props.transactions)

watch(
  () => props.transactions,
  (newTransactions) => {
    editingTransactions.value = newTransactions
  }
)

const editClick = (transaction) => {
  emit("edit", transaction)
}

</script>

<template>
  <table class="table">
    <thead>
      <tr>
        <th v-if="showId">N.#</th>
        <th>Data</th>
        <th>Tipo Pagamento</th>
        <th>Referencia</th>
        <th v-show="userStore.userType == 'A'">Tipo</th>
        <th>Valor</th>
        <th>Categoria</th>
        <th>Descrição</th>

        <th>New Balance</th>
        <th>Old Balance</th>
        <th v-show="userStore.userType =='V'"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in editingTransactions" :key="transaction.id">
        <td v-if="showId">{{ transaction.id }}</td>
        <td>{{ transaction.date }}</td>
        <td>{{ transaction.payment_type }}</td>
        <td>{{ transaction.payment_reference }}</td>
        <td v-show="userStore.userType == 'A'">{{ transaction.type }}</td>
        <td :class="{'text-red': transaction.type === 'D', 'text-green': transaction.type !== 'D'}">{{ transaction.type === 'D' ? -transaction.value : transaction.value }}</td>

        <td>{{ !transaction.category ? 'N/A' : transaction.category }}</td>
        <td>{{ transaction.description }}</td>
        <td>{{ transaction.new_balance }}</td>        
        <td>{{ transaction.old_balance }}</td>
        
        <td 
          class="text-end"
          v-show="userStore.userType =='V'">
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-xs btn-light"
              @click="editClick(transaction)"
              v-if="showEditButton">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.table {
  width: 100%;
  background-color: #fff;
  border-collapse: collapse;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  color: #333;
  margin-top: 20px;
}

.table th,
.table td {
  padding: 12px 15px;
  border-bottom: 1px solid #eaecef;
  text-align: left;
}

.table th {
  background-color: #f9fafb;
  color: #333;
  font-weight: 600;
  letter-spacing: 0.02em;
}

.table tbody tr:last-child td {
  border-bottom: none;
}

.table tbody tr:hover {
  background-color: #f4f7fa;
}


@media screen and (max-width: 768px) {
  .table {
    display: block;
    overflow-x: auto;
    white-space: nowrap;
  }
}


.btn {
  background-color: #3498db; 
  color: #fff;
  border: none;
  padding: 5px 10px;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn:hover {
  background-color: #2980b9;
}

.btn-light {
  background-color: #ecf0f1;
  color: #333;
}

.bi-pencil {
  display: inline-block;
  font-size: 0.8rem;
  vertical-align: middle;
}


.completed {
  color: #95a5a6;
  text-decoration: line-through;
}


button {
  margin: 0 5px;
}


button:hover {
  opacity: 0.8;
}

.d-flex {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.justify-content-end {
  justify-content: flex-end;
}

.text-end {
  text-align: right;
}

.text-red {
  color: red;
}

.text-green {
  color: green;
}


</style>
