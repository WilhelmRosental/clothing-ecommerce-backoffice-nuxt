<template>
  <div class="flex flex-col">
    <LayoutToolbar v-if="customerEmail" :title="customerEmail" />

    <div class="h-72 bg-gray-50">
      <div class="flex flex-row flex-nowrap h-full items-center overflow-x-auto">
        <CustomersQuestionary :customer="customer" />
      </div>
    </div>

    <div class="flex-1 min-h-0 overflow-y-auto">
      <div class="grid sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-6 gap-4 flex-1 min-h-0 overflow-y-auto p-2">
        <div v-for="look in customerLooks" :key="look.id" class="h-look w-full rounded shadow-md">
          <LookCard :look="look.look" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import useFetchCustomerLooks from '../../composables/customers/useFetchCustomerLooks'
import useFetchOneCustomer from '../../composables/customers/useFetchOneCustomer'

const route = useRoute()
const customerEmail = route.params.email
const customer = ref()
const customerLooks = ref([])

onMounted(async () => {
  customer.value = await useFetchOneCustomer(customerEmail)
  customerLooks.value = await useFetchCustomerLooks(customerEmail)
})
</script>
