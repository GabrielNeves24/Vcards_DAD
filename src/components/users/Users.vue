<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted, inject } from 'vue'
import UserList from "./UserList.vue"
import { useToast } from "vue-toastification"
import * as XLSX from 'xlsx'

const socket = inject("socket");
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()

const loadUsers = async () => {
  try {
    const response = await axios.get('users')
    users.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

const exportToExcel = () => {
  users.value.forEach(function (v) {
    delete v.password;
    delete v.confirmation_code;
  });
  const ws = XLSX.utils.json_to_sheet(users.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Users");
  XLSX.writeFile(wb, "Users.xlsx");
};

const showAddUserForm = ref(false);

const toggleAddUserForm = () => {
  showAddUserForm.value = !showAddUserForm.value;
};

const newUser = ref({
  name: '',
  email: '',
  password: ''
});
socket.on('insertedUser', (insertedUser) => {
        toast.info(`User #${insertedUser.id} (${insertedUser.name}) has registered successfully!`)
        })

const saveNewUser = async () => {
  try {
    await axios.post('users', newUser.value);
    toast.success('Utilizador  criado com sucesso!');
    socket.emit('insertedUser', newUser.value)
    newUser.value = { name: '', email: '', password: '' }; 
    showAddUserForm.value = false; 
    await loadUsers(); 
  } catch (error) {
    console.error(error);
  }
};

const editUser = (user) => {
    router.push({ name: 'User', params: { id: user.id } })
}

const deletedUser = async (deletedUser) => {
  console.log(deletedUser.id)
  if (!deletedUser.id) {
     console.error("Sem user para eliminar");
     return;
   }
    try {
      const reponse = await axios.delete('users/' + deletedUser.id)
      toast.success("Administrador eliminado com sucesso")
      loadUsers()
      router.push({ name: 'Users' })
    } catch (error) {
      console.log(error)
      toast.error("Erro ao eliminar Administrador")
    }

}

const props = defineProps({
  usersTitle: {
    type: String,
    default: 'Gestão Administradores'
  },
  onlyCurrentUsers: {
    type: Boolean,
    default: false
  }
})

const users = ref([])
  const filterByName = ref('')
  const currentPage = ref(1);

  const filteredVcards = computed( () => {
    let filtered = users.value;
    if (filterByName.value) {
      filtered = filtered.filter(v =>
        v.name && v.name.toString().includes(filterByName.value)
      );
    }


  const totalFiltered = filtered.length;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalFiltered);
  return filtered.slice(start, end);
  })
  const itemsPerPage = 10;

  const totalPageCount = computed(() => {
  return Math.ceil(users.value.length / itemsPerPage);
});

const updatePage = (direction) => {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < totalPageCount.value) {
    currentPage.value++;
    totalPageCount.value = Math.ceil(users.value.length / itemsPerPage);
  }
};

const totalUsers = computed( () => {
  return users.value.length; 
})


onMounted (() => {
  loadUsers()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ usersTitle }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalUsers }}</h5>
    </div>
  </div>
  <hr>
  <h2>Filtros</h2>
  <div
    v-if="!onlyCurrentVcards"
    class="mb-3 d-flex justify-content-between flex-wrap"
  >
    
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
        <label
          for="name"
          class="form-label"
        >Nome utilizador</label>
        <input class="form-control"
          id="name" v-model="filterByName">
      </div>

     <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-adduser"
        @click="toggleAddUserForm"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Novo Administrador</button>
      <button @click="exportToExcel" class="btn btn-success px-4 btn-adduser"> Exportar para Excel</button>

      <div v-if="showAddUserForm">
        <h3></h3>
        <div>
          <label for="newUserName" >Name:</label>
          <input id="newUserName" class="form-control" v-model="newUser.name" type="text">
        </div>
        <div>
          <label for="newUserEmail" class="form-label">Email:</label>
          <input id="newUserEmail" class="form-control" v-model="newUser.email" type="email">
        </div>
        <div>
          <label for="newUserPassword" class="form-label">Password:</label>
          <input id="newUserPassword" class="form-control" v-model="newUser.password" type="password">
        </div>
        <button @click="saveNewUser" class="btn btn-success btn-xs">Criar Novo</button>
      </div>
    </div>
  </div>
  <UserList
    :users="filteredVcards"
    :showId="true"
    :showOwner="false"
    @edit="editUser"
    @requestRemoveFromListUser="deletedUser"
  ></UserList>
  <div class="pagination-controls">
    <button class="btn-pagination" @click="updatePage('prev')">Previous</button>
    <span>Page {{ currentPage }} of {{ totalPageCount }}</span>
    <button class="btn-pagination" @click="updatePage('next')">Next</button>
  </div>
</template>


<style scoped>
.filter-div {
  min-width: 12rem;
}
.total-filtro {
  margin-top: 0.35rem;
}
.btn-adduser {
  margin-top: 1.85rem;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
</style>
