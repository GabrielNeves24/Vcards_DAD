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
    name: null,
    vcard: userStore.userId
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
        const response = await axios.get('vcards/' + userStore.userId + '/categories/' + id)
        category.value = response.data.data
        originalValueStr = JSON.stringify(category.value)
      } catch (error) {
        console.log(error)
      }
  }
}

const save = async () => {
  errors.value = null
  console.log(category.value)
  if (operation.value == 'insert') {
    try {
      const response = await axios.post('vcards/'+ userStore.userId + '/categories', category.value)
      category.value = response.data.data
      originalValueStr = JSON.stringify(category.value)
      toast.success('Catergoria #' + category.value.id + ' criada com sucesso')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Catergoria não foi atualizada devido a erros de validação!')
      } else {
        toast.error('Catergoria não foi atualizada devido a erros desconhecidos!')
      }
    }
  } else {
    try {
      const response = await axios.put('vcards/'+ userStore.userId + '/categories', category.value)
      category.value = response.data.data
      originalValueStr = JSON.stringify(category.value)
      toast.success('Categoria ' + category.value.id + ' atualizada com sucesso.')
      router.back()
    } catch (error) {
      if (error.response.status == 422) {
        errors.value = error.response.data.errors
        toast.error('Categoria ' + props.id + ' não foi atualizada devido a erros de validação!')
      } else {
        toast.error('Categoria ' + props.id + ' não foi atualizada devido a erros desconhecidos!')
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
  fixedCategory: {
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