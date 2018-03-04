const MAP_WIDTH = 120;
const MAP_HEIGHT = 50;



var planets = [
  {
    name: 'CLASS G STAR',
    xCoord: 75,
    yCoord: 30,
    radius: 4,
    class: BODY_STAR_YELLOW,
    mass: 100
  },
  {
    name: 'CERES',
    xCoord: 20,
    yCoord: 20,
    radius: 2,
    class: BODY_PLANET_BARREN,
    mass: 1
  }
];

let turn = 0;

var ships = [];

let ps = new Ship([20,10], [2,2], 5, 3, 10);
ps.name = `player's ship`;
ps.player = true;
ps.powerDown();
ships.push(ps);
let s2 = new Ship([30,30], [1,-2], 5, 3, 10);
ships.push(s2);

var map = [];

var selectDirection = {};
var highlightObjects = {};
var currentlyHighlightedObject = null;

var notEnoughEnergy = new Audio('sounds/Battlecruiser_EnergyLow00.mp3');
var bgm = new Audio('sounds/bgm_01.mp3');
bgm.loop = true;

/*

# ~ terrain
. background
@ player
A anomaly
S station
B battleship
C carrier
D destroyer
F frigate
f fighter
b bomber
s shuttle

..............
..###.........
.#####...@>...
..###.........
..............
...#####......
..##~##~#.....
..##~~###.....
..#~~#~##.....
...###~#...^..
...........B..
..............
..#####.......
.#######......
#########.....
#########.....
#########.....
.#######......
..#####.......
..............

*/

unitVector = function(x, y) {
  let mag = Math.sqrt(x*x+y*y)
  return { x: x/mag, y: y/mag }
}

function randomNumber(min, max) { return min + Math.floor(Math.random() * (max - min + 1)); }
function percentChance(chance) { return randomNumber(1, 100) <= chance; }

