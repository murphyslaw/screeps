'use strict'

class Sandbox {
  run() {
    try {

    } catch(error) {
      console.log('SANDBOX', error.stack)
    }

  }
}

global.Sandbox = new Sandbox()
