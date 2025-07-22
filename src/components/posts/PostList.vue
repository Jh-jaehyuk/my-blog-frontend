<template>
    <v-container>
        <v-row>
            <v-col cols="12" md="8" offset-md="2">
                <div class="d-flex justify-space-between align-center mb-5">
                    <h1 class="text-h4">Posts</h1>
                    <v-btn v-if="store.isSuperuser" color="primary" to="/posts/new">
                        새 게시글 작성
                    </v-btn>
                </div>

                <v-row class="mb-4">
                    <v-col cols="12">
                        <v-text-field v-model="searchKeyword" label="Search Posts" placeholder="Enter keyword..."
                            append-inner-icon="mdi-magnify" @click:append-inner="onSearch" @keyup.enter="onSearch"
                            clearable hide-details single-line variant="outlined"></v-text-field>
                    </v-col>
                </v-row>

                <v-card v-for="post in posts" :key="post.id" class="mb-4" @click="readPost(post)" hover>
                    <v-card-title class="text-h5">
                        {{ post.title }}
                    </v-card-title>
                    <v-card-subtitle>
                        {{ new Date(post.created_at).toLocaleDateString() }}
                    </v-card-subtitle>
                </v-card>

                <v-pagination v-if="totalPages > 1" v-model="currentPage" :length="totalPages" class="mt-5"></v-pagination>
            </v-col>
        </v-row>
    </v-container>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance'
import { useAuthenticationStore } from '@/store/authenticate';

const router = useRouter();
const store = useAuthenticationStore()

const posts = ref([]);
const currentPage = ref(1)
const pageSize = 10
const totalPages = ref(0)
const searchKeyword = ref('')
const currentSearch = ref('') // 실제 검색에 사용된 키워드

async function fetchData() {
    try {
        const params = new URLSearchParams();
        params.append('page', currentPage.value.toString());
        params.append('ordering', '-pk'); // 항상 최신순으로 정렬

        if (currentSearch.value) {
            params.append('search', currentSearch.value);
        }

        const response = await axiosInstance.get(`/api/posts/?${params.toString()}`);
        posts.value = response.data.results
        totalPages.value = Math.ceil(response.data.count / pageSize)
    } catch (error) {
        console.error("게시글 목록 가져오기 실패:", error);
    }
}

async function onSearch() {
    currentSearch.value = searchKeyword.value;
    currentPage.value = 1; // 검색 시 첫 페이지로 이동
    await fetchData();
}

onMounted(async () => {
    await fetchData()
})

watch(currentPage, async (newPage, oldPage) => {
    if (newPage !== oldPage) {
        await fetchData();
    }
});

function readPost(post) {
    router.push(`/posts/${post.id}`)
}

</script>

<style scoped>
.text-h4 {
    font-weight: 700;
    letter-spacing: -0.5px;
}

.v-card {
    transition: all 0.2s ease-in-out;
}
</style>
