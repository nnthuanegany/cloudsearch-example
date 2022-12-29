const { v4 } = require('uuid')

function generateId() {
  return v4()
}

const ObjectCodes = {
  collection: 'clt',
  product: 'prd'
}

const awaitWithPromise = (timeout) => new Promise((resolve) => setTimeout(() => resolve(true), timeout));

const isNullOrUndefined = (anything) => anything === null || anything === undefined

const isEmptyString = (anything) => isNullOrUndefined(anything) || anything.trim() === ''

module.exports = {
  generateId,
  ObjectCodes,
  awaitWithPromise,
  isNullOrUndefined,
  isEmptyString
}