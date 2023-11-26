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
      id: userStore.userId,
      currentPassword: '', // Add this for the current password
      password: null,
      confirmation_code: null,
  })
  const initialData = {
    id: userStore.userId,
    confirmation_code: null,
    password: null,
    passwordConfirmation: null,
};
const emit = defineEmits(['profile'])

// const verifyPassword = async (enteredPassword, phone_number, userType) => {
//     try {
//         const response = await axios.post('/verify-password', {
//             enteredPassword: enteredPassword,
//             user: phone_number,
//             userType: userType
//         });
//         console.log(response.data.isValid);
//         return response.data.isValid; // Assuming the API returns { isValid: true/false }
//     } catch (error) {
//         toast.error('Error verifying password');
//         return false;
//     }
// }


const profile = async () => {
  // Check if no changes were made
  if (credentialsProfile.value.password == null && 
    credentialsProfile.value.confirmation_code == null &&
    credentialsProfile.value.currentPassword == null) {
      toast.error('Sem alterações');
      return;
  }
  if (credentialsProfile.value.password != credentialsProfile.value.passwordConfirmation) {
    toast.error('Passwords diferentes');
    return;
  } 
  // const formData = new FormData();
  // for (const key in credentialsProfile.value) {
  //     formData.append(key, credentialsProfile.value[key]);
  // }
  console.log(credentialsProfile)
  if ((credentialsProfile.value.password || credentialsProfile.value.confirmation_code) && credentialsProfile.value.currentPassword) {
    const isPasswordValid = await userStore.verifyPassword(credentialsProfile.value.currentPassword);
    if (!isPasswordValid) {
        toast.error('Password atual inválida');
        return;
    }else{
      if (await userStore.profile(credentialsProfile,'password')) {
        toast.success('Passwords atualizada com sucesso!');
        //emit('profile');
        router.push({ name: 'Dashboard' });
      } else {
        toast.error('Erro ao atualizar passwords!');
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
      <div class="col-md-6">
        <form
          class="row g-3 needs-validation"
          novalidate
          @submit.prevent="profile"
        >
          <h3 class="mt-5 mb-3">Editar Passwords</h3>
          <hr>
          <div class="mb-3">
            <label for="inputPassword" class="form-label">Nova Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPassword"
              v-model="credentialsProfile.password"
            >
          </div>
          <div class="mb-3">
            <label for="inputPasswordConfirmation" class="form-label">Confirmar Nova Password</label>
            <input
              type="password"
              class="form-control"
              id="inputPasswordConfirmation"
              v-model="credentialsProfile.passwordConfirmation"
            >
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
          <div class="mb-3">
              <label for="currentPassword" class="form-label">Password Atual</label>
              <input type="password" class="form-control" id="currentPassword" v-model="credentialsProfile.currentPassword">
            </div>
          <div class="mb-3 d-flex justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="profile">Save</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

