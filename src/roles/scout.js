'use strict';

global.Scout = class extends Role {
  get name() { return 'scout' }

  get bodyPattern() {
    return [MOVE];
  }

  number(room) {
    return 0;
  }
};
