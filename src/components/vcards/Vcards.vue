<script setup>
import axios from 'axios'
import { useRouter } from 'vue-router'
import { useUserStore } from "../../stores/user.js"
import { ref, computed, onMounted, inject } from 'vue'
import VcardList from "./VcardList.vue"
import { useToast } from "vue-toastification"
import * as XLSX from 'xlsx'

const socket = inject("socket");
const router = useRouter()
const userStore = useUserStore()
const toast = useToast()
const props = defineProps({
VcardsTitle: {
    type: String,
    default: 'Vcards Manager'
  },
  onlyCurrentVcards: {
    type: Boolean,
    default: false
  }
})

const exportToExcel = () => {
  vcards.value.forEach(function (v) {
    delete v.password;
    delete v.confirmation_code;
  });
  const ws = XLSX.utils.json_to_sheet(vcards.value);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Vcards");
  XLSX.writeFile(wb, "Vcards.xlsx");
};


const loadVcards = async () => {
  try {
    const response = await axios.get('vcards')
    vcards.value = response.data.data
  } catch (error) {
    console.log(error)
  }
}
const editVcard = async (vcard) => {
  try{
        const response = await axios.put(`/vcards/user/${vcard.phone_number}`, vcard);
        console.log(response.data.data)
        toast.success('Dados atualizados com sucesso!')
        if (vcard.blocked == 1){
          socket.emit("blockUser", vcard.phone_number);
        }
        loadVcards()
    } catch (error) {
      toast.error('Erro ao atualizar os dados!')
    }
}

const deletedVcard =async  (deletedVcard) => {
      try {
        const responseDelete = await axios.delete(`/vcards/${deletedVcard.phone_number}`, deletedVcard);
        console.log(responseDelete.data.data)
        socket.emit("deleteUser", deletedVcard.phone_number);
        toast.success(responseDelete.data.message);
        loadVcards()
        } catch (error) {
          toast.error("Erro ao eliminar o vcard");
            console.error('Erro ao obter vcards:', error);
        }    
}


  const vcards = ref([])
  const filterByBlocked= ref('')
  const filterByName = ref('')
  const filterByPhoneNumber = ref('')
  const currentPage = ref(1);

  const filteredVcards = computed( () => {
    let filtered = vcards.value;
    if (filterByBlocked.value) {
      filtered = filtered.filter(v => v.blocked == filterByBlocked.value)
    }
    if (filterByName.value) {
      filtered = filtered.filter(v =>
        v.name && v.name.toString().includes(filterByName.value)
      );
    }
    if (filterByPhoneNumber.value){
      filtered = filtered.filter(v =>
        v.phone_number && v.phone_number.toString().includes(filterByPhoneNumber.value)
      );
    }
   console.log(filtered)

  const totalFiltered = filtered.length;
  const start = (currentPage.value - 1) * itemsPerPage;
  const end = Math.min(start + itemsPerPage, totalFiltered);
  console.log(filtered)
  return filtered.slice(start, end);
  })


  
  const itemsPerPage = 10;
  const totalVcards = computed( () => {
    return vcards.value.length  
  })

  const totalPageCount = computed(() => {
  return Math.ceil(vcards.value.length / itemsPerPage);
});

const updatePage = (direction) => {
  if (direction === 'prev' && currentPage.value > 1) {
    currentPage.value--;
  } else if (direction === 'next' && currentPage.value < totalPageCount.value) {
    currentPage.value++;
    totalPageCount.value = Math.ceil(vcards.value.length / itemsPerPage);
  }
};



  onMounted (() => {
    loadVcards()
  })
  </script>

  <template>
      <confirmation-dialog
      ref="deleteConfirmationDialog"
      confirmationBtn="Delete vcard"
      :msg="`Do you really want to delete the vcard?`"
      @confirmed="deleteTransactionConfirmed"
    >
    </confirmation-dialog>
    
    <div class="d-flex justify-content-between">
      <div class="mx-2">
        <h3 class="mt-4">{{ VcardsTitle }}</h3>
      </div>
      <div class="mx-2 total-filtro">
        <h5 class="mt-4">Total: {{ totalVcards }}</h5>
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
          for="selectBlocked"
          class="form-label"
        >Bloqueado</label>
        <select
          class="form-select"
          id="selectBlocked"
          v-model="filterByBlocked"
        >
          <option value="">Any</option>
          <option value="1">Blocked</option>
          <option value="0">Active</option>
        </select>
      </div>
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
        <label
          for="name"
          class="form-label"
        >Nome utilizador</label>
        <input class="form-control"
          id="name" v-model="filterByName">
      </div>
      <div class="mx-2 mt-2 flex-grow-1 filter-div">
        <label
          for="phone_number"
          class="form-label"
        >Numero Telefone</label>
        <input class="form-control"
          id="phone_number" type="number" v-model="filterByPhoneNumber">
      </div>
       <div class="mx-2 mt-2">
        <button @click="exportToExcel" class="btn btn-primary px-4 btn-addtask"> Exportar para Excel</button>
      </div>
      
    </div>
    <VcardList
      :vcards="filteredVcards"
      :showId="true"
      :showOwner="false"
      @requestUpdateVcard="editVcard"
      @requestRemoveFromListVcard="deletedVcard"
    ></VcardList>
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
