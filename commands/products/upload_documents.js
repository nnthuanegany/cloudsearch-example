const documents = require('../../data/product-documents-2022-12-29T03:17:43.229Z.json')
const { createClient, uploadDocuments } = require('../../client')

// The endpoint you will store during initialization domain search
const endpoint = 'search-egastyle-prd-kd7pqufzejkdhn2fmiivgzv5de.us-east-1.cloudsearch.amazonaws.com'
const client = createClient({ endpoint })
uploadDocuments({ client, documents }).then(console.log).catch(console.error)