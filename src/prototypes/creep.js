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
      if (value) {
        this.memory.source = value.id;
      } else if (this.memory.source) {
        delete this.memory.source;
      }

      return;
    },
    configurable: true
  },

  'destination': {
    get: function () {
      if (!this._destination && this.memory._move) {
        const destination = this.memory._move.dest

        if (destination) {
          this._destination = new RoomPosition(destination.x, destination.y, destination.room)
        }
      }

      return this._destination;
    },
    set: function (value) {
      if (!this.memory._move) {
        this.memory._move = {}
      }

      if (value) {
        const destination = value instanceof RoomPosition ? value : value.pos

        this.memory._move.dest = { x: destination.x, y: destination.y, room: destination.roomName }
      } else if (this.memory._move.dest) {
        delete this.memory._move.dest
      }

      return
    },
    configurable: true
  },

  'inDestinationRoom': {
    get: function () {
      if (!this.destination) return false

      return this.room.name === this.destination.roomName && !this.pos.isBorderPosition
    },
    configurable: true
  },

  'wounded': {
    get: function () {
      return Math.floor(this.hits / this.hitsMax * 100) < 75
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
      if (value) {
        this.memory.target = value.id;
      } else if (this.memory.target) {
        delete this.memory.target;
      }

      return;
    },
    configurable: true
  },

  'targetRoom': {
    get: function () {
      return this.memory.targetRoom;
    },
    set: function (value) {
      if (value) {
        this.memory.targetRoom = value;
      } else if (this.memory.targetRoom) {
        delete this.memory.targetRoom;
      }
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
      if (value) {
        this.memory.sourceRoom = value;
      } else if (this.memory.sourceRoom) {
        delete this.memory.sourceRoom;
      }
    },
    configurable: true
  },

  'inSourceRoom': {
    get: function () {
      return this.room.name == this.sourceRoom && !this.pos.isBorderPosition;
    },
    configurable: true
  },

  'sourceType': {
    get: function () {
      return this.memory.sourceType;
    },
    set: function (value) {
      this.memory.sourceType = value;
    },
    configurable: true
  },

  'resources': {
    get: function() {
      return this.store.resources;
    },
    configurable: true
  }
});

Creep.prototype.moveToRoom = function(roomName) {
  if (roomName) {
    return this.moveTo(new RoomPosition(25, 25, roomName));
  }
}

Creep.prototype.resetTarget = function() {
  this.targetRoom = null;
  this.target = null;
}

Creep.prototype.resetSource = function() {
  this.sourceRoom = null;
  this.source = null;
}

Creep.prototype.recycle = function() {
  const spawn = Game.spawns['Spawn1']

  if (spawn && spawn.recycleCreep(this) == ERR_NOT_IN_RANGE) {
    return this.moveTo(spawn)
  }

  return
}