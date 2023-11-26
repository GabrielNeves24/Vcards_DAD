<script setup>
import { ref, inject, onMounted } from 'vue'

const props = defineProps({
  vcard: Object
})

//const projects = inject('projects')

const emit = defineEmits(['hide', 'requestUpdateVcard'])

const editVcard = ref(Object.assign({}, props.vcard))

const inputDescription = ref(null)
const showErrors = ref(false) // just for testing the errors presentation/layout

const save = () => {
  // Instead of updating the data (task) here, we request to update it by emiting an event
  emit('requestUpdateVcard', editVcard.value)

  // after saving we also want to hide the component
  emit('hide')
}

const cancel = () => {
  emit('hide')
}

onMounted(() => {
  // Initializing with the focus on the input
  inputDescription.value.focus()
})


</script>

<template>
  <form action="#" class="d-flex">
    <img :src="editVcard.photo_url" alt="" class="img-fluid larger-image me-3">
    <div class="me-3 flex-grow-1">
      <div class="mb-3">
        <label>Blocked:</label>
        <input
          class="form-check-input"
          type="checkbox"
          id="blocked"
          v-model="editVcard.blocked"
          :checked="editVcard.blocked"
        />
        <label class="form-check-label" for="blocked">{{ editVcard.blocked ? 'Sim' : 'Não' }}</label>
      </div>
      <div>
        <label>Nº Telefone: {{ editVcard.phone_number }}</label><br>
        <label>Nome: {{ editVcard.name }}</label><br>
        <label>Email: {{ editVcard.email }}</label><br>
        <label>Máximo. Débito: {{ editVcard.max_debit }}</label>
      </div>
      <div class="error" v-show="showErrors">Show error if necessary</div>
    </div>

    <div class="flex-grow-2">
      <div class="mb-3">
        <label for="inputDescription" class="form-label mb-0">Max. Deb</label>
        <input
          type="number"
          class="form-control"
          id="inputDescription"
          ref="inputDescription"
          style="width: 150px;"
          placeholder=""
          v-model="editVcard.max_debit"
        />
      </div>
      <div class="error" v-show="showErrors">Show error if necessary</div>
    </div>
    <div class="me-0">
      <div class="d-flex flex-column">
        <button type="submit" class="btn btn-primary" @click.prevent="save">
          <i class="bi-check-lg" aria-hidden="true"></i> Save
        </button>
        <button type="button" class="btn btn-secondary mt-2" @click="cancel">
          <i class="bi-x-lg" aria-hidden="true"></i> Cancel
        </button>
      </div>
    </div>
  </form>
</template>


<style scoped>
.larger-image {
  max-width: 150px; /* or whatever size you prefer */
  height: auto;
}

.text-start {
  text-align: left;
}
</style>
