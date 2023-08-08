<template>
  <div class="sticky p-1 top-0 bg-slate-200 h-12 flex flex-row justify-between items-center">
    <div class="flex items-center">
      <!-- <img class="w-8 h-8" src="@/assets/icons/t-shirt.svg"> -->
      <h2 v-if="props.title" class="ml-1 font-bold">
        {{ props.title }}
      </h2>
    </div>

    <img class="w-12 h-12 sm:hidden justify-self-center" src="@/assets/logos/ICON_WILOOK.png">

    <slot />
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: null
  }
})
</script>
