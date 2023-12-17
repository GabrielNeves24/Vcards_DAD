import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useTransactionsStore } from "./transactions.js"
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'


export const useUserStore = defineStore('user', () => {

    const serverBaseUrl = inject('serverBaseUrl')
    const transactionsStore = useTransactionsStore()
    const socket = inject("socket")
    const toast = useToast()
    const user = ref(null)

    const userName = computed(() => user.value?.name ?? 'Anonymous')

    const userId = computed(() => user.value?.id ?? -1)

    const userEmail = computed(() => user.value?.email ?? -1)

    const userBalance = computed(() => user.value?.balance ?? 0)

    const userType = computed(() => user.value?.user_type ?? -1)

  
    const userPhotoUrl = computed(() =>
        user.value?.photo_url 
        ? serverBaseUrl + '/storage/fotos/' + user.value.photo_url  
        : avatarNoneUrl)

    async function loadUser() {
        try {
            const response = await axios.get('users/me')
            user.value = response.data.data
            
        } catch (error) {
            clearUser()
            
            throw error
        }
    }

    function clearUser() {
        delete axios.defaults.headers.common.Authorization
        //transactionsStore.clearTransactions()
        sessionStorage.removeItem('token')
        
        user.value = null
    }     

    async function login(credentials) {
        try {
            const response = await axios.post('login', credentials)
            console.log(response.data.access_token)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            
            await loadUser()
            socket.emit('loggedIn', user.value)
            //socket.emit('userLoggedIn', user.value)
            socket.emit('loginUser', user.value)
            return true       
        } 
        catch(error) {
            console.log(error.response.data.error)
            const message = error.response.data.error
            toast.error(message)
            
            clearUser() 
            return false
        }
    } 
    socket.on('userLoggedOut', (user) => {
        toast.info(`User #${user.id} (${user.name}) has logged out!`)
        })
    socket.on('loginUser', (user) => {
        if (user.id != userId.value && user.user_type == 'A')
        toast.info(`User #${user.id} (${user.name}) has logged in!`)
        })

    // socket.on('userLoggedIn', (user) => {
    //     //if (user.id != userId.value)
    //     console.log(user)
    //     toast.info(`User #${user.id} (${user.name}) has registered successfully!`)
    //     })

    async function teste (transaction){
        socket.emit('adminTransaction', transaction.value);
    }
    socket.on('newTransaction', (transaction) => {
        console.log(transaction.vcard + " " + userId.value)
                if (transaction.vcard === userId.value) { // Ensure this is the correct vCard user
                    toast.success('Recebeu uma nova transação (Crédito do Administrador)! '+ transaction.value + ' €');
                }
                //now i need to resfresh the balance of the user that received the transaction
            });
    socket.on('receivedDebit', (transaction) => {
        // Assume 'userStore' is your user state management, and it contains the current user's vCard ID
        console.log(transaction.reference + " " + userId.value)
        if (transaction.reference == userId.value) {
            toast.success('Recebeu uma nova transação de (Débito)! '+ transaction.value + ' €');
        }
    });   
    
    socket.on('blockUser', (vcard) => {
        // Assume 'userStore' is your user state management, and it contains the current user's vCard ID
        console.log(vcard + " " + userId.value)
        if (vcard == userId.value) {
            toast.error('A sua conta foi bloqueada!');
            logout()
            useRouter().push('/login')
        }
    });

    socket.on('deleteUser', (vcard) => {
        // Assume 'userStore' is your user state management, and it contains the current user's vCard ID
        console.log(vcard + " " + userId.value)
        if (vcard == userId.value) {
            toast.error('A sua conta foi Eliminada!');
            logout();
            //redirect to login page
            useRouter().push('/login')

        }
    });
    
    async function deleteAcountVCard() {
        try {
            const response = await axios.delete('vcards/' + userId.value)
            clearUser()
            return true
        }
        catch(error) {
            console.log(error.response.data.message)
            const mensaje = error.response.data.message
            toast.error(mensaje)
            return false
        }
    }





    async function loginRefresh(credentials) {
        //await logout()
        try {
            const response = await axios.post('login', credentials)
            console.log(response.data.access_token)
            axios.defaults.headers.common.Authorization = "Bearer " + response.data.access_token
            sessionStorage.setItem('token', response.data.access_token)
            await loadUser()
            //await projectsStore.loadProjects()
            return true       
        } 
        catch(error) {
            clearUser()            
            return error
        }
    } 

    async function register(formData) {
        try {
            let response = await axios.post('register', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
            // Process the response
            return true;   
                
        } catch(error) {
            clearUser();            
            return false;
        }
    } 

 

    async function profile(credentialsProfile) {
        try {

                if(userType.value == 'A'){
                    try{
                        
                        const response = await axios.put('users/perfil/' + userId.value, credentialsProfile);
                        loadUser();
                        return true;
                    }catch(error){
                        return false;
                    }
                }else{
                    try {
                        const response = await axios.post(`vcards/${userId.value}`, credentialsProfile, {
                            headers: {
                              "Content-Type": "multipart/form-data",
                            },
                          });
                        loadUser(); // Reload user data if necessary
                        console.log(response);
                        return true;
                    } catch (error) {
                        console.error(error);
                        return false;
                    }
                }
            
        } catch(error) {
            return false;
        }
    }

    async function verifyPassword(password) {
        try {
            const response = await axios.post('/verify-password', {
                enteredPassword: password,
                user: userId.value,
                userType: userType.value
            });
            return response.data.isValid;
        } catch (error) {
            return false;
        }
    }

    async function verifyPin(pin) {
        try {
            const response = await axios.post('/verify-pin', {
                enteredPassword: pin,
                user: userId.value,
                userType: userType.value
            });
            return response.data.isValid;
        } catch (error) {
            return false;
        }
    }
    
    

    async function logout () {
        try {
            await axios.post('logout', sessionStorage.getItem('token'))
            socket.emit('loggedOut', user.value)
            clearUser()
            return true
        } catch (error) {
            return false
        }
    }

    async function restoreToken () {
        let storedToken = sessionStorage.getItem('token')
        if (storedToken) {
            axios.defaults.headers.common.Authorization = "Bearer " + storedToken
            await loadUser()
            // await projectsStore.loadProjects()
            socket.emit('loggedIn', user.value)
            return true
        }
        clearUser()
        return false
    }
    
    // async function validatePassword (password) {
    //     try {
    //         const response = await axios.put('verify-password' + userId.value, password);
    //         return true;
    //     } catch (error) {   
    //         return false;
    //     }
    // }

    

    return {
        user,
        userId,
        userName,
        userPhotoUrl,
        userBalance,
        loadUser,
        clearUser,
        login,
        register,
        logout,
        restoreToken,
        userType,
        profile,
        verifyPassword,
        verifyPin,
        deleteAcountVCard,
        teste
    }
})
