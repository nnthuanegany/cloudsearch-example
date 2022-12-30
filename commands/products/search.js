const { createClient, search } = require('../../client')
const products = require('../../data/product-documents-2022-12-29T09:00:05.438Z.json')
const collections = require('../../data/collection-documents-2022-12-28T03:12:48.077Z.json')
const { toNonAccentVietnamese } = require('../../util')

// The endpoint you will store during initialization domain search
let endpoint = 'search-egastyle-prd-kd7pqufzejkdhn2fmiivgzv5de.us-east-1.cloudsearch.amazonaws.com'
const client = createClient({ endpoint })

async function main() {

  // await searchWithExactName()
  // console.log('-------------------')
  // await searchWithNonAccentVietnameseName()
  // console.log('-------------------')
  // await searchSortByDescMinPrice()
  // console.log('-------------------')
  // await searchProductsOfCollection()
  // console.log('-------------------')
  // await searchAllProducts()
  // console.log('-------------------')
  // await searchAllProductsWitPagination()
  // console.log('-------------------')
  // await searchProductsOfCollectionAndFilterColor()
  // console.log('-------------------')
  await searchProductsOfCollectionAndFilterRangePrice()

}

async function searchWithExactName() {
  console.log('Search with exact name')
  const params = { query: products[0].fields.name }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== 1) console.warn('==> [FAILED] Must be found %d but foud %d', 1, result.hits.found)
  else if (result.hits.hit[0].fields.name[0] !== products[0].fields.name) console.warn('==> [FAILED] Name must be "%s" but foud "%s"', products[0].fields.name, result.hits.hit[0].fields.name[0])
  else console.log('==> PASSED')
}

async function searchWithNonAccentVietnameseName() {
  console.log('Search with NonAccentVietnamese name')
  const nonAccentVietnameseName = toNonAccentVietnamese(products[0].fields.name)
  const params = { query: nonAccentVietnameseName }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== 1) console.warn('==> [FAILED] Must be found %d but foud %d', 1, result.hits.found)
  else if (result.hits.hit[0].fields.name[0] !== products[0].fields.name) console.warn('==> [FAILED] Name must be "%s" but foud "%s"', products[0].fields.name, result.hits.hit[0].fields.name[0])
  else console.log('==> PASSED')
}

async function searchSortByDescMinPrice() {
  console.log('Search sort by desc min price')
  const params = { query: 'đầm', sort: 'min_price desc' }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== 15) console.warn('==> [FAILED] Must be found %d but foud %d', 15, result.hits.found)
  else if (
    result.hits.hit[0].fields.min_price[0] < result.hits.hit[1].fields.min_price[0] ||
    result.hits.hit[1].fields.min_price[0] < result.hits.hit[2].fields.min_price[0])
    console.warn('==> [FAILED] Min price must be desc')
  else console.log('==> PASSED')
}

async function searchProductsOfCollection() {
  console.log('Search products of a collection')
  /**@type {import('aws-sdk').CloudSearchDomain.SearchRequest} */
  const params = { query: `(phrase field=collection_slug '${collections[0].fields.slug}')`, sort: 'min_price desc', queryParser: 'structured' }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)
  // console.log(JSON.stringify(result.hits, null, 4))
  if (result.hits.found !== collections[0].fields.products_count) console.warn('==> [FAILED] Must be found %d but foud %d', collections[0].fields.products_count, result.hits.found)
  else console.log('==> PASSED')
}

async function searchAllProducts() {
  console.log('Search all products')
  let total = 0
  for (const collection of collections) total += collection.fields.products_count
  /**@type {import('aws-sdk').CloudSearchDomain.SearchRequest} */
  const params = { query: 'matchall', sort: 'min_price desc', queryParser: 'structured' }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)
  // console.log(JSON.stringify(result.hits, null, 4))
  if (result.hits.found !== total) console.warn('==> [FAILED] Must be found %d but foud %d', total, result.hits.found)
  else console.log('==> PASSED')
}

async function searchAllProductsWitPagination() {
  console.log('Search all products with pagination')
  let total = 0
  for (const collection of collections) total += collection.fields.products_count
  /**@type {import('aws-sdk').CloudSearchDomain.SearchRequest} */
  const params = { query: 'matchall', sort: 'min_price desc', queryParser: 'structured', size: 2, start: 2 }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== total) console.warn('==> [FAILED] Must be total found %d but total foud %d', total, result.hits.found)
  else if (result.hits.start !== 2) console.warn('==> [FAILED] Must be start %d but start %d', 2, result.hits.start)
  else if (result.hits.hit.length !== 2) console.warn('==> [FAILED] Must be return %d but return %d', 2, result.hits.hit.length)
  else console.log('==> PASSED')
}

async function searchProductsOfCollectionAndFilterColor() {
  console.log('Search products of a collection and filter color')
  /**@type {import('aws-sdk').CloudSearchDomain.SearchRequest} */
  const params = { query: `(and (phrase field=collection_slug 'vest-blazer') (phrase field=options_values 'Cam'))`, sort: 'min_price desc', queryParser: 'structured' }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)
  if (result.hits.found !== 1) console.warn('==> [FAILED] Must be found %d but foud %d', 1, result.hits.found)
  else console.log('==> PASSED')
}

async function searchProductsOfCollectionAndFilterRangePrice() {
  console.log('Search products of a collection and filter range price')
  /**@type {import('aws-sdk').CloudSearchDomain.SearchRequest} */
  const params = { query: `(and (phrase field=collection_slug 'vest-blazer') (or (range field=min_price [2000000,3000000]) (range field=max_price [2000000,3000000])))`, sort: 'min_price desc', queryParser: 'structured' }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)
  if (result.hits.found !== 2) console.warn('==> [FAILED] Must be found %d but foud %d', 2, result.hits.found)
  else console.log('==> PASSED')
}

main()