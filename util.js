const { v4 } = require('uuid')

function generateId() {
  return v4()
}

const ObjectCodes = {
  collection: 'clt',
  product: 'prd'
}

const awaitWithPromise = (timeout) => new Promise((resolve) => setTimeout(() => resolve(true), timeout));

module.exports = {
  generateId,
  ObjectCodes,
  awaitWithPromise
}