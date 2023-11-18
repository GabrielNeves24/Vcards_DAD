<script setup>
import { ref, inject, onMounted } from 'vue'

const props = defineProps({
  user: Object
})

//const projects = inject('projects')



const editUser = ref(Object.assign({}, props.user))

const inputDescription = ref(null)
const showErrors = ref(false) // just for testing the errors presentation/layout



onMounted(() => {
  // Initializing with the focus on the input
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
  max-width: 150px; /* or whatever size you prefer */
  height: auto;
}

.text-start {
  text-align: left;
}
</style>
