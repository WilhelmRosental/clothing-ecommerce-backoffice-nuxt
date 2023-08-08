function convertToWebP (file, quality = 0.8, maxHeight = 400) {
  return new Promise((resolve, reject) => {
    const img = new Image()

    img.onload = async () => {
      let width = img.width
      let height = img.height

      // Redimensionnement de l'image si nécessaire
      if (width > maxHeight) {
        const scaleFactor = maxHeight / height
        width *= scaleFactor
        height *= scaleFactor
      }

      const canvas = document.createElement('canvas')
      canvas.width = width
      canvas.height = height

      const ctx = canvas.getContext('2d')
      ctx.drawImage(img, 0, 0, width, height)

      canvas.toBlob(
        (blob) => {
          const reader = new FileReader()

          reader.onloadend = () => {
            const compressedFile = new File([reader.result], file.name.replace(/\.[^.]+$/, '.webp'), { type: 'image/webp' })
            resolve(compressedFile)
          }

          reader.onerror = reject
          reader.readAsArrayBuffer(blob)
        },
        'image/webp',
        quality
      )
    }

    img.onerror = reject
    img.src = URL.createObjectURL(file)
  })
}

async function saveImages (product, productId) {
  const supabase = useSupabaseClient()

  // Téléchargement de la miniature
  try {
    const webPFile = await convertToWebP(product.images[0].file)

    await supabase.storage
      .from('products-images')
      .upload(`${productId}/thumbnail`, webPFile)
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image :', error)
  }

  // Téléchargement des fichiers d'images dans le stockage
  await Promise.all(
    product.images.map(({ id, file }) => {
      return supabase.storage
        .from('products-images')
        .upload(`${productId}/${id}`, file)
    })
  )
}

/**
 * @brief Sauvegarde un produit.
 * @param {Object} product - Le produit à sauvegarder.
 * @returns saved product
 */
export default async function (product, productId) {
  const supabase = useSupabaseClient()

  // Récupération des données des images du produit
  const imagesData = product.images.map(({ id, order }) => ({ id, order }))

  const productData = Object.assign({},
    {
    // Données principales du produit
      title: product.title,
      description: product.description,
      images: [],
      condition: product.condition,
      brand: product.brand,
      category: product.category,
      type: product.type,
      provider: product.provider,
      colors: product.colors,
      materials: product.materials,
      details: product.details,
      price: product.price,
      final_price: product.final_price
    },
    {
    // Données des images du produit
      images: imagesData
    })

  if (!productId) {
    try {
      // Insertion du produit dans la base de données
      const { data: savedProduct } = await supabase
        .from('products')
        .insert(productData)
        .select()

      // Récupération de l'ID du produit sauvegardé
      const productId = savedProduct[0].id

      // On sauvegarde les images
      await saveImages(product, productId)
    } catch (error) {
      console.error('Error :', error)
    }
  } else {
    try {
      // Insertion du produit dans la base de données
      await supabase
        .from('products')
        .update(productData)
        .eq('id', productId)
        .select()

      // Remove product images
      const imagesToRemove = product.images.map(x => `${productId}/${x.id}`)
      imagesToRemove.push(`${productId}/thumbnail`)
      await supabase.storage.from('products-images').remove(imagesToRemove)

      // On sauvegarde les images
      await saveImages(product, productId)

      console.log('Le produit a été sauvegardé avec succès.', productId)
    } catch (error) {
      console.error('Erreur lors de la sauvegarde du produit :', error)
    }
  }
}
