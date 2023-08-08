/**
 * @brief methode pour récupérer les images d'un produit dans l'ordre
 * @param {*} productId
 * @param {*} productImages
 * @returns un array d'objets des url publics et orderId de toutes les images
 */
export default async function (productId, productImages, isEditor = false) {
  const supabase = useSupabaseClient()

  productImages.sort((a, b) => {
    return a.order - b.order
  })

  const productImagesPublicUrl = []

  for (let i = 0; i < productImages.length; i++) {
    const imagePath = `${productId}/${productImages[i].id}`

    const { data: imagePublicUrl, error } = supabase.storage
      .from('products-images')
      .getPublicUrl(imagePath)

    if (error) { throw error }

    if (isEditor) {
      const { data, error } = await supabase.storage
        .from('products-images')
        .download(imagePath)

      if (error) {
        console.error('Error downloading file:', error.message)
        return null
      }

      const fileName = imagePath.split('/').pop()
      const fileType = fileName.split('.').pop()
      const imageFile = new File([data], fileName, { type: `image/${fileType}` })

      // const imageFile = await getFileFromStorage(imagePath)
      productImagesPublicUrl.push({
        id: productImages[i].id,
        order: productImages[i].order,
        fileUrl: imagePublicUrl.publicUrl,
        file: imageFile
      })
    } else {
      productImagesPublicUrl.push({
        id: productImages[i].id,
        order: productImages[i].order,
        fileUrl: imagePublicUrl.publicUrl
      })
    }
  }

  return productImagesPublicUrl
}
