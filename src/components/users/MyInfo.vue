<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="8">
                <v-card flat class="pa-md-4">
                    <v-card-title class="text-h4 font-weight-bold pt-4 pb-2">
                        내 정보
                    </v-card-title>

                    <v-divider class="mb-4"></v-divider>

                    <v-list lines="two">
                        <v-list-item>
                            <v-list-item-title class="font-weight-bold">닉네임</v-list-item-title>
                            <div v-if="!isEdit" class="d-flex align-center mt-2">
                                <p class="text-h6">{{ nickname }}</p>
                                <v-btn variant="tonal" color="primary" class="ml-4" @click="editNickname">닉네임 변경</v-btn>
                            </div>
                            <div v-else class="d-flex align-center mt-2">
                                <v-text-field 
                                    v-model="updatedNickname" 
                                    :placeholder="nickname" 
                                    variant="outlined" 
                                    dense 
                                    hide-details="auto"
                                    :error-messages="errorMessage"
                                    class="mr-2">
                                </v-text-field>
                                <v-btn color="success" @click="updateNickname">변경</v-btn>
                                <v-btn class="ml-2" @click="cancelEdit">취소</v-btn>
                            </div>
                        </v-list-item>

                        <v-divider class="my-4"></v-divider>

                        <v-list-item>
                            <v-list-item-title class="font-weight-bold">이메일</v-list-item-title>
                            <p class="text-h6 mt-2">{{ email }}</p>
                        </v-list-item>
                    </v-list>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
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
const errorMessage = ref('')

onMounted(async () => {
    await getMyInfo()
})

async function getMyInfo() {
    try {
        const response = await axiosInstance.get('/api/users/me/')
        nickname.value = response.data.username
        email.value = response.data.email
        updatedNickname.value = nickname.value
    } catch (error) {
        console.error("내 정보 가져오는 중 에러 발생: ", error)
        if (error.response && error.response.status === 403) {
            router.push('/login')
        }
    }
}

function editNickname() {
    isEdit.value = true
    errorMessage.value = '' // 편집 모드 진입 시 에러 메시지 초기화
}

async function updateNickname() {
    errorMessage.value = '' // 재시도 시 에러 메시지 초기화
    try {
        const response = await axiosInstance.put('/api/users/me/', { 'updatedNickname': updatedNickname.value })
        nickname.value = response.data.username
        isEdit.value = false
    } catch (error) {
        console.error("닉네임 변경 중 에러 발생: ", error)
        if (error.response && error.response.status === 400) {
            errorMessage.value = '이미 사용 중인 닉네임입니다. 다른 닉네임을 입력해주세요.'
        } else {
            errorMessage.value = '예상치 못한 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
        }
    }
}

function cancelEdit() {
    updatedNickname.value = nickname.value
    isEdit.value = false
    errorMessage.value = '' // 취소 시 에러 메시지 초기화
}

</script>

<style scoped>
.v-list-item-title {
    font-size: 1.1rem !important;
}
</style>