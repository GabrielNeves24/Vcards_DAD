<script setup>

import { ref, onMounted } from 'vue'
import axios from 'axios'
import { useToast } from "vue-toastification"
import { useRouter } from 'vue-router'
import { useUserStore } from '../stores/user.js'

const toast = useToast()
const router = useRouter()
const userStore = useUserStore()


const vcards = ref(null)
const errors = ref(null)


const loadVcard = async () => {
  try {
    const response = await axios.get('vcards/' + userStore.userId)
    vcards.value = response.data.data
    console.log(vcards.value)
    console.log(vcards.value.name)
    console.log(vcards.value.balance)
  } catch (error) {
    console.log(error)
  }
}

onMounted(() => {
  loadVcard()
})

</script>

<template>
    <section class="dashboard-content">
      <div class="vcard-section">
        <h2 class="section-title">Saldo {{ vcards.balance }} €</h2>
        <div class="vcard-list">
          <div class="vcard">
            <!-- Add more card details here -->
            
          </div>
        </div>
      </div>
      <!-- Additional sections can be added here -->
      <div class="vcard-section">
        <h2 class="section-title">Transações</h2>
        <div class="vcard-list">
          <div class="vcard">
            
            <!-- Add more card details here -->
          </div>
        </div>
      </div>
      <div class="vcard-section">
        <h2 class="section-title">Transações recentes</h2>
        <div class="vcard-list">
          <div class="vcard">
            
            <!-- Add more card details here -->
          </div>
        </div>
      </div>
    </section>
</template>

<style scoped>

.dashboard-header {
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
}

.dashboard-title {
  color: #333;
  font-size: 24px;
}

.user-info {
  display: flex;
  align-items: center;
}

.user-photo {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  margin-right: 10px;
}

.user-name {
  font-size: 18px;
  font-weight: bold;
}

.vcard-section {
  background-color: white;
  padding: 15px;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.section-title {
  color: #555;
  margin-bottom: 15px;
  text-align: center;
}

.vcard {
  border-bottom: 1px solid #eee;
  padding: 10px 0;
}

.vcard:last-child {
  border-bottom: none;
}

.vcard-name {
  font-size: 16px;
  color: #333;
}

.vcard-balance {
  font-size: 14px;
  color: #666;
}
</style>

  