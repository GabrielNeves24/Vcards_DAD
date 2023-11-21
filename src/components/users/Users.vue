<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted } from 'vue'
import UserList from "./UserList.vue"

const router = useRouter()
const userStore = useUserStore()

const loadUsers = async () => {
  try {
    const response = await axios.get('users')
    users.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

// const addTransaction = () => {
//     router.push({ name: 'NewTransaction' })
// }

const editUser = (user) => {
    router.push({ name: 'User', params: { id: user.id } })
}

const deletedUser = (deletedUser) => {
    let idx = users.value.findIndex((t) => t.id === deletedUser.id)
    if (idx >= 0) {
        users.value.splice(idx, 1)
    }
}

const props = defineProps({
  usersTitle: {
    type: String,
    default: 'Users Manager'
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
      //filter y phone_number or by name
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

    <!-- <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addtask"
        @click="addTransaction"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Nova Transação</button>
    </div> -->
  </div>
  <UserList
    :users="filteredVcards"
    :showId="true"
    :showOwner="false"
    @edit="editUser"
    @deleted="deletedUser"
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
.btn-addtask {
  margin-top: 1.85rem;
}

.pagination-controls {
  display: flex;
  justify-content: space-between;
  margin-top: 1em;
}
</style>
