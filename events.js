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
    let candidate_destinations = universe.systems.slice();
    candidate_destinations.splice(candidate_destinations.indexOf(system),1);
    let destination = candidate_destinations.random();
    let location = system.randomUnoccupiedSpace();
    let anomaly = new Planet(location[0], location[1], BODY_ANOMALY, 0, system);
    anomaly.events = [new AnomalyWarpEvent(anomaly, destination)];
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
    getAcknowledgement(this.message, callbackFunction);
  }
}

function MessageEvent (message, time_until) {
	this.message = message;
	this.time_until = time_until;
}
MessageEvent.prototype = {
  action: function (universe, callbackFunction) {
    getAcknowledgement(this.message, callbackFunction);
  }
}

function FindOrbitronEvent () {
	this.message = "Amongst the crumbling ruins of a Precursor temple, your landing party finds a metal sphere with many spindly antennas. Your tech specialist is ecstatic...this is an intact Orbitron Device!\n\n" +
  "Congratulations! You have saved the Altaris system.\n\n YOU HAVE WON THE GAME";
	this.time_until = 0;
}
FindOrbitronEvent.prototype = {
	action: function (universe, callbackFunction) {
    getPlayerShip(getPlayerSystem(universe).ships).hasOrbitron = true;
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

function LootDestroyedShipEvent (ship) {
  this.ship = ship;
  this.item = new Weapon(ship.getLootWeapon());
	this.message = `You lock on to the destroyed ${ship.name} and slice open its hull with your boarding tubes. Your crew scours the ship and manage to download ${ship.credits} BitCredits from the central computer.`;
	this.message += ` Most of the ships systems and weapons were badly damaged in combat, but you are able to salvage a ${this.item.name}.`
	this.time_until = 0;
}
LootDestroyedShipEvent.prototype = {
	action: function (universe, callbackFunction) {
		system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		ps.credits += this.ship.credits;
    this.ship.event = null;
    getAcknowledgement(this.message, () => {
			equipWeapon(ps, this.item, callbackFunction);
		});
	}
}

function LootAbandonedShipEvent (ship) {
  this.ship = ship;
  this.item = new Weapon(ship.getLootWeapon());
	this.message = `You lock on to the derelict ${ship.name} and slice open its hull with your boarding tubes. The ship's computers are in relatively good condition and your crew manages to download ${ship.credits} BitCredits.`;
	this.message += ` Many of the ship's systems were badly irradiated, but you are able to salvage a ${this.item.name}.`;
	if (this.ship.prisoners > 0) {
		this.message += ` You find ${this.ship.prisoners} in an unguarded detention block. They eagerly offer to join your crew.`
	}
	ps = getPlayerShip(getPlayerSystem(universe).ships);
	let roomLeft = ps.maxCrew - ps.crew;
	if (this.ship.prisoners > roomLeft) {
		this.message += ` Unfortunately you only have room for ${roomLeft} additional crewmembers, so the prisoners draw lots and the unlucky ones leave via the derelict vessel's escape pods.`;
	}
	this.time_until = 0;
}

LootAbandonedShipEvent.prototype = {
	action: function (universe, callbackFunction) {
		system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		ps.credits += this.ship.credits;
		ps.crew = Math.min(ps.maxCrew, ps.crew + this.ship.prisoners);
    this.ship.event = null;
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
      this.message = `Your landing party finds a number of fascinating glyphs and diagrams inscribed in the wall of a Precursor temple. The diagrams appear to depict the ${this.destination.name} star system, a system whose hyperspace coordinates your navigator already has determined.`
    }
    else{
      ps.known_systems.push(this.destination);
    }
    getAcknowledgement(this.message, callbackFunction);
	}
}

function AnomalyWarpEvent (p, destination) {
	this.message = "";
	this.time_until = 0;
  this.destination = destination;
  this.anomaly = p;
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
    p.system.clearTile(p.xCoord, p.yCoord);
    p.system.planets.splice(p.system.planets.indexOf(p),1);
    getAcknowledgement(this.message, callbackFunction);
	}
}

function AnomalyScienceEvent (p, destination) {
	this.message = `As you approach the anomaly, your science officer initiates a full sub-spatial survey. You are shocked to discover that it is a naturally occuring ${getPhenomenonName()}! Your engineers manage to use the data you collect to make some rather unorthodox field modifications to ship systems.`;
	this.message += '\n\n';
	this.time_until = 0;
  this.anomaly = p;
}
AnomalyScienceEvent.prototype = {

	action: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);

		switch (randomNumber(1,4)) {
			case 1:
				this.message += 'Your auxilliary reactor has been upgraded.';
				ps.energyRegen++;
				break;
			case 2:
				this.message += 'Your capacitor bank has been upgraded.';
				ps.energyMax += 2;
				break;
			case 3:
				this.message += 'Your shield battery has been upgraded.';
				ps.shieldsMax += 2;
				break;
			case 4:
				this.message += 'Your ship computer has been upgraded.';
				ps.accuracyBoost += 5;
				break;
		}

    p.system.clearTile(p.xCoord, p.yCoord);
    p.system.planets.splice(p.system.planets.indexOf(p),1);
    getAcknowledgement(this.message, callbackFunction);
	}
}

