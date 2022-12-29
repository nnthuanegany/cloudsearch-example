const cloudsearchdomain = require('./cloudsearchdomain')
async function search(params) {
  const result = await cloudsearchdomain.search(params).promise()
  console.log(JSON.stringify(result.hits, null, 4))
}

// search({ query: 'Áo' })
search({ query: 'Áo', filterQuery: `site_id:'d6dc43f1-17ab-4f26-b8ab-0b0024b42bc8'` })
search({ query: 'Áo', filterQuery: `site_id:'d6dc43f1-17ab-4f26-b8ab-0b0024b42bc9'` })
// search({ query: 'Quan' })