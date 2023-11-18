<script setup>
import { ref, computed } from 'vue'
import VcardDetail from './VcardDetail.vue'

const vcardEdit = ref(null)

const props = defineProps({
    vcard: Object,
    readonly: Boolean
})

const fullDescription = computed(
    () => props.vcard.phone_number+' - '+props.vcard.name
    )

const emit = defineEmits([
    'requestRemoveFromListVcard',
    'requestUpdateVcard'
])


const clickToDeleteVcard = (vcard) => {
    emit('requestRemoveFromListVcard', vcard)
}

const editVcard = (vcard) => {
    vcardEdit.value = vcard
}

const closeEdit = () => {
    vcardEdit.value = null
}

 const detailRequestedUpdateVcard = (vcard) => {     
     emit('requestUpdateVcard', vcard)
 }

</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <span style="text-align: left;" >{{ fullDescription }}</span>
        <div class="float-end" v-show="!readonly">
            <button class="btn btn-danger btn-xs" @click="clickToDeleteVcard(vcard)">
                <i class="bi-trash" aria-hidden="true">Eliminar</i>
            </button>
            <button class="btn btn-info btn-xs" @click="editVcard(vcard)" v-if="!vcardEdit">
                <i class="bi-pencil" aria-hidden="true">Editar</i>
            </button>
            <button class="btn btn-warning btn-xs" @click="closeEdit" v-else>
                <i class="bi-arrow-up" aria-hidden="true">Editando</i>
            </button>
        </div>
        <div v-if="vcardEdit">
            <hr>
            <VcardDetail :vcard="vcardEdit" @requestUpdateVcard="detailRequestedUpdateVcard" @hide="closeEdit"></VcardDetail>
        </div>
    </li>
</template>


<style scoped>
button.btn {
    margin-left: 5px;
}
</style>
