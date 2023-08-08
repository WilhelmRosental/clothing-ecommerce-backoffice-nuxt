<template>
  <div class="w-full">
    <!-- Modal -->
    <!-- <div v-if="saveLookModal" class="fixed w-full h-full z-40">
      <div
        :class="saveLookModal ? 'flex' : 'hidden'"
        class="sm:w-[385px] sm:min-w-[40vw] min-w-[80vw] min-h-[25vh] flex flex-col justify-between items-center gap-2 -translate-y-1/2 p-6 bg-gray-50 rounded-lg top-1/2 left-1/2 -translate-x-1/2 absolute shadow-lg"
      >
        <div class="h-12 w-full flex items-center justify-end">
          <button class="bg-indigo-200 hover:bg-indigo-300 py-2 px-2 rounded" @click="saveLookModal = false">
            <XMarkIcon class="h-5 w-5" />
          </button>
        </div>
        <div class="flex flex-col items-center">
          <span class="text-2xl font-medium">Envoyer un mail aux client</span>
          <p class="text-center">
            Voulez-vous envoyer un email aux clients pour les prévenir de la création du look ?
          </p>
        </div>
        <div class="flex flex-row w-full">
          <button
            class="p-3 bg-indigo-200 hover:bg-indigo-300 rounded-md w-1/2 text-black font-medium"
            @click="saveLook(true); saveLookModal = false;"
          >
            Oui
          </button>
          <button
            class="p-3 ml-1 bg-indigo-200 hover:bg-indigo-300 rounded-md w-1/2 text-black font-medium"
            @click="saveLook(); saveLookModal = false;"
          >
            Non
          </button>
        </div>
      </div>
    </div> -->

    <div class="flex flex-col h-screen">
      <UtilsSnackbar v-if="saveLookSnackbar" v-model:active="saveLookSnackbar">
        <p>Le look a été sauvegardé !</p>
      </UtilsSnackbar>

      <!-- Toolbar -->
      <LayoutToolbar title="Créateur de look">
        <div class="flex flex-row align-center h-full">
          <button class="mr-1 hover:bg-indigo-100 font-bold py-2 px-2 rounded" @click="wInterface.toggleFilters">
            <FunnelIcon v-if="!wInterface.filters" class="h-6 w-6 text-indigo-900" />
            <PlainFunnelIcon v-else class="h-6 w-6 text-indigo-900" />
          </button>

          <button
            class="rounded ml-2 bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-4"
            @click="saveLook"
          >
            Sauvegarder
          </button>
        </div>
      </LayoutToolbar>

      <!-- Infos Clients -->
      <LookCreationCustomersInfos
        v-model:finder="finder"
        :customers-list="customers"
        :removed-customers="customersToRemove"
      />

      <div class="flex flex-row flex-1 min-h-0">
        <!-- Produits -->
        <div v-show="!finder" ref="productList" class="grid sm:grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 overflow-y-scroll w-1/2 sm:w-7/12 p-2" @scroll="loadMore">
          <div
            v-for="product in products"
            :key="product.id"
            :draggable="true"
            class="h-card w-full rounded shadow-md"
            @dragstart="pickupElem($event, product);"
            @dragenter.prevent
            @dragend.prevent="dragEndClear();"
          >
            <ProductCard :product="product" />
          </div>
        </div>

        <!-- Menu d'ajout de clients -->
        <div
          v-show="finder"
          class="w-1/2 sm:w-7/12 px-3 overflow-y-hidden bg-white"
        >
          <LookCreationCustomerFinder v-model:finder="finder" v-model:customers="customers" />
        </div>
        <!-- Preview du look -->
        <div class="w-1/2 sm:w-5/12 flex flex-col">
          <LookCreationPreview
            v-model:lookdatas="lookdatas"
            :dragged-product="draggedProduct"
            @update:lookdatas="updateLookDatas"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, onBeforeMount } from 'vue'
