export default async function (type = 'all') {
  const supabase = useSupabaseClient()

  /**
  * @brief fetch tous les looks
  * @returns un array avec tous les looks
  */
  if (type === 'all') {
    try {
      const { data: allLooks } = await supabase.rpc('get_all_looks')
      return allLooks
    } catch (error) {
      console.log('Error : ', error)
    }
  }

  /**
  * @brief fetch les looks publiques
  * @returns un array de looks publiques
  */
  if (type === 'public') {
    try {
      const { data: publicLooks } = await supabase
        .from('looks')
        .select()
        .eq('is_public', true)
      return publicLooks
    } catch (error) {
      console.log('Error : ', error)
    }
  }

  /**
  * @brief fetch les looks qui ne sont pas attribués à des clients
  * @returns un array de looks non attribués
  */
  if (type === 'unused') {
    try {
      const { data: unusedLooks } = await supabase.rpc('get_unused_looks')

      return unusedLooks
    } catch (error) {
      console.log('Error : ', error)
    }
  }
}
