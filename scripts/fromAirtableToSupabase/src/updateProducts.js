import sharp from 'sharp'
import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import Airtable from 'airtable'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
dotenv.config()

const haut = [
  'Veste',
  'Sweat',
  'Top',
  'Blouse/Chemise',
  'Blouson',
  'Pull/Maille',
  'Tailleur',
  'Manteau',
  'Cardigan'
]

const bas = [
  'Jean',
  'Jupe',
  'Short',
  'Pantalon'
]

const accessoires = [
  'Cabas',
  'Ceinture',
  'Panier',
  'Pochette',
  'Foulard',
  'Valise',
  'Sac banane',
  'Sac de voyage',
  'Sac à main',
  'Bijoux',
  'Serre-Tête',
  'Barette',
  'Chapeau/Bonnet/Gants',
  'Lunettes',
  'Maroquinerie'
]

const chaussures = [
  'Bottes',
  'Boots',
  'Escarpin',
  'Espadrille',
  'Ballerine',
  'Basket',
  'Tong',
  'Sabot',
  'Sandale',
  'Chaussettes',
  'Mocassin'
]

const ensemble = [
  'Combinaison',
  'Pyjama',
  'Robe',
  'Ensemble',
  'Bain'
]

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_PUBLIC_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

Airtable.configure({
  endpointUrl: process.env.AIRTABLE_URL,
  apiKey: process.env.AIRTABLE_API_KEY
})

const base = Airtable.base('appVzMtutdWJJJ4p8')

async function getProducts () {
  let productsList = await base('Products')
    .select()
    .all()

  if (productsList) {
    productsList = productsList.map((e) => {
      return { ...e.fields }
    })
  }
  return productsList
}

function capitalizeFirstLetter (string) {
  if (string === 'IRO' || string === 'DMN' || string === 'YSL') {
    return string
  }
  if (string === 'APC') {
    return 'A.P.C.'
  }

  const allStrings = string.split(' ')

  for (let i = 0; i < allStrings.length; i++) {
    allStrings[i] = allStrings[i].charAt(0).toUpperCase() + allStrings[i].slice(1).toLowerCase()
  }

  return allStrings.join(' ')
}

function formatArray (textArray) {
  for (let i = 0; i < textArray.length; i++) {
    textArray[i] = capitalizeFirstLetter(textArray[i])
  }

  return textArray
}

async function removeImages (newProductId, images) {
  const { data: imagesList } = await supabase
    .storage
    .from('products-images')
    .list(`${newProductId}`, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'name', order: 'asc' }
    })

  const filesToRemove = imagesList.map(x => `${newProductId}/${x.name}`)

  if (filesToRemove && filesToRemove.length > 0) {
    const { data, error } = await supabase.storage
      .from('products-images')
      .remove(filesToRemove)

    if (error) {
      console.log('Deleting existing images error : ', error)
    }
  }
}

function createWebpThumbnail (newProductId, imageBuffer, imageType) {
  sharp(imageBuffer)
    .rotate()
    .resize(200)
    .toBuffer()
    .then((newBuffer) => {
      // changing the old jpg image buffer to new webp buffer
      imageBuffer = newBuffer

      // moving the new webq image to server public folders
      return supabase.storage
        .from('products-images')
        .upload(`${newProductId}/thumbnail`, imageBuffer, {
          contentType: 'image/webp'
        })
    })
    .catch((err) => { console.log(err) })
}

async function uploadImages (newProductId, images) {
  const imagesData = []

  await Promise.all(images.map(async (image, index) => {
    const url = image.url
    const imageId = uuidv4()

    const response = await axios.get(url, {
      responseType: 'arraybuffer'
    })
    const buffer = Buffer.from(response.data, 'binary')

    // On génère une miniature
    if (index === 0) {
      await createWebpThumbnail(newProductId, buffer, image.type)
    }

    imagesData.push({
      id: imageId,
      order: index + 1
    })

    return supabase.storage
      .from('products-images')
      .upload(`${newProductId}/${imageId}`, buffer, {
        contentType: image.type
      })
  }))

  const { data: updatedProductImages, error } = await supabase
    .from('products')
    .update({
      images: imagesData
    })
    .eq('id', newProductId)
    .select()
}

