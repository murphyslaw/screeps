'use strict';

const Role = require('roles_role');

class Scout extends Role {
  get bodyPattern() {
    return [MOVE];
  }

  get maxCreepSize() {
    return 1;
  }

  number(room) {
    return 0;
  }
};

module.exports = new Scout();
