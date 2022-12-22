const { CloudSearchDomain } = require('aws-sdk')
const cloudSearchDomain = new CloudSearchDomain({
  region: '<REGION>',
  credentials: {
    accessKeyId: '<ACCESS_KEY_ID>',
    secretAccessKey: '<SECRET_ACCESS_KEY>'
  },
  endpoint: '<ENDPOINT>'
})

module.exports = cloudSearchDomain