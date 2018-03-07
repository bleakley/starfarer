unitVector = function(x, y) {
  let mag = Math.sqrt(x*x+y*y)
  return { x: x/mag, y: y/mag }
}

function randomNumber(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function percentChance(chance) { return randomNumber(1, 100) <= chance; }

randomOption = function(options) {
  if (_.sumBy(options, 'prob') != 100) {
    console.log('Error in random option selection, probabilities do not sum to 100.');
    console.log(options);
    return options[0].opt;
  }
  let roll = randomNumber(1, 100);
  let randomizedOptions = _.shuffle(options);

  for (let i = 0; i < options.length; i++) {
    if (roll <= options[i].prob)
      return options[i].opt;
    roll -= options[i].prob;
  }

  console.log('default bug in random option');
  return options[0].opt;
}

getEightWayDirection = function(x, y) {
  if (x == 0) {
    if (y > 0)
      return SOUTH;
    if (y < 0)
      return NORTH;
    return CENTER;
  }
  if (y == 0) {
    if (x > 0)
      return EAST;
    if (x < 0)
      return WEST;
  }

  let ratio = x/y;

  if (y >= 1) {
    if (ratio < OCTANT3)
      return WEST;
    if (ratio >= OCTANT3 && ratio <= OCTANT4)
      return SW;
    if (ratio > OCTANT4 && ratio < OCTANT1)
      return SOUTH;
    if (ratio >= OCTANT1 && ratio <= OCTANT2)
      return SE;
    if (ratio > OCTANT2)
      return EAST;
  } else {
    if (ratio < OCTANT3)
      return EAST;
    if (ratio >= OCTANT3 && ratio <= OCTANT4)
      return NE;
    if (ratio > OCTANT4 && ratio < OCTANT1)
      return NORTH;
    if (ratio >= OCTANT1 && ratio <= OCTANT2)
      return NW;
    if (ratio > OCTANT2)
      return WEST;
  }
  return CENTER;
}

drawJet = function(xCoord, yCoord, radius, callback) {
  for (var x = xCoord - radius/2; x < xCoord + radius/2; x++)
    for (var y = yCoord - radius*2; y < yCoord + radius*2; y++)
      callback(x, y);
}

drawSquareBody = function(xCoord, yCoord, radius, callback) {
  for (var x = xCoord - radius; x < xCoord + radius; x++)
    for (var y = yCoord - radius; y < yCoord + radius; y++)
      callback(x, y);
}

drawPseudoSphericalBody = function(xCoord, yCoord, radius, callback) {
  for (var x = xCoord - radius; x < xCoord + radius; x++) {
    for (var y = yCoord - radius + 1; y < yCoord + radius - 1; y++) {
      callback(x, y);
    }
  }

  for (var x = xCoord - radius + 1; x < xCoord + radius - 1; x++) {
      callback(x, yCoord - radius);
      callback(x, yCoord + radius - 1);
  }
}

getFiringOctant = function(facing, weaponMount) {
  if (weaponMount == MOUNT_TURRET)
    return CENTER;
  let octant = facing - 2*weaponMount; // they both go clockwise :)
  if (octant < 0)
    octant += 8;
  return octant;
}

getClockwiseOctant = function(octant) {
  if (octant == CENTER)
    return CENTER;
  let clockwise = octant + 1;
  if (clockwise > 7)
    clockwise = 0;
  return clockwise;
}

getCounterClockwiseOctant = function(octant) {
  if (octant == CENTER)
    return CENTER;
  let ccw = octant - 1;
  if (ccw < 0)
    ccw = 7;
  return ccw;
}

freeDiagonalDistance = function(pointA, pointB) { // distance between two points in a square world where diagonal movement costs 1
  return Math.max(Math.abs(pointA[0]-pointB[0]), Math.abs(pointA[1]-pointB[1]));
}


djikstraSearch = function(layer, avoid, map)
{
  console.log('Updating AI map...');
	var updatedLastIteration = true;
	while(updatedLastIteration) {
		let updatedThisIteration = false;
		for(var j = 0; j < MAP_HEIGHT; j++)
			for(var i = 0; i < MAP_WIDTH; i++) {

					let prevVal = map[i][j].dijkstra[layer];

					for(let d = 0; d < 8; d++) {

            let adjX = DIRECTIONS[d][0];
            let adjY = DIRECTIONS[d][1];
						let delta = 1;

            if (_.has(map, [i+adjX, j+adjY, 'dijkstra'])) {
              map[i][j].dijkstra[layer] = Math.min(map[i][j].dijkstra[layer], map[i+adjX][j+adjY].dijkstra[layer] + delta);
            }

					}
					if(map[i][j].dijkstra[layer] != prevVal)
						updatedThisIteration = true;
		}
		updatedLastIteration = updatedThisIteration;
	}
	console.log('done.');
  if(avoid) {
    console.log('Inverting AI map...');
    for(var j = 0; j < MAP_HEIGHT; j++)
			for(var i = 0; i < MAP_WIDTH; i++) {
        map[i][j].dijkstra[layer] = -1.2*map[i][j].dijkstra[layer];
      }
    djikstraSearch(layer, false, map);
  }
}

getPlayerShip = function(ships) {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].player)
      return ships[i];
  }
}
