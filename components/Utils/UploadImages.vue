<template>
  <UtilsSnackbar v-if="imagesSnackbar" v-model:active="imagesSnackbar">
    <p>Vous ne devez sélectionner qu'une seule image !</p>
  </UtilsSnackbar>

  <div class="flex flex-col">
    <div
      v-if="props.singleImage"
      class="w-full mb-2"
    >
      <div
        v-if="props.images && props.images.length > 0"
        class="relative flex justify-center rounded text-sm h-44 w-full"
      >
        <button class="absolute right-0 bg-indigo-200 hover:bg-indigo-300 py-2 px-2 rounded" @click="removeImage(0)">
          <XMarkIcon class="h-6 w-6" />
        </button>
        <nuxt-img class="object-contain" draggable="false" :src="props.images[0].fileUrl" />
      </div>
      <div
        v-else
        class="flex items-center justify-center h-44"
      >
        <h3 class="text-indigo-300">
          Aucune image de look
        </h3>
      </div>
    </div>
    <div class="h-48 border-2 border-dashed border-gray-300 rounded-lg p-6 mb-2">
      <div
        :class="{
          'bg-gray-100': isDragOver,
          'bg-white': !isDragOver
        }"
        class="relative h-full flex flex-col items-center justify-center cursor-pointer hover:bg-indigo-50 rounded-lg"
        @dragover.prevent="isDragOver = true"
        @dragenter.prevent="isDragOver = true"
        @dragleave.prevent="isDragOver = false"
        @drop.prevent="handleDrop"
      >
        <PhotoIcon class="h-20 w-20 text-indigo-900" />
        <p class="mt-2 text-sm text-indigo-900">
          Glissez et déposez des fichiers ici ou cliquez pour les télécharger.
        </p>
        <input
          ref="fileInput"
          type="file"
          multiple
          class="absolute cursor-pointer w-full h-full opacity-0"
          @change="handleFileInput"
        >
      </div>
    </div>
    <div
      v-if="!props.singleImage"
      class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 overflow-y-auto flex-1 min-h-0 px-4"
      :class="props.singleImage ? 'w-full' : ''"
    >
      <div
        v-for="(file, index) in uploadedFiles"
        :key="index"
        class="relative rounded shadow-md text-sm my-2 h-72"
        :data-index="index"
        draggable="true"
        @dragstart="onImageDragStart($event, index)"
        @dragover="onImageDragOver($event)"
        @drop="onImageDrop($event, index)"
      >
        <div class="absolute top-1 left-1 inline-block bg-indigo-50 text-indigo-950 rounded-full px-2 py-1 text-xs font-semibold z-50">
          {{ index + 1 }}
        </div>
        <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full z-50" @click="removeImage(index)">
          <XMarkIcon class="h-5 w-5" />
        </button>
        <nuxt-img class="relative w-full h-full object-contain" draggable="false" :src="file.fileUrl" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { onBeforeMount, ref } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { PhotoIcon, XMarkIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  singleImage: {
    type: Boolean,
    default: false
  },
  images: {
    type: Array,
    default () { return [] }
  }
})

const isDragOver = ref(false)
const uploadedFiles = ref([])
const imagesSnackbar = ref(false)

onBeforeMount(async () => {
  uploadedFiles.value = props.images
})

const emit = defineEmits(['update:images'])

function handleFilesUpload (files) {
  if (props.singleImage && files.length > 1) {
    imagesSnackbar.value = true
  }
  if (props.singleImage && files.length === 1) {
    uploadedFiles.value.push({
      id: uuidv4(),
      file: files[0],
      fileUrl: URL.createObjectURL(files[0])
    })
  }
  if (!props.singleImage) {
    Array.from(files).forEach(element =>
      uploadedFiles.value.push({
        id: uuidv4(),
        order: uploadedFiles.value.length + 1,
        file: element,
        fileUrl: URL.createObjectURL(element)
      })
    )
    emit('update:images', uploadedFiles.value)
  }
}

function handleDrop (event) {
  isDragOver.value = false
  handleFilesUpload(event.dataTransfer.files)
}

function handleFileInput () {
  handleFilesUpload(event.target.files)
}

// Images
const onImageDragStart = (event, index) => {
  event.dataTransfer.setData('text/plain', index)
}

const onImageDragOver = (event) => {
  event.preventDefault()
}

const onImageDrop = (event, targetIndex) => {
  const draggingIndex = event.dataTransfer.getData('text/plain')

  if (draggingIndex !== targetIndex) {
    const draggingCard = uploadedFiles.value[draggingIndex]
    const targetCard = uploadedFiles.value[targetIndex]

    // Mise à jour des valeurs 'order'
    const draggingOrder = draggingCard.order
    draggingCard.order = targetCard.order
    targetCard.order = draggingOrder

    // Mettre à jour le tableau de cartes
    uploadedFiles.value.splice(draggingIndex, 1, targetCard)
    uploadedFiles.value.splice(targetIndex, 1, draggingCard)
  }
}

function removeImage (index) {
  uploadedFiles.value.splice(index, 1)
  emit('update:images', uploadedFiles.value)
}
</script>
