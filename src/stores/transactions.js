import axios from 'axios'
import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useUserStore } from "./user.js"

export const useTransactionsStore = defineStore('transactions', () => {
    
    const userStore = useUserStore()

    const transactions = ref([])

    const totalProjects = computed(() => {
        return transactions.value.length
    })

    // const myInprogressProjects = computed(() => {        
    //     return projects.value.filter( prj => 
    //         prj.status == 'W' && prj.responsible_id == userStore.userId)
    // })

    // const totalMyInprogressProjects = computed(() => {     
    //     return projects.value.reduce( (acumulador, prj) => 
    //         (prj.status == 'W' && prj.responsible_id == userStore.userId)
    //             ? acumulador + 1 
    //             : acumulador
    //         , 0)
    // })

    function getProjectsByFilter(responsibleId, status) {
        return transactions.value.filter( prj =>
            (!responsibleId || responsibleId == prj.responsible_id) &&
            (!status || status == prj.status)
        )
    }
    
    function getProjectsByFilterTotal(responsibleId, status) {
        return transactions.value.reduce((acumulador, prj) =>
            ((!responsibleId || responsibleId == prj.responsible_id) &&
                (!status || status == prj.status)    )
                ? acumulador + 1 
                : acumulador
            , 0)        
    }

    function clearProjects() {
        transactions.value = []
    }

    async function loadTransaction() {
        try {
            const response = await axios.get(`vcards/${userStore.id}/transations/all`)
            transactions.value = response.data.transactions
            return transactions.value
        } catch (error) {
            clearProjects()
            throw error
        }
    }
    
    async function insertTransaction(newTransaction) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the insertProject
        const response = await axios.post('transaction', newTransaction)
        transactions.value.push(response.data.data)
        return response.data.data
    }

    async function updateTransaction(updateTransaction) {
        // Note that when an error occours, the exception should be
        // catch by the function that called the updateProject
        const response = await axios.put('transaction/' + updateTransaction.id, updateTransaction)
        let idx = transactions.value.findIndex((t) => t.id === response.data.data.id)
        if (idx >= 0) {
            transactions.value[idx] = response.data.data
        }
        return response.data.data
    }
    
    return {
        transactions,
        totalProjects,
        // myInprogressTransactions,
        // totalMyInprogressTransactions,
        getProjectsByFilter,
        getProjectsByFilterTotal, 
        loadTransaction,
        clearProjects,
        insertTransaction,
        updateTransaction
    }
})
