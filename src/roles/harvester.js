'use strict';

const EnergyRole = require('roles_energyrole');

class Harvester extends EnergyRole {
  get maxCreepSize() {
    return 15;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    return room.sources.length;
  }

  findTarget(creep) {
    let targets = [];

    // containers with free capacity the creep stands on
    if (!targets.length) {
      targets = creep.pos.lookFor(LOOK_STRUCTURES);
      targets = _.filter(targets, function(structure) {
        return structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getFreeCapacity(this.resource) > 0;
      }, this);
    }

    // source container
    if (!targets.length) {
      const sourceContainers = creep.room.sourceContainers;

      targets = _.filter(sourceContainers, function(container) {
        return container.store.getFreeCapacity(this.resource) > 0;
      }, this)
    }

    const target = targets.length > 1 ? creep.pos.findClosestByPath(targets) : targets[0];

    return target;
  }

  findSource(creep) {
    const sources = creep.room.sources;

    for (const source of sources) {
      if (source && source.vacancies()) {
        return source;
      }
    }

    return;
  }

  // validate if the target store got full in the meantime
  invalidTarget(target) {
    return target.store && target.store.getFreeCapacity(this.resource) == 0;
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};

module.exports = new Harvester();
