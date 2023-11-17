<script setup>
  import { ref, watch, computed } from 'vue'

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

  const taskTitle = computed( () => {
    if (!editingTransaction.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'New Task' : 'Task #' + editingTransaction.value.id
  })

  const save = () => {
    emit('save', editingTransaction.value)
  }

  const cancel = () => {
    emit('cancel', editingTransaction.value)
  }
</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="save"
  >
    <h3 class="mt-5 mb-3">{{ taskTitle }}</h3>
    <hr>

    <div class="d-flex flex-wrap justify-content-between">
      <div class="mb-3 checkCompleted">
        <div class="form-check">
          <input
            class="form-check-input"
            :class="{ 'is-invalid': errors ? errors['completed'] : false }"
            type="checkbox"
            v-model="editingTransaction.completed"
            id="inputCompleted"
          >
          <label
            class="form-check-label"
            for="inputCompleted"
          >
            Task is Completed
          </label>
          <field-error-message :errors="errors" fieldName="completed"></field-error-message>
        </div>
      </div>
      <div
        class="row mb-3 total_hours"
        v-show="editingTransaction.completed"
      >
        <label
          for="inputHours"
          class="col-sm-2 col-form-label"
        >Hours</label>
        <div class="col-sm-10">
          <input
            type="number"
            class="form-control"
            :class="{ 'is-invalid': errors ? errors['total_hours'] : false }"
            id="inputHours"
            placeholder="Total hours to complete the task"
            v-model="editingTransaction.total_hours"
          >
          <field-error-message :errors="errors" fieldName="total_hours"></field-error-message>
        </div>
      </div>
    </div>

    <div class="mb-3">
      <label
        for="inputDescription"
        class="form-label"
      >Description</label>
      <input
        type="text"
        class="form-control"
        :class="{'is-invalid': errors ? errors['description']: false}"
        id="inputDescription"
        placeholder="Task Description"
        required
        v-model="editingTransaction.description"
      >
      <field-error-message :errors="errors" fieldName="description"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputProject"
        class="form-label"
      >Project</label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors ? errors['transaction_id'] : false }"
        id="inputProject"
        :disabled="fixedProject"
        v-model="editingTransaction.transaction_id"
      >
        <option :value="null">-- No Project --</option>
        <option
          v-for="prj in projects"
          :key="prj.id"
          :value="prj.id"
        >{{prj.name}}</option>
      </select>
      <field-error-message :errors="errors" fieldName="transaction_id"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="inputNotes"
        class="form-label"
      >Notes</label>
      <textarea
        class="form-control"
        :class="{ 'is-invalid': errors ? errors['notes'] : false }"
        id="inputNotes"
        rows="4"
        v-model="editingTransaction.notes"
      ></textarea>
      <field-error-message :errors="errors" fieldName="notes"></field-error-message>
    </div>

    <div class="mb-3 d-flex justify-content-end">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="save"
      >Save</button>
      <button
        type="button"
        class="btn btn-light px-5"
        @click="cancel"
      >Cancel</button>
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
