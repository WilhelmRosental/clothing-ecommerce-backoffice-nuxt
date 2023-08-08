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
        <li
          class="flex items-center py-2"
        >
          <input
            v-model="searchInput"
            class="px-4 appearance-none outline-none text-gray-800 flex-1"
            placeholder="Rechercher"
          >
        </li>
        <ul class="overflow-y-auto">
          <li
            v-for="(item, index) in filterBySearch"
            :key="index"
            class="flex items-center py-2 hover:bg-indigo-50"
            @click="updateSelected(item)"
          >
            <div
              class="flex justify-between items-center flex-1"
            >
              <span class="ml-2">{{ item }}</span>
              <CheckIcon v-if="props.selected.includes(item)" class="h-5 w-5 text-blue mr-4" />
            </div>
          </li>
        </ul>
        <div>
          <button
            v-if="props.selectAll"
            class="bg-indigo-200 hover:bg-indigo-300 text-black font-bold py-2 px-4 w-1/2"
            @click="selectAllItems"
          >
            Tout sélectionner
          </button>
          <button
            class="bg-indigo-50 hover:bg-indigo-100 text-black font-bold py-2 px-4"
            :class="props.selectAll ? 'w-1/2' : 'w-full'"
            @click="resetSelected"
          >
            Réinitialiser le filtre
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { CheckIcon, ChevronDownIcon } from '@heroicons/vue/24/outline'

const props = defineProps({
  label: {
    type: String,
    required: true
  },
  items: {
    type: Array,
    required: true
  },
  selected: {
    type: Array,
    default () { return [] }
  },
  selectAll: {
    type: Boolean,
    default: false
  }
})
const activeItems = ref(props.selected)

const isOpen = ref(false)

/**
 * @brief emet l'évènement 'update' qui met à jour les filtres sélectionnés
 * @param {*} updatedItem
 */
function updateSelected (updatedItem) {
  if (!activeItems.value.includes(updatedItem)) {
    activeItems.value.push(updatedItem)
    emit('update:selected', activeItems.value)
  } else {
    activeItems.value.splice(activeItems.value.indexOf(updatedItem), 1)
    emit('update:selected', activeItems.value)
  }
}

/**
 * @brief retire les filtre sélectionnés
 */
function resetSelected () {
  activeItems.value = []
  emit('update:selected', [])
}

function selectAllItems () {
  activeItems.value = props.items
  emit('update:selected', activeItems.value)
}

const emit = defineEmits(['update:selected'])

const searchInput = ref('')

/**
 * @brief  update la liste des filtres en fonction de la recherche de l'utilisateur
 * @returns la liste des items contenant la substring entrée dans le text-input
 */
const filterBySearch = computed(() => {
  if (searchInput.value) {
    const filter = searchInput.value.toUpperCase()

    const filtered = props.items.filter((value, index, arr) => {
      return value.toUpperCase().includes(filter)
    })

    return filtered
  } else {
    return props.items
  }
})

defineExpose({ resetSelected })
</script>