async function addProduct (productData, productIndex) {
  let newBrand = null
  let newColors = null
  let newDetails = null
  let newMaterials = null
  let newCategory = null
  let newType = null
  let newSize = null
  let newShoeSize = null
  let newPrice = null
  let newFinalPrice = null

  if (productData.Categories) {
    newType = capitalizeFirstLetter(productData.Categories)

    if (productData.Categories === 'BLOUSE/CHEMISE') {
      newType = 'Blouse/Chemise'
    }
    if (productData.Categories === 'PULL/MAILLE') {
      newType = 'Pull/Maille'
    }
    if (productData.Categories === 'SAC DE VOYAGE') {
      newType = 'Sac de voyage'
    }
    if (productData.Categories === 'SAC A MAIN') {
      newType = 'Sac à main'
    }
    if (productData.Categories === 'SAC A DOS') {
      newType = 'Sac à dos'
    }
    if (productData.Categories === 'SERRE-TÊTE') {
      newType = 'Serre-Tête'
    }

    if (haut.includes(newType)) {
      newCategory = 'Haut'
    }
    if (bas.includes(newType)) {
      newCategory = 'Bas'
    }
    if (accessoires.includes(newType)) {
      newCategory = 'Accessoires'
    }
    if (chaussures.includes(newType)) {
      newCategory = 'Chaussures'
    }
    if (ensemble.includes(newType)) {
      newCategory = 'Ensemble'
    }
  }
  if (productData.Marque) {
    newBrand = capitalizeFirstLetter(productData.Marque)
  }
  if (productData.Couleurs) {
    newColors = formatArray(productData.Couleurs)
  }
  if (productData.Detail) {
    newDetails = formatArray(productData.Detail)
  }
  if (productData['Matières']) {
    newMaterials = formatArray(productData['Matières'])
  }
  if (productData.Taille) {
    newSize = productData.Taille
  }
  if (productData.Pointure) {
    newShoeSize = productData.Pointure
  }
  if (productData.Prix) {
    newPrice = productData.Prix
  }
  if (productData['Prix Final']) {
    newFinalPrice = productData['Prix Final']
  }

  const { data: currentProduct } = await supabase
    .from('products').select().eq('old_id', productData.id)

  if (currentProduct.length !== 0) {
    const { data: updatedProduct, error } = await supabase
      .from('products')
      .update({
        category: newCategory,
        type: newType,
        description: productData.Commentaires,
        published: productData.Published,
        instructions: productData.Instructions,
        condition: productData.Etat,
        provider: productData.Fournisseurs,
        colors: newColors,
        title: productData['Product Title'],
        brand: newBrand,
        details: newDetails,
        materials: newMaterials,
        shoe_size: newShoeSize,
        size: newSize,
        price: newPrice,
        final_price: newFinalPrice,
        stock: productData.Stock
      })
      .eq('old_id', productData.id)
      .select()

    if (error) {
      console.log(`Error on update of product at index ${productIndex} `, error)
    } else {
      console.log(`Updated product ${updatedProduct[0].id} at index : `, productIndex)
    }

    if (currentProduct[0].images && currentProduct[0].images.length > 0) {
      console.log('Déjà des images')
      await removeImages(updatedProduct[0].id, currentProduct[0].images)
    }

    if (productData['Images (view only Shopify)']) {
      uploadImages(updatedProduct[0].id, productData['Images (view only Shopify)'])
    }
  } else if (currentProduct.length === 0 && productData.Stock > 0) {
    const { data: insertedProduct, error } = await supabase
      .from('products')
      .insert({
        old_id: productData.id,
        category: newCategory,
        type: newType,
        description: productData.Commentaires,
        published: productData.Published,
        instructions: productData.Instructions,
        condition: productData.Etat,
        provider: productData.Fournisseurs,
        colors: productData.Couleurs,
        title: productData['Product Title'],
        brand: newBrand,
        details: newDetails,
        materials: newMaterials,
        shoe_size: newShoeSize,
        size: newSize,
        price: newPrice,
        final_price: newFinalPrice,
        stock: productData.Stock
      })
      .select()

    if (error) {
      console.log(`Error on insertion of product at index ${productIndex} `, error)
    } else {
      console.log(`Inserted product ${insertedProduct[0].id} at index : `, productIndex)
    }

    if (productData['Images (view only Shopify)']) {
      uploadImages(insertedProduct[0].id, productData['Images (view only Shopify)'])
    }
  }
}

async function syncProducts () {
  const productsList = await getProducts()

  console.log(productsList[69])

  for (let index = 0; index < productsList.length; index++) {
    const productData = productsList[index]
    if (productData['Product Title'].length > 5) {
      await addProduct(productsList[index], index)
    }
  }
}

syncProducts()
