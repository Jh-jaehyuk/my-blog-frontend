<template>
    <h1>게시글 수정</h1>
    <div>
        <h2>제목</h2>
        <input v-model="title" :placeholder="title">
        <h3>내용</h3>
        <QuillEditor @ready="onEditorReady" :modules="modules" theme="snow" toolbar="full" contentType="delta"
            v-model:content="content" />
    </div>
    <div>
        <v-btn @click="onSubmit">수정</v-btn>
        <v-btn @click="onCancel">취소</v-btn>
    </div>
</template>

<script setup>
import { nextTick, onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { QuillEditor } from '@vueup/vue-quill';
import '@vueup/vue-quill/dist/vue-quill.snow.css'
import ImageUploader from 'quill-image-uploader'
import axiosInstance from '@/utils/axiosInstance';
import axios from 'axios';

const route = useRoute()
const router = useRouter()

const title = ref("")
const content = ref("")
const loadedContent = ref("")
let originalImages = []
let updatedImages = []

const postId = route.params.postId

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

async function loadContentIntoEditor(loadedContent) {
    try {
        const delta = quill.value.clipboard.convert(loadedContent)
        content.value = delta
        await nextTick()

        const lastIndex = quill.value.getLength()
        quill.value.setSelection(lastIndex, 0)
    } catch (error) {
        console.error("에디터에 내용 로드 중 에러 발생: ", error)
    }
}

function extractImagesFromHTML(loadedContent) {
    const parser = new DOMParser()
    const doc = parser.parseFromString(loadedContent, 'text/html')

    const images = doc.querySelectorAll('img')

    const srcValues = Array.from(images).map(img => img.src.split('/').pop())

    return srcValues
}

async function onSubmit() {
    try {
        const updatedContent = quill.value.root.innerHTML
        updatedImages = extractImagesFromHTML(updatedContent)
        const imagesToDelete = originalImages.filter(img => !updatedImages.includes(img))
        const payload = { 'title': title.value, 'content': quill.value.root.innerHTML, 'imagesToDelete': imagesToDelete }
        await axiosInstance.put(`/api/posts/${postId}/`, payload)
        router.push(`/posts/${postId}`)
    } catch (error) {
        console.error("게시글 수정 중 에러 발생: ", error)
    }
}

function onCancel() {
    router.go(-1)
}

onMounted(async () => {
    try {
        const response = await axiosInstance.get(`/api/posts/${postId}/`)
        title.value = response.data.title
        loadedContent.value = response.data.content

        if (quill.value) {
            await loadContentIntoEditor(loadedContent.value)
        }
        originalImages = extractImagesFromHTML(loadedContent.value)
    } catch (error) {
        console.error("게시글 수정 페이지에서 게시글 불러오는 중 에러 발생: ", error)
    }
})

</script>