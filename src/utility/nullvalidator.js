'use strict'

class NullValidator {
  isValid() { return true }
  filter(results) { return results }
}

global.NullValidator = NullValidator
