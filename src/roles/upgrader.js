'use strict';

global.Upgrader = class extends EnergyRole {
  get name() { return 'upgrader' }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  get maxCreepSize() {
    return this.bodyPattern.length * 6;
  }

  get keepTarget() {
    return true;
  }

  number(room) {
    return room.controller.container ? 2 : 0;
  }

  findTarget(creep) {
    return creep.room.controller;
  }

  findSource(creep) {
    let source;

    // controller container
    if (!source) {
      const container = _.get(creep.room, 'controller.container');

      if (container && container.store[this.resource(creep)] > 0) {
        source = container;
      }
    }

    // storage
    if (!source) {
      const storage = creep.room.storage;

      if (storage && storage.store[this.resource(creep)] > 0)
      source = creep.room.storage;
    }

    // energy source
    if (!source) {
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