randomOption = function(table) {
  let keys = Object.keys(table);
  let dflt = table[keys[0]];
  let roll = randomNumber(1, 100);
  for (let i = 0; i < keys.length; i++) {
    let prob = parseFloat(keys[i]);
    if (isNaN(prob))
      return dflt;
    if (roll <= prob)
      return table[keys[i]];
    roll -= prob;
  }
  return dflt;
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

generateMap = function()
{
  for(var i = 0; i < MAP_WIDTH; i++) {
  	map[i] = [];
  	for(var j = 0; j < MAP_HEIGHT; j++) {
  		map[i][j] = {
        terrain: randomOption({ '80': TERRAIN_NONE_EMPTY, '15': TERRAIN_NONE_DIM_STAR, '5': TERRAIN_NONE_BRIGHT_STAR}),
        body: null
      }
  	}
  }

  planets.forEach((p) => {
    console.log(p);
    for (var x = p.xCoord - p.radius; x < p.xCoord + p.radius; x++) {
  		for (var y = p.yCoord - p.radius; y < p.yCoord + p.radius; y++) {
  			map[x][y].body = p;
        switch(p.class) {
          case BODY_STAR_YELLOW:
            map[x][y].terrain = TERRAIN_STAR_YELLOW;
            break;
          case BODY_BLACK_HOLE:
            map[x][y].terrain = TERRAIN_BLACK_HOLE;
            break;
          case BODY_ANOMALY:
            map[x][y].terrain = TERRAIN_ANOMALY;
            break;			
          default:
            map[x][y].terrain = [TERRAIN_BARREN_1, TERRAIN_BARREN_2, TERRAIN_BARREN_3].random();
        }
      }
  	}
    map[p.xCoord - p.radius][p.yCoord - p.radius].body = null;
    map[p.xCoord - p.radius][p.yCoord - p.radius].terrain = TERRAIN_NONE_EMPTY;
    map[p.xCoord - p.radius][p.yCoord + p.radius - 1].body = null;
    map[p.xCoord - p.radius][p.yCoord + p.radius - 1].terrain = TERRAIN_NONE_EMPTY;
    map[p.xCoord + p.radius - 1][p.yCoord - p.radius].body = null;
    map[p.xCoord + p.radius - 1][p.yCoord - p.radius].terrain = TERRAIN_NONE_EMPTY;
    map[p.xCoord + p.radius - 1][p.yCoord + p.radius - 1].body = null;
    map[p.xCoord + p.radius - 1][p.yCoord + p.radius - 1].terrain = TERRAIN_NONE_EMPTY;
  });

}

drawHighlight = function(p) {
  for (var x = p.xCoord - p.radius - 1; x < p.xCoord + p.radius + 1; x++) {
    mapDisplay.draw(x, p.yCoord - p.radius - 1, "#", "#0E4");
    mapDisplay.draw(x, p.yCoord + p.radius, "#", "#0E4");
  }
  for (var y = p.yCoord - p.radius - 1; y < p.yCoord + p.radius + 1; y++) {
    mapDisplay.draw(p.xCoord - p.radius - 1, y, "#", "#0E4");
    mapDisplay.draw(p.xCoord + p.radius, y, "#", "#0E4");
  }
  mapDisplay.drawText(p.xCoord + p.radius + 2,  p.yCoord - p.radius - 1, `%c{#0E4}${p.name}`);
  mapDisplay.drawText(p.xCoord + p.radius + 2,  p.yCoord - p.radius, `%c{#0E4}MASS: ${p.mass} x10^28 kg`);
}

drawAll = function(recursion)
{
	for (var x = 0; x < MAP_WIDTH; x++) {
		for (var y = 0; y < MAP_HEIGHT; y++) {
		  var tile = randomOption(tiles[map[x][y].terrain]);
          mapDisplay.draw(x, y, tile.character, tile.color, tile.backgroundColor);
		}
	}

  planets.forEach((p) => {
    if (p == currentlyHighlightedObject) {
      drawHighlight(p);
    }
  });

  ships.forEach((s) => {
    mapDisplay.draw(s.xCoord, s.yCoord, s.char, "#FFF");
    if (s.player)
      mapDisplay.draw(s.xCoord+s.xMoment, s.yCoord+s.yMoment, "0", "#0E4");
    let direction = getEightWayDirection(s.xMoment, s.yMoment);
    mapDisplay.draw(s.xCoord+DIRECTIONS[direction][0], s.yCoord+DIRECTIONS[direction][1], ARROWS[direction], s.player ? "#0E4" : "red");

    if (s.player) {
      let maneuverMagnitude = Math.max(Math.abs(s.xCursor - s.xMoment), Math.abs(s.yCursor - s.yMoment));
      if (s.energy >= maneuverMagnitude * s.maneuverCost)
        mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#0E4");
      else
        mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#B63");
    } else {
      mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "red");
    }

  });

  drawSideBar();

	if(recursion)
		setTimeout(function() {
			drawAll(true);
		}, 900)

}

drawSideBar = function()
{
  let ps = getPlayerShip();
	sideBarDisplay.clear();
	sideBarDisplay.drawText(2, 0, `Turn: ${turn}`);
  sideBarDisplay.drawText(2, 1, `BitCredits: ${ps.credits}`);
	sideBarDisplay.drawText(2, 3, `Hull: ${ps.hull}/${ps.hullMax}`);
	sideBarDisplay.drawText(2, 4, `Shields: ${ps.shields}/${ps.shieldsMax}`);
	sideBarDisplay.drawText(2, 5, `Energy: ${ps.energy}/${ps.energyMax} (+${ps.energyRegen})`);
	sideBarDisplay.drawText(2, 6, `Maneuver: -${ps.maneuverCost}/\u0394`);
}

init = function()
{
  generateMap();
	mapDisplay = new ROT.Display({
		width:MAP_WIDTH, height:MAP_HEIGHT,
		layout:"rect", forceSquareRatio: false
	});

  sideBarDisplay = new ROT.Display({
		width:20, height:MAP_HEIGHT,
		layout:"rect", fg: "#0E4", forceSquareRatio: false
	});

	document.body.appendChild(mapDisplay.getContainer());
  document.body.appendChild(sideBarDisplay.getContainer());

	drawAll(true);
	bgm.play()
  playerTurn();
}

