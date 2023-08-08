/**
 * @brief méthode pour fetch les looks associés à un utilisateur
 * @returns customerLooks
 */
export default async function (email) {
  const supabase = useSupabaseClient()

  try {
    const { data: customerLooks } = await supabase
      .from('looks_profiles')
      .select(`
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
      .eq('customer_email', email)

    return customerLooks
  } catch (error) {
    console.log('Error: ', error)
  }
}
