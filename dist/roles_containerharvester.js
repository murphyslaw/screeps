'use strict';

const EnergyRole = require('roles_energyrole');

class ContainerHarvester extends EnergyRole {
  get bodyPattern() {
    return [WORK, WORK, WORK, WORK, WORK, MOVE];
  }

  get states() {
    return {
      [global.CREEP_STATE_REFILL]: this.refill
    }
  }

  get keepSource() {
    return true;
  }

  get keepTarget() {
    return true;
  }

  number(room) {
    return room.sourceContainers.length;
  }

  findSource(creep) {
    const sources = _.filter(creep.room.sources, function(source) {
      return !_.some(this.creeps, 'source', source);
    }, this);

    return creep.pos.findClosestByPath(sources);
  }

  sourceNotFound(creep) {
    return;
  }

  sourceAction(creep, source) {
    const container = source.container;

    if (container) {
      if (creep.pos.isEqualTo(container)) {
        creep.harvest(source);
      } else {
        creep.moveTo(container);
      }
    }

    return;
  }
};

module.exports = new ContainerHarvester();
