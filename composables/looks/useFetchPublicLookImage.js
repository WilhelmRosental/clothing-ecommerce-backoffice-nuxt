/**
 * @brief Retrieves the thumbnail URL of a product
 * @param {*} productId - a UUID
 * @returns the thumbnail URL
 */
export default async function (lookId, isEditor = false) {
  try {
    const supabase = useSupabaseClient()

    const { data: imagePublicUrl } = await supabase.storage
      .from('looks-images')
      .getPublicUrl(`${lookId}`)

    if (isEditor) {
      const { data, error } = await supabase.storage
        .from('looks-images')
        .download(lookId)

      if (error) {
        console.error('Error downloading file:', error.message)
        return null
      }

      const fileType = lookId.split('.').pop()
      const imageFile = new File([data], lookId, { type: `image/${fileType}` })

      // const imageFile = await getFileFromStorage(imagePath)
      return {
        id: lookId,
        fileUrl: imagePublicUrl.publicUrl,
        file: imageFile
      }
    } else {
      return imagePublicUrl.publicUrl
    }
  } catch (error) {
    console.log('Error:', error)
    return null
  }
}
