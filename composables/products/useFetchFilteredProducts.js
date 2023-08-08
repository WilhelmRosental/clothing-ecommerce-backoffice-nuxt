import _ from 'lodash'

/**
 * @brief Format filters into an array
 * @param {Object} route - The route object
 * @param {string} filterName - The name of the filter
 * @returns {Array|null} - The formatted filter array or null
 */
function formatFilter (route, filterName) {
  const filterValue = route.query[filterName]

  if (_.isArray(filterValue) && !_.isEmpty(filterValue)) {
    return filterValue
  } else if (filterValue && !_.isArray(filterValue)) {
    return [filterValue]
  } else {
    return null
  }
}

/**
 * @brief Retrieve a range of products from Supabase according to filters in the URL
 * @param {Object} range - The range object
 * @returns {Array|null} - The filtered products or null
 */
export default async function fetchFilteredProducts (range) {
  try {
    const route = useRoute()
    const supabase = useSupabaseClient()

    const queryProducts = supabase
      .from('products')
      .select()
      .order('created_at', { ascending: true })
      .range(range.from, range.to)

    const typesFilter = formatFilter(route, 'types')
    const brandsFilter = formatFilter(route, 'brands')
    const colorsFilter = formatFilter(route, 'colors')
    const materialsFilter = formatFilter(route, 'materials')
    const detailsFilter = formatFilter(route, 'details')
    const sizesFilter = formatFilter(route, 'sizes')
    const shoeSizesFilter = formatFilter(route, 'shoesizes')
    const minPriceFilter = parseFloat(route.query.minprice)
    const maxPriceFilter = parseFloat(route.query.maxprice)

    if (typesFilter) {
      queryProducts.in('type', typesFilter)
    }
    if (brandsFilter) {
      queryProducts.in('brand', brandsFilter)
    }
    if (colorsFilter) {
      queryProducts.containedBy('colors', colorsFilter)
    }
    if (materialsFilter) {
      queryProducts.containedBy('materials', materialsFilter)
    }
    if (detailsFilter) {
      queryProducts.containedBy('details', detailsFilter)
    }
    if (sizesFilter) {
      queryProducts.in('size', sizesFilter)
    }
    if (shoeSizesFilter) {
      queryProducts.in('shoe_size', shoeSizesFilter)
    }
    if (minPriceFilter) {
      queryProducts.gte('final_price', minPriceFilter)
    }
    if (maxPriceFilter) {
      queryProducts.lte('final_price', maxPriceFilter)
    }

    const { data: filteredProducts } = await queryProducts

    return filteredProducts
  } catch (error) {
    console.log('An error occurred:', error)
    return null
  }
}
