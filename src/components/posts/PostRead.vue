<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card v-if="post" flat class="pa-md-4">
                    <v-card-title class="text-h4 font-weight-bold pt-4 pb-2">
                        {{ post.title }}
                    </v-card-title>

                    <v-card-subtitle class="pb-4">
                        <span>Posted on {{ new Date(post.created_at).toLocaleDateString() }}</span>
                        <span v-if="post.updated_at && post.updated_at !== post.created_at" class="ml-2">(Updated on {{
                            new
                                Date(post.updated_at).toLocaleDateString() }})</span>
                    </v-card-subtitle>

                    <v-divider class="mb-4"></v-divider>

                    <v-card-text>
                        <div v-html="sanitizedContent" class="post-content"></div>
                    </v-card-text>

                    <v-card-actions v-if="store.isSuperuser" class="justify-end pa-4">
                        <v-btn color="primary" variant="tonal" @click="toEditPage">수정</v-btn>
                        <v-btn color="error" variant="tonal" @click="deletePost">삭제</v-btn>
                    </v-card-actions>

                    <v-divider class="my-4"></v-divider>

                    <div class="pa-4">
                        <h3 class="text-h5 mb-4">Comments</h3>
                        <CommentList ref="commentListRef" :postId="post.id" />
                        <CommentCreate :postId="post.id" @commentCreated="handleCommentCreated" class="mt-6" />
                    </div>

                </v-card>
                <div v-else class="text-center pa-10">
                    <v-progress-circular indeterminate color="primary"></v-progress-circular>
                    <p class="mt-4">Loading post...</p>
                </div>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'
import hljs from 'highlight.js'
import 'highlight.js/styles/github-dark.css' // A bit more modern theme
import DOMPurify from 'dompurify'
import CommentCreate from '../comments/CommentCreate.vue'
import CommentList from '../comments/CommentList.vue'
import { useAuthenticationStore } from '@/store/authenticate'

const commentListRef = ref(null)
const post = ref(null)
const route = useRoute()
const router = useRouter()
const store = useAuthenticationStore()
const postId = route.params.postId

const sanitizedContent = computed(() => {
    if (post.value && post.value.content) {
        // Configure DOMPurify to allow iframes for video embeds, etc.
        const cleanHTML = DOMPurify.sanitize(post.value.content, {
            USE_PROFILES: { html: true },
            ADD_TAGS: ['iframe'],
            ADD_ATTR: ['allow', 'allowfullscreen', 'frameborder', 'scrolling']
        })

        const tempDiv = document.createElement('div')
        tempDiv.innerHTML = cleanHTML

        // Highlight code blocks
        tempDiv.querySelectorAll('pre.ql-syntax').forEach((preBlock) => {
            try {
                hljs.highlightElement(preBlock)
            } catch (error) {
                console.error("Error highlighting block: ", error)
            }
        })

        return tempDiv.innerHTML
    }
    return ""
})

const handleCommentCreated = async () => {
    await commentListRef.value?.fetchData()
}

const toEditPage = () => {
    router.push(`/posts/${postId}/edit`)
}

const extractImagesFromHTML = (loadedContent) => {
    const parser = new DOMParser()
    const doc = parser.parseFromString(loadedContent, 'text/html')
    const images = doc.querySelectorAll('img')
    return Array.from(images).map(img => img.src.split('/').pop())
}

const deletePost = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
        const payload = { 'imagesToDelete': extractImagesFromHTML(post.value.content) }
        await axiosInstance.delete(`/api/posts/${postId}/`, { data: payload })
        router.push('/posts')
    } catch (error) {
        console.error("Error deleting post: ", error)
    }
}

async function fetchData() {
    try {
        const response = await axiosInstance.get(`/api/posts/${postId}/`)
        post.value = response.data
    } catch (error) {
        console.error("Error fetching post: ", error)
    }
}

onMounted(async () => {
    await fetchData()
})
</script>

<style>
.post-content h1,
.post-content h2,
.post-content h3 {
    margin-top: 24px;
    margin-bottom: 16px;
    font-weight: 600;
}

.post-content p {
    line-height: 1.8;
    margin-bottom: 16px;
}

.post-content a {
    color: #1976D2;
    text-decoration: none;
}

.post-content a:hover {
    text-decoration: underline;
}

.post-content img {
    max-width: 100%;
    height: auto;
    display: block;
    margin: 20px 0;
    border-radius: 8px;
}

.post-content pre.ql-syntax {
    background-color: #2d2d2d;
    /* Dark background for code */
    color: #f8f8f2;
    /* Light text for contrast */
    padding: 20px;
    border-radius: 8px;
    white-space: pre-wrap;
    word-wrap: break-word;
    font-family: 'Fira Code', 'monospace';
    margin: 20px 0;
}

.post-content blockquote {
    border-left: 4px solid #ccc;
    margin: 20px 0;
    padding-left: 16px;
    color: #666;
}
</style>
