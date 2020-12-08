'use strict';

const Role = require('roles_role');

class EnergyRole extends Role {
  get resource() {
    return RESOURCE_ENERGY;
  }

  get states() {
    return {
      [global.CREEP_STATE_REFILL]: this.refill,
      [global.CREEP_STATE_WORK]: this.work
    }
  }

  get startState() {
    return CREEP_STATE_REFILL;
  }

  memory(room) {
    return {
      targetRoom: this.findTargetRoom(room),
      sourceRoom: this.findSourceRoom(room)
    };
  }

  findSourceRoom(room) {
    return room.name;
  }

  assignSourceRoom(creep) {
    creep.sourceRoom = this.findSourceRoom(creep.room);

    return;
  }

  findSource(creep) {
    let source;

    // storage
    if (!source) {
      if (creep.room.storage && creep.room.storage.store[this.resource] > 0) {
        source = creep.room.storage;
      }
    }

    // containers with energy
    if (!source) {
      source = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return structure.structureType == STRUCTURE_CONTAINER &&
            structure.store[this.resource] > 0;
        }
      });
    }

    return source;
  }

  assignSource(creep) {
    const source = this.findSource(creep);

    if (source) {
      creep.source = source;
    } else {
      this.sourceNotFound(creep);
    }

    return;
  }

  sourceNotFound(creep) {
    // start working when no alternative source found
    this.changeState(creep, CREEP_STATE_WORK, false);
  }

  invalidSource(source) {
    return source.energy == 0 || (source.store && source.store[this.resource] == 0);
  }

  findTargetRoom(room) {
    return room.name;
  }

  assignTargetRoom(creep) {
    creep.targetRoom = this.findTargetRoom(creep.room);

    return;
  }

  findTarget(creep) {
    return;
  }

  assignTarget(creep) {
    const target = this.findTarget(creep);

    if (target) {
      creep.target = target;
    } else {
      this.targetNotFound(creep);
    }

    return;
  }

  targetNotFound(creep) {
    return;
  }

  invalidTarget(target) {
    return false;
  }

  work(creep) {
    // a working creep without energy needs to refill
    if (creep.store[this.resource] == 0) {
      creep.resetTarget();
      this.changeState(creep, CREEP_STATE_REFILL);
      return;
    }

    // a working creep without a target room needs to find one
    if (!creep.targetRoom) {
      this.assignTargetRoom(creep);
    }

    // a working creep in the wrong room needs to reach the target room
    if (!creep.inTargetRoom) {
      creep.moveToRoom(creep.targetRoom);
      return;
    }

    // a working creep needs a target
    if (!creep.target) {
      this.assignTarget(creep);
    }

    const target = creep.target;

    if (target && !this.invalidTarget(target)) {
      this.targetAction(creep, target);
    } else {
      creep.resetTarget();
    }

    return;
  }

  targetAction(creep, target) {
    return;
  }

  refill(creep) {
    // a refilling creep with full energy starts working
    if (creep.store.getFreeCapacity() == 0) {
      creep.resetSource();
      this.changeState(creep, CREEP_STATE_WORK);

      return;
    }

    // a refilling creep without a source room needs to find one
    if (!creep.sourceRoom) {
      this.assignSourceRoom(creep);
    }

    // a refilling creep in the wrong room needs to reach the source room
    if (!creep.inSourceRoom) {
      creep.moveToRoom(creep.sourceRoom);
      return;
    }

    // a refilling creep needs an energy source
    if (!creep.source) {
      this.assignSource(creep);
    }

    const source = creep.source;

    if (source && !this.invalidSource(source)) {
      this.sourceAction(creep, source);
    } else {
      creep.resetSource();
    }

    return;
  }

  sourceAction(creep, source) {
    if (creep.harvest(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);

      return;
    }

    if (creep.withdraw(source, this.resource) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);

      return;
    }

    if (creep.pickup(source) == ERR_NOT_IN_RANGE) {
      creep.moveTo(source);

      return;
    }

    return;
  }
}

module.exports = EnergyRole;
