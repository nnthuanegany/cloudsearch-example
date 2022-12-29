const { createClient, search } = require('../../client')
const collections = require('../../data/collection-documents-2022-12-28T03:12:48.077Z.json')
const { toNonAccentVietnamese } = require('../../util')

// The endpoint you will store during initialization domain search
let endpoint = 'search-egastyle-clt-hlokkzsvdzxvohnw2xp2v5mqga.us-east-1.cloudsearch.amazonaws.com'
const client = createClient({ endpoint })

async function main() {

  await searchWithExactName()
  console.log('-------------------')
  await searchWithNonAccentVietnameseName()

}

async function searchWithExactName() {
  console.log('Search with exact name')
  const params = { query: collections[0].fields.name }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== 1) console.warn('==> [FAILED] Must be found %d but foud %d', 1, result.hits.found)
  else if (result.hits.hit[0].fields.name[0] !== collections[0].fields.name) console.warn('==> [FAILED] Name must be "%s" but foud "%s"', collections[0].fields.name, result.hits.hit[0].fields.name[0])
  else console.log('==> PASSED')
}

async function searchWithNonAccentVietnameseName() {
  console.log('Search with NonAccentVietnamese name')
  const nonAccentVietnameseName = toNonAccentVietnamese(collections[0].fields.name)
  const params = { query: nonAccentVietnameseName }
  console.log('Params: ', params)
  const result = await search({ client, params })
  console.log('==> Times: %d ms', result.status.timems)

  if (result.hits.found !== 1) console.warn('==> [FAILED] Must be found %d but foud %d', 1, result.hits.found)
  else if (result.hits.hit[0].fields.name[0] !== collections[0].fields.name) console.warn('==> [FAILED] Name must be "%s" but foud "%s"', collections[0].fields.name, result.hits.hit[0].fields.name[0])
  else console.log('==> PASSED')
}

main()