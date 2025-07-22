<template>
    <div>
        <h1>새 게시글 생성</h1>
        <h2>제목</h2>
        <input v-model="title" placeholder="제목을 입력하세요">
        <h3>Quill TEST</h3>
        <QuillEditor @ready="onEditorReady" :modules="modules" theme="snow" toolbar="full" v-model:content="content"
            contentType="html" />
        <div>
            <button @click="onSubmit">생성</button>
            <button @click="onCancel">취소</button>
        </div>
    </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { QuillEditor } from '@vueup/vue-quill'
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import axiosInstance from '@/utils/axiosInstance'
import axios from 'axios'

const router = useRouter()
const title = ref("")
const content = ref("")
const quill = ref(null)
const modules = {
    name: 'imageUploader',
    module: ImageUploader,
    options: {
        upload: file => customImageUpload(file)
    }
}

const customImageUpload = async (file) => {
    if (!file) return

    if (file.size > 5 * 1024 * 1024) {
        alert('파일 크기는 5MB를 초과할 수 없습니다.')
        return
    }
    console.log("업로드 시도한 파일: ", file)
    // const range = quill.value.getSelection(true)

    try {
        console.log('Step 1: Requesting S3 Pre-signed URL...');
        const presignedUrlResponse = await axiosInstance.post("/api/s3-presigned-url/", { fileName: file.name, fileType: file.type })

        const { presigned_url, image_url } = presignedUrlResponse.data

        console.log('Step 2: Uploading image to S3...');
        await axios.put(presigned_url, file, {
            headers: {
                'Content-Type': file.type,
            }
        })

        console.log('Step 3: Inserting image into Quill editor with URL:', image_url);
        // this.quill.insertEmbed(range.index, 'image', image_url)
        // this.quill.setSelection(range.index + 1)

        console.log("이미지 업로드 성공: ", image_url)

        return image_url

    } catch (error) {
        console.error("이미지 업로드 중 에러 발생: ", error)
        alert('이미지 업로드에 실패했습니다. 다시 시도해주세요,')
    }
}

function onEditorReady(quillInstance) {
    quill.value = quillInstance
    console.log("Quill Editor is ready: ", quill.value)
}

async function onSubmit() {
    try {
        console.log("content: ", content.value)
        const payload = { 'title': title.value, 'content': content.value }
        await axiosInstance.post(`/api/posts/`, payload)
        console.log("게시글 생성 완료!")
    } catch (error) {
        console.error("게시글 생성 중 에러 발생: ", error)
    }
    router.push("/posts")
}

function onCancel() {
    router.push("/posts")
}
</script>