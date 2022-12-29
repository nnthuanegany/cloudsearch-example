const { createCollectionDocumentsFromHaravanCollections } = require('../../tools')
const egaStyleStore = require('../../store/ega-style.json')

createCollectionDocumentsFromHaravanCollections(egaStyleStore)