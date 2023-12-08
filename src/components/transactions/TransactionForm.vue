<script setup>
// TransactionForm.vue
import { ref } from 'vue';

const props = defineProps({
  categories: Array,
  vcards: Object
});

const transactionValue = ref(0);
const payment_type = ref('vCard');
const transactionReference = ref('');
const transactiondescription = ref('');
const selectedCategory = ref(''); // Initialize selectedCategory


//click on the button to make a debit transaction
const isDebitTransactionOpen = ref(false); // This will control the visibility of the debit transaction form
const toggleDebitTransaction = () => {
  isDebitTransactionOpen.value = !isDebitTransactionOpen.value; // Toggle the state
};

const emit = defineEmits(['updateTransactions']); // Define the event to be emitted
const emitUpdate = () => emit('updateTransactions');




// Add your transaction logic here

</script>

<template>
  <div class="section">
      <h2 @click="toggleDebitTransaction">Transação Débito</h2>
      <div v-show="isDebitTransactionOpen">
          <div>
          <form @submit.prevent="makeDebitTransaction">
            <div class="form-group">
              <label for="transactionValue">Valor (€):</label>
              <input type="number" id="transactionValue" v-model="transactionValue" min="0.01" step="0.01" required>
            </div>
            <div class="form-group">
              <label for="payment_type">Tipo Transação:</label>
              <select id="payment_type" v-model="payment_type" required>
                <option value="VCARD">vCard</option>
                <option value="MBWAY">MBWAY</option>
                <option value="PAYPAL">PayPal</option>
                <option value="IBAN">IBAN (Bank Transfer)</option>
                <option value="MB">MB (Multibanco)</option>
                <option value="VISA">Visa</option>
              </select>
            </div>
            <div class="form-group">
              <label for="payment_type">Tipo Transação:</label>
              <select id="payment_type" v-model="selectedCategory" required>
                <option value="">Selecione uma categoria</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-group">
              <label for="transactionReference">Referencia:</label>
              <input type="text" id="transactionReference" v-model="transactionReference" required>
            </div>
            <div class="form-group">
              <label for="transactiondescription">Descrição:</label>
              <input type="text" id="transactiondescription" v-model="transactiondescription" required>
            </div>
            <button type="submit">Make Debit Transaction</button>
          </form>
        </div>
      </div>
    </div>
</template>
