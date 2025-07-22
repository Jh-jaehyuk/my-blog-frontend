<template>
  <v-app>
    <NavBar />
    <v-main>
      <router-view />
    </v-main>
  </v-app>
</template>

<script setup>
import NavBar from './components/navbar/NavBar.vue'
import axiosInstance from '@/utils/axiosInstance';
import { onMounted } from 'vue'

onMounted(async () => {
  await axiosInstance.get("/api/auth/csrf-token/")
})
</script>

<style>
.v-main {
  background-color: #F5F5F5;
}
</style>
