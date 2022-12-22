const client = require('./client')
const collections = require('./collections.json')
async function uploadDocument() {
  await client.uploadDocuments({
    contentType: 'application/json',
    documents: Buffer.from(JSON.stringify(collections))
  }).promise()
}
uploadDocument()