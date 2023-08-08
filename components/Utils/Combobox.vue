<template>
  <div class="relative w-full">
    <div
      class="h-10 bg-white flex border border-gray-200 rounded items-center shadow"
      :class="isOpen ? 'ring-2 ring-indigo-900 border-indigo-900' : ''"
      @click="isOpen = true"
    >
      <div class="max-w-2/3 w-max flex flex-row overflow-x-hidden">
        <div v-for="(item, index) in props.selected" :key="item" class="flex flex-row justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1">
          <p class="mr-1 inline">
            {{ item }}
          </p>
          <XCircleMini class="h-4 w-4" @click="deleteSelected(index)" />
        </div>
      </div>
      <input
        id="select"
        v-model="searchInput"
        name="select"
        class="px-4 appearance-none outline-none text-gray-800 flex-1"
        :placeholder="props.placeholder"
        @keypress.enter="addEntry"
        @keydown.delete="backspaceDelete"
        @focus="isOpen = true"
      >
      <button class="cursor-pointer outline-none focus:outline-none transition-all text-gray-300 hover:text-gray-600">
        <XCircleIcon class="h-5 w-5 mr-1" @click="searchInput = ''; removeEntries()" />
      </button>
      <label class="cursor-pointer outline-none focus:outline-none border-l border-gray-200 transition-all text-gray-300 hover:text-gray-600" @click="isOpen = !isOpen">
        <ChevronDownIcon v-if="isOpen" class="h-5 w-5" />
        <ChevronUpIcon v-else class="h-5 w-5" />
      </label>
    </div>
    <div v-if="isOpen" ref="dropdown" class="max-h-96 overflow-y-scroll z-50 absolute rounded shadow-lg bg-white overflow-hidden flex flex-col w-full mt-1 border border-gray-200">
      <template v-if="filteredItemsCount > 0">
        <div
          v-for="item in filterBySearch"
          :key="item"
          class="cursor-pointer group flex flex-row justify-between hover:bg-gray-100 align-center"
          @click="toggleEntry(item)"
        >
          <a class="block p-2 border-transparent border-l-4">{{ item }}</a>
          <div v-if="selectedItems.length > 0" class="flex items-center justify-center">
            <CheckIcon v-if="selectedItems.includes(item)" class="h-5 w-5" />
          </div>
        </div>
      </template>
      <template v-else>
        <div>
          <p>Pas de résultats</p>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, computed, watch } from 'vue'
import { onClickOutside } from '@vueuse/core'
import { ChevronDownIcon, ChevronUpIcon, CheckIcon, XCircleIcon } from '@heroicons/vue/24/solid'
import { XCircleIcon as XCircleMini } from '@heroicons/vue/20/solid'

const props = defineProps({
  items: {
    type: Array,
    default: () => []
  },
  multiple: {
    type: Boolean,
    default: false
  },
  newEntry: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: ''
  },
  selected: {
    type: Array,
    default: () => []
  }
})

const emit = defineEmits([
  'update:selected'
])

const isOpen = ref(false)
const searchInput = ref('')
const dropdown = ref(null)
const selectedItems = ref(props.selected ? props.selected : [])

onClickOutside(dropdown, () => {
  isOpen.value = false
})

const filterBySearch = computed(() => {
  const filter = searchInput.value.toUpperCase()

  return _.chain(props.items.concat(selectedItems.value))
    .filter(value => value.toUpperCase().includes(filter))
    .uniq()
    .sortBy()
    .value()
})

const filteredItemsCount = computed(() => {
  return filterBySearch.value.length
})

function addEntry () {
  if (props.newEntry && searchInput.value !== '' && !selectedItems.value.includes(searchInput.value)) {
    if (props.multiple || selectedItems.value.length === 0) {
      selectedItems.value.push(searchInput.value)
      emit('update:selected', selectedItems.value)
    } else {
      selectedItems.value[0] = searchInput.value
      emit('update:selected', selectedItems.value)
    }
    searchInput.value = ''
  }
}

function toggleEntry (item) {
  if (props.multiple) {
    if (!selectedItems.value.includes(item)) {
      selectedItems.value.push(item)
      emit('update:selected', selectedItems.value)
    } else {
      selectedItems.value.splice(selectedItems.value.indexOf(item), 1)
      emit('update:selected', selectedItems.value)
    }
  } else {
    selectedItems.value = [item]
    emit('update:selected', selectedItems.value)
    isOpen.value = false
  }
}

function deleteSelected (index) {
  selectedItems.value.splice(index, 1)
  emit('update:selected', selectedItems.value)
}

function backspaceDelete (event) {
  if (event.which === 8 && searchInput.value === '' && selectedItems.value.length > 0) {
    selectedItems.value.splice(selectedItems.value.length - 1, 1)
    emit('update:selected', selectedItems.value)
  }
}

function removeEntries () {
  selectedItems.value = []
  emit('update:selected', selectedItems.value)
}

defineExpose({ removeEntries })

watch(selectedItems, () => {
  isOpen.value = false
})

watch(isOpen, () => {
  if (isOpen.value) {
    searchInput.value = ''
  }
})
</script>
