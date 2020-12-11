'use strict';

global.CREEP_STATE_INITIALIZE = 0;
global.CREEP_STATE_REFILL = 2;
global.CREEP_STATE_WORK = 3;
global.CREEP_STATE_RECYCLE = 9;

class Role {
  get name() {
    return this.constructor.name.toLowerCase();
  }

  get randomName() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2);
  }

  get bodyPattern() {
    return [];
  }

  get startState() {
    return CREEP_STATE_INITIALIZE;
  }

  get creeps() {
    return _.filter(Game.creeps, 'role', this.name);
  }

  get maxSpawnTime() {
    return this.maxCreepSize * CREEP_SPAWN_TIME;
  }

  get maxCreepSize() {
    return this.bodyPattern.length;
  }

  get states() {
    return {}
  }

  number(room) {
    return 0;
  }

  bodyparts(energyAvailable) {
    const pattern = this.bodyPattern;
    const patternSize = pattern.length;
    const maxFactor = Math.floor(this.maxCreepSize / patternSize);

    const patternCost = _.sum(pattern, s => BODYPART_COST[s]);
    const patternFactor = Math.floor(energyAvailable / patternCost);

    const factor = Math.min(patternFactor, maxFactor);

    return _.flatten(Array(factor).fill(pattern));
  }

  memory(room) {
    return {};
  }

  changeState(creep, state, rerun = true) {
    creep.state = state;

    if (rerun) {
      this.run(creep);
    }

    return;
  }

  run(creep) {
    let state = creep.state;

    if (!state) {
      state = creep.state = this.startState;
    }

    const action = this.states[state];

    if (action) {
      action.call(this, creep);
    } else {
      switch (state) {
        case global.CREEP_STATE_INITIALIZE:
          this.initialize(creep);
          break;
        case global.CREEP_STATE_RECYCLE:
          this.recycle(creep);
          break;
      }
    }


    return;
  }

  initialize(creep) {
    return;
  }

  isIdle(creep) {
    return false;
  }

  recycle(creep) {
    creep.recycle();

    return;
  }

  wantsToSpawn(room) {
    const creeps = this.creeps;

    const count = creeps.length;
    const number = this.number(room);

    if (count > number) { return false; }

    const renew = _.some(creeps, function (creep) {
      return creep.ticksToLive <= this.maxSpawnTime;
    }, this)

    return (count < number) || (count == number && renew);
  }

  spawn(room) {
    const spawn = room.nonSpawningSpawns[0];

    if (spawn) {
      const name = this.randomName;
      const bodyparts = this.bodyparts(room.energyAvailable);
      const memory = this.memory(room);
      memory['role'] = this.name;

      if (spawn.spawnCreep(bodyparts, name, { memory: memory }) == OK) {
        console.log('Spawning ' + this.name + ': ' + name);
      }
    }

    return;
  }
}

module.exports = Role;
