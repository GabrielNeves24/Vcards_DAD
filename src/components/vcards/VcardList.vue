<script setup>
import Vcard from './Vcard.vue'

const props = defineProps({
    vcards: Array,
    readonly: Boolean
})

const emit = defineEmits([
    'requestRemoveFromListVcard',
    'requestUpdateVcard'
])

const handleRequestToRemoveVcard = (vcard) => {
    emit('requestRemoveFromListVcard', vcard)
}

const updateVcard = (vcard) => {
    emit("requestUpdateVcard", vcard)
}

</script>

<template>
    <div>
        <ul class="list-group">
            <Vcard v-for="vcard in vcards" :key="vcard.phone_number" 
                :vcard="vcard" 
                :readonly="readonly" 
                @requestRemoveFromListVcard="handleRequestToRemoveVcard"
                @requestUpdateVcard="updateVcard" ></Vcard>
        </ul>
    </div>
</template>
