<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="6">
                <v-card class="pa-8 text-center" elevation="2">
                    <v-progress-circular indeterminate color="primary" size="64" width="6"></v-progress-circular>
                    <h1 class="text-h5 font-weight-bold mt-6 mb-2">Connecting to GitHub...</h1>
                    <p class="text-medium-emphasis">Please wait while we securely log you in with your GitHub account.</p>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { useAuthenticationStore } from '@/store/authenticate'
import axiosInstance from '@/utils/axiosInstance'
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

const route = useRoute()
const router = useRouter()
const store = useAuthenticationStore()

const code = ref(route.query.code)

onMounted(async () => {
    if (!code.value) {
        console.error("Authorization code not found.");
        // Optionally, redirect to an error page or login page
        router.push("/login");
        return;
    }

    try {
        const response = await axiosInstance.post("/api/auth/github/login", { "code": code.value })
        localStorage.setItem('userToken', response.data.user_token)
        const isStaff = response.data.is_staff
        const nickname = response.data.username
        store.login(isStaff, nickname)
        router.push("/posts")
    } catch (error) {
        console.error("GitHub login error: ", error)
        // Optionally, redirect to an error page with a message
        router.push("/login?error=github_login_failed");
    }
})
</script>

<style scoped>
.fill-height {
    min-height: 80vh;
}
</style>
