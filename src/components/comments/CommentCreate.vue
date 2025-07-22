<template>
    <div>
        <div v-if="store.isAuthenticated">
            <v-textarea v-model="content" label="Add a comment" variant="outlined" rows="3" auto-grow
                hide-details></v-textarea>
            <v-btn @click="onSubmit" :disabled="!content.trim()" color="primary" class="mt-2">Submit</v-btn>
        </div>
        <div v-else class="text-center text-grey pa-4 border rounded">
            <p>Please <router-link to="/login">log in</router-link> to post a comment.</p>
        </div>
    </div>
</template>

<script setup>
import { useAuthenticationStore } from '@/store/authenticate'
import axiosInstance from '@/utils/axiosInstance'
import { ref } from 'vue'

// eslint-disable-next-line no-undef
const props = defineProps(['postId'])
// eslint-disable-next-line no-undef
const emit = defineEmits(['commentCreated'])
const store = useAuthenticationStore()
const content = ref('')

async function onSubmit() {
    if (!content.value.trim()) return;

    try {
        const payload = { "postId": props.postId, "content": content.value };
        await axiosInstance.post("/api/comments/", payload);
        emit('commentCreated');
        content.value = ''; // Clear textarea after submission
    } catch (error) {
        console.error("Error creating comment: ", error);
    }
}
</script>

<style scoped>
.border {
    border: 1px solid #E0E0E0 !important;
}
</style>
