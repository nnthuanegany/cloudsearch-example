const { initialize } = require('../main')
const egaStyleStore = require('../store/ega-style.json')
const collectionIndexFields = require('../index-fields/collection.json')
const productIndexFields = require('../index-fields/product.json')

initialize({
  store: egaStyleStore,
  collectionIndexFields,
  productIndexFields
})