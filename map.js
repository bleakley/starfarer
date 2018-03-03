const MAP_WIDTH = 120;
const MAP_HEIGHT = 50;

const BODY_STAR_YELLOW = 0;
const BODY_STAR_RED = 1;
const BODY_STAR_BLUE = 2;
const BODY_STAR_ORANGE = 3;
const BODY_PLANET_BARREN = 4;
const BODY_PLANET_TERRAN = 5;
const BODY_PLANET_FROZEN = 6;
const BODY_PLANET_VOLCANIC = 7;
const BODY_PLANET_TOXIC = 8;
const BODY_GAS_1 = 9;
const BODY_GAS_2 = 10;
const BODY_GAS_3 = 11;
const BODY_GAS_4 = 12;


const TERRAIN_NONE_EMPTY = 0;
const TERRAIN_NONE_DIM_STAR = 1;
const TERRAIN_NONE_BRIGHT_STAR = 2;
const TERRAIN_STAR_YELLOW = 3;
const TERRAIN_CORONA_YELLOW = 4;
const TERRAIN_BARREN_1 = 5;
const TERRAIN_BARREN_2 = 6;
const TERRAIN_BARREN_3 = 7;
const TERRAIN_GRASS = 8;
const TERRAIN_WATER = 9;
const TERRAIN_ICE = 10;

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

const EAST = 0;
const WEST = 4;
const NORTH = 2;
const SOUTH = 6;
const NE = 1;
const NW = 3;
const SE = 7;
const SW = 5;
const CENTER = 8;

const DIRECTIONS = [];
DIRECTIONS[EAST] = [1, 0];
DIRECTIONS[WEST] = [-1, 0];
DIRECTIONS[NORTH] = [0, -1];
DIRECTIONS[SOUTH] = [0, 1];
DIRECTIONS[NE] = [1, -1];
DIRECTIONS[NW] = [-1, -1];
DIRECTIONS[SE] = [1, 1];
DIRECTIONS[SW] = [-1, 1];
DIRECTIONS[CENTER] = [0, 0];

const ARROWS = [];
ARROWS[EAST] = '\u25B6';
ARROWS[WEST] = '\u25C0';
ARROWS[NORTH] = '\u25B2';
ARROWS[SOUTH] = '\u25BC';
ARROWS[NE] = '\u25E5';
ARROWS[NW] = '\u25E4';
ARROWS[SE] = '\u25E2';
ARROWS[SW] = '\u25E3';
ARROWS[CENTER] = '\u25A0';

const OCTANT1 = Math.tan(Math.PI/8); //0.41
const OCTANT2 = Math.tan(3*Math.PI/8); //2.41
const OCTANT3 = Math.tan(5*Math.PI/8); //-2.41
const OCTANT4 = Math.tan(7*Math.PI/8); //-0.41

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
      switch(map[x][y].terrain) {
        case TERRAIN_NONE_EMPTY:
          mapDisplay.draw(x, y, ".", randomOption({ '99': '#000', '1': "#006" }), "#000");
          break;
        case TERRAIN_NONE_DIM_STAR:
          mapDisplay.draw(x, y, ".", randomOption({ '99': '#006', '1': "#FFF" }), "#000");
          break;
        case TERRAIN_NONE_BRIGHT_STAR:
          mapDisplay.draw(x, y, ".", randomOption({ '99': '#FFF', '1': "#006" }), "#000");
          break;
        case TERRAIN_STAR_YELLOW:
          mapDisplay.draw(x, y, "~", ["#D81", "#DD4"].random(), ["#D81", "#DD4"].random());
          break;
        case TERRAIN_BARREN_1:
          mapDisplay.draw(x, y, "~", "#000", "#999");
          break;
        case TERRAIN_BARREN_2:
          mapDisplay.draw(x, y, "~", "#000", "#bbb");
          break;
        case TERRAIN_BARREN_3:
          mapDisplay.draw(x, y, "~", "#000", "#555");
          break;
      }
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
    mapDisplay.draw(s.xCoord+DIRECTIONS[direction][0], s.yCoord+DIRECTIONS[direction][1], ARROWS[direction], "#0E4");

    if (s.player) {
      let maneuverMagnitude = Math.max(Math.abs(s.xCursor - s.xMoment), Math.abs(s.yCursor - s.yMoment));
      if (s.energy >= maneuverMagnitude * s.maneuverCost)
        mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#0E4");
      else
        mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#B63");
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
    switch(map[s.xCoord][s.yCoord].terrain) {
      case TERRAIN_STAR_YELLOW:
        if (s.takeDamage(10*(speed+1))) {
          s.stop();
        }
        break;
      case TERRAIN_BARREN_1:
      case TERRAIN_BARREN_2:
      case TERRAIN_BARREN_3:
        if (s.takeDamage(2*speed)) {
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
