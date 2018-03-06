const MAP_WIDTH = 120;
const MAP_HEIGHT = 50;
const N_STAR_SYSTEMS = 4;
const N_CLUES = 4;

let turn = 0;
let message = {text: ""};

var universe = [];
var candidate_planets = [];
for (var count = 0; count < N_STAR_SYSTEMS; count++) {
  universe.push(new System());
  console.log(universe);
}

// Determine location of the Orbitron Device
universe.forEach( (sys) => {
  sys.planets.forEach( (p) => {
    if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class == BODY_PLANET_FROZEN) {
      candidate_planets.push(p);
    }
  })
})
orbitron_planet = candidate_planets.random(); // Planet that holds the Orbitron Device
orbitron_planet.events = [new FindOrbitronEvent()];
orbitron_system = null; // System that the Orbitron Device is in
universe.forEach( (sys) => {
  if (sys.planets.indexOf(orbitron_planet) > -1) {
    orbitron_system = sys;
  }
});
console.log(orbitron_system)
console.log(orbitron_planet)

for (var count = 0; count < N_CLUES; count++){
  p = candidate_planets.random();
  if (p!=orbitron_planet){
    p.events = [new TempleClueEvent(orbitron_system, orbitron_planet)];
  }
}

var system = universe[0]; // The star system that the player currently is in
let ps = new Ship([20,10], [2,2], 5, 3, 10);
ps.name = `player's ship`;
ps.player = true;
ps.powerDown();
system.ships.push(ps);

var global_pending_events = [];
var message_text = "Xenopaleontologists have decrypted an intriguing Precursor digicodex. Apparently, by reversing the polarity, an Orbitron Device can be used to induce, rather than prevent, a supernova event. Records show that shortly after this capability was discovered, the Precursor council issued an edict ordering all Orbitron Devices to be destroyed.";
global_pending_events.push(new MessageEvent(message_text, 6));

message.text = `Greetings, space farer! You have entered the ${system.planets[0].name} system in search of an ancient Precursor artifact that can be used to prevent your home system, Altaris, from going supernova.\n\nArrow keys:\nchange trajectory\n\nSpace:\nmove\n\nh:\njump to hyperspace`;

var selectDirection = {};
var highlightObjects = {};
var currentlyHighlightedObject = null;

clearPopup = function()
{
	popUpDisplay.clear();
	document.getElementById('stuffOnTop').style.display = 'none';
}

drawBodyHighlight = function(p) {
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

drawShipHighlight = function(s) {
  let color = s.getHighlightColor();
  for (let x = s.xCoord - 1; x <= s.xCoord + 1; x++) {
    mapDisplay.draw(x, s.yCoord - 1, "#", color);
    mapDisplay.draw(x, s.yCoord + 1, "#", color);
  }
  mapDisplay.draw(s.xCoord - 1, s.yCoord, "#", color);
  mapDisplay.draw(s.xCoord + 1, s.yCoord, "#", color);
  mapDisplay.draw(s.xCoord+DIRECTIONS[s.facing][0], s.yCoord+DIRECTIONS[s.facing][1], ARROWS[s.facing], color);

  mapDisplay.drawText(s.xCoord + 2,  s.yCoord - 1, `%c{${color}}${s.name}`);
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
      drawBodyHighlight(p);
    }
  });

  system.ships.forEach((s) => {

    if (s == currentlyHighlightedObject) {
      drawShipHighlight(s);
    }

    let color = s.getHighlightColor();
    if (s.player)
      mapDisplay.draw(s.xCoord+s.xMoment, s.yCoord+s.yMoment, "0", color);
    mapDisplay.draw(s.xCoord+DIRECTIONS[s.facing][0], s.yCoord+DIRECTIONS[s.facing][1], ARROWS[s.facing], color);
    let maneuverMagnitude = Math.max(Math.abs(s.xCursor - s.xMoment), Math.abs(s.yCursor - s.yMoment));
	  if (s.energy >= maneuverMagnitude * s.maneuverCost)
		   mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", color);
	  else
		   mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#B63");
    mapDisplay.draw(s.xCoord, s.yCoord, s.char, "#FFF");

  });

  drawSideBar();

	if(recursion)
		setTimeout(function() {
			drawAll(true);
		}, 900)

}

drawSideBar = function()
{
  let ps = getPlayerShip(system.ships);
	sideBarDisplay.clear();
	sideBarDisplay.drawText(2, 0, `Turn: ${turn}`);
  sideBarDisplay.drawText(2, 1, `BitCredits: ${ps.credits}`);
	sideBarDisplay.drawText(2, 3, `Hull: ${ps.hull}/${ps.hullMax}`);
	sideBarDisplay.drawText(2, 4, `Shields: ${ps.shields}/${ps.shieldsMax}`);
	sideBarDisplay.drawText(2, 5, `Energy: ${ps.energy}/${ps.energyMax} (+${ps.energyRegen})`);
	sideBarDisplay.drawText(2, 6, `Maneuver: -${ps.maneuverCost}/\u0394`);
  for (let i = 0; i < ps.weapons.length; i++) {
    let w = ps.weapons[i];
    let color = '#0E4';
    if (!w.readyToFire || ps.energy < w.energy)
      color = 'dimgrey';
    else if (w.selected)
      color = 'yellow';
    sideBarDisplay.drawText(2, 8+i, `%c{${color}}${MOUNT_NAMES[w.mount].padEnd(4)} ${w.name}: ${w.damage}d -${w.energy}e`);
  }
	sideBarDisplay.drawText(2, 10 + ps.weapons.length, message.text);
}

