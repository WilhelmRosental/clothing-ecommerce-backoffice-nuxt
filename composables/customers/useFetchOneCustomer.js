/**
 * @brief Fetches a unique customer by their email address
 * @returns customer
 */
export default async function fetchCustomerByEmail (email) {
  try {
    const supabase = useSupabaseClient()
    const { data: customer } = await supabase
      .from('profiles')
      .select()
      .eq('email', email)

    return customer ? customer[0] : null
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