import { FunnelIcon, XMarkIcon } from '@heroicons/vue/24/outline'
import { FunnelIcon as PlainFunnelIcon } from '@heroicons/vue/24/solid'
import { useScroll } from '@vueuse/core'
import useSaveLook from '../../composables/looks/useSaveLook'
import { useInterface } from '../../stores/interface'
import useFetchOneLook from '../../composables/looks/useFetchOneLook'
import useFetchPublicLookImage from '../../composables/looks/useFetchPublicLookImage'
import useFetchFilteredProducts from '../../composables/products/useFetchFilteredProducts'
const wInterface = useInterface()
const saveLookSnackbar = ref(false)
const saveLookModal = ref(false)
const productList = ref(null)

// Fetch si un il y a un id dans l'url
const route = useRoute()
// Customers
const finder = ref(false)
const customersToRemove = ref([])
const customers = ref([])
// Look
const lookdatas = ref({
  title: null,
  univers: null,
  designer: null,
  image: [],
  left_top: null,
  left_bottom: null,
  right_top: null,
  right_middle: null,
  right_bottom: null,
  is_public: false,
  published: false
})

onBeforeMount(async () => {
  // si il y a un id dans l'url
  if (route.query.id) {
    const lookToEdit = ref([])

    lookToEdit.value = await useFetchOneLook(route.query.id)

    if (lookToEdit.value[0]) {
      lookdatas.value = {
        title: lookToEdit.value[0].look.title || '',
        univers: lookToEdit.value[0].look.univers ? [lookToEdit.value[0].look.univers] : null,
        designer: lookToEdit.value[0].look.designer ? [lookToEdit.value[0].look.designer] : null,
        image: [],
        left_top: lookToEdit.value[0].look.left_top || null,
        left_bottom: lookToEdit.value[0].look.left_bottom || null,
        right_top: lookToEdit.value[0].look.right_top || null,
        right_middle: lookToEdit.value[0].look.right_middle || null,
        right_bottom: lookToEdit.value[0].look.right_bottom || null,
        is_public: lookToEdit.value[0].look.is_public || false,
        published: lookToEdit.value[0].look.published || false
      }

      if (lookToEdit.value[0].customer) {
        for (let i = 0; i < lookToEdit.value.length; i++) {
          customers.value.push(lookToEdit.value[i].customer)
        }
      }

      if (lookToEdit.value[0].look.thumbnail) {
        lookdatas.value = Object.assign(lookdatas.value, { image: [await useFetchPublicLookImage(route.query.id, true)] })
      }
    }
  }
})

// Fetch des produits avec prise en compte des filtres
const reactiveQuery = computed(() => route.query)

const { data: products, refresh } = useAsyncData('products', async () => {
  return await useFetchFilteredProducts({ from: 0, to: 49 })
})

watch(reactiveQuery, refresh)

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

const emit = defineEmits([
  'update:lookdatas'
])

async function updateLookDatas (updatedLookDatas) {
  await emit('update:lookdatas', updatedLookDatas)
}

// Sauvegarde du look
async function saveLook () {
  await useSaveLook(
    Object.assign(lookdatas.value, { thumbnail: lookdatas.value.image && lookdatas.value.image.length > 0 }),
    customers.value,
    customersToRemove.value,
    route.query.id
  )

  // if (sendMail) {
  //   try {
  //     const response = await fetch('/api/send-look-mail', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify({ users: [{ email: 'wilhelm.rosental@gmail.com' }] })
  //     })

  //     if (response.ok) {
  //       const data = await response.json()
  //       return true
  //     } else {
  //       return false
  //     }
  //   } catch (error) {
  //     console.error('Erreur lors de la requête', error)
  //     return false
  //   }
  // }

  saveLookSnackbar.value = true
}

// Drag & Drop
const draggedProduct = ref({})

/**
 * @brief méthode appelée pour envoyer au parent l'objet produit qui est dragged
 * @param {*} event
 * @param {*} product
 */
function pickupElem (event, product) {
  event.currentTarget.style.opacity = '0.5'

  const ghostCard = document.createElement('div')
  ghostCard.classList.add('dragging')

  event.dataTransfer.dropEffect = 'move'
  draggedProduct.value = product
}

function dragEndClear () {
  event.currentTarget.style.opacity = '1'
  draggedProduct.value = {}
}
</script>
