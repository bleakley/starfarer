let turn = 0;
let message = {text: ""};

var universe = new Universe();

let ps = new Ship([20, 10], [1,1], SHIP_TYPE_FRIGATE, SHIP_FLAG_PLAYER);
ps.name = `S.S. Profundity`;
ps.player = true;
ps.char = '@';
ps.hullMax = 12;
ps.hull = 12;
ps.credits = 25;
ps.mountWeapon(new Weapon('Tractor Beam', 10, 1, 100, 3, DAMAGE_TRACTOR), MOUNT_FWD);
ps.known_systems.push(universe.systems[0]);
universe.systems[0].ships.push(ps);
universe.systems[0].bgm = bgm2;

var repairCost = 1;
var reactorUpgradeCost = 10;
var propulsionUpgradeCost = 10;
var armorUpgradeCost = 10;
var crewUpgradeCost = 10;
var prisonerUpgradeCost = 10;
var capacitorUpgradeCost = 10;
var shieldUpgradeCost = 10;
var computerUpgradeCost = 10;

var global_pending_events = [];
var message_text = "Xenopaleontologists have decrypted an intriguing Precursor digicodex. Apparently, by reversing the polarity, an Orbitron Device can be used to induce, rather than prevent, a supernova event. Records show that shortly after this capability was discovered, the Precursor council issued an edict ordering all Orbitron Devices to be destroyed.";
global_pending_events.push(new MessageEvent(message_text, 10));

var selectDirection = {};
var highlightObjects = {};
var currentlyHighlightedObject = null;

clearPopup = function()
{
	popUpDisplay.clear();
	document.getElementById('stuffOnTop').style.display = 'none';
}

drawBodyHighlight = function(p) {
  let color = "#0E4";
  if (p.radius) {
    for (var x = p.xCoord - p.radius - 1; x < p.xCoord + p.radius + 1; x++) {
      mapDisplay.draw(x, p.yCoord - p.radius - 1, "#", color);
      mapDisplay.draw(x, p.yCoord + p.radius, "#", color);
    }
    for (var y = p.yCoord - p.radius - 1; y < p.yCoord + p.radius + 1; y++) {
      mapDisplay.draw(p.xCoord - p.radius - 1, y, "#", color);
      mapDisplay.draw(p.xCoord + p.radius, y, "#", color);
    }
    mapDisplay.drawText(p.xCoord + p.radius + 2,  p.yCoord - p.radius - 1, `%c{${color}}${p.name}`);
    mapDisplay.drawText(p.xCoord + p.radius + 2,  p.yCoord - p.radius, `%c{${color}}MASS: ${p.mass} x10^28 kg`);
  } else {
    for (let x = p.xCoord - 1; x <= p.xCoord + 1; x++) {
      mapDisplay.draw(x, p.yCoord - 1, "#", color);
      mapDisplay.draw(x, p.yCoord + 1, "#", color);
    }
    mapDisplay.draw(p.xCoord - 1, p.yCoord, "#", color);
    mapDisplay.draw(p.xCoord + 1, p.yCoord, "#", color);
    mapDisplay.drawText(p.xCoord + 2,  p.yCoord - 1, `%c{${color}}${p.name}`);
    mapDisplay.drawText(p.xCoord + 2,  p.yCoord + 0, `%c{${color}}MASS: ${p.mass} x10^0 kg`);
  }
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
  mapDisplay.drawText(s.xCoord + 2,  s.yCoord + 0, `%c{${color}}Hull: ${s.hull}/${s.hullMax}`);
  mapDisplay.drawText(s.xCoord + 2,  s.yCoord + 1, `%c{${color}}Shields: ${s.shields}/${s.shieldsMax}`);
  mapDisplay.drawText(s.xCoord + 2,  s.yCoord + 2, `%c{${color}}Energy: ${s.energy}/${s.energyMax}`);
  if (s.player)
    return;
  var ps = getPlayerShip(getPlayerSystem(universe).ships);
  var pw = ps.activeWeapon();
  if (!pw)
    return;
  let cd = ps.getChanceToHit(pw, s);
  mapDisplay.drawText(s.xCoord + 2,  s.yCoord + 3, `%c{${color}} ${cd.prob}% to hit`);
  for (let j = 0; j < cd.modifiers.length; j++)
    mapDisplay.drawText(s.xCoord + 2,  s.yCoord + 4 + j, `%c{${color}}${cd.modifiers[j]}`);
}

