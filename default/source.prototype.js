Source.prototype.harvestSlots = function() {
  const terrain = this.room.getTerrain();
  const adjacentPositions = this.pos.adjacentPositions();

  return _.filter(adjacentPositions, function(position) {
    return terrain.get(position.x, position.y) != TERRAIN_MASK_WALL;
  }).length;
};
