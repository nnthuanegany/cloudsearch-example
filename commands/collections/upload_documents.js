const documents = require('../../data/collection-documents-2022-12-28T03:12:48.077Z.json')
const { createClient, uploadDocuments } = require('../../client')

// The endpoint you will store during initialization domain search
let endpoint = 'search-egastyle-clt-hlokkzsvdzxvohnw2xp2v5mqga.us-east-1.cloudsearch.amazonaws.com'
const client = createClient({ endpoint })
uploadDocuments({ client, documents }).then(console.log).catch(console.error)