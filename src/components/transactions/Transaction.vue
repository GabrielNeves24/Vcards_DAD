<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user.js"
import { useTransactionsStore } from "../../stores/transactions.js"
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, watch, computed } from 'vue'

import TransactionDetail from "./TransactionDetail.vue"

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionsStore()

const newTransaction = () => { 
  return {
    id: null,
    vcard: userStore.userId,
    //type C or D,
    type: null,
    value: null,
    payment_type: null,
    payment_reference: null,
    category_id: null,
    description: null,
  }
}

const transaction = ref(newTransaction())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''
  
const loadTransactions = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    transaction.value = newTransaction()
    originalValueStr = JSON.stringify(transaction.value)
  } else {
      try {
        const response = await axios.get('/transactions/' + id)
        transaction.value = response.data.data
        originalValueStr = JSON.stringify(transaction.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const save = async () => {
  errors.value = null
  if (operation.value == 'insert') {
    try {
      console.log(transaction.value)
      //add type to transaction
      if (userStore.userType == 'A'){
        transaction.value.type = 'C'
        const response = await axios.post('transactions/credit', transaction.value)
        transaction.value = response.data.data
        //console.log(transaction.value)
        originalValueStr = JSON.stringify(transaction.value)
        toast.success('Transação criada com sucesso!')
        router.back()
        router.push({ name: 'Transactions' })
      }else{
        transaction.value.type = 'D'
        const response = await axios.post('transactions/debit', transaction.value)
        transaction.value = response.data.data
        //console.log(transaction.value)
        originalValueStr = JSON.stringify(transaction.value)
        toast.success('Transação criada com sucesso!')
        router.push({ name: 'Transactions' })
      }      
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transação não foi criada!')
      } else {
        toast.error('Transação não foi criada!')
      }
    }
  } else {
    try {
      const response = await axios.put('transactions', transaction.value)
      transaction.value = response.data.data
      originalValueStr = JSON.stringify(transaction.value)
      toast.success('Transação ' + transaction.value.id + ' was updated successfully.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transação ' + props.id + ' não foi atualizada!')
      } else {
        toast.error('Transação ' + props.id + ' não foi atualizada devido a um erro do servidor! ')
      }
    }
  }
}

const cancel = () => {
  originalValueStr = JSON.stringify(transaction.value)
  router.back()
}

const props = defineProps({
  id: {
    type: Number,
    default: null
  },
  fixedTransaction: {
    type: Number,
    default: null
  }
})


const operation = computed( () => (!props.id || props.id < 0) ? 'insert' : 'update')

  // beforeRouteUpdate was not fired correctly
  // Used this watcher instead to update the ID
watch(
  () => props.id,
  (newValue) => {
    loadTransactions(newValue)
    console.log(newValue)
    }, 
  { immediate: true}
  
)

let nextCallBack = null
const leaveConfirmed = () => {
  if (nextCallBack) {
    nextCallBack()
  }
}

onBeforeRouteLeave((to, from, next) => {
  nextCallBack = null
  let newValueStr = originalValueStr
  if (originalValueStr != newValueStr) {
    // Some value has changed - only leave after confirmation
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
    // No value has changed, so we can leave the component without confirming
    next()
  }
})
</script>


<template>
  <confirmation-dialog
    ref="confirmationLeaveDialog"
    confirmationBtn="Discard changes and leave"
    msg="Do you really want to leave? You have unsaved changes!"
    @confirmed="leaveConfirmed"
  >
  </confirmation-dialog>  

  <transaction-detail
    :operationType="operation"
    :transaction="transaction"
    :transactions="transactionStore.transactions"
    :fixedTransaction="fixedTransaction"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></transaction-detail>
</template>