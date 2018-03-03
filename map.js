const MAP_WIDTH = 150;
const MAP_HEIGHT = 60;

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


const TERRAIN_NONE = 0;
const TERRAIN_STAR_YELLOW = 1;
const TERRAIN_CORONA_YELLOW = 2;
const TERRAIN_BARREN_1 = 3;
const TERRAIN_BARREN_2 = 4;
const TERRAIN_BARREN_3 = 5;
const TERRAIN_GRASS = 6;
const TERRAIN_WATER = 7;
const TERRAIN_ICE = 8;

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
    xCoord: 20,
    yCoord: 20,
    radius: 2,
    class: BODY_PLANET_BARREN,
    mass: 1
  }
];

var ships = [
  {
    xCoord: 10,
    yCoord: 10,
    char: "@",
    player: true
  }
];

var map = [];

var selectDirection = {};
var highlightObjects = {};
var currentlyHighlightedObject = null;

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

generateMap = function()
{
  for(var i = 0; i < MAP_WIDTH; i++) {
  	map[i] = [];
  	for(var j = 0; j < MAP_HEIGHT; j++) {
  		map[i][j] = {
        terrain: TERRAIN_NONE,
        body: null,
        gravityX: 0,
        gravityY: 0
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
    map[p.xCoord - p.radius][p.yCoord - p.radius].terrain = TERRAIN_NONE;
    map[p.xCoord - p.radius][p.yCoord + p.radius - 1].body = null;
    map[p.xCoord - p.radius][p.yCoord + p.radius - 1].terrain = TERRAIN_NONE;
    map[p.xCoord + p.radius - 1][p.yCoord - p.radius].body = null;
    map[p.xCoord + p.radius - 1][p.yCoord - p.radius].terrain = TERRAIN_NONE;
    map[p.xCoord + p.radius - 1][p.yCoord + p.radius - 1].body = null;
    map[p.xCoord + p.radius - 1][p.yCoord + p.radius - 1].terrain = TERRAIN_NONE;
  });

  for(var i = 0; i < MAP_WIDTH; i++) {
  	for(var j = 0; j < MAP_HEIGHT; j++) {
      planets.forEach((p) => {
        let unit = unitVector(i-p.xCoord, j-p.yCoord);
        gx = p.mass/Math.pow(i-p.xCoord, 2)/unit.x;
        gy = p.mass/Math.pow(j-p.yCoord, 2)/unit.y;
        map[i][j].gravityX += gx;
        map[i][j].gravityY += gy;
      });
      //console.log('' + map[i][j].gravityX + ', ' + map[i][j].gravityY);
  	}
  }

}

drawAll = function(recursion)
{
	for (var x = 0; x < MAP_WIDTH; x++) {
		for (var y = 0; y < MAP_HEIGHT; y++) {
      switch(map[x][y].terrain) {
        case TERRAIN_NONE:
          mapDisplay.draw(x, y, ".", ["#FFF", "#000", "#000", "#000", "#000", "#000", "#006"].random(), "#000");
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
  });

  ships.forEach((s) => {
    mapDisplay.draw(s.xCoord, s.yCoord, s.char, "#FFF");
  });

	if(recursion)
		setTimeout(function() {
			drawAll(true);
		}, 900)

}

init = function()
{
  generateMap();
	mapDisplay = new ROT.Display({
		width:MAP_WIDTH, height:MAP_HEIGHT,
		layout:"rect", forceSquareRatio: true
	});

	document.body.appendChild(mapDisplay.getContainer());

	drawAll(true);
  playerTurn();
}



highlightObjects.handleEvent = function(event) {
  let coords = mapDisplay.eventToPosition(event);
  let body = map[coords[0]][coords[1]].body;
  if (body == currentlyHighlightedObject) {
    return;
  }

  currentlyHighlightedObject = body;
  drawAll();
};

selectDirection.handleEvent = function(event) {
	//console.log("event handle key code: " + event.keyCode);
	console.log(event.keyCode);
	switch(event.keyCode)
	{
		case 103:
		case 36:
		case 55:
			//numpad7
			window.removeEventListener('keydown', this);
			move(playerX-1, playerY-1);
			break;
		case 105:
		case 33:
		case 57:
			//numpad9
			window.removeEventListener('keydown', this);
			move(playerX+1, playerY-1);
			break;
		case 100:
		case 37:
			//numpad4
			window.removeEventListener('keydown', this);
			move(playerX-1, playerY);
			break;
		case 102:
		case 39:
			//numpad6
			window.removeEventListener('keydown', this);
			move(playerX+2, playerY);
			break;
		case 191:
			//?
			console.log('help');
			break;
		case 97:
		case 35:
		case 49:
			//numpad1
			window.removeEventListener('keydown', this);
			move(playerX-1, playerY+1);
			break;
		case 99:
		case 34:
		case 51:
			//numpad3
			window.removeEventListener('keydown', this);
			move(playerX+1, playerY+1);
			break;
	}

};

playerTurn = function()
{
	drawAll();
	window.addEventListener('keydown', selectDirection);
  window.addEventListener('mousemove', highlightObjects);
}
