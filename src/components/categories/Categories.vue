<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted } from 'vue'
import CategoryTable from "./CategoryTable.vue"

const router = useRouter()
const userStore = useUserStore()


const props = defineProps({
categoriesTitle: {
    type: String,
    default: 'Categories'
  },
  onlyCurrentCategories: {
    type: Boolean,
    default: false
  }
})


const loadCategories = async () => {
  try {
    const response = await axios.get('vcards/' + userStore.userId + '/categories')
    categories.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}

const addCategory = () => {
    router.push({ name: 'NewCategory' })
}

const editCategory = (categories) => {
    router.push({ name: 'Category', params: { id: categories.id } })
}

const deletedCategory = (deletedCategory) => {
    let idx = categories.value.findIndex((t) => t.id === deletedCategory.id)
    if (idx >= 0) {
      categories.value.splice(idx, 1)
    }
}


const categories = ref([])
const filterByName = ref('') // New ref for filtering by name
const filterByType = ref('') // New ref for filtering by type (debit/credit)
const currentPage = ref(1);

const filteredCategories2 = computed( () => {
  
  let filtered = categories.value
      // if (filterByName.value) {
      //   filtered = filtered.filter(v =>
      //       v.name && v.name.toString().includes(filterByName.value)
      //   );
      // }
  //  //  if (filterByType.value) {
  //  //    filtered = filtered.filter((t) => t.type === filterByType.value)
  //  //  }
  const totalFiltered = filtered.length;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalFiltered);
  console.log(filtered)
  return filtered.slice(start, end);
});



const itemsPerPage = 10;
const totalCategories = computed( () => {
  return categories.value.length  
});

const totalPageCount = computed(() => {
  return Math.ceil(categories.value.length / itemsPerPage);
});

const updatePage = (direction) => {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < totalPageCount.value) {
    currentPage.value++;
    totalPageCount.value = Math.ceil(categories.value.length / itemsPerPage);
  }
};


onMounted (() => {
  loadCategories()
})
</script>

<template>
  <div class="d-flex justify-content-between">
    <div class="mx-2">
      <h3 class="mt-4">{{ categoriesTitle }}</h3>
    </div>
    <div class="mx-2 total-filtro">
      <h5 class="mt-4">Total: {{ totalCategories }}</h5>
    </div>
  </div>
  <hr>
  <div
    v-if="!onlyCurrentCategories"
    class="mb-3 d-flex justify-content-between flex-wrap">
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="filterByName" class="form-label">Filter by Name:</label>
      <input class="form-control" id="filterByName" v-model="filterByName" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="filterByType" class="form-label">Filter by Type:</label>
      <select class="form-select" id="filterByType" v-model="filterByType">
        <option value="">Any</option>
        <option value="D">Debit</option>
        <option value="C">Credit</option>
      </select>
    </div>
    </div>
    <div class="mx-2 mt-2">
      <button
        type="button"
        class="btn btn-success px-4 btn-addtask"
        @click="addCategory"
      ><i class="bi bi-xs bi-plus-circle"></i>&nbsp; Nova Categoria</button>
    </div> 
  </div> 
  <category-table
    :categories="filteredCategories2"  
    :showId="true"
    :showOwner="false"
    @edit="editCategory"
    @deleted="deletedCategory"
  ></category-table>
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
