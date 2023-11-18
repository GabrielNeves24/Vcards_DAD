<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useUserStore } from "../../stores/user.js"
//import { useTransactionsStore } from "../../stores/transactions.js"
import { useRouter, onBeforeRouteLeave } from 'vue-router'
import { ref, watch, computed } from 'vue'

import CategoryDetail from "./CategoryDetail.vue"

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()
//const transactionStore = useTransactionsStore()

const newCategory = () => { 
  return {
    id: null,
    type: null,
    description: null,
  }
}

const category = ref(newCategory())
const errors = ref(null)
const confirmationLeaveDialog = ref(null)
// String with the JSON representation after loading the project (new or edit)
let originalValueStr = ''
  
const loadCategories = async (id) => {
  originalValueStr = ''
  errors.value = null
  if (!id || (id < 0)) {
    category.value = newCategory()
    originalValueStr = JSON.stringify(category.value)
  } else {
      try {
        const response = await axios.get('vcards/' + userStore.$id + '/categories')
        category.value = response.data.data
        originalValueStr = JSON.stringify(category.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const save = async () => {
  errors.value = null
  if (operation.value == 'insert') {
    try {
      const response = await axios.post('transactions/debit', category.value)
      category.value = response.data.data
      originalValueStr = JSON.stringify(category.value)
      toast.success('Transação #' + category.value.id + ' was created successfully.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transação was not created due to validation errors!')
      } else {
        toast.error('Transação was not created due to unknown server error!')
      }
    }
  } else {
    try {
      const response = await axios.put('transactions/debit' + props.id, category.value)
      category.value = response.data.data
      originalValueStr = JSON.stringify(category.value)
      toast.success('Transação #' + category.value.id + ' was updated successfully.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Transação #' + props.id + ' was not updated due to validation errors!')
      } else {
        toast.error('Transação #' + props.id + ' was not updated due to unknown server error!')
      }
    }
  }
}

const cancel = () => {
  originalValueStr = JSON.stringify(category.value)
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
      loadCategories(newValue)
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
  let newValueStr = JSON.stringify(category.value)
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

  <category-detail
    :operationType="operation"
    :category="category"
    :categories="categories"
    :fixedTransaction="fixedCategory"
    :errors="errors"
    @save="save"
    @cancel="cancel"
  ></category-detail>
</template>