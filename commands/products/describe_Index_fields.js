const { describeIndexFields, describeDomain } = require('../../cloudsearch')
const domainName = 'egastyle-prd'

async function main() {
  const domain = await describeDomain({ domainName })
  const indexFields = await describeIndexFields({ domain })
  console.log(JSON.stringify(indexFields, null, 4))
}

main().then(console.log).catch(console.error)