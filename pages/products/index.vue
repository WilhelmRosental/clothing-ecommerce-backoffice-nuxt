<template>
  <div class="flex flex-col h-full">
    <ProductsFiltersDrawer />

    <!-- Toolbar -->
    <LayoutToolbar title="Produits">
      <div class="flex flex-row align-center h-full">
        <button class="mr-1 hover:bg-gray-100 font-bold py-2 px-2 rounded" @click="wInterface.toggleFilters">
          <FunnelIcon v-if="!wInterface.filters" class="h-6 w-6 text-indigo-900" />
          <PlainFunnelIcon v-else class="h-6 w-6 text-indigo-900" />
        </button>
        <a href="products/edit" class="rounded bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-4">
          Ajouter
        </a>
      </div>
    </LayoutToolbar>

    <div
      v-if="products.length === 0"
      class="flex flex-col items-center justify-center flex-1 min-h-0"
    >
      <NoSymbolIcon class="h-12 w-12 text-indigo-900" />
      <h2 class="text-lg font-semibold text-indigo-900">
        Aucun produit n'a été trouvé
      </h2>
    </div>
    <div
      v-else
      ref="productList"
      class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 overflow-y-scroll flex-1 min-h-0 p-2"
      @scroll="loadMore"
    >
      <div v-for="product in products" :key="product.id" class="h-card w-full rounded shadow-md">
        <ProductCard :product="product">
          <li>
            <button
              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
              @click="deleteProduct(product)"
            >
              Supprimer
            </button>
          </li>
        </ProductCard>
      </div>
    </div>

    <UtilsSnackbar v-if="snackbar" v-model:active="snackbar">
      <p>Produit supprimé avec succès !</p>
    </UtilsSnackbar>
  </div>
</template>

<script setup>
import { ref, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useScroll } from '@vueuse/core'
import { FunnelIcon, NoSymbolIcon } from '@heroicons/vue/24/outline'
import { FunnelIcon as PlainFunnelIcon } from '@heroicons/vue/24/solid'
import { useInterface } from '../../stores/interface'
import useDeleteOneProduct from '../../composables/products/useDeleteOneProduct'
import useFetchFilteredProducts from '../../composables/products/useFetchFilteredProducts'

const wInterface = useInterface()
const productList = ref(null)
const snackbar = ref(false)

const route = useRoute()
const reactiveQuery = computed(() => route.query)

const { data: products, refresh } = useAsyncData('products', async () => {
  return await useFetchFilteredProducts({ from: 0, to: 49 })
})
watch(reactiveQuery, refresh)

async function deleteProduct (product) {
  await useDeleteOneProduct(product)
  refresh()
  snackbar.value = true
}

const loadMore = async () => {
  const containerEl = productList.value
  const isAtEnd = containerEl.scrollHeight - containerEl.scrollTop === containerEl.clientHeight
  if (!isAtEnd) { return }

  try {
    const loadedProducts = await useFetchFilteredProducts({ from: products.value.length, to: products.value.length + 99 })
    products.value.push(...loadedProducts)
  } catch (e) {
    console.log('Error : ', e)
  }
}

useScroll(productList, loadMore)
</script>
