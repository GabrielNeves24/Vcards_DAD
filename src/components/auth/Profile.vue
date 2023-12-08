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
      name: null,
      email: null,
      photo_url: null,
  })
  const initialData = {
    id: userStore.userId,
    name: null,
    email: null,
    photo_url: null,
};

const handleFileUpload = (event) => {
  credentialsProfile.value.photo_url = event.target.files[0];
};
const emit = defineEmits(['profile'])

const profile = async () => {
  // Check if no changes were made
  if (initialData.name == credentialsProfile.value.name && 
      initialData.email == credentialsProfile.value.email && 
      credentialsProfile.value.photo_url == null) {
        toast.error('Sem alterações');
        return;
    }
    //if only alter name and email do the followingprofile
    if (initialData.name != credentialsProfile.value.name || initialData.email != credentialsProfile.value.email || credentialsProfile.value.photo_url != null) {
      //console.log(await userStore.profile(credentialsProfile,'perfil'))
      const formData = new FormData();
      for (const key in credentialsProfile.value) {
          formData.append(key, credentialsProfile.value[key]);
      }
      if (await userStore.profile(formData)) {
        toast.success('Perfil atualizado com sucesso.');
        //emit('profile');
        router.push({ name: 'Dashboard' });
      } else {
        toast.error('Erro ao atualizar perfil!');
      }
    }
}


const fetchData = async () => {
        if (userStore.userType == 'V'){
          const response = await axios.get(`/vcards/${userStore.userId}`);
          const data = response.data.data;
          credentialsProfile.value.name = data.name;
          credentialsProfile.value.email = data.email;
          //credentialsProfile.value.photo_url = data.photo_url;
          initialData.name = data.name;
          //initialData.id = data.id
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
          <div class="mb-3 d-flex justify-content-center">
            <button type="button" class="btn btn-primary px-5" @click="profile">Save</button>
          </div>
        </form>
      </div>
      <div v-if="userStore.userType == 'V'" class="col-md-6 d-flex align-items-center justify-content-center" >
        <img :src="userStore.userPhotoUrl" alt="Vcard Foto" class="img-fluid rounded-circle" style="max-width: 200px;" for="photo_url">
        <input type="file" accept="image/jpeg" @change="handleFileUpload" id="photo_url">
      </div>
    </div>
  </div>
</template>

