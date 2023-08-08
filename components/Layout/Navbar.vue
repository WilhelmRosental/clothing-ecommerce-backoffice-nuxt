<template>
  <div class="hidden sticky shadow-lg top-0 sm:flex flex-col items-center w-16 h-screen overflow-hidden text-gray-700 bg-gray-100 z-40">
    <NuxtLink to="/">
      <img src="@/assets/logos/ICON_WILOOK.png">
    </NuxtLink>
    <div class="flex flex-col items-center mt-3 border-t border-gray-300">
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-indigo-100" href="/looks">
        <RectangleGroupIcon class="h-6 w-6 text-indigo-900" />
      </a>
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-indigo-100" href="/products">
        <TagIcon class="h-6 w-6 text-indigo-900" />
      </a>
      <a class="flex items-center justify-center w-12 h-12 mt-2 rounded hover:bg-indigo-100" href="/users">
        <UsersIcon class="h-6 w-6 text-indigo-900" />
      </a>
    </div>
    <a class="flex items-center justify-center w-full h-16 mt-auto bg-gray-200 hover:bg-gray-300" href="#">
      <ArrowLeftOnRectangleIcon class="h-6 w-6 text-indigo-900" />
    </a>
  </div>
</template>

<script setup>
import { UsersIcon, ArrowLeftOnRectangleIcon, RectangleGroupIcon, TagIcon } from '@heroicons/vue/24/outline'
</script>
