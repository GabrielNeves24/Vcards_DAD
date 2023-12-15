<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted } from 'vue'
import CategoryTable from "./CategoryTable.vue"
import { useToast } from "vue-toastification"

const router = useRouter()
const userStore = useUserStore()
const toast = useToast()


const loadCategories = async () => {
 if (userStore.userType == 'A'){
    try {
      const response = await axios.get('categories/defaults')
      categories.value = response.data.data
    } catch (error) {
      toast.error('Erro ao carregar categorias')
    }
  }else{
      try {
        const response = await axios.get('vcards/' + userStore.userId + '/categories')
        categories.value = response.data.data
      } catch (error) {
        toast.error('Erro ao carregar categorias')
      }
  }
}

const addCategory = () => {
    if (userStore.userType == 'A'){
      router.push({ name: 'CategoryDefaults', params: { id: -1 } })
    }else{
      router.push({ name: 'Category', params: { id: -1 } })
    }
}

const editCategory = (categories) => {
  if (userStore.userType == 'A'){
    router.push({ name: 'CategoryDefaults', params: { id: categories.id } })
  }else{
    router.push({ name: 'Category', params: { id: categories.id } })
  }
  
}

const deletedCategory = () => {
    loadCategories()
}

const props = defineProps({
  categoriesTitle: {
    type: String,
    default: 'Categorias'
  },
  onlyCurrentCategories: {
    type: Boolean,
    default: false
  }
})


const categories = ref([])
const filterByName = ref('') 
const filterByType = ref(-1) 
const currentPage = ref(1);

const filteredCategories2 = computed( () => {
  
  let filtered = categories.value
     if (filterByName.value !== '') {
       filtered = filtered.filter(v =>
           v.name && v.name.toString().includes(filterByName.value)
       );
     }
     if (filterByType.value !== -1) {
       filtered = filtered.filter((t) => t.type === filterByType.value)
     }
  const totalFiltered = filtered.length;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalFiltered);
  
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
      <label for="filterByName" class="form-label">Filtro por Nome:</label>
      <input class="form-control" id="filterByName" v-model="filterByName" />
    </div>
    <div class="mx-2 mt-2 flex-grow-1 filter-div">
      <label for="filterByType" class="form-label">Filtro por Tipo:</label>
      <select class="form-select" id="filterByType" v-model="filterByType">
        <option value="-1">Todas</option>
        <option value="D">Débito</option>
        <option value="C">Crédito</option>
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
