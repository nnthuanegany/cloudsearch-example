// A new store flow
// 1. A new store created.
// 2. Emit event - The purpose is for asynchronous handling between the creation of the store and the creating of the CloudSearch service.
// 3. Receive event.
// 4. Create CloudSearchDomain instance for the collection of store.
// 4.1. Create instance.
// 4.2. Index fileds.
// 5. Create CloudSearchDomain instance for the product of store.
// 5.1. Create instance.
// 5.2. Index fields.
// 6. Create CloudSearchDomain instance for the product variant of store.
// 6.1. Create instance.
// 6.2. Index fields.
// 7. Upload collection documents.
// 8. Upload product documents.
// 9. Search collection.
// 10. Search product.

const { createDomainSearch, defineIndexField, indexDocuments } = require('./cloudsearch')
const { uploadDocuments, createClient } = require('./client')
const { awaitWithPromise, ObjectCodes } = require('./util')

async function initialize({ store, productIndexFields, collectionIndexFields }) {
  await createDomainSearchForStore({ store, collectionIndexFields, productIndexFields })
  // await uploadDocuments({ client: collectionDomainSearch.client, documents: collectionDocuments })
  // await uploadDocuments({ client: productDomainSearch.client, documents: productDocuments })
}

async function createDomainSearchForStore({ store, collectionIndexFields, productIndexFields }) {

  console.log('Create domain search for store')
  const collectionDomainSearch = await createCollectionDomainSearch({ store, collectionIndexFields })
  const productDomainSearch = await createProductDomainSearch({ store, productIndexFields })

  return {
    collectionDomainSearch,
    productDomainSearch
  }

}

async function createCollectionDomainSearch({ store, collectionIndexFields }) {

  console.log('Create collection domain search')
  const identifier = store.name + '-' + ObjectCodes.collection
  const domain = await createDomainSearch({ identifier, tags: { Stack: '7ux', EcommerceObject: 'Collection' } })
  const client = createClient({ endpoint: domain.DomainStatus.SearchService.Endpoint })

  console.log('Define index fields for collections')
  const failure = []
  const success = []
  const errors = []
  const total = collectionIndexFields.length
  let count = 1

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

  return { domain, client }

}

async function createProductDomainSearch({ store, productIndexFields }) {

  console.log('Create product domain search')
  const identifier = store.name + '-' + ObjectCodes.product
  const domain = await createDomainSearch({ identifier, tags: { Stack: '7ux', EcommerceObject: 'Product' } })
  const client = createClient({ endpoint: domain.DomainStatus.SearchService.Endpoint })

  console.log('Define index fields for products')
  const failure = []
  const success = []
  const errors = []
  const total = productIndexFields.length
  let count = 1

  for (const indexField of productIndexFields) {
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

  return { domain, client }

}

module.exports = {
  createProductDomainSearch,
  createCollectionDomainSearch,
  createDomainSearchForStore,
  initialize
}