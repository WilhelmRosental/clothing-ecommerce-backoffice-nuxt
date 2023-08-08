<template>
  <div>
    <div class="border rounded mb-2">
      <div class="accordion-header bg-gray-50 px-4 py-2 flex items-center justify-between cursor-pointer" @click="isOpen = !isOpen">
        <label class="flex items-center px-2 py-1 cursor-pointer">
          <span>{{ props.label }}</span>
        </label>

        <span class="transition group-open:rotate-180" :class="{'rotate-180': !isOpen}">
          <ChevronDownIcon class="h-5 w-5" />
        </span>
      </div>
      <div v-if="isOpen" class="accordion-body flex flex-col max-h-128 overflow-y-hidden">
        <input
          v-model="currentMin"
          class="px-4 appearance-none outline-none text-gray-800 flex-1"
          placeholder="Prix Min"
          @update:model-value="updateMin"
        >

        <input
          v-model="currentMax"
          class="px-4 appearance-none outline-none text-gray-800 flex-1"
          placeholder="Prix Max"
          @update:model-value="updateMax"
        >

        <div>
          <button
            class="bg-indigo-50 hover:bg-indigo-100 text-black font-bold py-2 px-4 w-full"
            @click="resetPrices"
          >
            Réinitialiser le filtre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChevronDownIcon } from '@heroicons/vue/24/outline'
import { ref } from 'vue'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  minprice: {
    type: String,
    default: null
  },
  maxprice: {
    type: String,
    default: null
  }
})

const isOpen = ref(false)
const currentMin = ref(props.minprice)
const currentMax = ref(props.maxprice)

const emit = defineEmits(['update:minprice', 'update:maxprice'])

/**
 * @brief retire les filtre sélectionnés
 */
function resetPrices () {
  emit('update:minprice')
  emit('update:maxprice')
  currentMin.value = null
  currentMax.value = null
}

/**
 * @brief emet l'évènement 'update' qui met à jour les filtres sélectionnés
 * @param {*} updatedItem
 */
function updateMin (updatedItem) {
  emit('update:minprice', updatedItem)
}

function updateMax (updatedItem) {
  emit('update:maxprice', updatedItem)
}

defineExpose({ resetPrices })
</script>
