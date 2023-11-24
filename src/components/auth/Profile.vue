<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../../stores/user.js'
import { ref, onMounted } from 'vue'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()

const credentialsProfile = ref({
      name: '',
      email: '',
      currentPassword: '', // Add this for the current password
      password: null,
      passwordConfirmation: null,
      confirmation_code: null,
      photo_url: '',
  })
  const initialData = {
    id: '',
    name: '',
    email: '',
    photo_url: null,
    confirmationCode: null,
    password: null,
    passwordConfirmation: null,

};

const handleFileUpload = (event) => {
  credentialsProfile.value.photo_url = event.target.files[0];
};
const emit = defineEmits(['profile'])

const verifyPassword = async (enteredPassword, phone_number, userType) => {
    try {
        const response = await axios.post('/verify-password', {
            enteredPassword: enteredPassword,
            user: phone_number,
            userType: userType
        });
        console.log(response.data.isValid);
        return response.data.isValid; // Assuming the API returns { isValid: true/false }
    } catch (error) {
        toast.error('Error verifying password');
        return false;
    }
}


const profile = async () => {
  // Check if no changes were made
  if (initialData.name == credentialsProfile.value.name && 
      initialData.email == credentialsProfile.value.email &&
      credentialsProfile.value.password == null && 
      credentialsProfile.value.confirmation_code == null) {
        toast.error('No changes were made');
        return;
    }
    const formData = new FormData();
    for (const key in credentialsProfile.value) {
        formData.append(key, credentialsProfile.value[key]);
    }
    //if only alter name and email do the followingprofile
    if (initialData.name != credentialsProfile.value.name || initialData.email != credentialsProfile.value.email && credentialsProfile.value.password == '' && credentialsProfile.value.confirmation_code == '') {
      console.log('alter name and email');
      if (await userStore.profile(formData)) {
        toast.success('Profile updated successfully.');
        emit('profile');
        router.push({ name: 'Profile' });
      } else {
        toast.error('Error updating profile!');
      }
    }

    if ((credentialsProfile.value.password || credentialsProfile.value.confirmation_code) && credentialsProfile.value.currentPassword) {
      const isPasswordValid = await verifyPassword(credentialsProfile.value.currentPassword, userStore.userId, userStore.userType);
      console.log(isPasswordValid);
      if (!isPasswordValid) {
          toast.error('Current password is incorrect');
          return;
      }else{
              console.log('password is correct');
        if (await userStore.profile(formData)) {
          toast.success('Profile updated successfully.');
          emit('profile');
          router.push({ name: 'Profile' });
        } else {
          toast.error('Error updating profile!');
        }
      }
  }
}


const fetchData = async () => {
        if (userStore.userType == 'V'){
          const response = await axios.get(`/vcards/${userStore.userId}`);
          const data = response.data.data;
          credentialsProfile.value.name = data.name;
          credentialsProfile.value.email = data.email;
          credentialsProfile.value.photo_url = data.photo_url;
          initialData.name = data.name;
          initialData.id = data.id
        initialData.email = data.email;
        } else {
          const response = await axios.get(`/users/${userStore.userId}`);
        const data = response.data.data;
        credentialsProfile.value.name = data.name;
        credentialsProfile.value.email = data.email;
        initialData.name = data.name;
        initialData.email = data.email;
        }

};

onMounted(() => {
    fetchData();
});


</script>


<template>
  <div class="container">
    <div class="row">
      <!-- User Information and Form Fields on the Left -->
      <div class="col-md-6">
        <form
          class="row g-3 needs-validation"
          novalidate
          @submit.prevent="profile"
        >
          <h3 class="mt-5 mb-3">Editar Perfil</h3>
          <hr>
          <div class="mb-3">
            <label for="name" class="form-label">Nome</label>
            <input
              type="text"
              class="form-control"
              id="name"
              required
              v-model="credentialsProfile.name"
            >
          </div>
          <div class="mb-3">
            <label for="email" class="form-label">Email</label>
            <input
              type="email"
              class="form-control"
              id="email"
              required
              v-model="credentialsProfile.email"
            >
          </div>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              v-model="credentialsProfile.password"
            >
          </div>
          <div class="mb-3">
            <label for="inputPasswordConfirmation" class="form-label">Confirm Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPasswordConfirmation"
              v-model="credentialsProfile.passwordConfirmation"
            >
          </div>
          <!-- Current Password Field (only show if changing password or confirmation code) -->
          <div class="mb-3" v-if="credentialsProfile.password || credentialsProfile.confirmation_code">
                <label for="currentPassword" class="form-label">Current Password</label>
                <input type="password" class="form-control" id="currentPassword" v-model="credentialsProfile.currentPassword">
              </div>
          <div class="mb-3">
            <label for="confirmation_code" class="form-label">Código de Confirmação</label>
            <input
              type="number"
              class="form-control"
              id="confirmation_code"
              v-model="credentialsProfile.confirmation_code"
            >
          </div>
          <div class="mb-3 d-flex justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="profile">Save</button>
          </div>
        </form>
      </div>

       

      <!-- User Image on the Right -->
      <div class="col-md-6 d-flex align-items-center justify-content-center">
        <img :src="userStore.userPhotoUrl" alt="Vcard Foto" class="img-fluid rounded-circle" style="max-width: 200px;">
        <input type="file" accept="image/*" @change="handleFileUpload">
      </div>
    </div>
  </div>
</template>

