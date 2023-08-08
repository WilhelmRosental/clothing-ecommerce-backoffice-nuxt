<template>
  <div
    class="relative h-full rounded-lg w-full border-2 border-dashed border-gray-300"
  >
    <div v-if="loaded && props.product" class="absolute rounded-lg flex items-center justify-center h-full w-full opacity-0 hover:opacity-100 bg-indigo-900 bg-opacity-40">
      <slot />
      <div class="text-sm">
        <template v-if="product.type">
          <p class="text-white font-semibold">
            {{ product.type }}
          </p>
        </template>
        <template v-if="product.size">
          <p class="text-white font-semibold">
            {{ product.size }}
          </p>
        </template>
        <template v-if="product.condition">
          <p class="text-white font-semibold">
            {{ product.condition }}
          </p>
        </template>
        <template v-if="product.provider">
          <p class="text-white font-semibold">
            {{ product.provider }}
          </p>
        </template>
        <template v-if="product.brand">
          <p class="text-white font-semibold">
            {{ product.brand }}
          </p>
        </template>
        <div v-if="product.colors">
          <template v-for="color in product.colors" :key="color">
            <span
              class="inline-block bg-indigo-900 rounded-full px-2 py-1 text-xs font-semibold text-white mr-1 mb-1"
            >
              {{ color }}
            </span>
          </template>
        </div>
        <div v-if="product.details || product.materials">
          <template v-for="detail in product.details" :key="detail">
            <span
              class="inline-block bg-indigo-900 rounded-full px-2 py-1 text-xs font-semibold text-white mr-1 mb-1"
            >
              {{ detail }}
            </span>
          </template>
          <template v-for="material in product.materials" :key="material">
            <span
              class="inline-block bg-indigo-900 rounded-full px-2 py-1 text-xs font-semibold text-white mr-1 mb-1"
            >
              {{ material }}
            </span>
          </template>
        </div>
        <div>
          <span
            class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1"
          >
            {{ product.price }} €
          </span>
          <span
            class="inline-block bg-gray-200 rounded-full px-2 py-1 text-xs font-semibold text-gray-700 mr-1 mb-1"
          >
            {{ Math.round(product.price * 1.18) }} €
          </span>
        </div>
      </div>
    </div>
    <img v-if="loaded && props.product" :src="getThumbnail" class="object-contain w-full h-full">
  </div>
</template>

<script setup>
import { watch, ref, onMounted } from 'vue'
import useFetchProductThumbnail from '../../composables/products/useFetchProductThumbnail'

const loaded = ref(false)

const props = defineProps({
  product: {
    type: Object,
    default: () => ({})
  }
})

const getThumbnail = ref(null)

onMounted(async () => {
  if (props.product) {
    if (props.product.images && props.product.images.length > 0) {
      getThumbnail.value = await useFetchProductThumbnail(props.product.id)
    } else {
      getThumbnail.value = null
    }
    loaded.value = true
  }
})

watch(() => props.product, async (newProduct) => {
  if (newProduct) {
    if (newProduct.images && newProduct.images.length > 0) {
      getThumbnail.value = await useFetchProductThumbnail(newProduct.id)
    } else {
      getThumbnail.value = null
    }
    loaded.value = true
  }
})
</script>
