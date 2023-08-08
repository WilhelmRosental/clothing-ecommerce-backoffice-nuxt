<template>
  <div>
    <p>Nombre de looks: {{ nbLooks }}</p>
    <p>Nombre de produits: {{ nbProducts }}</p>
    <p>Nombre de profils: {{ nbProfiles }}</p>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
const supabase = useSupabaseClient()

const nbLooks = ref()
const nbProducts = ref()
const nbProfiles = ref()

onMounted(() => {
  try {
    supabase
      .from('looks')
      .select('count', { count: 'exact' })
      .then(({ data }) => {
        nbLooks.value = data[0].count
      })
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de looks:', error.message)
  }

  try {
    supabase
      .from('products')
      .select('count', { count: 'exact' })
      .then(({ data }) => {
        nbProducts.value = data[0].count
      })
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de looks:', error.message)
  }

  try {
    supabase
      .from('profiles')
      .select('count', { count: 'exact' })
      .then(({ data }) => {
        nbProfiles.value = data[0].count
      })
  } catch (error) {
    console.error('Erreur lors de la récupération du nombre de looks:', error.message)
  }
})
</script>
