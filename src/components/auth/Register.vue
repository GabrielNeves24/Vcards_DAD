<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref } from 'vue'

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

  const handleFileUpload = (event) => {
    credentialsRegsiter.value.photo_url = event.target.files[0];
};
const emit = defineEmits(['register'])

const register = async () => {
  
  const formData = new FormData();
    for (const key in credentialsRegsiter.value) {
        formData.append(key, credentialsRegsiter.value[key]);
    }

    if (await userStore.register(formData)) {
        toast.success('Vcard ' + credentialsRegsiter.value.phone_number + ' criado com sucesso.');
        router.push({ name: 'Login' });
    } else {
        credentialsRegsiter.value.password = '';
        toast.error('Error creating user!');
    }
};

</script>

<template>
  <form
    class="row g-3 needs-validation"
    novalidate
    @submit.prevent="register"
  >
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
    <div class="mb-3">
      <div class="mb-3">
        <label for="photo_url" class="form-label">Profile Image</label>
        <input type="file" class="form-control" id="photo_url" accept="image/jpeg" @change="handleFileUpload">
      </div>
    </div>
    <div class="mb-3 d-flex justify-content-center">
      <button type="button" class="btn btn-primary px-5" @click="register">Register</button>
    </div>

  </form>

</template>

