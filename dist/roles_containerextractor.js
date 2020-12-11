'use strict';

const EnergyRole = require('roles_energyrole');

class ContainerExtractor extends EnergyRole {
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
    return room.extractors.length;
  }

  findSource(creep) {
    const sources = _.filter(creep.room.minerals, function (source) {
      return !_.some(this.creeps, 'source', source);
    }, this);

    return sources[0];
  }

  invalidSource(creep, source) {
    return source.mineralAmount === 0;
  }

  sourceNotFound(creep) {
    return;
  }

  sourceAction(creep, source) {
    const container = source.container;

    if (container) {
      if (creep.pos.isEqualTo(container) && !source.extractor.cooldown) {
        creep.harvest(source);
      } else {
        creep.moveTo(container);
      }
    }

    return;
  }
};

module.exports = new ContainerExtractor();
