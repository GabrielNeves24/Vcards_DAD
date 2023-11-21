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

const emit = defineEmits(["completeToggled", "edit", "deleted"])

const editingTransactions = ref(props.transactions)
// const transactionToDelete = ref(null)
// const deleteConfirmationDialog = ref(null)

watch(
  () => props.transactions,
  (newTransactions) => {
    editingTransactions.value = newTransactions
  }
)

// Alternative to previous watch
// watchEffect(() => {
//   editingTasks.value = props.tasks
// })

const toogleClick = async (task) => {
    try {
    const response = await axios.patch('tasks/' + task.id + '/completed', { completed: !task.completed })
    task.completed = response.data.data.completed
    emit("completeToggled", task)
  } catch (error) {
    console.log(error)
  }
}
const editClick = (transaction) => {
  emit("edit", transaction)
}

// const deleteClick = (transaction) => {
//   transactionToDelete.value = transaction
//   deleteConfirmationDialog.value.show()
// }

// const deleteTaskConfirmed = async () => {
//   try {
//     const response = await axios.delete('tasks/' + transactionToDelete.value.id)
//     let deletedTransaction = response.data.data
//     toast.info(`Task ${taskToDeleteDescription.value} was deleted`)
//     emit("deleted", deletedTransaction)
//   } catch (error) {
//     console.log(error)
//     toast.error(`It was not possible to delete Task ${transactionToDeleteDescription.value}!`)
//   }
// }

// const transactionToDeleteDescription = computed(() => taskToDelete.value
//   ? `#${taskToDelete.value.id} (${taskToDelete.value.description})`
//   : "")

</script>

<template>
  <!-- <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Delete transaction"
    :msg="`Do you really want to delete the task ${transactionToDeleteDescription}?`"
    @confirmed="deleteTransactionConfirmed"
  >
  </confirmation-dialog> -->

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
        <th v-if="showCompletedButton || showEditButton || showDeleteButton" v-show="userStore.userType=='V'"></th>
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
        <td v-show="userStore.userType=='V'"
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
