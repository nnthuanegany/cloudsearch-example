const { CloudSearch, ResourceGroupsTaggingAPI } = require('aws-sdk')
const config = require('./config');
const { awaitWithPromise } = require('./util');
const cloudSearch = new CloudSearch({
  region: config.region,
  credentials: {
    accessKeyId: config.credentials.accessKeyId,
    secretAccessKey: config.credentials.secretAccessKey
  }
})
const resourceGroupsTaggingAPI = new ResourceGroupsTaggingAPI({
  region: config.region,
  credentials: {
    accessKeyId: config.credentials.accessKeyId,
    secretAccessKey: config.credentials.secretAccessKey
  }
})

async function tagResources({ domain, tags }) {
  return await resourceGroupsTaggingAPI.tagResources({
    ResourceARNList: [domain.DomainStatus.ARN],
    Tags: tags
  }).promise()
}

/**
 * A name for the domain you are creating. Allowed characters are a-z (lower-case letters), 0-9, and hyphen (-). Domain names must start with a letter or number and be at least 3 and no more than 28 characters long.
 * https://docs.aws.amazon.com/AWSJavaScriptSDK/v3/latest/clients/client-cloudsearch/interfaces/createdomaincommandinput.html#domainname
 * @param {*} param0 
 * @returns 
 */
function generateDomainSeachName({ identifier }) {
  let name = identifier;
  if (name.length >= 28) throw new Error('A name for the domain you are creating. Allowed characters are a-z (lower-case letters), 0-9, and hyphen (-). Domain names must start with a letter or number and be at least 3 and no more than 28 characters long.')
  return name;
}

async function defineIndexField({ domain, indexField }) {
  return await cloudSearch.defineIndexField({
    DomainName: domain.DomainStatus.DomainName,
    IndexField: indexField
  }).promise()
}

async function describeIndexFields({ domain }) {
  const result = await cloudSearch.describeIndexFields({
    DomainName: domain.DomainStatus.DomainName
  }).promise()
  return result.IndexFields
}

async function indexDocuments({ domain }) {
  return await cloudSearch.indexDocuments({ DomainName: domain.DomainStatus.DomainName }).promise()
}

async function describeDomain({ domainName }) {
  const { DomainStatusList } = await cloudSearch.describeDomains({ DomainNames: [domainName] }).promise()
  return {
    DomainStatus: DomainStatusList[0]
  }
}

async function createDomainSearch({ identifier, tags }) {
  let name = generateDomainSeachName({ identifier });
  let domain = await cloudSearch.createDomain({ DomainName: name }).promise()
  let checking = true

  // WARNING - Example of how to check the availability of Search Service Endpoint.
  // Please handle this process for your production environment.
  while (checking) {
    console.log('Check the availability of Search Service Endpoint...')
    const { DomainStatusList } = await cloudSearch.describeDomains({ DomainNames: [domain.DomainStatus.DomainName] }).promise()
    console.log(JSON.stringify(DomainStatusList, null, 4))

    if (DomainStatusList[0]?.SearchService?.Endpoint) {
      checking = false
      domain.DomainStatus = DomainStatusList[0]
    }
    else {
      console.log('Next check after 5 minutes')
      await awaitWithPromise(300000)
    }
  }

  return domain
}

module.exports = {
  generateDomainSeachName,
  defineIndexField,
  createDomainSearch,
  describeIndexFields,
  indexDocuments,
  tagResources,
  describeDomain
}