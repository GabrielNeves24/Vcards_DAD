<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref,computed } from 'vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const credentialsRegsiter = ref({
      password: '',
      name: '',
      email: '',
      phone_number: '',
      confirmation_code: '',
      photo_url: ''
  })


// ... existing imports and setup

const photoPreview = computed(() => {
  if (credentialsRegsiter.value.photo_url && typeof credentialsRegsiter.value.photo_url === 'object') {
    return URL.createObjectURL(credentialsRegsiter.value.photo_url);
  }
  return null; // Return null if no photo is selected
});


const handleFileUpload = (event) => {
  const files = event.target.files;
  if (files && files[0]) {
    credentialsRegsiter.value.photo_url = files[0];
  }
};

const emit = defineEmits(['register'])

const register = async () => {
    const formData = new FormData();
    for (const key in credentialsRegsiter.value) {
        formData.append(key, credentialsRegsiter.value[key]);
    }
    const error = await userStore.register(formData);
    if(error === true) {
        toast.success('Vcard ' + credentialsRegsiter.value.phone_number + ' criado com sucesso.');
        router.push({ name: 'Login' });
    } else{
        handleApiErrors(error);
        credentialsRegsiter.value.password = '';
    }
};

function handleApiErrors(error) {
    if (error.response && error.response.data) {
        if (error.response.data.error && Array.isArray(error.response.data.error)) {
            // If the error is an array of messages
            error.response.data.error.forEach(message => {
                toast.error(message);
            });
        } else if (error.response.data.error) {
            // If it's a single error message
            toast.error(error.response.data.error);
        } else {
            // General error message
            toast.error('An unexpected error occurred!');
        }
    } else {
        // Fallback error message
        toast.error('An unexpected error occurred!');
    }
}

</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="register"
  >
  <div class="row">
    <!-- Form Fields on the Left -->
    <div class="col-md-8">
      <h3 class="mt-5 mb-3">Login</h3>
      <hr>
      <div class="mb-3">
        <div class="mb-3">
          <label
            for="phone_number"
            class="form-label"
          >Numero Telefone</label>
          <input
            type="tel"
            class="form-control"
            id="phone_number"
            required
            v-model="credentialsRegsiter.phone_number"
          >
        </div>
      </div>
      <div class="mb-3">
        <div class="mb-3">
          <label
            for="name"
            class="form-label"
          > Nome</label>
          <input
            type="text"
            class="form-control"
            id="name"
            required
            v-model="credentialsRegsiter.name"
          >
        </div>
      </div>
      <div class="mb-3">
        <div class="mb-3">
          <label
            for="email"
            class="form-label"
          >Email</label>
          <input
            type="email"
            class="form-control"
            id="email"
            required
            v-model="credentialsRegsiter.email"
          >
        </div>
      </div>
      <div class="mb-3">
        <div class="mb-3">
          <label
            for="inputPassword"
            class="form-label"
          >Password</label>
          <input
            type="password"
            class="form-control"
            id="inputPassword"
            required
            v-model="credentialsRegsiter.password"
          >
        </div>
      </div>
      <div class="mb-3">
        <div class="mb-3">
          <label
            for="confirmation_code"
            class="form-label"
          >Codigo Confirmação</label>
          <input
            type="number"
            class="form-control"
            id="confirmation_code"
            required
            v-model="credentialsRegsiter.confirmation_code"
          >
        </div>
      </div>
    </div>
    <div class="col-md-4">
      <div class="image-upload-container">
        <div v-if="photoPreview" class="image-preview-container">
          <img :src="photoPreview" alt="Profile Image Preview" class="image-preview">
        </div>
        <div v-else class="image-placeholder"></div>
        <input type="file" class="form-control" id="photo_url" accept="image/*" @change="handleFileUpload">
        <button v-if="photoPreview" class="btn btn-danger mt-2" @click="removePhoto">Remove Image</button>
      </div>
    </div>
  </div>
    
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="register">Register</button>
    </div>

  </form>

</template>

<style scoped>
.image-upload-container {
  text-align: center; /* Center the content */
  padding-top: 20px; /* Add some spacing */
}

.image-preview-container {
  margin-bottom: 10px;
  width: 100%; /* Full width of the container */
  max-width: 200px; /* Max width of the image */
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-left: auto; /* Center the image preview */
  margin-right: auto;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* Adjust the button styles if needed */
.btn-danger {
  width: 100%; /* Full width of the container */
  max-width: 200px; /* Max width of the button */
  margin-left: auto; /* Center the button */
  margin-right: auto;
}

.image-placeholder {
  width: 200px; /* Adjust as needed */
  height: 200px; /* Adjust as needed */
  background-color: #ddd; /* Gray color */
  border-radius: 10px; /* Rounded corners, optional */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; /* Optional, if you want to add text */
  color: #333; /* Text color, optional */
}
</style>
