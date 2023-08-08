import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'
import Airtable from 'airtable'
dotenv.config()

const supabaseUrl = process.env.SUPABASE_URL
const supabaseAnonKey = process.env.SUPABASE_PUBLIC_KEY

const supabase = createClient(supabaseUrl, supabaseAnonKey)

Airtable.configure({
  endpointUrl: process.env.AIRTABLE_URL,
  apiKey: process.env.AIRTABLE_API_KEY
})

const base = Airtable.base('appVzMtutdWJJJ4p8')

/**
 * @brief Méthode convertissant une string en array
 * @param {*} string
 * @returns un array
 */
function stringToArray (string) {
  string = string.split(',')
  const array = []

  string.forEach((e) => {
    if (e !== '') {
      array.push(e)
    }
  })

  return array
}

/**
 * @brief Méthode convertissant un prix (string) en prix sous forme de valeur numérique
 * @param {*} priceString
 * @returns {*} priceNum - prix sous forme de valeur numérique
 */
function formatBudgetToNum (priceString) {
  let priceNum

  if (priceString === '250 €') {
    priceNum = 250
  } else if (priceString === '500 €') {
    priceNum = 500
  } else if (priceString === '700 €') {
    priceNum = 700
  } else if (priceString === '1 000 €') {
    priceNum = 1000
  } else if (priceString === '+ de 1 000 €' || priceString === '1 500 €') {
    priceNum = 1500
  } else if (priceString === '+ de 1 500 €') {
    priceNum = 2000
  }

  return priceNum
}

/**
 * @brief Méthode qui fetch les datas des users depuis Airtable dans la table 'Questionnaires'
 * @returns un Array où chaque row correspond au questionnaire d'un user d'Airtable
 */
async function getQuestionaries () {
  try {
    let records = await base('Questionnaire')
      .select()
      .all()

    if (records) {
      records = records.map((e) => {
        return { id: e.id, ...e.fields }
      })
    }

    return records
  } catch (error) {
    console.log('error: ', error)
  }
}

/**
 * @brief Méthode qui formate les datas du questionnaire d'un unique user dans les bons types
 * @param {*} questionaryDatas
 * @returns un objet correspondant aux datas d'un user
 */
function formatQuestionaryDatas (questionaryDatas) {
  let newPreferedBrands = null
  let newNotColors = null
  let newTopBudget = null
  let newCoatBudget = null
  let newBottomBudget = null
  let newShoesBudget = null
  let newBagBudget = null
  let newCompleteBudget = null

  if (questionaryDatas.preferedBrands) {
    newPreferedBrands = stringToArray(questionaryDatas.preferedBrands)
  }
  if (questionaryDatas.notColors) {
    newNotColors = stringToArray(questionaryDatas.notColors)
  }
  if (questionaryDatas.topBudget) {
    newTopBudget = formatBudgetToNum(questionaryDatas.topBudget)
  }
  if (questionaryDatas.coatBudget) {
    newCoatBudget = formatBudgetToNum(questionaryDatas.coatBudget)
  }
  if (questionaryDatas.bottomBudget) {
    newBottomBudget = formatBudgetToNum(questionaryDatas.bottomBudget)
  }
  if (questionaryDatas.shoesBudget) {
    newShoesBudget = formatBudgetToNum(questionaryDatas.shoesBudget)
  }
  if (questionaryDatas.bagBudget) {
    newBagBudget = formatBudgetToNum(questionaryDatas.bagBudget)
  }
  if (questionaryDatas.completeBudget) {
    newCompleteBudget = formatBudgetToNum(questionaryDatas.completeBudget)
  }

  const formattedQuestionaryDatas = {
    last_update: questionaryDatas.lastUpdate,
    firstname: questionaryDatas.firstname,
    lastname: questionaryDatas.lastname,
    email: questionaryDatas.email,
    looking_for: questionaryDatas.lookingFor,
    prefered_brands: newPreferedBrands,
    occasion: questionaryDatas.occasion,
    styles: questionaryDatas.styles,
    season: questionaryDatas.season,
    color: questionaryDatas.color,
    not_colors: newNotColors,
    silhouette: questionaryDatas.silhouette,
    height: questionaryDatas.height,
    age: questionaryDatas.age,
    top_size: questionaryDatas.topSize,
    bottom_size: questionaryDatas.bottomSize,
    shoe_size: questionaryDatas.shoeSize,
    heel_height: questionaryDatas.heelHeight,
    finished: questionaryDatas.finished,
    top_budget: newTopBudget,
    coat_budget: newCoatBudget,
    bottom_budget: newBottomBudget,
    shoes_budget: newShoesBudget,
    bag_budget: newBagBudget,
    complete_budget: newCompleteBudget,
    not_details: questionaryDatas.notDetails,
    not_materials: questionaryDatas.notMaterials,
    not_imprimes: questionaryDatas.notImprimes
  }

  return formattedQuestionaryDatas
}

/**
 *
 * @param {*} email
 * @param {*} customerDatas
 * @param {*} customerIndex
 */
async function addCustomer (email, customerDatas, customerIndex) {
  const updatedQuestionary = supabase
    .from('profiles')
    .upsert([
      customerDatas
    ])
    .select()
    .eq('email', email)

  const { data: updatedCustomer, error } = await updatedQuestionary

  if (error) {
    console.log('Error :', error)
  } else {
    console.log('Updated customer :', updatedCustomer)
  }
}

/**
 * @brief
 */
async function addCustomers () {
  // Fetch des questionnaires depuis Airtable
  const questionaries = await getQuestionaries()

  for (let index = 0; index < questionaries.length; index++) {
    const formattedQuestionaryDatas = formatQuestionaryDatas(questionaries[index])

    console.log(formattedQuestionaryDatas)

    if (formattedQuestionaryDatas.email) {
      await addCustomer(formattedQuestionaryDatas.email, formattedQuestionaryDatas, index)
    }
  }
}

addCustomers()
