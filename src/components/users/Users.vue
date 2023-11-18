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
UsersTitle: {
    type: String,
    default: 'Users'
  },
  onlyCurrentUsers: {
    type: Boolean,
    default: false
  }
})

const users = ref([])
const filterByVcardsId = ref(-1)
const filterByCompleted = ref(-1)

const filteredUsers = computed( () => {
  return users.value.filter(t =>
      (props.onlyCurrentTasks && !t.completed)
      ||
      (!props.onlyCurrentTasks && (
        (filterByVcardsId.value == -1
          || filterByVcardsId.value == t.transaction_id
        ) &&
        (filterByCompleted.value == -1
          || filterByCompleted.value == 0 && !t.completed
          || filterByCompleted.value == 1 && t.completed
        ))))

})

const totalUsers = computed( () => {
  return users.value.reduce((c, t) =>
      (props.onlyCurrentTasks && !t.completed)
        ||
        (!props.onlyCurrentTasks && (
          (filterByVcardsId.value == -1
            || filterByVcardsId.value == t.project_id
          ) &&
          (filterByCompleted.value == -1
            || filterByCompleted.value == 0 && !t.completed
            || filterByCompleted.value == 1 && t.completed
          ))) ? c + 1 : c, 0)
  
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
  <div
    v-if="!onlyCurrentVcards"
    class="mb-3 d-flex justify-content-between flex-wrap"
  >
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="selectCompleted"
        class="form-label"
      >Filter by completed:</label>
      <select
        class="form-select"
        id="selectCompleted"
        v-model="filterByCompleted"
      >
        <option value="-1">Any</option>
        <option value="0">Pending Tasks</option>
        <option value="1">Completed Tasks</option>
      </select>
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label
        for="selectProject"
        class="form-label"
      >Filter by User:</label>
      <select
        class="form-select"
        id="selectProject"
        v-model="filterByUserId"
      >
        <!-- <option value="-1">Any</option>
        <option :value="null">-- No project --</option>
        <option
          v-for="trs in transactionsStore.vcards"
          :key="trs.id"
          :value="trs.id"
        >{{trs.name}}</option> -->
      </select>
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
    :users="users"
    :showId="true"
    :showOwner="false"
    @edit="editUser"
    @deleted="deletedUser"
  ></UserList>
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
</style>
