const collectionIndexFields = require('../../index-fields/collection.json')
const { defineIndexField, indexDocuments, describeDomain } = require('../../cloudsearch')
const { awaitWithPromise } = require('../../util')

const domainName = 'egastyle-clt'

async function main() {
  console.log('Define index fields for collections')
  const failure = []
  const success = []
  const errors = []
  const total = collectionIndexFields.length
  let count = 1
  const domain = await describeDomain({ domainName })

  for (const indexField of collectionIndexFields) {
    try {
      console.log(`[${count}/${total}] Define index field`, [indexField])
      await defineIndexField({ domain, indexField })
      success.push(indexField)
      console.log('==> SUCCESS')
    } catch (error) {
      failure.push(indexField)
      errors.push(error)
      console.log('==> FAILED')
    }
    count++
    await awaitWithPromise(500)
  }

  await indexDocuments({ domain, indexFields: success })

  console.log('success', success)
  console.log('failure', failure)
  console.error('error', errors)
  console.log('==> COMPLETED')
}

main().then(console.log).catch(console.error)