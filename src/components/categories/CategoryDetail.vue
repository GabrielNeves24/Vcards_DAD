<script setup>
  import { ref, watch, computed } from 'vue'

  const props = defineProps({
    category: {
      type: Object,
      required: true
    },
    operationType: {
      type: String,
      default: 'insert' 
    },
    categories: {
      type: Array,
      required: true
    },
    fixedCategory: {
      type: Number,
      default: null
    },
    errors: {
      type: Object,
      required: false,
    },
  })

  const emit = defineEmits(['save', 'cancel'])

  const editingCategory = ref(props.category)

  watch(
  () => props.category,
  (newCategory) => {
    editingCategory.value = newCategory;
  }
);

  watch(
    () => props.fixedCategory, 
    (newFixedCategory) => {
      if (newFixedCategory) {
        editingCategory.value.category_id = newFixedCategory
      }
    },
    { immediate: true }
  )

  const categoryTitle = computed( () => {
    if (!editingCategory.value) {
        return ''
      }
      return props.operationType == 'insert' ? 'Nova Categoria' : 'Categoria ' + editingCategory.value.id
  })

  const save = () => {
    emit('save', editingCategory.value)
  }

  const cancel = () => {
    emit('cancel', editingCategory.value)
  }
</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="save"
  >
    <h3 class="mt-5 mb-3">{{ categoryTitle }}</h3>
    <hr>

    <div class="mb-3">
      <label
        for="type"
        class="form-label"
      >Tipo</label>
      <select
        class="form-select"
        :class="{ 'is-invalid': errors ? errors['payment_type'] : false }"
        id="payment_type"
        v-model="editingCategory.type"
        required
      >
        <option value="D">Débito</option>
        <option value="C">Crédito</option>
      </select>
      <field-error-message :errors="errors" fieldName="type"></field-error-message>
    </div>
    <div class="mb-3">
      <label
        for="name"
        class="form-label"
      >Nome</label>
      <input
        type="text"
        class="form-control"
        :class="{'is-invalid': errors ? errors['name']: false}"
        id="name"
        placeholder="name"
        required
        v-model="editingCategory.name"
      >
      <field-error-message :errors="errors" fieldName="name"></field-error-message>
    </div>
    <div class="mb-3 d-flex justify-content-end">
      <button
        type="button"
        class="btn btn-primary px-5"
        @click="save"
      >Guardar</button>
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
