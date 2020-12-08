'use strict';

const EnergyRole = require('roles_energyrole');

class Builder extends EnergyRole {
  get maxCreepSize() {
    return 6;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return room.constructionSites.length > 0 ? 1 : 0;
  }

  findTarget(creep) {
    return creep.pos.findClosestByPath(FIND_CONSTRUCTION_SITES);
  }

  targetNotFound(creep) {
    // TODO violates single responsibility principle, but useful because when
    // walls or ramparts are build then the creep automatically repairs them
    // afterwards.
    creep.role = 'repairer';
  }

  targetAction(creep, target) {
    if (creep.build(target) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }
  }
};

module.exports = new Builder();
