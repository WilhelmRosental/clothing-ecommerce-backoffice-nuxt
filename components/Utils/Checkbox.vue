<template>
  <div>
    <div class="flex items-center">
      <input
        :id="state.uniqueId"
        v-bind="$attrs"
        :checked="value"
        type="checkbox"
        class="h-4 w-4 focus:ring-0 cursor-pointer rounded accent-indigo-900"
        @change="updateInput"
      >
      <label :for="state.uniqueId" class="ml-2 block text-sm text-gray-900 cursor-pointer">
        {{ label }}
      </label>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive } from 'vue'

const emit = defineEmits(['update:value'])

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  value: {
    type: Boolean,
    default: false
  }
})

const state = reactive({
  uniqueId: ''
})

const updateInput = ($event) => {
  emit('update:value', $event.target.checked)
}

onMounted(() => {
  state.uniqueId = props.id || Math.random()
    .toString(16)
    .slice(2)
})
</script>
