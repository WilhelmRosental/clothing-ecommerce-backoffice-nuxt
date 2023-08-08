<template>
  <div class="flex flex-col h-screen">
    <!-- Toolbar -->
    <LayoutToolbar title="Clients" />

    <input
      v-model="searchInput"
      placeholder="Rechercher une adresse email"
      name="select"
      class="h-10 bg-white flex border border-gray-200 rounded items-center px-4 appearance-none outline-none text-gray-800 m-2"
    >

    <div class="flex-1 min-h-0 overflow-y-auto">
      <table class="w-full table-auto">
        <thead>
          <tr class="sticky top-0 bg-indigo-100 text-gray-600 uppercase text-sm leading-normal">
            <th
              :class="toggleDirection('email')"
              class="py-3 px-6 text-left cursor-pointer select-none"
              @click="sortBy('email')"
            >
              Email
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
                <span class="font-medium">
                  <NuxtLink class="hover:text-indigo-900" :to="`/user/${customer.email}`">
                    {{ customer.email }}
                  </NuxtLink>
                </span>
              </div>
            </td>
            <td class="py-3 px-6 text-center">
              <span class="font-medium">{{ customer.nb_looks }}</span>
            </td>
            <td class="py-3 px-6 text-center">
              <span v-if="customer.last_look_date !== 'Aucun'" class="font-medium">{{ dayjs(customer.last_look_date).fromNow() }}</span>
              <span v-else class="font-medium">Aucun</span>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import _ from 'lodash'
import { ref, onMounted, computed } from 'vue'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import useFetchCustomers from '../composables/customers/useFetchCustomers'
import 'dayjs/locale/fr'

// Configure Day.js pour utiliser la localisation française
dayjs.locale('fr')
dayjs.extend(relativeTime)

const allCustomers = ref([])
const displayedCustomers = ref([])
const searchInput = ref('')
const sortByColumn = ref('')
const sortDirection = ref('')

onMounted(async () => {
  allCustomers.value = await useFetchCustomers()

  displayedCustomers.value = allCustomers.value.map((obj) => {
    return {
      email: obj.profile.email,
      nb_looks: obj.nb_looks,
      last_look_date: obj.last_look_date ? obj.last_look_date : 'Aucun'
    }
  })
})

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
</script>
