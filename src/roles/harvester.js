'use strict';

global.Harvester = class extends EnergyRole {
  get name() { return 'harvester' }

  get maxCreepSize() {
    return this.bodyPattern.length * 5;
  }

  get bodyPattern() {
    return [WORK, CARRY, MOVE];
  }

  number(room) {
    // return room.sources.length;
    return 0;
  }

  findTarget(creep) {
    let targets = [];

    // containers with free capacity the creep stands on
    if (!targets.length) {
      targets = creep.pos.lookFor(LOOK_STRUCTURES);
      targets = _.filter(targets, function(structure) {
        return structure.structureType == STRUCTURE_CONTAINER &&
          structure.store.getFreeCapacity(this.resource(creep)) > 0;
      }, this);
    }

    // source container
    if (!targets.length) {
      const sourceContainers = creep.room.sourceContainers;

      targets = _.filter(sourceContainers, function(container) {
        return container.store.getFreeCapacity(this.resource(creep)) > 0;
      }, this)
    }

    if (!targets.length) {
      targets = [creep.room.storage];
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

  invalidTarget(creep, target) {
    return target.store && target.store.getFreeCapacity(this.resource(creep)) == 0;
  }

  targetAction(creep, target) {
    if (creep.transfer(target, this.resource(creep)) == ERR_NOT_IN_RANGE) {
      creep.moveTo(target);
    }

    return;
  }
};
