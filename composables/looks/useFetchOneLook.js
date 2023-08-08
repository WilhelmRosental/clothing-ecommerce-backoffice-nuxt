/**
 * @brief méthode pour fetch un look unique par son id
 * @returns look
 */
export default async function fetchLookById (id) {
  const supabase = useSupabaseClient()

  // Récupérer le look avec les informations du client associé (customer)
  const { data: look, error } = await supabase
    .from('looks_profiles')
    .select(`
      customer: customer_email(*),
      look: look_id(
        id,
        created_at,
        title,
        thumbnail,
        univers,
        designer,
        left_top(*),
        left_bottom(*),
        right_top(*),
        right_middle(*),
        right_bottom(*),
        is_public,
        published
      )
    `)
    .eq('look_id', id)

  // Si le look n'est pas trouvé avec le client associé, récupérer le look seul
  if (look.length < 1) {
    try {
      const { data: lookItems, error } = await supabase
        .from('looks')
        .select(`
          id,
          created_at,
          title,
          thumbnail,
          univers,
          designer,
          left_top(*),
          left_bottom(*),
          right_top(*),
          right_middle(*),
          right_bottom(*),
          is_public,
          published
        `)
        .eq('id', id)

      if (error) {
        console.log('Error fetching look: ', error)
        return null
      }

      return [{ look: lookItems[0], customer: null }]
    } catch (error) {
      console.log('Error fetching look: ', error)
      return null
    }
  }

  if (error) {
    console.log('Error fetching look: ', error)
    return null
  }

  return look
}
