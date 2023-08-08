<template>
  <div
    class="fixed navbar top-0 md:left-16 z-20 w-full xl:w-1/3 bg-white flex-grow-1"
    :class="wInterface.filters ? 'navbar-open shadow-lg' : 'navbar-close'"
  >
    <div class="px-6 py-4 h-screen flex flex-col w-full">
      <div class="h-10 flex flex-row justify-between items-center">
        <h2 class="text-lg font-semibold">
          Filtres
        </h2>
        <div class="flex flex-row items-center">
          <button
            class="bg-indigo-50 hover:bg-indigo-100 py-2 px-2 rounded mr-1"
            @click="resetFilters"
          >
            Réinitialiser
          </button>
          <button class="bg-indigo-200 hover:bg-indigo-300 py-2 px-2 rounded" @click="wInterface.toggleFilters">
            <XMarkIcon class="h-6 w-6" />
          </button>
        </div>
      </div>
      <slot />
      <div class="grid mx-auto mt-6 flex-1 min-h-0 w-full">
        <div class="overflow-y-auto">
          <!-- Catégorie du produit -->
          <div class="grid grid-cols-5 w-full mb-2 gap-1">
            <button
              v-for="category in categories"
              :key="category"
              class="rounded py-2 text-center bg-gray-300 font-bold text-black"
              :class="category === selectCateg ? 'bg-indigo-900 text-white' : ''"
              @click="toggleCateg(category)"
            >
              {{ category }}
            </button>
          </div>

          <!-- Type de produit -->
          <FiltersAccordion
            ref="typesFilters"
            v-model:selected="filters.types"
            :label="selectCateg"
            :items="FormSelectionValues.categories[selectCateg]"
            :select-all="true"
            @update:selected="updateRoute($event, 'types')"
          />

          <FiltersAccordion
            ref="brandsFilters"
            v-model:selected="filters.brands"
            label="Marque"
            :items="filtersValues.brands"
            @update:selected="updateRoute($event, 'brands')"
          />

          <FiltersAccordion
            ref="colorsFilters"
            v-model:selected="filters.colors"
            label="Couleurs"
            :items="FormSelectionValues.colors"
            @update:selected="updateRoute($event, 'colors')"
          />

          <FiltersAccordion
            ref="materialsFilters"
            v-model:selected="filters.materials"
            label="Matières"
            :items="FormSelectionValues.materials"
            @update:selected="updateRoute($event, 'materials')"
          />

          <FiltersAccordion
            ref="detailsFilters"
            v-model:selected="filters.details"
            label="Détails"
            :items="FormSelectionValues.details"
            @update:selected="updateRoute($event, 'details')"
          />

          <FiltersAccordion
            ref="sizesFilters"
            v-model:selected="filters.sizes"
            label="Tailles"
            :items="FormSelectionValues.sizes.clothes"
            @update:selected="updateRoute($event, 'sizes')"
          />

          <FiltersAccordion
            ref="shoeSizesFilters"
            v-model:selected="filters.shoesizes"
            label="Pointures"
            :items="FormSelectionValues.sizes.shoes"
            @update:selected="updateRoute($event, 'shoesizes')"
          />

          <FiltersAccordionPrices
            ref="pricesFilters"
            v-model:minprice="filters.minprice"
            v-model:maxprice="filters.maxprice"
            label="Prix"
            @update:minprice="updateRoute($event, 'minprice')"
            @update:maxprice="updateRoute($event, 'maxprice')"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { reactive, watch, computed, ref } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import useFetchFiltersValues from '../composables/useFetchFilterValues'
import { useInterface } from '../stores/interface'
import FormSelectionValues from '@/datas/FormSelectionValues.json'
const wInterface = useInterface()

const categories = Object.keys(FormSelectionValues.categories)

const route = useRoute()
const router = useRouter()
const reactiveQuery = computed(() => route.query)

const selectCateg = ref('Haut')
const typesFilters = ref()
const brandsFilters = ref()
const colorsFilters = ref()
const materialsFilters = ref()
const detailsFilters = ref()
const sizesFilters = ref()
const shoeSizesFilters = ref()
const pricesFilters = ref()

function toggleCateg (newCategory) {
  selectCateg.value = newCategory
}

function formatFilter (filterName) {
  if (route.query[filterName]) {
    return Array.isArray(route.query[filterName]) ? route.query[filterName] : [route.query[filterName]]
  } else {
    return []
  }
}

function setFilters () {
  return {
    types: formatFilter('types'),
    brands: formatFilter('brands'),
    colors: formatFilter('colors'),
    materials: formatFilter('materials'),
    details: formatFilter('details'),
    sizes: formatFilter('sizes'),
    shoesizes: formatFilter('shoesizes'),
    minprice: route.query.minprice,
    maxprice: route.query.maxprice
  }
}

const filters = reactive(setFilters())

watch(reactiveQuery, () => { Object.assign(filters, setFilters()) })

const filtersValues = ref({
  brands: await useFetchFiltersValues('brand', 'brands')
})

const emit = defineEmits([
  'update:isopen',
  'update:types',
  'update:brands',
  'update:colors',
  'update:materials',
  'update:details',
  'update:sizes',
  'update:shoessizes',
  'update:minprice',
  'update:maxprice'
])

async function resetFilters () {
  if (route.query.types) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { types: [] }) })
    typesFilters.value.resetSelected()
  }
  if (route.query.brands) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { brands: [] }) })
    brandsFilters.value.resetSelected()
  }
  if (route.query.colors) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { colors: [] }) })
    colorsFilters.value.resetSelected()
  }
  if (route.query.materials) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { materials: [] }) })
    materialsFilters.value.resetSelected()
  }
  if (route.query.details) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { details: [] }) })
    detailsFilters.value.resetSelected()
  }
  if (route.query.sizes) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { sizes: [] }) })
    sizesFilters.value.resetSelected()
  }
  if (route.query.shoesizes) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { shoesizes: [] }) })
    shoeSizesFilters.value.resetSelected()
  }
  if (route.query.minprice || route.query.maxprice) {
    pricesFilters.value.resetPrices()
  }
  if (route.query.minprice) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { minprice: [] }) })
  }
  if (route.query.maxprice) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { maxprice: [] }) })
  }
}

async function updateRoute ($event, filterName) {
  await emit('update:' + filterName, $event)

  if (route.query) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, { [filterName]: filters[filterName] }) })
  }
}
</script>

<style scoped>
.navbar {
  transition: all 280ms ease-out;
}

.navbar-open {
  transform: translateX(0%);
}
.navbar-close {
  transform: translateX(-100%);
}
</style>
