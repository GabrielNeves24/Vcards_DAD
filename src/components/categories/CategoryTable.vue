<script setup>
import axios from 'axios'
import { useToast } from "vue-toastification"
import { ref, watch, computed } from "vue"

const toast = useToast()

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

// // Alternative to previous watch
//  watchEffect(() => {
//    editingCategories.value = props.tasks
//  })


 const deleteClick = (category) => {
  categoryToDelete.value = category
   deleteConfirmationDialog.value.show()
   }


const deleteCategoryConfirmed = async () => {
   try {
     const response = await axios.delete('vcards/' + categoryToDelete.value.vcard + '/categories/' + categoryToDelete.value.id)
     let deletedcategory = response.data.data
     toast.info(`Categoria ${categoryToDeleteDescription.value} foi eliminada!`)
     emit("deleted", deletedcategory)
   } catch (error) {
     console.log(error)
     toast.error(`It was not possible to delete Task ${categoryToDeleteDescription.value}!`)
   }
 }

 const categoryToDeleteDescription = computed(() => categoryToDelete.value
   ? `#${categoryToDelete.value.id} (${categoryToDelete.value.name})`
   : "")

</script>

<template>
   <confirmation-dialog
    ref="deleteConfirmationDialog"
    confirmationBtn="Delete category"
    :msg="`Do you really want to delete the task ${categoryToDeleteDescription}?`"
    @confirmed="deleteCategoryConfirmed"
  >
  </confirmation-dialog>

  <table class="table">
    <thead>
      <tr>
        <th v-if="showId">#</th>
        <th>Tipo</th>
        <th>Nome</th>
        <th v-if="showDeleteButton || showEditButton"></th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="category in editingCategories" :key="category.id">
        <td v-if="showId">{{ category.id }}</td>
        <td>{{ category.type }}</td>
        <td>{{ category.name }}</td>
        <td
          class="text-end"
          v-if="showDeleteButton">
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
