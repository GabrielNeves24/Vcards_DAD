<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user.js"
import { useTransactionsStore } from "../../stores/transactions.js"
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, watch, computed, inject } from 'vue'
import TransactionDetail from "./TransactionDetail.vue"

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
const transactionStore = useTransactionsStore()
const socket = inject("socket");

const newTransaction = () => { 
  return {
    id: null,
    vcard: null,
    value: null,
    type: null,
    reference: null,
    category_id: null,
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
      if (userStore.userType == 'A'){
        try {
          const response = await axios.post(`https://dad-202324-payments-api.vercel.app/api/credit`, {
            type: transaction.value.type,
            reference: transaction.value.reference,
            value: transaction.value.value,
          });
          if (response.status === 201) {
            toast.success('Transaction processed successfully! na api');
            const response = await axios.post('transactions/credit', {
              vcard: transaction.value.vcard,
              payment_type: transaction.value.type,
              value: transaction.value.value,
              payment_reference: transaction.value.reference,
              category_id: transaction.value.category_id,
              description: transaction.value.description,
            })
            transaction.value = response.data.data
            originalValueStr = JSON.stringify(transaction.value)
            toast.success('Transação criada com sucesso!')
            socket.emit('adminTransaction', transaction.value);
            console.log("emitido")
            router.back()
            router.push({ name: 'Transactions' })
          }
        } catch (error) {
          toast.error(`Error: ${error.response.data.message}`);
          return false;
        }
      }else{
          
        if(transaction.value.type == 'VCARD'){
          const response = await axios.post('transactions/debit', {
                vcard: userStore.userId,
                payment_type: transaction.value.type,
                value: transaction.value.value,
                payment_reference: transaction.value.reference,
                category_id: transaction.value.category_id,
                description: transaction.value.description,
              })
              socket.emit('debitTransaction', transaction.value);
          transaction.value = response.data.data
          //console.log(transaction.value)
          
          originalValueStr = JSON.stringify(transaction.value)
          toast.success('Transação criada com sucesso!')
          router.push({ name: 'Transactions' })
        }else{
          try {
            const response = await axios.post(`https://dad-202324-payments-api.vercel.app/api/debit`, {
              type: transaction.value.type,
              reference: transaction.value.reference,
              value: transaction.value.value,
            });
            if (response.status === 201) {
              toast.success('Transaction processed successfully! na api');
              const response = await axios.post('transactions/debit', {
                vcard: userStore.userId,
                payment_type: transaction.value.type,
                value: transaction.value.value,
                payment_reference: transaction.value.reference,
                category_id: transaction.value.category_id,
                description: transaction.value.description,
              })
              transaction.value = response.data.data
              originalValueStr = JSON.stringify(transaction.value)
              toast.success('Transação criada com sucesso!')
              router.push({ name: 'Transactions' })
            }
          } catch (error) {
            toast.error(`Error: ${error.response.data.message}`);
            return false;
          }
        }
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
socket.on('newTransaction', (transaction) => {
  toast.success('Você recebeu uma nova transação!');
  console.log("Transaction received:", transaction);
  if (transaction.vcard === userStore.userId) {
    console.log('Trying to show toast');
    toast.success('Você recebeu uma nova transação!');
    console.log('Toast should be shown');
  }
});


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