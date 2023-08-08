/**
 * @brief On fetch la view supabase du filtre concerné
 * @param {*} filterColumn
 * @param {*} filterName
 * @returns
 */
export default async function (filterColumn, filterName) {
  const supabase = useSupabaseClient()
  let returnedFilters = []

  const { data: filters, error } = await supabase
    .from(filterName)
    .select()
    .order(filterColumn, { ascending: true })

  if (error) {
    console.log('Error : ', error)
  }

  returnedFilters = filters.map(filter => filter[filterColumn])

  return returnedFilters.filter(element => element !== null)
}