init = function()
{
	mapDisplay = new ROT.Display({
		width:MAP_WIDTH, height:MAP_HEIGHT,
		layout:"rect", forceSquareRatio: false
	});

  sideBarDisplay = new ROT.Display({
		width:30, height:MAP_HEIGHT,
		layout:"rect", fg: "#0E4", forceSquareRatio: false
	});

  popUpDisplay = new ROT.Display({
		width:50, height:23,
		layout:"rect"
	});

	document.body.appendChild(mapDisplay.getContainer());
  document.body.appendChild(sideBarDisplay.getContainer());
  document.getElementById("stuffOnTop").appendChild(popUpDisplay.getContainer());

	drawAll(true);
  system.bgm.play();
  //getAcknowledgement('Welcome to Rogue Starfarer!', playerTurn);
  playerTurn();
}

moveCursor =  function(direction) {
  let playerShip = getPlayerShip(system.ships);
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

  let ps = getPlayerShip(system.ships);
  var astar = new ROT.Path.AStar(ps.xCoord+ps.xMoment, ps.yCoord+ps.yMoment, (x,y) => {
     return !_.get(system.map, [x, y, 'forbiddenToAI'], true);
  });

  system.ships.forEach((s) => {
    if (!s.player) {
      s.plotBetterCourse(system.map, astar);
    }
    let maneuverMagnitude = Math.max(Math.abs(s.xCursor - s.xMoment), Math.abs(s.yCursor - s.yMoment));
    if (s.energy >= maneuverMagnitude * s.maneuverCost) {
      s.energy -= maneuverMagnitude * s.maneuverCost;
      s.xMoment = s.xCursor;
      s.yMoment = s.yCursor;
      if(!(s.xMoment == 0 && s.yMoment == 0))
        s.facing = getEightWayDirection(s.xMoment, s.yMoment);
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
      ps = getPlayerShip(system.ships);
      if (ps.xCoord == s.xCoord && ps.yCoord == s.yCoord) {
        if(s.event!=null)
          s.event.action(message, p, system);
      }
    }

    s.regenerateSystems();
  });

  system.pending_events.forEach((e, index, arr) => {
	  e.time_until = e.time_until - 1;
	  if (e.time_until == 0) {
		  e.action(message, null, system);
		  arr.splice(index, 1);
	  }});
  global_pending_events.forEach((e, index, arr) => {
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
  let highlightedShip = _.find(system.ships, (s) => { return s.xCoord == coords[0] && s.yCoord == coords[1] });
  if (highlightedShip) {
    currentlyHighlightedObject = highlightedShip;
    drawShipHighlight(highlightedShip);
    return;
  }
  if(!_.has(system.map, [coords[0], coords[1], 'body']))
    return;

  let body = system.map[coords[0]][coords[1]].body;
  if (body == currentlyHighlightedObject) {
    return;
  }

  currentlyHighlightedObject = body;
  if (body)
    drawBodyHighlight(body);
  else drawAll();
};

selectDirection.handleEvent = function(event) {
	//console.log("event handle key code: " + event.keyCode);
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
      event.preventDefault();
			window.removeEventListener('keydown', this);
      advanceTurn();
			break;
    case 87:
			//w, toggle weapon
      getPlayerShip(system.ships).toggleSelectedWeapon();
			window.removeEventListener('keydown', this);
      playerTurn();
			break;
    case 70:
			//f, fire weapon
      getPlayerShip(system.ships).fireSelectedWeapon();
			window.removeEventListener('keydown', this);
      playerTurn();
			break;
    case 72:
			//h, go to hyperspace
			window.removeEventListener('keydown', this);
      let ps = getPlayerShip(system.ships);
      system.removeShip(ps);
      system.bgm.pause();
      system = universe.random();
      system.ships.push(ps);
      coords = system.randomUnoccupiedSpace(system.map);
      ps.xCoord = coords[0];
      ps.yCoord = coords[1];
      ps.xMoment = randomNumber(-2,2);
      ps.yMoment = randomNumber(-2,2);
      ps.xCursor = ps.xMoment;
      ps.yCursor = ps.yMoment;
      system.bgm.play();

      message.text = "Hyperspace jump successful...warp core recharging.";
      playerTurn();
			break;
	}

};

playerTurn = function()
{
  clearPopup();
	drawAll();
	window.addEventListener('keydown', selectDirection);
  window.addEventListener('mousemove', highlightObjects);
}
