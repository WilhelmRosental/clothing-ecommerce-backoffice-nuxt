<template>
  <div v-if="props.customer" class="flex flex-nowrap">
    <div class="mx-4">
      <div v-if="props.customer.silhouette" class="flex flex-row flex-nowrap mb-1">
        <p>Silhouette : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ props.customer.silhouette }}
        </div>
      </div>

      <div v-if="props.customer.age" class="flex flex-row flex-nowrap mb-1">
        <p>Âge : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ props.customer.age }}
        </div>
      </div>

      <div v-if="props.customer.lookingFor" class="flex flex-row flex-nowrap mb-1">
        <p>Recherche : </p><div v-for="item in props.customer.lookingFor" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>

      <div v-if="props.customer.height" class="flex flex-row flex-nowrap mb-1">
        <p>Taille : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ props.customer.height }}
        </div>
      </div>

      <div v-if="props.customer.color" class="flex flex-row flex-nowrap mb-1">
        <p>Couleur : </p><div>{{ props.customer.color }}</div>
      </div>

      <div v-if="props.customer.completeBudget" class="flex flex-row flex-nowrap">
        <p>Budget complet : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-green-200 text-green-950 rounded-full py-1 ml-1">
          {{ props.customer.completeBudget + '€' }}
        </div>
      </div>
    </div>

    <div class="mx-4">
      <div v-if="props.customer.preferedBrands" class="flex flex-row flex-nowrap mb-1">
        <p>Marques préférées : </p><div v-for="item in props.customer.preferedBrands" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-sky-200 text-sky-950 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>

      <div v-if="props.customer.season" class="flex flex-row flex-nowrap mb-1">
        <p>Saison : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ props.customer.season }}
        </div>
      </div>

      <div v-if="props.customer.occasion" class="flex flex-row flex-nowrap mb-1">
        <p>Occasion : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ props.customer.occasion }}
        </div>
      </div>

      <div v-if="props.customer.styles" class="flex flex-row flex-nowrap mb-1">
        <p>Styles : </p><div v-for="item in props.customer.styles" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-indigo-100 text-gray-800 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>

      <div v-if="props.customer.notColors" class="flex flex-row flex-nowrap mb-1">
        <p>Couleurs exclues : </p><div v-for="item in props.customer.notColors" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-rose-50 text-rose-950 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>

      <div v-if="props.customer.notMaterials" class="flex flex-row flex-nowrap mb-1">
        <p>Matières exclues : </p><div v-for="item in props.customer.notMaterials" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-rose-200 text-rose-950 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>

      <div v-if="props.customer.notImprimes" class="flex flex-row flex-nowrap">
        <p>Imprimés exclues : </p><div v-for="item in props.customer.notImprimes" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-rose-200 text-rose-950 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>
    </div>

    <div class="mx-4">
      <div v-if="props.customer.topSize" class="flex flex-row flex-nowrap mb-1">
        <p>Taille haut : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-violet-200 text-violet-950 rounded-full py-1 ml-1">
          {{ props.customer.topSize }}
        </div>
      </div>

      <div v-if="props.customer.bottomSize" class="flex flex-row flex-nowrap mb-1">
        <p>Taille bas : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-violet-200 text-violet-950 rounded-full py-1 ml-1">
          {{ props.customer.bottomSize }}
        </div>
      </div>

      <div v-if="props.customer.shoeSize" class="flex flex-row flex-nowrap mb-1">
        <p>Pointure : </p><div class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-violet-200 text-violet-950 rounded-full py-1 ml-1">
          {{ props.customer.shoeSize }}
        </div>
      </div>

      <div v-if="props.customer.heelHeight" class="flex flex-row flex-nowrap">
        <p>Hauteurs de talons : </p><div v-for="item in props.customer.heelHeight" :key="item" class="flex flex-row flex-nowrap justify-between text-xs px-3 bg-violet-200 text-violet-950 rounded-full py-1 ml-1">
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  customer: {
    type: Object,
    default: null
  }
})
</script>
