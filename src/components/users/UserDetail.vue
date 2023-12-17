<script setup>
import { ref, inject, onMounted } from 'vue'

const props = defineProps({
  user: Object
})
const editUser = ref(Object.assign({}, props.user))

const inputDescription = ref(null)
const showErrors = ref(false) 
onMounted(() => {
  inputDescription.value.focus()
})


</script>

<template>
      <div class="me-3 flex-grow-1">
        <div>
          <label >Nome: {{ editUser.name }} </label><br>
          <label >Email: {{ editUser.email }} </label>  <br>       
        </div>
        <div class="error" v-show="showErrors">Show error if necessary</div>
      </div>
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
