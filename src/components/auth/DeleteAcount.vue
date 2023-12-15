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
      currentPassword: null, 
      password: null,
      confirmation_code: null,
  })
const confirmDeleteAccount = async () => {
  const isPinValid = await userStore.verifyPin(credentialsProfile.value.confirmation_code);
  if (!isPinValid) {
    toast.error('Pin de confirmação inválido');
    return;
  }

  const isCodeValid = await userStore.verifyPassword(credentialsProfile.value.currentPassword);
  if (!isCodeValid) {
    toast.error('Password de confirmação inválido');
    return;
  }

  if (await userStore.deleteAcountVCard()) {
    toast.success('Conta eliminada com sucesso.');
    router.push({ name: 'Login' });
  } else {
    toast.error('Erro ao eliminar conta!');
  }
}

onMounted(() => {
   
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
          <h3 class="mt-5 mb-3">Eliminar Conta</h3>
          <hr>
          
          <div class="mb-3" v-show="userStore.userType == 'V'">
            <label for="confirmation_code" class="form-label">Pin Vcard</label>
            <input
              type="password"
              class="form-control"
              id="confirmation_code"
              v-model="credentialsProfile.confirmation_code"
            >
          </div>
          <div class="mb-3">
              <label for="currentPassword" class="form-label">Password Vcard</label>
              <input type="password" class="form-control" id="currentPassword" v-model="credentialsProfile.currentPassword">
            </div>
          <div class="mb-3 d-flex justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="confirmDeleteAccount">Eliminar Conta</button>           
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<style scoped>

</style>

