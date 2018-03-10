unitVector = function(x, y) {
  let mag = Math.sqrt(x*x+y*y)
  return [x/mag, y/mag]
}

crossProduct = function(a, b) {
  return Math.abs(a[0]*b[1] - a[1]*b[0]);
}

function randomNumber(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function percentChance(chance) { return randomNumber(1, 100) <= chance; }

randomOption = function(options) {
  let roll = randomNumber(1, _.sumBy(options, 'prob'));
  let randomizedOptions = _.shuffle(options);

  for (let i = 0; i < options.length; i++) {
    if (roll <= options[i].prob)
      return options[i].opt;
    roll -= options[i].prob;
  }

  console.log('default bug in random option');
  return options[0].opt;
}

getAnomalyName = function() {
  let num = randomNumber(0,99).toString().padStart(2, '0');
  let goodScrabbleLetter = ['X', 'Q', 'Z', 'J', 'K'].random();
  let badScrabbleLetter = ['A', 'B', 'C', 'D', 'E'].random()
  return `Anomaly ${goodScrabbleLetter}${num}-${badScrabbleLetter}`;
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

function drawline(x0,y0,x1,y1, callback){
  var tmp;
  var steep = Math.abs(y1-y0) > Math.abs(x1-x0);
  if(steep){
  	//swap x0,y0
  	tmp=x0; x0=y0; y0=tmp;
    //swap x1,y1
    tmp=x1; x1=y1; y1=tmp;
  }

  var sign = 1;
  if(x0>x1){
    sign = -1;
    x0 *= -1;
    x1 *= -1;
  }
  var dx = x1-x0;
  var dy = Math.abs(y1-y0);
  var err = ((dx/2));
  var ystep = y0 < y1 ? 1:-1;
  var y = y0;

  for(var x=x0;x<=x1;x++){
    //if(!(steep ? callback(y,sign*x) : callback(sign*x,y)))
      //continue;
    steep ? callback(y,sign*x) : callback(sign*x,y)
    err = (err - dy);
    if(err < 0){
      y+=ystep;
      err+=dx;
    }
  }
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
  return(null);
}

getPlayerSystem = function(universe) {
  for (let i = 0; i < universe.systems.length; i++) {
    if (getPlayerShip(universe.systems[i].ships) != null)
      return universe.systems[i];
  }
  console.log("couldn't find player!")
}

warp = function (ship, source, destination) {
  source.removeShip(ship);
  destination.ships.push(ps);
  coords = destination.randomUnoccupiedSpace();
  ship.xCoord = coords[0];
  ship.yCoord = coords[1];
  ship.xMoment = randomNumber(-2,2);
  ship.yMoment = randomNumber(-2,2);
  ship.xCursor = ps.xMoment;
  ship.yCursor = ps.yMoment;
  ship.facing = getEightWayDirection(ps.xMoment, ps.yMoment);
  if (ship.player) {
    source.bgm.pause();
    destination.bgm.play();
  }
}

randomLargeBodyName = function () {
  const NGC = 0;
  const COMMON_NAME = 1;
  const CONSTELLATION_NAME = 2;
  var options = [{opt: NGC, prob: 20}, {opt: COMMON_NAME, prob: 50}, {opt: CONSTELLATION_NAME, prob: 30}];
  var name = null;
  do { 
    var choice = randomOption(options);
    switch (choice) {
      case NGC:
        name = "NGC-" + randomNumber(1000,9999);
        break;
      case COMMON_NAME:
        name = STAR_COMMON_NAMES.random();
        break;
      case CONSTELLATION_NAME:
        name = GREEK_LETTERS.random() + " " + CONSTELLATION_NAMES_POSSESSIVE.random();
    }
  }
  while(USED_BODY_NAMES.indexOf(name) < -1);
  USED_BODY_NAMES.push(name);
  return name;
}

randomSmallBodyName = function (p) {
  const COMMON_NAME = 0;
  const SCIENTIFIC_NAME = 1;
  const SYSTEM_DERIVED_NAME = 1;
  var options = [{opt: COMMON_NAME, prob: 40}, {opt: SCIENTIFIC_NAME, prob: 30}, {opt: SYSTEM_DERIVED_NAME, prob: 30}];
  var name = null;
  do { 
    var choice = randomOption(options);
    switch (choice) {
      case COMMON_NAME:
        name = SMALL_BODY_COMMON_NAMES.random();
        break;
      case SCIENTIFIC_NAME:
        name = SMALL_BODY_SCIENTIFIC_NAMES.random() + randomNumber(1,999);
        break;
      case SYSTEM_DERIVED_NAME:
        name = p.system.name + " " + SMALL_BODY_SYSTEM_DERIVED_NAMES.random();
        if (p.system.name.substring(0,3) == "NGC")
          name = null;
    }
  }
  while(name != null && USED_BODY_NAMES.indexOf(name) < -1);
  USED_BODY_NAMES.push(name);
  return name;
}

equipWeapon = function (ship, weapon, callback) {
  let message = `You have a new ${weapon.name}. Where will you mount it?`;
  var options = [];
  if (ship.maneuverCost < ship.energyMax) {
    options.push({ t: `Mount it on the forward end of the ship. (+1 mass)`, o: () => {
        ship.mountWeapon(weapon, MOUNT_FWD);
        ship.minCrew++;
        ship.maneuverCost++;
        drawSideBar();
        callback();
      }
    });
    options.push({ t: `Mount it on the starboard side. (+1 mass)`, o: () => {
        ship.mountWeapon(weapon, MOUNT_STBD);
        ship.minCrew++;
        ship.maneuverCost++;
        drawSideBar();
        callback();
      }
    });
    options.push({ t: `Mount it on the port side. (+1 mass)`, o: () => {
        ship.mountWeapon(weapon, MOUNT_PORT);
        ship.minCrew++;
        ship.maneuverCost++;
        drawSideBar();
        callback();
      }
    });
  }
  if (ps.maneuverCost + AFT_MOUNT_PENALTY < ps.energyMax) {
    options.push({ t: `Mount it on the aft end of the ship. It's bulky and will likely interfere with propulsion. (+${1 + AFT_MOUNT_PENALTY} mass)`, o: () => {
        ship.mountWeapon(weapon, MOUNT_AFT);
        ship.minCrew++;
        ship.maneuverCost += 1 + AFT_MOUNT_PENALTY;
        drawSideBar();
        callback();
      }
    });
  }
  options.push({ t: `Just jettison it. The thing will only slow us down.`, o: callback });

  var so = new selectOption(message, options);
  so.run();
}
