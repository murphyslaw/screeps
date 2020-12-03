const roomManager = {
  defense: function(room) {
    const towers = room.find(FIND_MY_STRUCTURES, {
      filter: { structureType: STRUCTURE_TOWER }
    });

    _.forEach(towers, function(tower) {
      const closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: function(structure) {
          return structure.hits < structure.maxHits;
        }
      });

      if (closestDamagedStructure) {
        tower.repair(closestDamagedStructure)
      }

      const closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);

      if (closestHostile) {
        tower.attack(closestHostile);
      }
    });
  }
}

module.exports = roomManager;
