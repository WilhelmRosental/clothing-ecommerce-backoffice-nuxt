/**
 * 
 * @brief retrieve all possible values of products variables from frontend & and Airtable
 * 
 */
import fs from 'fs'
import dotenv from 'dotenv'
import Airtable from 'airtable'
import FormSelectionValues from "../../../datas/FormSelectionValues.json" assert { type: "json" };
dotenv.config()

Airtable.configure({
  endpointUrl: process.env.AIRTABLE_URL,
  apiKey: process.env.AIRTABLE_API_KEY
})

const base = Airtable.base('appVzMtutdWJJJ4p8')

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

function mergeValues (productsList, outputFileName, typeName) {
  const outputValues = []

  const dataTypeFromJSON = FormSelectionValues[outputFileName]

  for (let index = 0; index < dataTypeFromJSON.length; index++) {
    outputValues.push(capitalizeFirstLetter(dataTypeFromJSON[index]))
  }

  let currentProduct = null

  for (let index = 0; index < productsList.length; index++) {
    currentProduct = productsList[index]

    if(Array.isArray(currentProduct[typeName])) {
        let currentProductType = currentProduct[typeName]

        for(let i = 0; i < currentProduct[typeName].length; i++) {
            if (currentProductType[i] !== undefined && !(outputValues.find(e => e === capitalizeFirstLetter(currentProductType[i])))) {
                outputValues.push(capitalizeFirstLetter(currentProductType[i]))
            }
        }
    } else if(currentProduct[typeName] !== undefined && !(outputValues.find(e => e === capitalizeFirstLetter(currentProduct[typeName])))) {
        outputValues.push(capitalizeFirstLetter(currentProduct[typeName]))
    }
  }

  outputValues.sort()

  let output = {
    [outputFileName]: outputValues
  }

  fs.writeFile('outputs/' + outputFileName + '.json', JSON.stringify(output), 'utf8', (err) => {
    if (err) { throw err }
  })
}

async function getProducts () {
    let productsList = await base('Products')
      .select({
        sort: [
          { field: 'Product Title', direction: 'asc' }
        ]
      })
      .all()
  
    if (productsList) {
      productsList = productsList.map((e) => {
        return { ...e.fields }
      })
    }
  
    return productsList
}

async function generateDataTypes () {
    const productList = await getProducts ()

    // getBrands(productList)
    mergeValues(productList, 'details', 'Detail')
}

generateDataTypes()