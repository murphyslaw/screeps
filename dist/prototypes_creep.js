'use strict';

Object.defineProperties(Creep.prototype, {
  'role': {
    get: function () {
      return this.memory.role;
    },
    set: function (value) {
      this.memory.role = value;

      return;
    },
    configurable: true
  },

  'state': {
    get: function () {
      return this.memory.state;
    },
    set: function (value) {
      this.memory.state = value;

      return;
    },
    configurable: true
  },

  'source': {
    get: function () {
      if (!this._source) {
        this._source = Game.getObjectById(this.memory.source)
      }

      return this._source;
    },
    set: function (value) {
      this.memory.source = value.id;

      return;
    },
    configurable: true
  },

  'target': {
    get: function () {
      if (!this._target) {
        this._target = Game.getObjectById(this.memory.target)
      }

      return this._target;
    },
    set: function (value) {
      this.memory.target = value.id;

      return;
    },
    configurable: true
  },

  'targetRoom': {
    get: function () {
      return this.memory.targetRoom;
    },
    set: function (value) {
      this.memory.targetRoom = value;
    },
    configurable: true
  },

  'inTargetRoom': {
    get: function () {
      return this.room.name == this.targetRoom && !this.pos.isBorderPosition;
    },
    configurable: true
  },

  'sourceRoom': {
    get: function () {
      return this.memory.sourceRoom;
    },
    set: function (value) {
      this.memory.sourceRoom = value;
    },
    configurable: true
  },

  'inSourceRoom': {
    get: function () {
      return this.room.name == this.sourceRoom && !this.pos.isBorderPosition;
    },
    configurable: true
  }
});

Creep.prototype.resetSource = function() {
  delete this.memory.source;
}

Creep.prototype.resetTarget = function () {
  delete this.memory.target;
}

Creep.prototype.moveToRoom = function(roomName) {
  if (roomName) {
    return this.moveTo(new RoomPosition(25, 25, roomName));
  }
}

Creep.prototype.recycle = function() {
  const spawn = this.room.spawns[0];

  if (spawn && spawn.recycleCreep(this) == ERR_NOT_IN_RANGE) {
    return this.moveTo(spawn);
  }

  return;
}
