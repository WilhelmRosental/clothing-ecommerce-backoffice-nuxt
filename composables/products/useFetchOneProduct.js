/**
 * @brief Fetches a unique product by its id
 * @returns product
 */
export default async function fetchProductById (id) {
  try {
    const supabase = useSupabaseClient()

    const { data: product } = await supabase
      .from('products')
      .select()
      .eq('id', id)

    return Object.assign(
      product[0],
      {
        type: product[0].type ? [product[0].type] : null,
        category: product[0].category ? [product[0].category] : null,
        condition: product[0].condition ? [product[0].condition] : null,
        brand: product[0].brand ? [product[0].brand] : null,
        provider: product[0].provider ? [product[0].provider] : null,
        size: product[0].size ? [product[0].size] : null
      }
    )
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