function ApexPredatorEvent () {
	this.predator = getPredatorName();
	this.message = "You find no signs of civilization on this planet, but it still serves as a good location to stop and repair while one of your crew makes a geological survey of the surroundings.\n\n";
	this.message += `An unearthly howl is soon heard echoing all around you! Your xenobiologist quickly identifies it as the cry of the fearsome ${this.predator}, which is likely to soon devour your unfortunate surveyor.`;
	this.option1 = `How truly brave of him to give his life so that we may survive. Let's get out of here!`;
	this.option2 = `We will never leave a shipmate behind! Crack open the weapons locker and hunt down the ${this.predator}.`;
	this.time_until = 0;
}
ApexPredatorEvent.prototype = {
	action: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		if (ps.crew < 3) {
			getAcknowledgement("You land on this desolate world, but even with your advanced surveying equipment you are unable to find anything of note.", callbackFunction);
		} else {
			var so = new selectOption(this.message, [{ t: this.option1, o: () => this.flee(universe, callbackFunction) }, { t: this.option2, o: () => this.fight(universe, callbackFunction) }]);
	    so.run();
		}
	},
	flee: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		ps.loseCrew(1);
		getAcknowledgement("You quickly fire up the main engines and leave this planet, and your unluckly geologist, behind.", callbackFunction);
	},
	fight: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
		if (percentChance(35)) {
			getAcknowledgement(`Your party is able to track down the ${this.predator} and slay the massive creature with several well-placed railgun shots. Your xenobiologist insists that you got lucky, and that such creatures should rarely be trifled with.`, callbackFunction);
		} else {
			let casualties = randomNumber(2,5);
			if (casualties < ps.crew) {
				ps.loseCrew(casualties);
				getAcknowledgement(`Not long after beginning your hunt, the ${this.predator} leaps from cover and attacks! You manage to bring the creature down with a well-placed shot from your plasma rifle, but not before it savagely butchers ${casualties} of your crew.`, callbackFunction);
			} else {
				ps.loseCrew(casualties);
				getAcknowledgement(`You try to trap the ${this.predator} in an ambush, but the creature is far too clever. Attacking from the shadows, it picks off the last of your crew, one by one. You try to flee back to the ship but the ${this.predator} moves with frightening speed and mercilessly devours you.`, callbackFunction);
			}
		}
	}
}

function FindTribeEvent () {
	this.message = "You find a pre-warptech city-state on this planet. Some of the civilians left unemployed after the recent cryptocurrency collapse are eager to leave their homeworld and start a new life.";
	this.time_until = 0;
}
FindTribeEvent.prototype = {
	action: function (universe, callbackFunction) {
    let system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
    var crew = Math.min(randomNumber(5,20), ps.maxCrew - ps.crew);
    if (crew > 0) {
      this.message += ` Your ship acquires ${crew} new crewmembers.`
      ps.crew += crew;
    }
    else {
      this.message += " With great sadness you inform them that your ship doesn't have any room to fit new crew members."
    }
    getAcknowledgement(this.message, callbackFunction);
	}
}

function MoggKhanArrivalEvent () {
	this.message = "News of your quest has spread to men of ill motives. The dread warlord Mogg Khan's scouts have informed him of your presence in the sector and his fleets are now arriving in full force to claim the Orbitron Device.";
	this.time_until = 0;
}
MoggKhanArrivalEvent.prototype = {
	action: function (universe, callbackFunction) {
		// add 1 capital fleet and 2 strike fleets
		let possibleSystems = _.shuffle(universe.systems.filter((sys) => { return sys != getPlayerSystem(universe) }));
		for (let n = 0; n < 3; n++) {
			possibleSystems[n].khanFleet = true;
			possibleSystems[n].ships.push(new Ship(possibleSystems[n].randomUnoccupiedSpace(), [1,1], SHIP_TYPE_BATTLESHIP, SHIP_FLAG_KHAN));
			for (var count = 0; count < 2; count++) {
				let s = new Ship(possibleSystems[n].randomUnoccupiedSpace(), [1,-2], SHIP_TYPE_FRIGATE, SHIP_FLAG_KHAN);
				possibleSystems[n].ships.push(s);
			}
			for (var count = 0; count < 2; count++) {
				let s = new Ship(possibleSystems[n].randomUnoccupiedSpace(), [1,-2], SHIP_TYPE_SLOOP, SHIP_FLAG_KHAN);
				possibleSystems[n].ships.push(s);
			}
		}

		possibleSystems[0].ships.push(new Ship(possibleSystems[0].randomUnoccupiedSpace(), [1,1], SHIP_TYPE_DREADNOUGHT, SHIP_FLAG_KHAN));
    getAcknowledgement(this.message, callbackFunction);
	}
}

function PrecursorArrivalEvent () {
	this.message = "Hidden transponders located within the Precursor temples have notified long-dormant Precursor strike fleets of your activity in the sector. They will stop at nothing to ensure that these ancient secrets stay buried.";
	this.time_until = 0;
}
PrecursorArrivalEvent.prototype = {
	action: function (universe, callbackFunction) {
		// add 1 precursor fleet
		let precursorSystem = universe.systems.filter((sys) => { return sys != getPlayerSystem(universe) && !sys.khanFleet })[0];
		precursorSystem.ships = [];
		for (var count = 0; count < 2; count++) {
			let s = new Ship(precursorSystem.randomUnoccupiedSpace(), [1,-2], SHIP_TYPE_WRAITH, SHIP_FLAG_PRECURSOR);
			precursorSystem.ships.push(s);
		}
		precursorSystem.ships.push(new Ship(precursorSystem.randomUnoccupiedSpace(), [1,-2], SHIP_TYPE_ARBITER, SHIP_FLAG_PRECURSOR));
    getAcknowledgement(this.message, callbackFunction);
	}
}
