function convertToWebP (file, quality = 0.8, maxHeight = 500) {
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

async function saveImage (lookdatas, lookId) {
  const supabase = useSupabaseClient()

  // Téléchargement de la miniature
  try {
    const webPFile = await convertToWebP(lookdatas.image[0].file)

    await supabase.storage
      .from('looks-images')
      .upload(`${lookId}`, webPFile)
  } catch (error) {
    console.error('Erreur lors de la conversion de l\'image :', error)
  }
}

/**
 * @brief Méthode pour créer ou mettre à jour un look unique par son id
 * @returns Le look sauvegardé
 */
export default async function (lookDatas, customersToSave, customersToRemove, lookId) {
  const supabase = useSupabaseClient()

  const lookCustomersList = []
  let newLookId

  const lookData = {
    title: lookDatas.title || null,
    thumbnail: lookDatas.thumbnail,
    designer: lookDatas.designer?.toString() || null,
    univers: lookDatas.univers?.toString() || null,
    left_top: lookDatas.left_top?.id || null,
    left_bottom: lookDatas.left_bottom?.id || null,
    right_top: lookDatas.right_top?.id || null,
    right_middle: lookDatas.right_middle?.id || null,
    right_bottom: lookDatas.right_bottom?.id || null,
    is_public: lookDatas.is_public,
    published: lookDatas.published
  }

  if (lookId) {
    try {
      const { data: customersJoins } = await supabase
        .from('looks_profiles')
        .select('customer_email')
        .eq('look_id', lookId)

      customersJoins.forEach((customer) => {
        lookCustomersList.push(customer.customer_email)
      })
    } catch (error) {
      console.log('Error:', error)
    }

    // On met à jour le look
    try {
      await supabase
        .from('looks')
        .update(lookData)
        .eq('id', lookId)
    } catch (error) {
      console.log('Error:', error)
    }

    // On supprime la miniature
    try {
      await supabase.storage
        .from('looks-images')
        .remove(lookId)
    } catch (error) {
      console.log('Error:', error)
    }

    saveImage(lookDatas, lookId)
  } else {
    try {
      const { data: savedLook } = await supabase
        .from('looks')
        .insert(lookData)
        .select()
      newLookId = savedLook[0].id
    } catch (error) {
      console.log('Error:', error)
    }

    if (lookData.thumbnail) {
      saveImage(lookDatas, newLookId)
    }
  }

  // Lier les clients qui ne sont pas déjà associés au look
  if (customersToSave && customersToSave.length > 0) {
    for (const customer of customersToSave) {
      if (!lookId || !lookCustomersList.includes(customer.email)) {
        try {
          await supabase
            .from('looks_profiles')
            .insert({
              customer_email: customer.email,
              look_id: lookId || newLookId
            })
        } catch (error) {
          console.log('Error:', error)
        }
      }
    }
  }

  // Dissocier les clients qui sont associés au look
  if (customersToRemove && customersToRemove.length > 0) {
    for (const customer of customersToRemove) {
      if (!lookId || lookCustomersList.includes(customer.email)) {
        try {
          await supabase
            .from('looks_profiles')
            .delete()
            .eq('customer_email', customer.email)
            .eq('look_id', lookId)
        } catch (error) {
          console.log('Error:', error)
        }
      }
    }
  }
}
