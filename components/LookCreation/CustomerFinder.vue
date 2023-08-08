<template>
  <div class="bg-white z-20 h-24">
    <div class="flex flex-row justify-between align-center mb-3 mt-1">
      <h2 class="text-gray-600 uppercase font-bold text-lg">
        Lier un client au look
      </h2>
      <button class="mr-1 bg-indigo-50 hover:bg-indigo-100 py-2 px-2 rounded" @click="emit('update:finder', false)">
        <XMarkIcon class="h-6 w-6" />
      </button>
    </div>
    <input
      v-model="searchInput"
      placeholder="Rechercher une adresse email"
      name="select"
      class="h-10 bg-white flex border border-gray-200 rounded items-center px-4 appearance-none outline-none text-gray-800 w-full mb-2"
    >
  </div>
  <div
    class="overflow-y-auto"
    :class="props.customers && props.customers.length > 0 ? 'h-[calc(100vh-22rem)]' : 'h-[calc(100vh-14rem)]'"
  >
    <table class="w-full table-auto">
      <thead>
        <tr class="sticky top-0 bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
          <th class="py-3 px-6 text-left">
            Client
          </th>
          <th class="sticky z-40 bg-gray-200 right-0 py-3 px-6 text-center">
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="text-gray-600 text-sm font-light overflow-y-hidden">
        <tr
          v-for="(customer, index) in filterBySearch"
          :key="index"
          class="border-b border-gray-200 hover:bg-gray-100"
        >
          <td class="py-3 px-6 text-left whitespace-nowrap">
            <div class="flex items-center">
              <span class="font-medium">{{ customer.profile.email }}</span>
            </div>
          </td>
          <td class="py-3 px-6 text-center">
            <button
              v-if="!props.customers.map( e => e.email).includes(customer.profile.email)"
              class="bg-indigo-50 hover:bg-indigo-100 text-black font-bold py-2 px-4"
              @click="updateLookCustomers(customer.profile.email)"
            >
              Ajouter
            </button>
            <div v-else>
              <p>Client déjà ajouté !</p>
            </div>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { onMounted, ref, computed } from 'vue'
import { XMarkIcon } from '@heroicons/vue/24/outline'
import _ from 'lodash'
import useFetchCustomers from '../../composables/Customers/useFetchCustomers'
import useFetchOneCustomer from '../../composables/Customers/useFetchOneCustomer'

const props = defineProps({
  customers: {
    type: Array,
    default: () => []
  },
  finder: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['update:finder', 'update:customers'])

const allCustomers = ref([])
onMounted(async () => {
  allCustomers.value = await useFetchCustomers()
})

const searchInput = ref('')

const filterBySearch = computed(() => {
  if (searchInput.value) {
    const filter = searchInput.value.toUpperCase()
    return _.filter(allCustomers.value, customer => customer.profile.email.toUpperCase().includes(filter))
  } else {
    return allCustomers.value
  }
})

const selectedCustomers = ref(props.customers)

const updateLookCustomers = async (userMail) => {
  const userToAdd = await useFetchOneCustomer(userMail)
  selectedCustomers.value.push(userToAdd)
  emit('update:customers', selectedCustomers)
}
</script>
