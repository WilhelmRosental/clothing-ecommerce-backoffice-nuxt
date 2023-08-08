<template>
  <div class="flex flex-col h-screen">
    <!-- Toolbar -->
    <LayoutToolbar title="Looks">
      <div class="flex flex-row align-center h-full">
        <a href="looks/edit" class="rounded bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-2 px-4">
          Ajouter
        </a>
      </div>
    </LayoutToolbar>

    <div class="flex flex-row">
      <button
        class="font-bold py-2 px-4 w-1/4 text-xs md:text-sm xl:text-base"
        :class="currentTab === 0 ? 'text-white bg-indigo-900 hover:bg-indigo-950' : 'bg-slate-100 hover:bg-slate-200 text-black'"
        @click="currentTab = 0; preventFetchLooks('all')"
      >
        Tous les looks
      </button>
      <button
        class="font-bold py-2 px-4 w-1/4 text-xs md:text-sm xl:text-base"
        :class="currentTab === 1 ? 'text-white bg-indigo-900 hover:bg-indigo-950' : 'bg-slate-100 hover:bg-slate-200 text-black'"
        @click="currentTab = 1; preventFetchLooks('todo')"
      >
        Looks à faire
      </button>
      <button
        class="font-bold py-2 px-4 w-1/4 text-xs md:text-sm xl:text-base"
        :class="currentTab === 2 ? 'text-white bg-indigo-900 hover:bg-indigo-950' : 'bg-slate-100 hover:bg-slate-200 text-black'"
        @click="currentTab = 2; preventFetchLooks('unused')"
      >
        Looks non assignés
      </button>
      <button
        class="font-bold py-2 px-4 w-1/4 text-xs md:text-sm xl:text-base"
        :class="currentTab === 3 ? 'text-white bg-indigo-900 hover:bg-indigo-950' : 'bg-slate-100 hover:bg-slate-200 text-black'"
        @click="currentTab = 3; preventFetchLooks('public')"
      >
        Looks publiques
      </button>
    </div>

    <!-- All Looks -->
    <div
      v-if="currentTab === 0"
      class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 flex-1 min-h-0 overflow-y-auto p-2"
    >
      <div v-for="look in allLooks" :key="look.id" class="h-look w-full rounded shadow-md">
        <LookCard :look="look">
          <li>
            <button
              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
              @click="deleteLook(look.id)"
            >
              Supprimer
            </button>
          </li>
        </LookCard>
      </div>
    </div>

    <!-- Looks ToDo -->
    <input
      v-if="currentTab === 1"
      v-model="searchInput"
      placeholder="Rechercher une adresse email"
      name="select"
      class="h-10 bg-white flex border border-gray-200 rounded items-center px-4 appearance-none outline-none text-gray-800 m-2"
    >
    <div
      v-if="currentTab === 1"
      class="flex-1 min-h-0 overflow-y-auto"
    >
      <table class="w-full table-auto">
        <thead>
          <tr class="sticky top-0 bg-indigo-100 text-gray-600 uppercase text-sm leading-normal">
            <th
              :class="toggleDirection('email')"
              class="py-3 px-6 text-left cursor-pointer select-none"
              @click="sortBy('email')"
            >
              Client
            </th>
            <th
              :class="toggleDirection('nb_looks')"
              class="cursor-pointer select-none"
              @click="sortBy('nb_looks')"
            >
              Nb de looks
            </th>
            <th
              :class="toggleDirection('last_look_date')"
              class="cursor-pointer select-none"
              @click="sortBy('last_look_date')"
            >
              Dernier look
            </th>
            <th class="sticky z-40 bg-indigo-200 right-0 py-3 px-6 text-center">
              Actions
            </th>
          </tr>
        </thead>
        <tbody class="text-gray-600 text-sm font-light overflow-y-hidden">
          <tr
            v-for="(customer, index) in sortedItems"
            :key="index"
            class="border-b border-gray-200 hover:bg-gray-100"
          >
            <td class="py-3 px-6 text-left whitespace-nowrap">
              <div class="flex items-center">
                <span class="font-medium">{{ customer.email }}</span>
              </div>
            </td>
            <td class="py-3 px-6 text-center">
              <span class="font-medium">{{ customer.nb_looks }}</span>
            </td>
            <td class="py-3 px-6 text-center">
              <span v-if="customer.last_look_date !== 'Aucun'" class="font-medium">{{ dayjs(customer.last_look_date).fromNow() }}</span>
              <span v-else class="font-medium">Aucun</span>
            </td>
            <td class="py-3 px-6 text-center">
              <button
                class="bg-indigo-50 hover:bg-indigo-100 text-black font-bold py-2 px-4"
                @click="createLook(customer.email)"
              >
                Créer un look
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- Unused Looks -->
    <div
      v-if="currentTab === 2"
      class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 flex-1 min-h-0 overflow-y-auto p-2"
    >
      <div v-for="look in unusedLooks" :key="look.id" class="h-look w-full rounded shadow-md">
        <LookCard :look="look">
          <li>
            <button
              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
              @click="deleteLook(look.id)"
            >
              Supprimer
            </button>
          </li>
        </LookCard>
      </div>
    </div>

    <!-- Public Looks -->
    <div
      v-if="currentTab === 3"
      class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 flex-1 min-h-0 overflow-y-auto p-2"
    >
      <div v-for="look in publicLooks" :key="look.id" class="h-look w-full rounded shadow-md">
        <LookCard :look="look">
          <li>
            <button
              class="text-sm hover:bg-gray-100 text-gray-700 block px-4 py-2"
              @click="deleteLook(look.id)"
            >
              Supprimer
            </button>
          </li>
        </LookCard>
      </div>
    </div>

    <UtilsSnackbar v-if="snackbar" v-model:active="snackbar">
      <p>Look supprimé avec succès !</p>
    </UtilsSnackbar>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useFetchCustomers from '../../composables/customers/useFetchCustomers'
