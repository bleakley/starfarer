const MAP_WIDTH = 120;
const MAP_HEIGHT = 50;
const N_STAR_SYSTEMS = 4;

let turn = 0;
let message = {text: ""};

var universe = [];
for (var count = 0; count < N_STAR_SYSTEMS; count++) {
  universe.push(new System());
  console.log(universe);
}
var system = universe[0];
console.log(universe)

var selectDirection = {};
var highlightObjects = {};
var currentlyHighlightedObject = null;

var notEnoughEnergy = new Audio('sounds/Battlecruiser_EnergyLow00.mp3');
var bgm = new Audio('sounds/bgm_01.mp3');
bgm.loop = true;

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
		  var tile = randomOption(TILES[system.map[x][y].terrain]);
          mapDisplay.draw(x, y, tile.character, tile.color, tile.backgroundColor);
		}
	}

  system.planets.forEach((p) => {
    if (p == currentlyHighlightedObject) {
      drawHighlight(p);
    }
  });

  system.ships.forEach((s) => {
    mapDisplay.draw(s.xCoord, s.yCoord, s.char, "#FFF");
    if (s.player)
      mapDisplay.draw(s.xCoord+s.xMoment, s.yCoord+s.yMoment, "0", "#0E4");
    let direction = getEightWayDirection(s.xMoment, s.yMoment);
	if (s.xMoment != 0 || s.yMoment != 0) {
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
	sideBarDisplay.drawText(2, 8, message.text);
}

init = function()
{
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
  for (let i = 0; i < system.ships.length; i++) {
    if (system.ships[i].player)
      return system.ships[i];
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
  system.ships.forEach((s) => {
    if (!s.player) {
      s.plotCourse(system.map);
    }
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
    if(_.has(system.map, [s.xCoord, s.yCoord, 'terrain'])){
      switch(system.map[s.xCoord][s.yCoord].terrain) {
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
      
      if (s.player) {
        p = system.map[s.xCoord][s.yCoord].body
        if(p!=null) {
          if(p.events!=null && p.events.length > 0) {
            p.events.pop().action(message, p, system);
          }
        }
      }
    }
    
    if (!s.player) {
      ps = getPlayerShip();
      if (ps.xCoord == s.xCoord && ps.yCoord == s.yCoord) {
        if(s.event!=null)
          s.event.action(message, p, system);
      }
    }

    if(s.energy >= s.energyMax) {
      s.shields = Math.min(s.shields + 1, s.shieldsMax);
    }
    s.energy = Math.min(s.energy + s.energyRegen, s.energyMax);
  });
  
  system.pending_events.forEach((e, index, arr) => {
	  e.time_until = e.time_until - 1;
	  if (e.time_until == 0) {
		  e.action(message, null, system);
		  arr.splice(index, 1);
	  }});
  
  turn++;
  playerTurn();
}

highlightObjects.handleEvent = function(event) {
  let coords = mapDisplay.eventToPosition(event);
  if(!_.has(system.map, [coords[0], coords[1], 'body']))
    return;

  let body = system.map[coords[0]][coords[1]].body;
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
    case 72:
			//h, go to hyperspace
			window.removeEventListener('keydown', this);
      system = universe.random();
      message.text = "Hyperspace jump successful...warp core recharging.";
      playerTurn();
			break;
	}

};

playerTurn = function()
{
  console.log(system.planets);
	drawAll();
	window.addEventListener('keydown', selectDirection);
  window.addEventListener('mousemove', highlightObjects);
}
