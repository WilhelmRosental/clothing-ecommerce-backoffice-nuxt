<template>
  <transition name="fade">
    <div v-if="show" class="z-50 fixed bottom-4 left-2/4 bg-gray-800 text-white py-2 px-4 rounded-lg shadow">
      <slot />
    </div>
  </transition>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:active'])

const show = ref(false)

onMounted(() => {
  show.value = true
  setTimeout(() => {
    show.value = false
    setTimeout(() => {
      emit('update:active', false)
    }, 500)
  }, 2000)
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
