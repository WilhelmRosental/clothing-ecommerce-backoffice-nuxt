<template>
  <div
    class="bg-white shadow-sm flex flex-col"
    :class="selectedCustomers.length > 0 ? 'h-72' : 'h-20'"
  >
    <client-only>
      <ProductsFiltersDrawer>
        <div v-if="selectedCustomers && selectedCustomers.length">
          <div v-if="selectedCustomers[currentCustomerTab]" class="flex flex-col justify-center items-center">
            {{ 'Filtres pour ' + selectedCustomers[currentCustomerTab].email }}
            <button
              class="rounded py-2 w-56 mt-1 text-center bg-indigo-900 hover:bg-indigo-950 text-white font-bold"
              @click="applyCustomerFilters('manteau', currentCustomerTab)"
            >
              Filtres Manteau
            </button>
            <button
              class="rounded py-2 w-56 mt-1 text-center bg-indigo-900 hover:bg-indigo-950 text-white font-bold"
              @click="applyCustomerFilters('haut', currentCustomerTab)"
            >
              Filtres Haut
            </button>
            <button
              class="rounded py-2 w-56 mt-1 text-center bg-indigo-900 hover:bg-indigo-950 text-white font-bold"
              @click="applyCustomerFilters('bas', currentCustomerTab)"
            >
              Filtres Bas
            </button>
            <button
              class="rounded py-2 w-56 mt-1 text-center bg-indigo-900 hover:bg-indigo-950 text-white font-bold"
              @click="applyCustomerFilters('accessoire', currentCustomerTab)"
            >
              Filtres Accessoire
            </button>
            <button
              class="rounded py-2 w-56 mt-1 text-center bg-indigo-900 hover:bg-indigo-950 text-white font-bold"
              @click="applyCustomerFilters('chaussures', currentCustomerTab)"
            >
              Filtres Chaussures
            </button>
          </div>
        </div>
      </ProductsFiltersDrawer>
    </client-only>

    <!-- On affiche les onglets de switch de clients -->
    <div
      v-if="selectedCustomers && selectedCustomers.length > 0"
    >
      <div class="flex flex-row">
        <button
          v-for="(customer, index) in selectedCustomers"
          :key="index"
          class="flex items-center py-1 px-4 text-xs h-7 border-b-2"
          :class="currentCustomerTab === index ? 'border-indigo-900 bg-gray-200' : 'bg-gray-100'"
          @click="currentCustomerTab = index"
        >
          {{ customer.email }}
          <XCircleMini class="h-4 w-4 ml-2 text-indigo-900" @click="removeCustomer(customer,index)" />
        </button>
        <button class="flex justify-center items-center h-7 w-7 bg-gray-100 hover:bg-gray-200 text-white font-bold" @click="emit('update:finder', true)">
          <PlusIcon class="h-4 w-4 text-indigo-900" />
        </button>
      </div>
    </div>

    <!-- S'il n'y a pas de client associé, on affiche le bouton pour ajouter un client -->
    <div v-else class="flex flex-row justify-center items-center">
      <div class="flex flex-col">
        <p>Aucun client associé à ce look</p>
        <button href="#" class="bg-indigo-900 hover:bg-indigo-950 text-white font-bold py-1 px-4" @click="emit('update:finder', true)">
          Ajouter un client
        </button>
      </div>
    </div>

    <!-- On affiche les infos du client sélectionné -->
    <div v-if="selectedCustomers && selectedCustomers.length > 0" class="flex flex-row flex-nowrap flex-1 min-h-0 items-center overflow-x-auto">
      <CustomersQuestionary :customer="selectedCustomers[currentCustomerTab]" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'
import { XCircleIcon as XCircleMini } from '@heroicons/vue/20/solid'
import { PlusIcon } from '@heroicons/vue/24/solid'

const props = defineProps({
  filtersDrawer: {
    type: Boolean,
    default: false
  },
  customersList: {
    type: Array,
    default () { return [] }
  },
  removedCustomers: {
    type: Array,
    default () { return [] }
  },
  isExpanded: {
    type: Boolean,
    default: true
  },
  finder: {
    type: Boolean,
    default: false
  }
})

