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

async function getNewsletters () {
  try {
    let records = await base('Newsletters')
      .select({
        view: 'Grid view'
      })
      .all()

    if (records) {
      records = records.map((e) => {
        return { ...e.fields }
      })
    }

    return records
  } catch (error) {
    console.log('error: ', error)
  }
}

async function addNewsletters (datas) {
  const { data, error } = await supabase
    .from('newsletters')
    .upsert({
      email: datas.email,
      firstname: datas.PRENON,
      lastname: datas.NAME
    })
    .select()

  if (error) {
    console.log('Error : ', error)
  }
}

const newslettersList = await getNewsletters()
console.log(newslettersList)

newslettersList.forEach((e) => {
  addNewsletters(e)
})
