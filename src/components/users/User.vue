<script setup>
import { ref, computed } from 'vue'
const props = defineProps({
    user: Object,
    readonly: Boolean
})

const fullDescription = computed(
    () => props.user.name + ' - ' + props.user.email
    )

const emit = defineEmits([
    'requestRemoveFromListUser',
    'requestUpdateUser'
])


const clickToDeleteUser = (user) => {
    emit('requestRemoveFromListUser', user)
}

</script>

<template>
    <li class="list-group-item" :class="{'bg-light': readonly}">
        <span style="text-align: left;" >{{ fullDescription }}</span>
        <div class="float-end" v-show="!readonly">
            <button class="btn btn-danger btn-xs" @click="clickToDeleteUser(user)">
                <i class="bi-trash" aria-hidden="true"></i>
            </button>
        </div>
    </li>
</template>


<style scoped>
button.btn {
    margin-left: 5px;
}
</style>
