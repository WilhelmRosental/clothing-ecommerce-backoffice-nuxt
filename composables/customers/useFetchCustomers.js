/**
 * @brief Fetches all customer profiles
 * @returns customers
 */
export default async function fetchAllCustomers () {
  try {
    const supabase = useSupabaseClient()

    const { data: customers } = await supabase.rpc('get_nb_looks_users')

    return customers
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
