const { createClient, search } = require('../../client')
const products = require('../../data/product-documents-2022-12-29T09:00:05.438Z.json')
const { toNonAccentVietnamese } = require('../../util')

// The endpoint you will store during initialization domain search
let endpoint = 'search-egastyle-prd-kd7pqufzejkdhn2fmiivgzv5de.us-east-1.cloudsearch.amazonaws.com'
const client = createClient({ endpoint })

async function main() {

  await searchWithExactName()
  console.log('-------------------')
  await searchWithNonAccentVietnameseName()
  console.log('-------------------')
  await searchSortByDescMinPrice()
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

main()