import useFetchLooks from '../../composables/looks/useFetchLooks'
import useDeleteLook from '../../composables/looks/useDeleteLook'
import useCreateLookForCustomer from '../../composables/looks/useCreateLookForCustomer'
import 'dayjs/locale/fr'

// Configure Day.js pour utiliser la localisation française
dayjs.locale('fr')
dayjs.extend(relativeTime)

const currentTab = ref(0)

const allLooks = ref([])
const allCustomers = ref([])
const displayedCustomers = ref([])
const unusedLooks = ref([])
const publicLooks = ref([])
const snackbar = ref(false)

onMounted(async () => {
  allLooks.value = await useFetchLooks('all')
})

async function deleteLook (lookId) {
  await useDeleteLook(lookId)
  _.remove(allLooks.value, obj => obj.id === lookId)
  _.remove(unusedLooks.value, obj => obj.id === lookId)
  _.remove(publicLooks.value, obj => obj.id === lookId)
  snackbar.value = true
}

async function preventFetchLooks (type) {
  if (type === 'all' && allLooks.value && allLooks.value.length) {
    allLooks.value = await useFetchLooks(type)
  }
  if (type === 'todo' && allCustomers.value && allCustomers.value.length === 0) {
    allCustomers.value = await useFetchCustomers()

    displayedCustomers.value = allCustomers.value.map((obj) => {
      return {
        email: obj.profile.email,
        nb_looks: obj.nb_looks,
        last_look_date: obj.last_look_date ? obj.last_look_date : 'Aucun'
      }
    })
  }
  if (type === 'unused' && unusedLooks.value && unusedLooks.value.length === 0) {
    unusedLooks.value = await useFetchLooks(type)
  }
  if (type === 'public' && publicLooks.value && publicLooks.value.length === 0) {
    publicLooks.value = await useFetchLooks(type)
  }
}

// Fonctions pour les looks à faire
const sortByColumn = ref('')
const sortDirection = ref('')
const searchInput = ref('')

const filterBySearch = computed(() => {
  if (searchInput.value) {
    const filter = searchInput.value.toUpperCase()
    return _.filter(displayedCustomers.value, customer => customer.email.toUpperCase().includes(filter))
  } else {
    return displayedCustomers.value
  }
})

const sortedItems = computed(() => {
  const sorted = [...filterBySearch.value]

  if (sortByColumn.value) {
    sorted.sort((a, b) => {
      const aValue = a[sortByColumn.value]
      const bValue = b[sortByColumn.value]

      if (aValue < bValue) { return sortDirection.value === 'asc' ? -1 : 1 }
      if (aValue > bValue) { return sortDirection.value === 'asc' ? 1 : -1 }
      return 0
    })
  }

  return sorted
})

function sortBy (column) {
  if (sortByColumn.value === column) {
    sortDirection.value = sortDirection.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortByColumn.value = column
    sortDirection.value = 'asc'
  }
}

function toggleDirection (column) {
  if (sortByColumn.value === column) {
    return sortDirection.value === 'asc' ? 'text-indigo-600' : 'text-indigo-600 transform'
  }
  return ''
}

async function createLook (email) {
  const router = useRouter()
  const lookId = await useCreateLookForCustomer(email)
  await router.push({ path: 'looks/edit', query: { id: lookId } })
}
</script>
