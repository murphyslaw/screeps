'use strict';

require('version');

if (!Memory.SCRIPT_VERSION || Memory.SCRIPT_VERSION != SCRIPT_VERSION) {
  Memory.SCRIPT_VERSION = SCRIPT_VERSION;
  console.log('New code uploaded', SCRIPT_VERSION);
}

global.config = {
  debug: {
    active: true,
    scope: {
      global: true,
      test: true,
      test2: true,
      room: true,
    }
  }
}

class Logger {
  constructor(scope) {
    this._scope = scope;
  }

  get scope() {
    return this._scope;
  }

  get config() {
    return _.get(global, 'config.debug', {});
  }

  get active() {
    return _.get(global, 'config.debug.active', false);
  }

  get activeScope() {
    return _.get(this.config, 'scope.' + this._scope.toLowerCase(), false);
  }

  debug() {
    if (!this.active) { return; }
    if (!this.activeScope) { return; }

    const prefix = 'DEBUG:' + this.scope.toUpperCase();

    this.log(prefix, ...arguments);
  }

  log() {
    console.log(...arguments);
  }
}


class Test {
  foo () {
    this.logger.debug('Test');
  }
}

class Test2 {
  foo () {
    this.logger.debug('Test2');
  }
}

Test.prototype.logger = new Logger('test');
Test2.prototype.logger = new Logger('test2');
Room.prototype.logger = new Logger('room');

Room.prototype.debug = function(...messages) {
  this.logger.debug('"' + this.name + '"', '-', messages);
};

module.exports.loop = function() {
  const room = Game.rooms['sim'];
  const creep = room.find(FIND_MY_CREEPS)[0];
  const source = room.find(FIND_SOURCES)[0];

  const logger = new Logger('global');
  logger.debug('debug');
  logger.log('log');

  (new Test).foo();
  (new Test2).foo();

  room.debug('test room');
}
