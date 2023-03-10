const axios = require('axios')
const path = require('path')
const fs = require('fs')
const { generateId, isEmptyString } = require('./util')

/**
 * 
 * @param {{ collectionUrls: string[], siteId: string}} params
 */
async function createCollectionDocumentsFromHaravanCollections({ collectionUrls, siteId }) {

  console.log('Create collection documents from haravan collections')

  const documents = []

  for (const url of collectionUrls) {

    const response = await axios({ url, method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const hrvCollection = response.data.collection
    const document = {
      type: "add",
      id: generateId(),
      fields: {
        id: generateId(),
        seo_title: hrvCollection.title,
        seo_description: hrvCollection.title,
        name: hrvCollection.title,
        slug: hrvCollection.handle,
        description: hrvCollection.description,
        description_html: '',
        description_json: '',
        channel: 'vn',
        sources: [hrvCollection.id.toString()],
        site_id: siteId,
        products_count: hrvCollection.products_count,
        updated_at: new Date(hrvCollection.updated_at).toISOString()
      }
    }
    documents.push(document)

  }

  fs.writeFileSync(path.join(path.resolve('.'), 'data', `collection-documents-${new Date().toISOString()}.json`), JSON.stringify(documents, null, 2))
  console.log('==> COMPLETED')

}

/**
 * 
 * @param {{ collectionUrls: string[], siteId: string}} params
 */
async function createProductDocumentsFromHaravanProducts({ collectionUrls, siteId }) {

  console.log('Create product documents from haravan products')

  const documents = []
  const allHaravanProducts = []

  for (const url of collectionUrls) {

    console.log(`Fetch collection from ${url}`)
    const fetchHaravanCollectoinResponse = await axios({ url, method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const hrvCollection = fetchHaravanCollectoinResponse.data.collection

    console.log(`Fetch products from ${url}`)
    const response = await axios({ url: url.replace('.json', '/products.json'), method: 'GET', headers: { 'Content-Type': 'application/json' } })
    const hrvProducts = response.data.products
    const total = hrvProducts.length

    console.log('Product total: ', total)

    let count = 1

    for (const hrvProduct of hrvProducts) {

      console.log(`[${count}/${total}]: `, [hrvProduct.title])

      if (allHaravanProducts.find(p => p.id === hrvProduct.id)) {

        const document = documents.find(d => d.sources.includes(hrvProduct.id.toString()))

        if (document) {
          document.collection_id.push(hrvCollection.id.toString())
          if (!isEmptyString(hrvCollection.title)) document.collection_name.push(hrvCollection.title)
          if (!isEmptyString(hrvCollection.title)) document.collection_seo_title.push(hrvCollection.title)
          if (!isEmptyString(hrvCollection.description)) document.collection_seo_description.push(hrvCollection.description)
          if (!isEmptyString(hrvCollection.description)) document.collection_description.push(hrvCollection.description)
          if (!isEmptyString(hrvCollection.handle)) document.collection_slug.push(hrvCollection.handle)
        }

      }
      else {

        let options_values = []
        for (const option of hrvProduct.options) options_values.push(...option.values)
        options_values = [...new Set(options_values)]

        let variant_weight_unit = []
        let variant_weight_value = []
        let variant_pricing_price_currency = ['vn']
        let variant_pricing_price_gross_currency = ['vn']
        let variant_pricing_price_gross_amount = []
        let variant_pricing_price_net_currency = ['vn']
        let variant_pricing_price_net_amount = []
        let variant_pricing_price_tax_currency = ['vn']
        let variant_pricing_price_tax_amount = []

        for (const variant of hrvProduct.variants) {

          if ('weight_unit' in variant && !isEmptyString(variant.weight_unit)) variant_weight_unit.push(variant.weight_unit)

          if ('weight' in variant && typeof variant.weight === 'number') variant_weight_value.push(variant.weight)

          variant_pricing_price_gross_amount.push(Number.parseFloat(variant.price))

        }

        variant_weight_unit = [...new Set(variant_weight_unit)]
        variant_weight_unit = variant_weight_unit.filter(u => !isEmptyString(u))
        variant_weight_value = [...new Set(variant_weight_value)]
        variant_pricing_price_gross_amount = [...new Set(variant_pricing_price_gross_amount)]
        variant_pricing_price_gross_amount = variant_pricing_price_gross_amount.sort((f, s) => f - s)
        let min_price = variant_pricing_price_gross_amount[0]
        let max_price = variant_pricing_price_gross_amount[variant_pricing_price_gross_amount.length - 1]

        const document = {
          type: "add",
          id: generateId(),
          fields: {
            id: generateId(),
            name: hrvProduct.title,
            slug: hrvProduct.handle,
            channel: 'vn',
            description: hrvProduct.description,
            description_html: hrvProduct.body_html,
            description_json: "",
            seo_title: hrvProduct.title,
            seo_description: hrvProduct.description,
            type: hrvProduct.product_type,
            tags: hrvProduct.tags || "",
            created_at: new Date(hrvProduct.created_at).toISOString(),
            updated_at: new Date(hrvProduct.updated_at).toISOString(),
            options_name: hrvProduct.options.map(o => o.name),
            options_key: [],
            options_values,
            weight_unit: "",
            weight_value: 0,
            min_price,
            max_price,
            variant_id: hrvProduct.variants.map(v => v.id.toString()),
            variant_name: hrvProduct.variants.map(v => v.title).filter(v => v !== undefined && v !== null),
            variant_sku: hrvProduct.variants.map(v => v.sku).filter(v => v !== undefined && v !== null),
            variant_channel: hrvProduct.variants.map(v => v.channel).filter(v => v !== undefined && v !== null),
            variant_weight_unit,
            variant_weight_value,
            variant_pricing_price_currency,
            variant_pricing_price_gross_currency,
            variant_pricing_price_gross_amount,
            variant_pricing_price_net_currency,
            variant_pricing_price_net_amount,
            variant_pricing_price_tax_currency,
            variant_pricing_price_tax_amount,
            category_id: '',
            category_name: '',
            category_seo_title: '',
            category_seo_description: '',
            category_description: '',
            category_slug: '',
            collection_id: [hrvCollection.id.toString()],
            collection_name: isEmptyString(hrvCollection.title) ? [] : [hrvCollection.title],
            collection_seo_title: isEmptyString(hrvCollection.title) ? [] : [hrvCollection.title],
            collection_seo_description: isEmptyString(hrvCollection.description) ? [] : [hrvCollection.description],
            collection_description: isEmptyString(hrvCollection.description) ? [] : [hrvCollection.description],
            collection_slug: isEmptyString(hrvCollection.handle) ? [] : [hrvCollection.handle],
            sources: [hrvProduct.id.toString()],
            site_id: siteId
          }
        }
        documents.push(document)
        allHaravanProducts.push(hrvProduct)

      }

    }

  }

  fs.writeFileSync(path.join(path.resolve('.'), 'data', `product-documents-${new Date().toISOString()}.json`), JSON.stringify(documents, null, 2))
  console.log('==> COMPLETED')

}

module.exports = {
  createCollectionDocumentsFromHaravanCollections,
  createProductDocumentsFromHaravanProducts
}