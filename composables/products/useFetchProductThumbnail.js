/**
 * @brief Retrieves the thumbnail URL of a look
 * @param {*} productId - a UUID
 * @returns the thumbnail URL
 */
export default async function getProductThumbnailUrl (productId) {
  try {
    const supabase = useSupabaseClient()

    const { data: imagePublicUrl } = await supabase.storage
      .from('products-images')
      .getPublicUrl(`${productId}/thumbnail`)

    return imagePublicUrl.publicUrl
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
