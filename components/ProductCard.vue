<template>
  <div class="flex flex-col h-full">
    <div class="sticky h-10 items-center bg-gray-50 flex flex-row justify-end px-2 z-30">
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
                :to="'/products/edit' + '?id=' + props.product.id"
              >
                Modifier
              </NuxtLink>
            </li>
            <slot />
          </ul>
        </div>
      </div>
    </div>

    <div class="flex justify-center items-center h-36">
      <template v-if="thumbnailUrl">
        <nuxt-img
          :class="thumbnailUrl ? 'w-full h-full object-contain' : 'h-16 w-16 text-indigo-800'"
          :src="thumbnailUrl || '@/assets/icons/no-image.svg'"
          alt="product image"
        />
      </template>
      <template v-else>
        <img class="h-16 w-16 text-indigo-800" src="@/assets/icons/no-image.svg">
      </template>
    </div>

    <div class="flex flex-col justify-between p-2 bg-gray-50 flex-1 min-h-0">
      <div>
        <template v-if="product.type">
          <p>{{ product.type }}</p>
        </template>
        <template v-if="product.size">
          <div class="inline-block bg-violet-200 text-violet-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1">
            {{ product.size }}
          </div>
        </template>
        <template v-if="product.condition">
          <p>{{ product.condition }}</p>
        </template>
        <template v-if="product.provider">
          <p>{{ product.provider }}</p>
        </template>
        <template v-if="product.brand">
          <div class="inline-block bg-sky-200 text-sky-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1">
            {{ product.brand }}
          </div>
        </template>
        <div v-if="product.colors">
          <template v-for="color in product.colors" :key="color">
            <span
              class="inline-block bg-rose-50 text-rose-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
            >
              {{ color }}
            </span>
          </template>
        </div>
        <div v-if="product.details || product.materials">
          <template v-for="detail in product.details" :key="detail">
            <span
              class="inline-block bg-rose-200 text-rose-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
            >
              {{ detail }}
            </span>
          </template>
          <template v-for="material in product.materials" :key="material">
            <span
              class="inline-block bg-rose-200 text-rose-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
            >
              {{ material }}
            </span>
          </template>
        </div>
        <div v-if="product.final_price">
          <span
            class="inline-block bg-green-200 text-green-950 rounded-full px-2 py-1 text-xs font-semibold mr-1 mb-1"
          >
            {{ Math.round(product.price * 1.18) }} €
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { EllipsisHorizontalIcon } from '@heroicons/vue/24/solid'
import { onClickOutside } from '@vueuse/core'
import useFetchProductThumbnail from '../composables/products/useFetchProductThumbnail'

const thumbnailUrl = ref(null)
const isMenuOpen = ref(false)
const dropdown = ref(null)

const props = defineProps({
  product: {
    type: Object,
    required: true
  }
})

onMounted(async () => {
  if (props.product.images && props.product.images.length > 0) {
    thumbnailUrl.value = await useFetchProductThumbnail(props.product.id)
  }
})

function toggleMenu () {
  isMenuOpen.value = !isMenuOpen.value
}

onClickOutside(dropdown, () => {
  isMenuOpen.value = false
})
</script>
