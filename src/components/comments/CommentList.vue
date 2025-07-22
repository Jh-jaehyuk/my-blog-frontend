<template>
    <div>
        <v-list v-if="comments.length > 0" lines="two" class="py-0">
            <div v-for="(comment, index) in comments" :key="comment.id">
                <v-list-item>
                    <v-list-item-title class="font-weight-bold">{{ comment.writer }}</v-list-item-title>

                    <div v-if="editingCommentId === comment.id">
                        <v-text-field v-model="editingContent" variant="outlined" density="compact" hide-details
                            class="mb-2"></v-text-field>
                        <v-btn size="small" color="primary" @click="saveEdit(comment.id)" class="mr-2">Save</v-btn>
                        <v-btn size="small" @click="cancelEdit">Cancel</v-btn>
                    </div>
                    <v-list-item-subtitle v-else>
                        {{ comment.content }}
                    </v-list-item-subtitle>

                    <template v-slot:append>
                        <div v-if="canEditOrDelete(comment.writer)">
                            <v-btn icon="mdi-pencil" variant="text" size="small" @click="startEdit(comment)"></v-btn>
                            <v-btn icon="mdi-delete" variant="text" size="small"
                                @click="deleteComment(comment.id)"></v-btn>
                        </div>
                    </template>
                </v-list-item>
                <v-divider v-if="index < comments.length - 1"></v-divider>
            </div>
        </v-list>
        <div v-else class="text-center text-grey py-4">
            <p>No comments yet. Be the first to comment!</p>
        </div>
        <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" class="mt-4"></v-pagination>
    </div>
</template>

<script setup>
import { useAuthenticationStore } from '@/store/authenticate';
import axiosInstance from '@/utils/axiosInstance';
import { onMounted, ref, watch } from 'vue';

// eslint-disable-next-line no-undef
const props = defineProps(['postId'])
const store = useAuthenticationStore()
const comments = ref([])
const currentPage = ref(1)
const totalPages = ref(0)
const pageSize = 10

const editingCommentId = ref(null);
const editingContent = ref('');

function canEditOrDelete(commentWriter) {
    return store.isSuperuser || store.nickname === commentWriter;
}

function startEdit(comment) {
    editingCommentId.value = comment.id;
    editingContent.value = comment.content;
}

function cancelEdit() {
    editingCommentId.value = null;
    editingContent.value = '';
}

async function saveEdit(commentId) {
    if (!editingContent.value.trim()) return;
    try {
        await axiosInstance.put(`/api/comments/${commentId}/`, { content: editingContent.value });
        cancelEdit();
        await fetchData(); // Refresh comments list
    } catch (error) {
        console.error("Error updating comment: ", error);
    }
}

async function deleteComment(commentId) {
    if (!confirm("Are you sure you want to delete this comment?")) return;
    try {
        await axiosInstance.delete(`/api/comments/${commentId}/`);
        await fetchData(); // Refresh comments list
    } catch (error) {
        console.error("Error deleting comment: ", error);
    }
}

async function fetchData() {
    try {
        const response = await axiosInstance.get(`/api/posts/${props.postId}/comments/?page=${currentPage.value}`)
        comments.value = response.data.results
        totalPages.value = Math.ceil(response.data.count / pageSize)
    } catch (error) {
        console.error("Error fetching comments: ", error)
    }
}

onMounted(async () => {
    await fetchData()
})

watch(currentPage, async (newPage, oldPage) => {
    if (newPage !== oldPage) {
        await fetchData();
    }
});

// eslint-disable-next-line no-undef
defineExpose({ fetchData })
</script>