<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card class="elevation-12">
                    <v-toolbar color="primary" dark flat>
                        <v-toolbar-title>Login</v-toolbar-title>
                    </v-toolbar>
                    <v-card-text class="pa-6">
                        <p class="text-body-1 text-center text-grey-darken-1 mb-6">
                            No registration required. Your account is automatically created on your first login.
                        </p>
                        <v-btn @click="githubLogin" color="#24292e" block x-large>
                            <v-icon left>mdi-github</v-icon>
                            <span class="ml-2">Sign in with GitHub</span>
                        </v-btn>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import axiosInstance from '@/utils/axiosInstance'

async function githubLogin() {
    try {
        const response = await axiosInstance.get("/api/auth/github/login-uri")
        window.location.href = response.data.uri
    } catch (error) {
        console.error("Error fetching GitHub Login URI: ", error)
    }
}
</script>

<style scoped>
.fill-height {
    min-height: 80vh;
}
</style>
