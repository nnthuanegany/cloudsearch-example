const { createProductDocumentsFromHaravanProducts } = require('../../tools')
const egaStyleStore = require('../../store/ega-style.json')

createProductDocumentsFromHaravanProducts(egaStyleStore)