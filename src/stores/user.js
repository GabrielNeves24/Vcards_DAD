import axios from 'axios'
import { ref, computed, inject } from 'vue'
import { defineStore } from 'pinia'
import avatarNoneUrl from '@/assets/avatar-none.png'
import { useTransactionsStore } from "./transactions.js"

export const useUserStore = defineStore('user', () => {

    const serverBaseUrl = inject('serverBaseUrl')
    const transactionsStore = useTransactionsStore()
    
    const user = ref(null)

    const userName = computed(() => user.value?.name ?? 'Anonymous')

    const userId = computed(() => user.value?.id ?? -1)

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
            //await projectsStore.loadProjects()
            return true       
        } 
        catch(error) {
            clearUser()            
            return false
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

    async function profile(formData) {
        try {
            if(userType.value == 'A'){
                try{
                    const response = await axios.put('users/' + userId.value, formData);
                }catch(error){
                    return false;
                }
            }else{
                try{
                    const response = await axios.put('vcards/' + userId.value, formData, {
                        headers: {
                            'Content-Type': 'multipart/form-data'
                        }
                    });
                }catch(error){
                    return false;
                }
            }
            // Check if the password was changed
            if (formData.password) {
                // Prepare new login credentials
                const newCredentials = {
                    username: userId.value, 
                    password: formData.password
                };
    
                // Perform a new login with the updated credentials
                await login(newCredentials);
            } else {
                // If password wasn't changed, just reload user data
                //await loadUser();
            }
    
            return true;
        } catch (error) {
            return false;
        }
    }
    

    async function logout () {
        try {
            await axios.post('logout', sessionStorage.getItem('token'))
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
            return true
        }
        clearUser()
        return false
    }
    
    async function validatePassword (password) {
        try {
            const response = await axios.put('verify-password' + userId.value, password);
            return true;
        } catch (error) {   
            return false;
        }
    }

    return {
        user,
        userId,
        userName,
        userPhotoUrl,
        loadUser,
        clearUser,
        login,
        register,
        logout,
        restoreToken,
        userType,
        profile,
    }
})
