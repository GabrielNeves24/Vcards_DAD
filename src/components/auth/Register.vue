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

const photoPreview = computed(() => {
  if (credentialsRegsiter.value.photo_url && typeof credentialsRegsiter.value.photo_url === 'object') {
    return URL.createObjectURL(credentialsRegsiter.value.photo_url);
  }
  return null; 
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
           
            error.response.data.error.forEach(message => {
                toast.error(message);
            });
        } else if (error.response.data.error) {
            toast.error(error.response.data.error);
        } else {
            toast.error('Erro ao criar conta!');
        }
    } else {
        toast.error('Erro ao criar conta!');
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
  text-align: center;
  padding-top: 20px; 
}

.image-preview-container {
  margin-bottom: 10px;
  width: 100%; 
  max-width: 200px;
  height: 200px;
  border: 1px solid #ddd;
  border-radius: 10px;
  overflow: hidden;
  margin-left: auto; 
  margin-right: auto;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}


.btn-danger {
  width: 100%; 
  max-width: 200px; 
  margin-left: auto; 
  margin-right: auto;
}

.image-placeholder {
  width: 200px; 
  height: 200px; 
  background-color: #ddd; 
  border-radius: 10px; 
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px; 
  color: #333;
}
</style>
