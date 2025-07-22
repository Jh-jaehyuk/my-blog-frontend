<template>
    <div>
        <h1>내 정보</h1>
    </div>
    <div>
        <h2>닉네임</h2>
        <div v-if="!isEdit">
            <p>{{ nickname }}</p>
            <button @click="editNickname">닉네임 변경</button>
        </div>
        <div v-else>
            <input v-model="updatedNickname" :placeholder="updatedNickname">
            <button @click="updateNickname">변경</button>
            <button @click="cancelEdit">취소</button>
        </div>
        <h2>이메일</h2>
        <p>{{ email }}</p>
    </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import axiosInstance from '@/utils/axiosInstance';

const nickname = ref(null)
const email = ref(null)
const isEdit = ref(false)
const updatedNickname = ref(null)
const router = useRouter()

onMounted(async () => {
    await getMyInfo()
})

async function getMyInfo() {
    try {
        const userToken = localStorage.getItem('userToken')
        const response = await axiosInstance.get('/api/users/me/', { headers: { Authorization: `Bearer ${userToken}` } })


        console.log("userInfo: ", response.data)
        nickname.value = response.data.username
        email.value = response.data.email
        updatedNickname.value = nickname.value
    } catch (error) {
        console.error("내 정보 가져오는 중 에러 발생: ", error)

        if (error.response.status == 403) {
            router.push('/login')
        }
    }
}

function editNickname() {
    isEdit.value = true
}

async function updateNickname() {
    try {
        const userToken = localStorage.getItem('userToken')
        const response = await axiosInstance.put('/api/users/me/', { 'updatedNickname': updatedNickname.value }, { headers: { Authorization: `Bearer ${userToken}` } })
        console.log("updatedUserInfo: ", response.data)
        nickname.value = response.data.username
        isEdit.value = false
    } catch (error) {
        console.error("닉네임 변경 중 에러 발생: ", error)
    }
}

function cancelEdit() {
    updatedNickname.value = nickname.value
    isEdit.value = false
}

</script>