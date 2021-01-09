'use strict'

class Action {
  execute() { throw Error('not implemented') }
}

global.Action = Action
