<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch, computed } from "vue"
import { useUserStore } from '../../stores/user';
import { useRouter } from 'vue-router'

const toast = useToast()
const userStore = useUserStore()
const router = useRouter()

const props = defineProps({
  categories: {
    type: Array,
    default: () => [],
  },
  showId: {
    type: Boolean,
    default: true,
  },
  showCompleted: {
    type: Boolean,
    default: true,
  },
  showOwner: {
    type: Boolean,
    default: true,
  },
  showProject: {
    type: Boolean,
    default: true,
  },
  showCompletedButton: {
    type: Boolean,
    default: true,
  },
  showEditButton: {
    type: Boolean,
    default: true,
  },
  showDeleteButton: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(["completeToggled", "edit", "deleted"])

const editingCategories = ref(props.categories)
 const categoryToDelete = ref(null)
 const deleteConfirmationDialog = ref(null)

watch(
  () => props.categories,
  (newCategories) => {
    editingCategories.value = newCategories
  }
)
const editClick = (category) => {
  emit("edit", category)
}

 const deleteClick = (category) => {
  categoryToDelete.value = category
   deleteConfirmationDialog.value.show()
   }


const deleteCategoryConfirmed = async () => {
  if (!categoryToDelete.value) {
    toast.error("Sem categoria para eliminar")
     return;
   }
   if (userStore.userType == 'A'){
     try {
       await axios.delete('categories/defaults/' + categoryToDelete.value.id)
       emit("deleted", categoryToDelete.value)
       toast.success("Categoria eliminada com sucesso")
       router.push({ name: 'CategoriesDefaults' })
     } catch (error) {
       console.log(error)
       toast.error("Erro a eliminar a categoria")
     }
    }else{
       try {
         await axios.delete('vcards/' + userStore.userId + '/categories/' + categoryToDelete.value.id)
         emit("deleted", categoryToDelete.value)
         toast.success("Cetergoria eliminada com sucesso")
         router.push({ name: 'Categories' })
       } catch (error) {
         console.log(error)
         toast.error("Erro a eliminar a categoria")
       }
     }
 }

 const categoryToDeleteDescription = computed(() => categoryToDelete.value
   ? `(${categoryToDelete.value.type}) ${categoryToDelete.value.name}`
   : "")

</script>

<template>
   <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Eliminar categoria"
    :msg="`Deseja eliminar a categoria ${categoryToDeleteDescription}?`"
    @confirmed="deleteCategoryConfirmed"
  >
  </confirmation-dialog>

  <table class="table">
    <thead>
      <tr>
        <th>Tipo</th>
        <th>Nome</th>
        <th v-if="showDeleteButton || showEditButton || showDeleteButton"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in editingCategories" :key="category.id">
        <td>{{ category.type }}</td>
        <td>{{ category.name }}</td>
        <td
          class="text-end"
          v-if="showCompletedButton || showEditButton || showDeleteButton">
          <div class="d-flex justify-content-end">
            <button
              class="btn btn-xs btn-light"
              @click="deleteClick(category)"
              v-if="showDeleteButton">
              <i class="bi bi-xs bi-trash"></i>
            </button>
            <button
              class="btn btn-xs btn-light"
              @click="editClick(category)"
              v-if="showEditButton">
              <i class="bi bi-xs bi-pencil"></i>
            </button>
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.completed {
  text-decoration: line-through;
}

button {
  margin-left: 3px;
  margin-right: 3px;
}
</style>
