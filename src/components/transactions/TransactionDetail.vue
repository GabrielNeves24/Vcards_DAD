<script setup>
  import { ref, watch, computed, onMounted } from 'vue'
  import axios from 'axios'
  import { useToast } from 'vue-toastification'
  import { defineProps, defineEmits } from 'vue'
  import { useUserStore } from "../../stores/user.js"

  const toast = useToast()
const userStore = useUserStore()
  const props = defineProps({
    transaction: {
      type: Object,
      required: true
    },
    operationType: {
      type: String,
      default: 'insert'  // insert / update
    },
    transactions: {
      type: Array,
      required: true
    },
    fixedTransaction: {
      type: Number,
      default: null
    },
    errors: {
      type: Object,
      required: false,
    },
  })

  const emit = defineEmits(['save', 'cancel'])

  const editingTransaction = ref(props.transaction)

  watch(
    () => props.transaction,
    (newTransaction) => {
        editingTransaction.value = newTransaction
    }
  )

  watch(
    () => props.fixedTransaction, 
    (newFixedTransaction) => {
      if (newFixedTransaction) {
        editingTransaction.value.transaction_id = newFixedTransaction
      }
    },
    { immediate: true }
  )

  const transactionTitle = computed( () => {
    if (!editingTransaction.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'Nova Transação' : 'Transação ' + editingTransaction.value.id
  })

  const save = () => {
    emit('save', editingTransaction.value)
  }

  const cancel = () => {
    emit('cancel', editingTransaction.value)
  }

  const categories = ref([])
  const fetchCategories = async () => {
    try {
      const response = await axios.get('vcards/'+ userStore.userId +'/categories/debit')
      categories.value = response.data.data
      console.log(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories!')
    }
  }

  onMounted(() => {
    if (userStore.userType == 'V') {
     
    fetchCategories()
    }
  })
</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="save"
  >
    <h3 class="mt-5 mb-3">{{ transactionTitle }}</h3>
    <hr>

    <div class="mb-3">
      <label
        for="value"
        class="form-label"
      >Valor:</label>
      <input
        type="number"
        class="form-control"
        :class="{'is-invalid': errors ? errors['value']: false}"
        id="value"
        placeholder="Valor da Transação"
        required
        v-model="editingTransaction.value" min="0.01" step="0.01"
      >
      <field-error-message :errors="errors" fieldNumber="value"></field-error-message>
    </div>
    <div class="mb-3" v-show="userStore.userType=='A'">
      <label
        for="vcard"
        class="form-label"
      >Numero VCard</label>
      <input
        type = "number"
        class="form-control"
        :class="{ 'is-invalid': errors ? errors['vcard'] : false }"
        id="vcard"
        v-model="editingTransaction.vcard"
      >
      <field-error-message :errors="errors" fieldName="vcard"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="payment_type"
        class="form-label"
      >Tipo Transação</label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors ? errors['payment_type'] : false }"
        id="payment_type"
        v-model="editingTransaction.payment_type"
      >
          <option value="VCARD" >vCard</option>
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PayPal</option>
          <option value="IBAN">IBAN (Bank Transfer)</option>
          <option value="MB">MB (Multibanco)</option>
          <option value="VISA">Visa</option>
      </select>
      <field-error-message :errors="errors" fieldName="payment_type"></field-error-message>
    </div>
    <div class="mb-3" v-show="userStore.userType=='V'"> 
      <label
        for="category_id"
        class="form-label"
      >Categoria Transação</label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors ? errors['category_id'] : false }"
        id="category_id"
        v-model="editingTransaction.category_id"
      >
          <option v-for="category in categories" :key="category.id" :value="category.id">
            {{ category.name }}
          </option>
      </select>
      <field-error-message :errors="errors" fieldName="category_id"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="payment_reference"
        class="form-label"
      >Referencia</label>
      <input
        type="text"
        class="form-control"
        :class="{'is-invalid': errors ? errors['payment_reference']: false}"
        id="payment_reference"
        placeholder="Referencia da Transação"
        required
        v-model="editingTransaction.payment_reference"
      >
      <field-error-message :errors="errors" fieldName="payment_reference"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="description"
        class="form-label"
      >Descrição</label>
      <textarea
        class="form-control"
        :class="{ 'is-invalid': errors ? errors['description'] : false }"
        id="description"
        rows="4"
        v-model="editingTransaction.description"
      ></textarea>
      <field-error-message :errors="errors" fieldName="description"></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="save"
      >Efetuar Transação</button>
      <button
        type="button"
        class="btn btn-light px-5"
        @click="cancel"
      >Cancelar</button>
    </div>
  </form>
</template>


<style scoped>
.total_hours {
  width: 26rem;
}
.checkCompleted {
  min-height: 2.375rem;
}
</style>