getPlayerShip = function() {
  for (let i = 0; i < ships.length; i++) {
    if (ships[i].player)
      return ships[i];
  }
}

moveCursor =  function(direction) {
  let playerShip = getPlayerShip();
  let dx = DIRECTIONS[direction][0];
  let dy = DIRECTIONS[direction][1];
  if (Math.abs(playerShip.xCursor+dx-playerShip.xMoment) > playerShip.maneuverLevel)
    return false;
  if (Math.abs(playerShip.yCursor+dy-playerShip.yMoment) > playerShip.maneuverLevel)
    return false;

  playerShip.xCursor += dx;
  playerShip.yCursor += dy;
  return true;
}

advanceTurn =  function() {
  ships.forEach((s) => {
    let maneuverMagnitude = Math.max(Math.abs(s.xCursor - s.xMoment), Math.abs(s.yCursor - s.yMoment));
    if (s.energy >= maneuverMagnitude * s.maneuverCost) {
      s.energy -= maneuverMagnitude * s.maneuverCost;
      s.xMoment = s.xCursor;
      s.yMoment = s.yCursor;
    } else if (s.player) {
      notEnoughEnergy.play();
    }

    s.xCoord += s.xMoment;
    s.yCoord += s.yMoment;

    let speed = Math.max(Math.abs(s.xMoment), Math.abs(s.yMoment));
    if(_.has(map, [s.xCoord, s.yCoord, 'terrain']))
      switch(map[s.xCoord][s.yCoord].terrain) {
        case TERRAIN_STAR_YELLOW:
          if (s.takeDamage(10*(speed+1))) {
            s.stop();
          }
          break;
        case TERRAIN_BARREN_1:
        case TERRAIN_BARREN_2:
        case TERRAIN_BARREN_3:
          if (s.takeDamage(2*(Math.max(0, speed-1)))) {
            s.stop();
          }
      }

    if(s.energy >= s.energyMax) {
      s.shields = Math.min(s.shields + 1, s.shieldsMax);
    }
    s.energy = Math.min(s.energy + s.energyRegen, s.energyMax);
  });
  turn++;
  playerTurn();
}



highlightObjects.handleEvent = function(event) {
  let coords = mapDisplay.eventToPosition(event);
  if(!_.has(map, [coords[0], coords[1], 'body']))
    return;

  let body = map[coords[0]][coords[1]].body;
  if (body == currentlyHighlightedObject) {
    return;
  }

  currentlyHighlightedObject = body;
  if (body)
    drawHighlight(body);
  else drawAll();
};

selectDirection.handleEvent = function(event) {
	//console.log("event handle key code: " + event.keyCode);
	console.log(event.keyCode);
	switch(event.keyCode)
	{
		case 103:
		case 36:
		case 55:
			//numpad7, top left
      if (moveCursor(NW)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
		case 105:
		case 33:
		case 57:
			//numpad9, top right
      if (moveCursor(NE)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
		case 100:
		case 37:
			//numpad4, left
      if (moveCursor(WEST)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
		case 102:
		case 39:
			//numpad6, right
      if (moveCursor(EAST)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
		case 191:
			//?
			console.log('help');
			break;
		case 97:
		case 35:
		case 49:
			//numpad1, bottom left
      if (moveCursor(SW)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
		case 99:
		case 34:
		case 51:
			//numpad3, bottom right
      if (moveCursor(SE)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
    case 40:
			//numpad2, down
      if (moveCursor(SOUTH)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
    case 38:
			//numpad8, up
      if (moveCursor(NORTH)) {
        window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
    case 32:
			//space, next turn
			window.removeEventListener('keydown', this);
      advanceTurn();
			break;
	}

};

playerTurn = function()
{
	drawAll();
	window.addEventListener('keydown', selectDirection);
  window.addEventListener('mousemove', highlightObjects);
}
