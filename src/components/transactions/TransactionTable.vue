<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch, computed } from "vue"
import { useUserStore } from '../../stores/user';
//const toast = useToast()
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
        <th v-if="showId">#</th>
        <th>Date</th>
        <th>Payment Reference</th>
        <th>Category</th>
        <th>Description</th>
        <th>Type</th>
        <th>Value</th>
        <th>Old Balance</th>
        <th>Tipo Pagamento</th>
        <th v-if="showEditButton"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="transaction in editingTransactions" :key="transaction.id">
        <td v-if="showId">{{ transaction.id }}</td>
        <td>{{ transaction.date }}</td>
        <td>{{ transaction.payment_reference }}</td>
        <td>{{ transaction.category }}</td>
        <td>{{ transaction.description }}</td>
        <td>{{ transaction.type }}</td>
        <td>{{ transaction.value }}</td>
        <td>{{ transaction.old_balance }}</td>
        <td>{{ transaction.payment_type }}</td>
        <td 
          class="text-end"
          v-if="showEditButton">
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
.completed {
  text-decoration: line-through;
}

button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
