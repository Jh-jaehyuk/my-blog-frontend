<template>
    <v-app-bar app color="white" elevate-on-scroll>
        <v-container class="d-flex align-center">
            <v-toolbar-title class="font-weight-bold text-h5">
                <router-link to="/" class="text-decoration-none text-grey-darken-3">Jh's blog</router-link>
            </v-toolbar-title>

            <v-btn text to="/posts" class="ml-4">
                Posts
            </v-btn>

            <v-spacer></v-spacer>

            <div v-if="!store.isAuthenticated">
                <v-btn text to="/login">
                    Login
                </v-btn>
            </div>

            <div v-else>
                <v-btn text to="/users/me">
                    My Info
                </v-btn>
                <v-btn text @click="logout">
                    Logout
                </v-btn>
            </div>
        </v-container>
    </v-app-bar>
</template>

<script setup>
import axiosInstance from '@/utils/axiosInstance'
import { useRouter } from 'vue-router'
import { useAuthenticationStore } from '@/store/authenticate'

const router = useRouter()
const store = useAuthenticationStore()

async function logout() {
    try {
        await axiosInstance.post("/api/auth/github/logout", { "userToken": localStorage.getItem('userToken') })
        localStorage.removeItem('userToken')
        store.logout()
        router.push("/")
    } catch (error) {
        console.error("로그아웃 중 에러 발생: ", error)
        // 만약 서버 로그아웃에 실패하더라도, 프론트엔드에서는 로그아웃 처리를 강행합니다.
        localStorage.removeItem('userToken')
        store.logout()
        router.push("/")
    }
}
</script>

<style scoped>
.v-toolbar-title a {
    transition: color 0.2s ease-in-out;
}

.v-toolbar-title a:hover {
    color: #1976D2;
    /* Vuetify primary color */
}
</style>
