RoomPosition.prototype.adjacentPositions = function() {
  const positions = [];
  let x;
  let y;

  for (let xRange = 1; xRange >= -1; xRange--) {
    x = _.clamp(this.x + xRange, 1, 49);

    for (let yRange = 1; yRange >= -1; yRange--) {
      y = _.clamp(this.y + yRange, 1, 49);

      if (!(x == this.x && y == this.y)) {
        positions.push(new RoomPosition(x, y, this.roomName));
      }
    }
  }

  return positions;
};