<script setup>
import { ref, computed, onMounted, inject} from 'vue'
import avatarNoneUrl from '@/assets/avatar-none.png'
const props = defineProps({
  vcard: Object
})
const serverBaseUrl = inject('serverBaseUrl')
const emit = defineEmits(['hide', 'requestUpdateVcard'])

const editVcard = ref(Object.assign({}, props.vcard))

const inputDescription = ref(null)
const showErrors = ref(false) 

const save = () => {
  let vcardToSave = {
    ...editVcard.value,
    blocked: editVcard.value.blocked ? 1 : 0
  };

  emit('requestUpdateVcard', vcardToSave);
  emit('hide');

}

const getPhotoUrl = (photoUrl) => {
  
  return photoUrl
    ? serverBaseUrl + '/storage/fotos/' + photoUrl
    : avatarNoneUrl;
}

const cancel = () => {
  emit('hide')
}

const blockedForDisplay = computed({
  get: () => editVcard.value.blocked === 1,
  set: (newValue) => {
    editVcard.value.blocked = newValue ? 1 : 0;
  }
});

onMounted(() => {
  inputDescription.value.focus()
})


</script>

<template>
  <form action="#" class="d-flex">
    <img :src="getPhotoUrl(vcard.photo_url)" alt="" class="img-fluid larger-image me-3">
    <div class="me-3 flex-grow-1">
      <div class="mb-3">
        <label>Blocked:</label>
        <input
            class="form-check-input"
            type="checkbox"
            id="blocked"
            v-model="blockedForDisplay"
          />
        <label class="form-check-label" for="blocked">{{ editVcard.blocked ? 'Sim' : 'Não' }}</label>
      </div>
      <div>
        <label>Nº Telefone: {{ editVcard.phone_number }}</label><br>
        <label>Nome: {{ editVcard.name }}</label><br>
        <label>Email: {{ editVcard.email }}</label><br>
        <label>Saldo:  {{ editVcard.balance }} €</label><br>
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
  max-width: 150px;
  height: auto;
}

.text-start {
  text-align: left;
}
</style>
