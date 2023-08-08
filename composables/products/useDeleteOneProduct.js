/**
 * @brief Delete a unique product by its id
 * @returns product
 */
export default async function deleteProductById (product) {
  try {
    const supabase = useSupabaseClient()

    const { data: deletedProduct } = await supabase
      .from('products')
      .delete()
      .eq('id', product.id)

    // Remove product images
    const imagesToRemove = product.images.map(x => `${product.id}/${x.id}`)
    imagesToRemove.push(`${product.id}/thumbnail`)

    await supabase.storage.from('products-images').remove(imagesToRemove)

    return deletedProduct
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
