<template>
  <div class="p-4 h-full overflow-y-auto">
    <UtilsSnackbar v-if="snackbar" v-model:active="snackbar">
      <p>Le produit a été sauvegardé !</p>
    </UtilsSnackbar>

    <input
      id="username"
      v-model="productToEdit.title"
      class="focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
      type="text"
      placeholder="Titre du produit"
    >
    <textarea
      v-model="productToEdit.description"
      class="h-36 focus:ring-2 mb-4 focus:ring-indigo-900 focus:border-indigo-900 shadow focus:shadow-outline focus:outline-none py-2 px-3 text-gray-700 appearance-none border w-full resize rounded-md"
      type="text"
      placeholder="Description du produit"
    />
    <div
      class="flex flex-col lg:flex-row mb-4"
    >
      <!-- Selection Categorie -->
      <div class="w-full lg:w-1/2 lg:mb-0 mb-1 flex flex-row lg:mr-1">
        <div class="grid grid-cols-5 w-full gap-1">
          <button
            v-for="category in categories"
            :key="category"
            class="rounded p-2 text-center bg-gray-300 font-bold text-black"
            :class="category === selectCateg ? 'bg-indigo-900 text-white' : ''"
            @click="toggleCateg(category)"
          >
            {{ category }}
          </button>
        </div>
      </div>

      <!-- Selection Type -->
      <div class="w-full lg:w-1/2 flex flex-row lg:ml-1">
        <UtilsCombobox
          v-model:selected="productToEdit.type"
          :placeholder="selectCateg"
          :items="FormSelectionValues.categories[selectCateg]"
          :multiple="false"
          :new-entry="false"
        />
      </div>
    </div>

    <div class="grid lg:grid-cols-2 xl:grid-cols-3 gap-2 mb-4">
      <UtilsCombobox
        v-model:selected="productToEdit.condition"
        placeholder="Etat"
        :items="['NEUF','PARFAIT ETAT','BON ETAT']"
        :multiple="false"
        :new-entry="false"
      />

      <UtilsCombobox
        v-model:selected="productToEdit.brand"
        placeholder="Marque"
        :items="filtersValues.brands"
        :multiple="false"
        :new-entry="true"
      />

      <UtilsCombobox
        v-model:selected="productToEdit.provider"
        placeholder="Fournisseur"
        :items="filtersValues.providers"
        :multiple="false"
        :new-entry="true"
      />

      <UtilsCombobox
        v-model:selected="productToEdit.colors"
        placeholder="Couleur(s)"
        :items="FormSelectionValues.colors"
        :multiple="true"
        :new-entry="true"
      />

      <UtilsCombobox
        v-model:selected="productToEdit.materials"
        placeholder="Matière(s)"
        :items="FormSelectionValues.materials"
        :multiple="true"
        :new-entry="true"
      />

      <UtilsCombobox
        v-model:selected="productToEdit.details"
        placeholder="Détail(s)"
        :items="FormSelectionValues.details"
        :multiple="true"
        :new-entry="true"
      />

      <input
        v-if="selectCateg === 'Accessoires'"
        id="size"
        v-model="productToEdit.size"
        class="h-10 focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        type="text"
        placeholder="Taille"
      >
      <UtilsCombobox
        v-if="selectCateg === 'Chaussures'"
        v-model:selected="productToEdit.shoe_size"
        class="mb-2"
        placeholder="Pointure"
        :items="FormSelectionValues.sizes.shoes"
        :multiple="false"
        :new-entry="false"
      />
      <UtilsCombobox
        v-if="selectCateg === 'Haut' || selectCateg === 'Bas' || selectCateg === 'Ensemble'"
        v-model:selected="productToEdit.size"
        class="mb-2"
        placeholder="Taille"
        :items="FormSelectionValues.sizes.clothes"
        :multiple="false"
        :new-entry="false"
      />
    </div>
    <!-- Prix -->
    <div
      class="flex flex-col lg:flex-row"
    >
      <div class="w-full lg:w-1/2 lg:mb-0 mb-1 flex flex-row lg:mr-1">
        <input
          id="price"
          v-model="productToEdit.price"
          class="focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Prix"
        >
      </div>
      <div class="w-full lg:w-1/2 flex flex-row lg:ml-1">
        <input
          id="final_price"
          v-model="productToEdit.final_price"
          class="focus:ring-2 focus:ring-indigo-900 focus:border-indigo-900 mb-2 shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          type="text"
          placeholder="Prix Final"
        >
      </div>
    </div>

    <client-only>
      <UtilsUploadImages v-model:images="productToEdit.images" />
    </client-only>

    <div class="flex flex-row justify-end self-end">
      <button
        class="mt-6 p-2 text-center bg-indigo-900 font-bold hover:bg-indigo-950 text-white"
        @click="saveProduct"
      >
        Sauvegarder le produit
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, reactive } from 'vue'
import { useRoute } from 'vue-router'
import useFetchFiltersValues from '../../composables/useFetchFilterValues'
import useFetchOneProduct from '../../composables/Products/useFetchOneProduct'
import useFetchProductImages from '../../composables/products/useFetchProductImages'
import useSaveProduct from '../../composables/products/useSaveProduct'
import FormSelectionValues from '@/datas/FormSelectionValues.json'

const filtersValues = ref({
  brands: await useFetchFiltersValues('brand', 'brands'),
  providers: await useFetchFiltersValues('provider', 'providers')
})

const snackbar = ref(false)
const route = useRoute()
const selectCateg = ref(null)
const productToEdit = reactive({
  title: null,
  description: null,
  type: null,
  images: [],
  condition: null,
  brand: null,
  provider: null,
  colors: null,
  materials: null,
  details: null,
  price: 0,
  size: null,
  shoe_size: null,
  final_price: 0
})
const categories = Object.keys(FormSelectionValues.categories)

if (route.query.id) {
  Object.assign(productToEdit, await useFetchOneProduct(route.query.id))
  productToEdit.images = await useFetchProductImages(route.query.id, productToEdit.images, true)
  if (productToEdit.category) { selectCateg.value = productToEdit.category.toString() }
}

function toggleCateg (newCateg) {
  if (selectCateg.value === newCateg) {
    selectCateg.value = null
  } else {
    selectCateg.value = newCateg
    productToEdit.size = null
    productToEdit.shoe_size = null
  }
  productToEdit.type = null
}

const finalPrice = computed(() => {
  return parseFloat(productToEdit.price) + (parseFloat(productToEdit.price) * 0.18)
})

watch(() => productToEdit.price, () => {
  productToEdit.final_price = finalPrice.value
})

async function saveProduct () {
  await useSaveProduct({
    title: productToEdit.title,
    description: productToEdit.description,
    category: selectCateg.value,
    type: productToEdit.type ? productToEdit.type.toString() : null,
    images: productToEdit.images,
    condition: productToEdit.condition ? productToEdit.condition.toString() : null,
    brand: productToEdit.brand ? productToEdit.brand.toString() : null,
    provider: productToEdit.provider ? productToEdit.provider.toString() : null,
    colors: productToEdit.colors,
    materials: productToEdit.materials,
    details: productToEdit.details,
    price: productToEdit.price,
    final_price: productToEdit.final_price,
    size: productToEdit.size ? productToEdit.size.toString() : null,
    shoe_size: productToEdit.shoe_size ? productToEdit.shoe_size.toString() : null
  },
  route.query.id)

  snackbar.value = true
}
</script>
