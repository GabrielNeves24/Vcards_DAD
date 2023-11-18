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

const makeDebitTransaction = async () => {
  try {
    // Validate the transaction value
    if (parseFloat(transactionValue.value) <= 0) {
      alert('Transaction value must be greater than 0.');
      return;
    }

    // Validate the transaction value against the vCard balance and max_debit
    const vCardBalance = parseFloat(vcards.value.balance);
    const maxDebit = parseFloat(vcards.value.max_debit);
    if (parseFloat(transactionValue.value) > vCardBalance) {
      alert('Transaction value exceeds the vCard balance.');
      return;
    }
    if (parseFloat(transactionValue.value) > maxDebit) {
      alert('Transaction value exceeds the maximum debit limit.');
      return;
    }
    const currentDate = new Date().toISOString().split('T')[0]; // Format as 'YYYY-MM-DD'
    const currentDatetime = new Date().toISOString().replace('T', ' ').replace('Z', ''); // Format as 'YYYY-MM-DD HH:MM:SS'

    const response = await axios.post('/transactions/debit', {
      vcard: vcards.value.phone_number,
      date: currentDate,
      datetime: currentDatetime,
      type: 'D',
      value: transactionValue.value, // Use transactionValue.value
      old_balance: vcards.value.balance,
      new_balance: vcards.value.balance - transactionValue.value, // Use transactionValue.value
      payment_type: payment_type.value, // Assuming payment_type is also a ref
      payment_reference: transactionReference.value, // Use transactionReference.value
      pair_transaction: null,
      pair_vcard: null,
      category_id: selectedCategory.value, // Assuming selectedCategory is also a ref
      description: transactiondescription.value, // Use transactiondescription.value
    });
    if (response.status === 201) {
      alert(response.data.message);
      //fetchRecentTransactions();
      //fetchRecentTransactions(); // Refresh transactions
      emit('transactionMade'); // Emitting an event
      toggleDebitTransaction(); // Hide the debit transaction form

    } else {
      alert('Error creating debit transaction.');
    }
  } catch (error) {
    console.error('Error creating debit transaction:', error);
    alert('Error creating debit transaction. Please try again.');
  }
}


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