drawFiringArc = function(ship, weapon) {
  let color = ship.getHighlightColor();
  let octant = getFiringOctant(ship.facing, weapon.mount);
  if (octant == CENTER)
    return;
  [getClockwiseOctant(octant), getCounterClockwiseOctant(octant)].forEach((line) => {
    for(let r = 0; r < weapon.range; r++)
      mapDisplay.draw(ship.xCoord+DIRECTIONS[line][0]*r, ship.yCoord+DIRECTIONS[line][1]*r, "+", ship.getHighlightColor());
  });
}

selectNextClosestTarget = function(ship, weapon) {
  let potentialTargets = _.filter(getPlayerSystem(universe).ships, (t) => { return t.canBeHitByWeapon(ship, weapon) });
  let sortedTargets = _.sortBy(potentialTargets, [(t) => { return freeDiagonalDistance([ship.xCoord, ship.yCoord], [t.xCoord, t.yCoord])}, 'name']);
  if (!currentlyHighlightedObject) {
    currentlyHighlightedObject = sortedTargets[0];
    return;
  }
  let newIndex = sortedTargets.indexOf(currentlyHighlightedObject) + 1;
  if (newIndex >= sortedTargets.length)
    newIndex = 0;
  currentlyHighlightedObject = sortedTargets[newIndex];
}

