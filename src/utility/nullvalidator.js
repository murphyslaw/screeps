'use strict'

class NullValidator {
  isValid() { return true }
}

global.NullValidator = NullValidator
