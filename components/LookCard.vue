<template>
  <div class="flex flex-col h-full">
    <!-- Menu d'interaction du look -->
    <div class="sticky h-10 items-center bg-gray-50 flex flex-row justify-end px-2">
      <div>
        <button
          ref="dropdown"
          class="ml-px inline-flex items-center justify-center w-8 h-8 text-black transition-colors duration-150 bg-gray-200 rounded-full focus:shadow-outline hover:bg-gray-100"
          @click="toggleMenu"
        >
          <EllipsisHorizontalIcon class="h-5 w-5" />
        </button>
        <div v-if="isMenuOpen" class="absolute bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
          <ul class="py-1" aria-labelledby="dropdown">
            <li>
              <NuxtLink
                class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2 w-full"
                :to="'/looks/edit' + '?id=' + props.look.id"
              >
                Modifier
              </NuxtLink>
            </li>
            <slot />
          </ul>
        </div>
      </div>
    </div>

    <!-- Aperçu s'il s'agit d'un look publique -->
    <div v-if="props.look.is_public" class="flex flex-1 min-h-0 justify-center items-center">
      <template v-if="props.look.thumbnail">
        <nuxt-img
          :class="'w-full h-full object-contain'"
          :src="thumbnailUrl"
          alt="product image"
        />
      </template>
      <template v-else>
        <img src="@/assets/icons/no-image.svg" class="h-16 w-16 text-indigo-800">
      </template>
    </div>

    <!-- Aperçu 'il s'agit d'un look client -->
    <div v-else class="flex flex-1 min-h-0">
      <div class="w-7/12">
        <div v-if="props.look.left_top" class="h-1/2 p-1">
          <div v-if="props.look.left_top.id" class="h-full w-full">
            <nuxt-img :src="productImages.left_top" :class="'object-contain w-full h-full border border-dashed border-gray-200'" />
          </div>
        </div>
        <div v-else class="p-1 h-1/2 w-full">
          <div class="flex items-center justify-center h-full w-full border border-dashed border-gray-200">
            <NoSymbolIcon class="h-7 w-7 text-indigo-900" />
          </div>
        </div>

        <div v-if="props.look.left_bottom" class="h-1/2 p-1">
          <div v-if="props.look.left_bottom.id" class="h-full w-full">
            <nuxt-img :src="productImages.left_bottom" :class="'object-contain w-full h-full border border-dashed border-gray-200'" />
          </div>
        </div>
        <div v-else class="p-1 h-1/2 w-full">
          <div class="flex items-center justify-center h-full w-full border border-dashed border-gray-200">
            <NoSymbolIcon class="h-7 w-7 text-indigo-900" />
          </div>
        </div>
      </div>

      <div class="w-5/12">
        <div v-if="props.look.right_top" class="h-1/3 p-1">
          <div v-if="props.look.right_top.id" class="h-full w-full">
            <nuxt-img :src="productImages.right_top" :class="'object-contain w-full h-full border border-dashed border-gray-200'" />
          </div>
        </div>
        <div v-else class="p-1 h-1/3 w-full">
          <div class="flex items-center justify-center h-full w-full border border-dashed border-gray-200">
            <NoSymbolIcon class="h-7 w-7 text-indigo-900" />
          </div>
        </div>

        <div v-if="props.look.right_middle" class="h-1/3 p-1">
          <div v-if="props.look.right_middle.id" class="h-full w-full">
            <nuxt-img :src="productImages.right_middle" :class="'object-contain w-full h-full border border-dashed border-gray-200'" />
          </div>
        </div>
        <div v-else class="p-1 h-1/3 w-full">
          <div class="flex items-center justify-center h-full w-full border border-dashed border-gray-200">
            <NoSymbolIcon class="h-7 w-7 text-indigo-900" />
          </div>
        </div>

        <div v-if="props.look.right_bottom" class="h-1/3 p-1">
          <div v-if="props.look.right_bottom.id" class="h-full w-full">
            <nuxt-img :src="productImages.right_bottom" :class="'object-contain w-full h-full border border-dashed border-gray-200'" />
          </div>
        </div>
        <div v-else class="p-1 h-1/3 w-full">
          <div class="flex items-center justify-center h-full w-full border border-dashed border-gray-200">
            <NoSymbolIcon class="h-7 w-7 text-indigo-900" />
          </div>
        </div>
      </div>
    </div>

    <!-- Si des clients sont associés au look -->
    <div class="h-10 flex items-center p-2">
      <div v-if="props.look.customers && props.look.customers.length > 0">
        <button
          ref="dropdown"
          class="ml-px inline-flex items-center justify-center text-black transition-colors duration-150 bg-gray-200 rounded-full focus:shadow-outline hover:bg-gray-100 py-1 px-2 text-sm"
          @click="toggleCustomers"
        >
          {{ props.look.customers.length }} Clients associés
        </button>
        <div v-if="isCustomersOpen" class="absolute w-72 bg-white text-base z-50 list-none divide-y divide-gray-100 rounded shadow my-4">
          <ul class="py-1" aria-labelledby="dropdown">
            <li v-for="customer in props.look.customers" :key="customer" class="py-1 px-2">
              {{ customer }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { EllipsisHorizontalIcon, NoSymbolIcon } from '@heroicons/vue/24/solid'
import { onClickOutside } from '@vueuse/core'
import useFetchProductThumbnail from '../composables/products/useFetchProductThumbnail'
import useFetchPublicLookImage from '../composables/looks/useFetchPublicLookImage'

const isMenuOpen = ref(false)
const isCustomersOpen = ref(false)
const dropdown = ref(null)

const props = defineProps({
  look: {
    type: Object,
    required: true
  }
})

const thumbnailUrl = ref(null)
const productImages = ref({
  left_top: null,
  left_bottom: null,
  right_top: null,
  right_middle: null,
  right_bottom: null
})

if (props.look.is_public && props.look.thumbnail) {
  thumbnailUrl.value = await useFetchPublicLookImage(props.look.id)
}
if (!props.look.is_public) {
  if (props.look.left_top) {
    productImages.value.left_top = await fetchProductThumbnailFromLook('left_top')
  }
  if (props.look.left_bottom) {
    productImages.value.left_bottom = await fetchProductThumbnailFromLook('left_bottom')
  }
  if (props.look.right_top) {
    productImages.value.right_top = await fetchProductThumbnailFromLook('right_top')
  }
  if (props.look.right_middle) {
    productImages.value.right_middle = await fetchProductThumbnailFromLook('right_middle')
  }
  if (props.look.right_bottom) {
    productImages.value.right_bottom = await fetchProductThumbnailFromLook('right_bottom')
  }
}

async function fetchProductThumbnailFromLook (productSlot) {
  return await useFetchProductThumbnail(props.look[productSlot].id)
}

function toggleMenu () {
  isMenuOpen.value = !isMenuOpen.value
}

function toggleCustomers () {
  isCustomersOpen.value = !isCustomersOpen.value
}

onClickOutside(dropdown, () => {
  isMenuOpen.value = false
})
</script>
