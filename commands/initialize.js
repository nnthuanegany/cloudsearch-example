const { initialize } = require('../main')
const egaStyleStore = require('../store/ega-style.json')
const productDocuments = require('../data/product-documents-2022-12-28T03:19:10.545Z.json')
const collectionIndexFields = require('../index-fields/collection.json')
const productIndexFields = require('../index-fields/product.json')

initialize({
  store: egaStyleStore,
  collectionIndexFields,
  productIndexFields
})