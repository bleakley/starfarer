function ArrivalEvent (ship) {
	this.message = `Cherenkov radiation detected from an unknown object dropping out of hyperspace, bearing ${ship.xMoment} ${ship.yMoment}.`;
	this.time_until = 0;
	this.ship = ship;
}

ArrivalEvent.prototype = {

	action: function (universe, callbackFunction) {
    getPlayerSystem(universe).ships.push(this.ship);
    getAcknowledgement(this.message, callbackFunction);
	}
}

function TempleEvent () {
  this.arrival_delay = randomNumber(4,12);
	this.message = `Your landing party searches a crumbling Precursor temple and finds a digicodex containing the coordinates of a nearby anomaly. However, while decrypting the access key, your tech specialist accidentally activated the temple's subspace transponder. Orbital simulations indicate that if any ships in the nearest star system picked up the transmission, they could arrive in as few as ${this.arrival_delay} days.`;
	this.time_until = 0;
}

TempleEvent.prototype = {

	action: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);

		let location = system.randomUnoccupiedSpace();
		let anomaly = {
			name: getAnomalyName(),
			xCoord: location[0],
			yCoord: location[1],
			radius: 0,
			class: BODY_ANOMALY,
			mass: -1,
			events: []
		}
		anomaly.events.push(new AnomalyCollapseEvent(anomaly));
		system.planets.push(anomaly);
		system.map[anomaly.xCoord][anomaly.yCoord].body = anomaly;
		system.map[anomaly.xCoord][anomaly.yCoord].terrain = TERRAIN_ANOMALY;

    getAcknowledgement(this.message, callbackFunction);

    var ship = new Ship(system.randomUnoccupiedSpace(), [2,1], SHIP_TYPE_FRIGATE, SHIP_FLAG_KHAN)
    arrival = new ArrivalEvent(ship);
    arrival.time_until = this.arrival_delay;
    system.pending_events.push(arrival);
	}
}

function AnomalyCollapseEvent (anomaly) {
	this.message = `Your science officer scans the anomaly with a neutrino oscillation probe, accidentally triggering a Richtmyer-Meshkov instability. Gravity waves rock your ship violently as the anomaly begins collapsing into a black hole...SET THRUSTERS TO MAXIMUM!`;
	this.time_until = 0;
	this.anomaly = anomaly;
}

AnomalyCollapseEvent.prototype = {
  action: function (universe, callbackFunction) {
    black_hole = {
      name: 'BLACK HOLE',
      xCoord: this.anomaly.xCoord,
      yCoord: this.anomaly.yCoord,
      radius: 6,
      class: BODY_BLACK_HOLE,
      mass: 1000,
      events: null
    }
    system = getPlayerSystem(universe);
    system.planets.push(black_hole);
    this.anomaly.destroy();
    getAcknowledgement(this.message, callbackFunction);
  }
}


function MessageEvent (message, time_until) {
	this.message = "A subspace communication has been received from Altaris IV. " + message;
	this.time_until = time_until;
}

MessageEvent.prototype = {
  action: function (universe, callbackFunction) {
    getAcknowledgement(this.message, callbackFunction);
  }
}

function FindOrbitronEvent () {
	this.message = "Amongst the crumbling ruins of a Precursor temple, your landing party finds a metal sphere with many spindly antennas. Your tech specialist is ecstatic...this is an intact Orbitron Device!\n\n" +
  "Congratulations! You have saved the Altaris system and won the game.";
	this.time_until = 0;
}

FindOrbitronEvent.prototype = {
	action: function (universe, callbackFunction) {
    getAcknowledgement(this.message, callbackFunction);
	}
}


function TempleClueEvent (orbitron_system, orbitron_planet) {

  switch(randomNumber(1,3)) {
      case 1:
        this.message = `Amongst the crumbling ruins of a Precursor temple, your landing party finds a damaged digicodex. A crude reconstruction of the glyphs suggests that the Orbitron Device resides in a system that contains ${orbitron_system.planets.length} bodies.`;
        break;
      case 2:
        this.message = `Amongst the crumbling ruins of a Precursor temple, your landing party finds a damaged digicodex. A crude reconstruction of the glyphs suggests that the Orbitron Device resides the ${orbitron_system.planets[0].name} system.`;
        break;
      case 3:
       this.message = `Amongst the crumbling ruins of a Precursor temple, your landing party finds a damaged digicodex. A crude reconstruction of the glyphs suggests that the Orbitron Device resides on a planet named ${orbitron_planet.name}.`;
       break;
  }
	this.time_until = 0;
}

TempleClueEvent.prototype = {

	action: function (universe, callbackFunction) {
    getAcknowledgement(this.message, callbackFunction);
	}
}


function SpaceStationEvent () {
	this.message = "As you approach the space station, you see that its scaffolds have been badly damaged by laser burns. The commander of the space station explains that a savage band of space pirates ransacked the station 17 days ago. They were searching for Precursor digicodexes. \"I just don't get why space pirates would care so much about some boring old books!\"\n\n" +
  "The commander looks scarcely old enough to be a ensign. You speculate that everyone above him in the chain of command was killed in the attack.";
	this.time_until = 0;
}

SpaceStationEvent.prototype = {
	action: function (universe, callbackFunction) {
    getAcknowledgement(this.message, callbackFunction);
	}
}

function LootDestroyedShipEvent (name, credits, item) {
	this.item = new Weapon(item);
	this.message = `You lock on to the destroyed ${name} and slice open its hull with your boarding tubes. Your crew scours the ship and manage to download ${credits} BitCredits from the central computer.`;
	this.message += `Most of the ships systems and weapons were badly damaged in combat, but you are able to salvage a ${this.item.name}.`
	this.credits = credits;
	this.time_until = 0;
}

LootDestroyedShipEvent.prototype = {
	action: function (universe, callbackFunction) {
		system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		ps.credits += this.credits;
    getAcknowledgement(this.message, () => {
			equipWeapon(ps, this.item, callbackFunction);
		});
	}
}


function TempleFindCoordinatesEvent (destination) {
	this.message = `Your landing party finds a number of fascinating glyphs and diagrams inscribed in the wall of a Precursor temple. Your tech specialist recognizes the diagrams as a star map, and is able to determine the hyperspace coordinates of the ${destination.name} star system.`;
	this.time_until = 0;
  this.destination = destination;
}

TempleFindCoordinatesEvent.prototype = {

	action: function (universe, callbackFunction) {
    system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
    if (ps.known_systems.indexOf(this.destination) > -1) {
      this.message = `Your landing party finds a number of fascinating glyphs and diagrams inscribed in the wall of a Precursor temple. The diagrams appear to depict the ${destination.name} star system, whose hyperspace coordinates your navigator had previously recorded.`
    }
    else{
      ps.known_systems.push(this.destination);
    }
    getAcknowledgement(this.message, callbackFunction);
	}
}


function AnomalyWarpEvent (destination) {
	this.message = "";
	this.time_until = 0;
  this.destination = destination;
}

AnomalyWarpEvent.prototype = {

	action: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
    this.message = `As your ship approaches the anomaly, you feel feel for a brief moment as if you've been turned upside down. Your navigator reports that you now are in the ${this.destination.name} star system.`
    if (ps.known_systems.indexOf(this.destination) == -1) {
      ps.known_systems.push(this.destination);
      this.message = this.message + " Your navigator has added the hyperspace coordinates of this system to her system log."
    }
    warp(getPlayerShip(system.ships), system, this.destination);
    getAcknowledgement(this.message, callbackFunction);
	}
}
