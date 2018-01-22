const testUtils = require('./test-utils')

module.exports = function() {
  testUtils.initFirebase()
  return testUtils.cleanFirebase()
}