<script setup>
import User from './User.vue'

const props = defineProps({
    users: Array,
    readonly: Boolean
})

const emit = defineEmits([
    'requestRemoveFromListUser',
    'requestUpdateUser'
])

const handleRequestToRemoveUser = (user) => {
    emit('requestRemoveFromListUser', user)
}

const updateUser = (user) => {
    emit("requestUpdateUser", user)
}
</script>

<template>
    <div>
        <ul class="list-group">
            <User v-for="user in users" :key="user.id" 
                :user="user" 
                :readonly="readonly" 
                @requestRemoveFromListUser="handleRequestToRemoveUser"
                @requestUpdateUser="updateUser"></User>
        </ul>
    </div>
</template>
