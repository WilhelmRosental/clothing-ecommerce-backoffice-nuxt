<template>
  <client-only>
    <span
      class="absolute bottom-0 right-0 inline-block bg-indigo-900 rounded-full px-2 py-1 text-xs font-semibold text-white mr-1 mb-1 z-40"
    >
      {{ globalPrice }} €
    </span>
  </client-only>
  <div class="h10">
    <button
      class="text-black font-bold py-2 px-4 w-1/2"
      :class="!isPublicOpen ? 'bg-indigo-900 hover:bg-indigo-950 text-white' : 'bg-indigo-100 hover:bg-indigo-200'"
      @click="isPublicOpen = false"
    >
      Items
    </button>
    <button
      class="text-black font-bold py-2 px-4 w-1/2"
      :class="isPublicOpen ? 'bg-indigo-900 hover:bg-indigo-950 text-white' : 'bg-indigo-100 hover:bg-indigo-200'"
      @click="isPublicOpen = true"
    >
      Look publique
    </button>
  </div>
  <div v-show="!isPublicOpen" class="hidden sm:flex sm:flex-row sm:flex-1 sm:min-h-0 overflow-y-auto">
    <div class="w-7/12">
      <div class="h-1/2 p-2">
        <LookCreationPreviewSlot
          :product="props.lookdatas.left_top"
          @drop.prevent="updateLookSlot('left_top', props.draggedProduct)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full" @click="updateLookSlot('left_top', null)">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </LookCreationPreviewSlot>
      </div>
      <div class="h-1/2 p-2">
        <LookCreationPreviewSlot
          :product="props.lookdatas.left_bottom"
          @drop.prevent="updateLookSlot('left_bottom', props.draggedProduct)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full" @click="updateLookSlot('left_bottom', null)">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </LookCreationPreviewSlot>
      </div>
    </div>
    <div class="w-5/12">
      <div class="h-1/3 p-2">
        <LookCreationPreviewSlot
          :product="props.lookdatas.right_top"
          @drop.prevent="updateLookSlot('right_top', props.draggedProduct)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full" @click="updateLookSlot('right_top', null)">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </LookCreationPreviewSlot>
      </div>
      <div class="h-1/3 p-2">
        <LookCreationPreviewSlot
          :product="props.lookdatas.right_middle"
          @drop.prevent="updateLookSlot('right_middle', props.draggedProduct)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full" @click="updateLookSlot('right_middle', null)">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </LookCreationPreviewSlot>
      </div>
      <div class="h-1/3 p-2">
        <LookCreationPreviewSlot
          :product="props.lookdatas.right_bottom"
          @drop.prevent="updateLookSlot('right_bottom', props.draggedProduct)"
          @dragover.prevent="dragover = true"
          @dragenter.prevent="dragover = true"
          @dragleave.prevent="dragover = false"
        >
          <button class="absolute top-1 right-1 bg-indigo-100 hover:bg-indigo-200 py-2 px-2 rounded-full" @click="updateLookSlot('right_bottom', null)">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </LookCreationPreviewSlot>
      </div>
    </div>
  </div>
  <div v-show="!isPublicOpen" class="flex flex-col sm:hidden justify-between overflow-y-auto">
    <LookCreationPreviewSlot
      :product="props.lookdatas.left_top"
      @drop.prevent="updateLookSlot('left_top', props.draggedProduct)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    />

    <LookCreationPreviewSlot
      :product="props.lookdatas.left_bottom"
      @drop.prevent="updateLookSlot('left_bottom', props.draggedProduct)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    />

    <LookCreationPreviewSlot
      :product="props.lookdatas.right_top"
      @drop.prevent="updateLookSlot('right_top', props.draggedProduct)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    />

    <LookCreationPreviewSlot
      :product="props.lookdatas.right_middle"
      @drop.prevent="updateLookSlot('right_middle', props.draggedProduct)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    />

    <LookCreationPreviewSlot
      :product="props.lookdatas.right_bottom"
      @drop.prevent="updateLookSlot('right_bottom', props.draggedProduct)"
      @dragover.prevent="dragover = true"
      @dragenter.prevent="dragover = true"
      @dragleave.prevent="dragover = false"
    />
  </div>
  <div v-show="isPublicOpen" class="flex flex-col flex-1 min-h-0 p-1 overflow-y-auto">
    <client-only>
      <UtilsUploadImages
        :images="props.lookdatas.image"
        :single-image="true"
        @update:images="updateLookSlot('image', $event)"
      />
    </client-only>
    <input
      id="title"
      :value="props.lookdatas.title"
      class="h-10 focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type="text"
      placeholder="Titre du look"
      @change="updateLookSlot('title', $event.target.value)"
    >
    <UtilsCombobox
      :selected="props.lookdatas.designer"
      placeholder="Designer"
      :items="designers"
      :multiple="false"
      :new-entry="true"
      @update:selected="updateLookSlot('designer', $event)"
    />
    <UtilsCombobox
      :selected="props.lookdatas.univers"
      class="my-2"
      placeholder="Univers"
      :items="univers"
      :multiple="false"
      :new-entry="true"
      @update:selected="updateLookSlot('univers', $event)"
    />
    <UtilsCheckbox
      :value="props.lookdatas.is_public"
      class="mb-1"
      name="public"
      label="Look Publique"
      @update:value="updateLookSlot('is_public', $event)"
    />
    <UtilsCheckbox
      :value="props.lookdatas.published"
      class="mb-1"
      name="published"
      label="Publier sur la boutique"
      @update:value="updateLookSlot('published', $event)"
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import useFetchFilterValues from '../../composables/useFetchFilterValues'
const univers = ref(await useFetchFilterValues('univers', 'univers'))
const designers = ref(await useFetchFilterValues('designer', 'designers'))

const props = defineProps({
  lookdatas: {
    type: Object,
    required: true
  },
  draggedProduct: {
    type: Object,
    required: true
  }
})

const dragover = ref(false)
const isPublicOpen = ref(false)

const globalPrice = computed(() => {
  const { left_top: leftTop, left_bottom: leftBottom, right_top: rightTop, right_middle: rightMiddle, right_bottom: rightBottom } = props.lookdatas
  let price = 0
  if (leftTop) { price += leftTop.final_price }
  if (leftBottom) { price += leftBottom.final_price }
  if (rightTop) { price += rightTop.final_price }
  if (rightMiddle) { price += rightMiddle.final_price }
  if (rightBottom) { price += rightBottom.final_price }
  return price
})

const emit = defineEmits(['update:lookdatas'])

function updateLookSlot (slotName, newValue) {
  emit('update:lookdatas', { ...props.lookdatas, [slotName]: newValue })
};
</script>
