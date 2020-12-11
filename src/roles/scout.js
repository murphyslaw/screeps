'use strict';

const Role = require('roles_role');

class Scout extends Role {
  get bodyPattern() {
    return [MOVE];
  }

  number(room) {
    return 0;
  }
};

module.exports = new Scout();