const route = useRoute()
const router = useRouter()
const currentCustomerTab = ref(0)
const customersToRemove = ref(props.removedCustomers)
const selectedCustomers = ref(props.customersList)

// Mise à jour réactive de selectedCustomers lorsque customersList change
watch(props.customersList, (newCustomersList) => {
  selectedCustomers.value = newCustomersList
})

const emit = defineEmits(['update:customersList', 'update:removedCustomers', 'update:finder'])

async function removeCustomer (customer, index) {
  if (currentCustomerTab.value === index && selectedCustomers.value.length > 1) {
    currentCustomerTab.value = currentCustomerTab.value - 1
  } else {
    currentCustomerTab.value = 0
  }
  await customersToRemove.value.push(customer)
  await selectedCustomers.value.splice(index, 1)
  emit('update:removedCustomers', customersToRemove)
  emit('update:customersList', selectedCustomers)
}

async function applyCustomerFilters (type, customerIndex) {
  const brands = props.customersList[customerIndex].preferedBrands
  let filters = {}

  if (type === 'manteau') {
    filters = {
      brands,
      types: ['Manteau'],
      sizes: [
        props.customersList[customerIndex].topSize - 1,
        props.customersList[customerIndex].topSize - 0.5,
        props.customersList[customerIndex].topSize,
        props.customersList[customerIndex].topSize + 0.5,
        props.customersList[customerIndex].topSize + 1
      ],
      maxprice: props.customersList[customerIndex].coatBudget
    }
  }
  if (type === 'haut') {
    filters = {
      brands,
      types: ['Veste', 'Sweat', 'Top', 'Blouse/Chemise', 'Blouson', 'Pull/Maille', 'Tailleur', 'Cardigan'],
      sizes: [
        props.customersList[customerIndex].topSize - 1,
        props.customersList[customerIndex].topSize - 0.5,
        props.customersList[customerIndex].topSize,
        props.customersList[customerIndex].topSize + 0.5,
        props.customersList[customerIndex].topSize + 1
      ],
      maxprice: props.customersList[customerIndex].topBudget
    }
  }
  if (type === 'bas') {
    filters = {
      brands,
      types: ['Jean', 'Jupe', 'Short', 'Pantalon'],
      sizes: [
        props.customersList[customerIndex].bottomSize - 1,
        props.customersList[customerIndex].bottomSize - 0.5,
        props.customersList[customerIndex].bottomSize,
        props.customersList[customerIndex].bottomSize + 0.5,
        props.customersList[customerIndex].bottomSize + 1
      ],
      maxprice: props.customersList[customerIndex].bottomBudget
    }
  }
  if (type === 'accessoire') {
    filters = {
      brands,
      types: ['Cabas', 'Ceinture', 'Panier', 'Pochette', 'Foulard', 'Valise', 'Sac banane', 'Sac de voyage', 'Sac à main', 'Bijoux', 'Serre-Tête', 'Barette', 'Chapeau/Bonnet/Gants', 'Lunettes', 'Maroquinerie'],
      maxprice: props.customersList[customerIndex].bagBudget
    }
  }
  if (type === 'chaussures') {
    filters = {
      brands,
      types: ['Bottes', 'Boots', 'Escarpin', 'Espadrille', 'Ballerine', 'Basket', 'Tong', 'Sabot', 'Sandale', 'Chaussettes', 'Mocassin'],
      sizes: [
        props.customersList[customerIndex].shoesSize - 1,
        props.customersList[customerIndex].shoesSize - 0.5,
        props.customersList[customerIndex].shoesSize,
        props.customersList[customerIndex].shoesSize + 0.5,
        props.customersList[customerIndex].shoesSize + 1
      ],
      maxprice: props.customersList[customerIndex].shoesBudget
    }
  }

  if (route.query) {
    await router.push({ path: route.path, query: Object.assign({}, route.query, filters) })
  }
}
</script>
