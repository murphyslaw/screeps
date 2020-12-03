Room.prototype.constructionSites = function() {
  return this.find(FIND_CONSTRUCTION_SITES);
};

Room.prototype.spawns = function () {
  return this.find(FIND_MY_SPAWNS);
};

Room.prototype.damagedStructures = function() {
  const targets = this.find(FIND_STRUCTURES, {
    filter: structure => structure.hits < structure.hitsMax
  });

  return targets.sort((a, b) => a.hits - b.hits);
};

Room.prototype.harvestSlots = function() {
  if (this.memory.harvestSlots) {
    return this.memory.harvestSlots;
  }

  const sources = this.find(FIND_SOURCES);
  let count = 0;

  for (const source of sources) {
    count += source.harvestSlots();
  }

  this.memory.harvestSlots = count;

  return count;
};
