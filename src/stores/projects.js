import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "./user.js"

export const useTransactionsStore = defineStore('transations', () => {
    
    const userStore = useUserStore()

    const transations = ref([])

    const totalTransactions = computed(() => {
        return transations.value.length
    })

    // const myInprogressTransactions = computed(() => {        
    //     return transations.value.filter( prj => 
    //         prj.status == 'W' && prj.responsible_id == userStore.userId)
    // })

    // const totalMyInprogressTransactions = computed(() => {     
    //     return transations.value.reduce( (acumulador, prj) => 
    //         (prj.status == 'W' && prj.responsible_id == userStore.userId)
    //             ? acumulador + 1 
    //             : acumulador
    //         , 0)
    // })

    function getTransactionsByFilter(responsibleId, status) {
        return transations.value.filter( prj =>
            (!responsibleId || responsibleId == prj.responsible_id) &&
            (!status || status == prj.status)
        )
    }
    
    function getTransactionsByFilterTotal(responsibleId, status) {
        return transations.value.reduce((acumulador, prj) =>
            ((!responsibleId || responsibleId == prj.responsible_id) &&
                (!status || status == prj.status)    )
                ? acumulador + 1 
                : acumulador
            , 0)        
    }

    function clearTransactions() {
        transations.value = []
    }

    async function loadTransactions() {
        try {
            const response = await axios.get(`vcards/${userStore.id}/transations/all`)
            transations.value = response.data.transactions
            return transations.value
        } catch (error) {
            clearTransactions()
            throw error
        }
    }
    
    async function insertProject(newProject) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the insertProject
        const response = await axios.post('transations', newProject)
        transations.value.push(response.data.data)
        return response.data.data
    }

    async function updateProject(updateProject) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the updateProject
        const response = await axios.put('transations/' + updateProject.id, updateProject)
        let idx = transations.value.findIndex((t) => t.id === response.data.data.id)
        if (idx >= 0) {
            transations.value[idx] = response.data.data
        }
        return response.data.data
    }

    async function deleteProject( deleteProject) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the deleteProject
        const response = await axios.delete('transations/' + deleteProject.id)
        let idx = transations.value.findIndex((t) => t.id === response.data.data.id)
        if (idx >= 0) {
            transations.value.splice(idx, 1)
        }
        return response.data.data
    }  
    
    return {
        transations,
        totalTransactions,
        //myInprogressTransations,
        //totalMyInprogressTransations,
        getTransactionsByFilter,
        getTransactionsByFilterTotal, 
        loadTransactions,
        clearTransactions,
        insertProject,
        updateProject,
        deleteProject
    }
})
