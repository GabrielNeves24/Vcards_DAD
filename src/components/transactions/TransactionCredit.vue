<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user.js"
import { useTransactionsStore } from "../../stores/transactions.js"
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, watch, computed, inject } from 'vue'

import TransactionDetail from "./TransactionDetail.vue"
const socket = inject("socket");
const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionsStore()

const newTransaction = () => { 
  return {
    id: null,
    vcard: null,
    value: null,
    type: null,
    reference: null,
    description: null,
  }
}

const transaction = ref(newTransaction())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
let originalValueStr = ''
  
const loadTransactions = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    transaction.value = newTransaction()
    originalValueStr = JSON.stringify(transaction.value)
  } else {
      try {
        const response = await axios.get('vcards/' + id + '/transactions/all')
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
      const response = await axios.post('transactions/credit', transaction.value)
      transaction.value = response.data.data
      originalValueStr = 1;
      toast.success('Transação criada com sucesso!')
      
      

      router.push({ name: 'TransactionsAll'})
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transação was not created due to validation errors!')
      } else {
        toast.error('Transação was not created due to unknown server error!')
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
watch(
  () => props.id,
  (newValue) => {
      loadTransactions(newValue)
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
    nextCallBack = next
    confirmationLeaveDialog.value.show()
  } else {
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