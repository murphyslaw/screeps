'use strict';

const EnergyRole = require('roles_energyrole');

class Upgrader extends EnergyRole {
  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  get maxCreepSize() {
    return 15;
  }

  number(room) {
    return room.controller.container ? 1 : 0;
  }

  findTarget(creep) {
    return creep.room.controller;
  }

  findSource(creep) {
    let source;

    // controller container
    if (!source) {
      const container = _.get(creep.room, 'controller.container');

      if (container && container.store[this.resource] > 0) {
        source = container;
      }
    }

    // energy source
    if (!source && !creep.room.controller.container) {
      source = creep.pos.findClosestByPath(creep.room.sources);
    }

    return source;
  }

  targetAction(creep, target) {
    if (creep.upgradeController(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new Upgrader();
