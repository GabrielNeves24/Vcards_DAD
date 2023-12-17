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
  const pin = ref({
    value: null,
  })
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
      if(userStore.userType == 'A'){
        return props.operationType == 'insert' ? 'Nova Transação Crédito' : 'Transação ' + editingTransaction.value.id
      }else{
        return props.operationType == 'insert' ? 'Nova Transação Débito' : 'Transação ' + editingTransaction.value.id
      }
  })

  const save = async () => {
    if (!validatePaymentReference() && editingTransaction.value.id == null) {
      toast.error('Referencia inválida');
      return;
  }
  if (editingTransaction.value.type == 'MBWAY' && editingTransaction.value.value > 50){
    toast.error('Valor maximo MBWAY 50€');
    return;
  }
  if (editingTransaction.value.type == 'PAYPAL' && editingTransaction.value.value > 100){
    toast.error('Valor maximo PAYPAL 100€');
    return;
  }
  if (editingTransaction.value.type == 'IBAN' && editingTransaction.value.value > 1000){
    toast.error('Valor maximo IBAN 1000€');
    return;
  }
  if (editingTransaction.value.type == 'MB' && editingTransaction.value.value > 500){
    toast.error('Valor maximo MB 500€');
    return;
  }
  if (editingTransaction.value.type == 'VISA' && editingTransaction.value.value > 200){
    toast.error('Valor maximo VISA 200€');
    return;
  }
  if (userStore.userType === 'V' && editingTransaction.value.id == null) {
    if (editingTransaction.value.value <= 0 )
    {
      toast.error('Insira um valor positivo');
      return;
    }
    if (editingTransaction.value.value > vcardMax.value.balance) {
      toast.error('Sem saldo suficiente para efetuar a transação');
      return;
    }
    if (editingTransaction.value.value > vcardMax.value.max_debit ) {
      toast.error('Valor da transação superior ao permitido');
      return;
    }
    if (pin.value.value == null){
      toast.error('Pin inválido');
      return;
    }
    const isPasswordValid = await userStore.verifyPin(pin.value.value);
    if (!isPasswordValid) {
        toast.error('Pin inválido');
        return;
    }
  }

  emit('save', editingTransaction.value);
  }

  const cancel = () => {
    emit('cancel', editingTransaction.value)
  }

  const categories = ref([])
  const fetchCategories = async () => {
    try {
      const response = await axios.get('vcards/'+ userStore.userId +'/categories/debit')
      categories.value = response.data.data
      categories.value.push({id: null, name: null})
      console.log(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories!')
    }
  }
  const vcardMax = ref([])
  const fetchVcard_maxDebit = async () => {
    try {
      const response = await axios.get('vcards/'+ userStore.userId)
      vcardMax.value = response.data.data

      console.log(response.data.data);
    } catch (error) {
      toast.error('Error fetching categories!')
    }
  }

  const vcardsNumbers = ref([])
  const fetchVcardsNumbers = async () => {
    try {
      const response = await axios.get('vcards')      
      vcardsNumbers.value = response.data.data.filter(vcard => vcard.blocked == 0)
      console.log(vcardsNumbers.value);
    } catch (error) {
      toast.error('Error fetching categories!')
    }
  }

  const validatePaymentReference = () => {
  const ref = editingTransaction.value.reference;
  const type = editingTransaction.value.type;

  switch (type) {
    case 'VCARD':
      return /^\d{9}$/.test(ref) && ref.startsWith('9'); 
    case 'MBWAY':
      return /^\d{9}$/.test(ref) && ref.startsWith('9'); 
    case 'PAYPAL':
      return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ref); 
    case 'IBAN':
      return /^[A-Z]{2}\d{23}$/.test(ref); 
    case 'MB':
      return /^\d{5}-\d{9}$/.test(ref); 
    case 'VISA':
      return /^\d{16}$/.test(ref) && ref.startsWith('4'); 
    default:
      return false;
  }
};


  onMounted(() => {
    if (userStore.userType == 'V') {
     
    fetchCategories()
    fetchVcard_maxDebit()
    
    }else{
      fetchVcardsNumbers()
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

    <div class="mb-3" v-show="operationType === 'insert'"> 
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
    <div class="mb-3" v-show="userStore.userType=='A' && operationType === 'insert'">
      <label
        for="vcard"
        class="form-label"
      >Numero VCard Destino Credito</label>
        <select
          class="form-select"
          :class="{ 'is-invalid': errors ? errors['vcard'] : false }"
          id="vcard"
          v-model="editingTransaction.vcard"
        >
          <option v-for="vcardsNumber in vcardsNumbers" :key="vcardsNumber.phone_number" :value="vcardsNumber.phone_number">
            {{ vcardsNumber.phone_number }}
          </option>
        </select>
      <field-error-message :errors="errors" fieldName="vcard"></field-error-message>
    </div>
    <div class="mb-3" v-show="operationType === 'insert'">
      <label
        for="type"
        class="form-label"
      >Tipo Transação</label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors ? errors['type'] : false }"
        id="type"
        v-model="editingTransaction.type"
      >
          <option value="VCARD" v-show="userStore.userType=='V'" >vCard</option>
          <option value="MBWAY">MBWAY</option>
          <option value="PAYPAL">PayPal</option>
          <option value="IBAN">IBAN (Bank Transfer)</option>
          <option value="MB">MB (Multibanco)</option>
          <option value="VISA">Visa</option>
      </select>
      <field-error-message :errors="errors" fieldName="type"></field-error-message>
    </div>
    <div class="mb-3" v-show="userStore.userType=='V'" > 
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
    <div class="mb-3" v-show="operationType === 'insert'">
      <label
        for="reference"
        class="form-label"
      >Referencia</label>
      <input
        type="text"
        class="form-control"
        :class="{'is-invalid': !validatePaymentReference() && errors}"
        id="reference"
        placeholder="Referencia da Transação"
        required
        v-model="editingTransaction.reference"
      >
      <field-error-message :errors="errors" fieldName="reference"></field-error-message>
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
    <div class="mb-3" v-show="userStore.userType=='V'  && operationType === 'insert'">
              <label for="currentPassword" class="form-label">Pin (Confirmação)</label>
              <input type="password" class="form-control" id="currentPassword" v-model="pin.value">
            </div>
    <div v-show="operationType == 'insert'">
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
    </div>
    <div v-show="operationType != 'insert'">
      <div class="mb-3 d-flex justify-content-end">
        <button
          type="button"
          class="btn btn-primary px-5"
          @click="save"
        >Alterar Transação</button>
        <button
          type="button"
          class="btn btn-light px-5"
          @click="cancel"
        >Cancelar</button>
      </div>
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
