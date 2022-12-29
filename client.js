const { CloudSearchDomain } = require('aws-sdk')
const config = require('./config')

function createClient({ endpoint }) {
  return new CloudSearchDomain({
    region: config.region,
    credentials: {
      accessKeyId: config.credentials.accessKeyId,
      secretAccessKey: config.credentials.secretAccessKey
    },
    endpoint
  })
}

async function search({ client, params }) {
  const result = await client.search(params).promise()
  // console.log(JSON.stringify(result.hits, null, 4))
  return result
}

async function uploadDocuments({ client, documents }) {
  return await client.uploadDocuments({
    contentType: 'application/json',
    documents: Buffer.from(JSON.stringify(documents))
  }).promise()
}

module.exports = {
  createClient,
  search,
  uploadDocuments
}