drawAll = function(recursion)
{
  let system = getPlayerSystem(universe);
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

  let selectedWeapon = _.find(getPlayerShip(system.ships).weapons, (w) => w.selected);
  if (selectedWeapon && selectedWeapon.readyToFire && getPlayerShip(system.ships).energy >= selectedWeapon.energy )
    drawFiringArc(getPlayerShip(system.ships), selectedWeapon);

  system.ships.forEach((s) => {

    let color = s.getHighlightColor();
    if(!s.destroyed) {
      if (s.player)
        mapDisplay.draw(s.xCoord+s.xMoment, s.yCoord+s.yMoment, "0", color);
      mapDisplay.draw(s.xCoord+DIRECTIONS[s.facing][0], s.yCoord+DIRECTIONS[s.facing][1], ARROWS[s.facing], color);
      let maneuverMagnitude = freeDiagonalDistance([s.xCursor, s.yCursor], [s.xMoment, s.yMoment]);
  	  if (s.energy >= maneuverMagnitude * s.maneuverCost)
  		   mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", color);
  	  else
  		   mapDisplay.draw(s.xCoord+s.xCursor, s.yCoord+s.yCursor, "X", "#B63");
    }
    if(!s.toBeDisintegrated)
      mapDisplay.draw(s.xCoord, s.yCoord, s.char, "#FFF");

  });

  system.ships.forEach((s) => {

    if (s == currentlyHighlightedObject) {
      drawShipHighlight(s);
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
  let ps = getPlayerShip(getPlayerSystem(universe).ships);
	sideBarDisplay.clear();
	sideBarDisplay.drawText(2, 0, `Turn: ${turn}`);
  sideBarDisplay.drawText(2, 1, `BitCredits: ${ps.credits}`);
	sideBarDisplay.drawText(2, 3, `Hull: ${ps.hull}/${ps.hullMax}`);
	sideBarDisplay.drawText(2, 4, `Shields: ${ps.shields}/${ps.shieldsMax}`);
	sideBarDisplay.drawText(2, 5, `Energy: ${ps.energy}/${ps.energyMax} (+${ps.energyRegen})`);
	sideBarDisplay.drawText(2, 6, `Maneuver: -${ps.maneuverCost}/\u0394`);
  sideBarDisplay.drawText(2, 7, `Crew: ${ps.crew}/${ps.maxCrew} (min. ${ps.minCrew})`);
  for (let i = 0; i < ps.weapons.length; i++) {
    let w = ps.weapons[i];
    let color = '#0E4';
    if (!w.readyToFire || ps.energy < w.energy)
      color = 'dimgrey';
    else if (w.selected)
      color = 'yellow';
    sideBarDisplay.drawText(2, 9+i, `%c{${color}}${MOUNT_NAMES[w.mount].padEnd(4)} ${w.name}: ${w.damage}d -${w.energy}e`);
  }
	sideBarDisplay.drawText(2, 11 + ps.weapons.length, message.text);
}

init = function()
{
  document.body.appendChild(mapDisplay.getContainer());
  document.body.appendChild(sideBarDisplay.getContainer());
  document.getElementById("stuffOnTop").appendChild(popUpDisplay.getContainer());

	drawAll(true);
  getPlayerSystem(universe).bgm.play();
  let system = getPlayerSystem(universe);

  getAcknowledgement(`Greetings, space farer! You have entered the ${system.name} system in search of an ancient Precursor artifact, the Orbitron Device, that can be used to prevent your home system, Altaris, from going supernova.`, displayHelp);

}

displayHelp = function(){
  getAcknowledgement(
  "STARSHIP CONTROLS\n\n" +
  "h, ?     show this help dialog\n" +
  "arrows   change trajectory\n" +
  "space    move\n" +
  "j        jump to hyperspace\n" +
  "w        toggle weapons\n" +
  "f        fire weapon\n" +
  "esc      deselect weapon\n" +
  "tab      cycle through available targets\n\n" +
  "To explore a planet, move on top of it. Your starship will be damaged if you are moving too fast when you land!",
  playerTurn);
}

moveCursor =  function(direction) {
  let playerShip = getPlayerShip(getPlayerSystem(universe).ships);
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

  let system = getPlayerSystem(universe);
  let ps = getPlayerShip(system.ships);
  var astar = new ROT.Path.AStar(ps.xCoord+ps.xMoment, ps.yCoord+ps.yMoment, (x,y) => {
     return !_.get(system.map, [x, y, 'forbiddenToAI'], true);
  });

  let renderAttacks = false;

  system.ships.forEach((s) => {
    if (!s.player) {

      if (s.attackPlayer) {
        s.weapons.forEach((w) => {
          if (s.canFireWeapon(w) && ps.canBeHitByWeapon(s, w)) {
            fire(s, ps, w, Function.prototype);
            renderAttacks = true;
          }
        });
      }

      s.plotBetterCourse(system.map, astar);
    }
    let maneuverMagnitude = freeDiagonalDistance([s.xCursor, s.yCursor], [s.xMoment, s.yMoment]);
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

    if(_.has(system.map, [s.xCoord, s.yCoord, 'terrain'])){

      let effect = TERRAIN_EFFECTS[system.map[s.xCoord][s.yCoord].terrain];
      if (s.takeDamage(effect.damage * (Math.max(0, s.speed() + 1 - effect.minSpeedForDamage)), effect.damageType)) {
        if (effect.stopOnDeath)
          s.stop();
        if (effect.disintegrateOnDeath)
          s.toBeDisintegrated = true;
      }

      if (s.player && !s.destroyed) {
        p = system.map[s.xCoord][s.yCoord].body
        if(p!=null) {
          if(p.events!=null && p.events.length > 0) {
            if(s.speed() == 0 || !TERRAIN_EFFECTS[system.map[s.xCoord][s.yCoord].terrain].stopForEvent)
              system.pending_events.push(p.events.pop());
          }
        }
      }
    }

    s.regenerateSystems();
  });

  system.ships = system.ships.filter(s => s.player || !s.toBeDisintegrated);

  if (getPlayerShip(system.ships).destroyed) {
    system.ships.forEach((s) => {
      s.followPlayer = false;
      s.attackPlayer = false; //peace has come to the galaxy at last
    });
  }

  system.ships.forEach((s) => {
    if (!s.player) {
      ps = getPlayerShip(system.ships);
      if (ps.xCoord == s.xCoord && ps.yCoord == s.yCoord) {
        if(s.event!=null)
          system.pending_events.push(s.event);
      }
    }
  });

  turn++;
  if (renderAttacks) {
    setTimeout(resolvePendingEvents, 1000);
  } else {
   resolvePendingEvents();
  }
}

resolvePendingEvents = function() {
  let system = getPlayerSystem(universe);
  for (var count = 0; count < system.pending_events.length; count++) {
    let e = system.pending_events[count];
    e.time_until = e.time_until - 1;
    if (e.time_until <= 0) {
      e.action(universe, resolvePendingEvents);
      index = system.pending_events.indexOf(e);
      system.pending_events.splice(index, 1);
      drawAll();
      return;
    }
  }

  for (var count = 0; count < global_pending_events.length; count++) {
    let e = global_pending_events[count];
    e.time_until = e.time_until - 1;
    if (e.time_until <= 0) {
      console.log(e);
      e.action(universe, resolvePendingEvents);
      index = global_pending_events.indexOf(e);
      global_pending_events.splice(index, 1);
      drawAll();
      return;
    }
  }

  playerTurn();
}

fire = function(attacker, target, weapon, callback) {
  let hit = attacker.fireAt(weapon, target);

  drawline(attacker.xCoord, attacker.yCoord, target.xCoord, target.yCoord, (x,y) => {
    mapDisplay.draw(x, y, weapon.symbol, weapon.color);
  });
  mapDisplay.draw(attacker.xCoord, attacker.yCoord, attacker.char, "#FFF");
  if (hit)
    mapDisplay.draw(target.xCoord, target.yCoord, weapon.symbol, weapon.color, weapon.color);
  else
    mapDisplay.draw(target.xCoord, target.yCoord, target.char, "#FFF");
  setTimeout(function() {
    callback();
  }, 1000);
}

highlightObjects.handleEvent = function(event) {
  let system = getPlayerSystem(universe);
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
		case 72: //h
    case 191: //?
      window.removeEventListener('keydown', this);
			displayHelp();
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
      window.removeEventListener('keydown', this);
      var ps = getPlayerShip(getPlayerSystem(universe).ships);
      ps.toggleSelectedWeapon();
      var pw = _.find(ps.weapons, (w) => { return ps.canFireWeapon(w) && w.selected });
      if (pw) {
        selectNextClosestTarget(ps, pw);
      }
      playerTurn();
			break;
    case 70:
			//f, fire weapon
      if (!currentlyHighlightedObject || getPlayerSystem(universe).ships.indexOf(currentlyHighlightedObject) == -1)
        break;
      var ps = getPlayerShip(getPlayerSystem(universe).ships);
      var pw = ps.activeWeapon();
      if (!pw)
        break;
      if (!currentlyHighlightedObject.canBeHitByWeapon(ps, pw))
        break;

      window.removeEventListener('keydown', this);

      fire(ps, currentlyHighlightedObject, pw, playerTurn);

			break;
    case 27:
			//esc, deselect weapon
      getPlayerShip(getPlayerSystem(universe).ships).weapons.forEach((w) => { w.selected = false; });
			window.removeEventListener('keydown', this);
      playerTurn();
			break;
    case 9:
			//tab, cycle targets
      event.preventDefault();
      var ps = getPlayerShip(getPlayerSystem(universe).ships);
      var pw = _.find(ps.weapons, (w) => { return ps.canFireWeapon(w) && w.selected });
      if (pw) {
        selectNextClosestTarget(ps, pw);
  			window.removeEventListener('keydown', this);
        playerTurn();
      }
			break;
    case 74:
			//j, jump to hyperspace
			window.removeEventListener('keydown', this);
      var options = [];
      var ps = getPlayerShip(getPlayerSystem(universe).ships);
      ps.known_systems.forEach( (sys) => {
        let opt = { system: sys, t: sys.name, o: () => {warp(ps, getPlayerSystem(universe), sys); playerTurn()} };
        if (sys != getPlayerSystem(universe)) {
          options.push(opt);
        }
      })
      options.push({t: "cancel", o: playerTurn})

      if (options.length == 1) {
        getAcknowledgement("We do not know the coordinates of any other star systems. Perhaps we can find coordinates somewhere in this system.", playerTurn);
      }
      else {

        var so = new selectOption("Select a destination:", options);
        so.run();
        message.text = "Hyperspace jump successful...warp core recharging.";
      }
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
