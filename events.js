function ArrivalEvent (ship) {
	this.message = `Cherenkov radiation detected from an unknown object dropping out of hyperspace, bearing ${ship.xMoment} ${ship.yMoment}.`;
	this.time_until = 0;
	this.ship = ship;
}

ArrivalEvent.prototype = {

	action: function (message, p, system) {
    system.ships.push(this.ship);
    message.text = this.message;
	}
}

function TempleEvent () {
	this.message = "Your landing party searches a crumbling precursor temple and finds a digicodex containing the coordinates of a nearby anomaly. However, while decrypting the access key, your tech specialist accidentally activated the temple's subspace transponder. Orbital simulations indicate that if any ships in the nearest star system picked up the transmission, they could arrive in as few as 4 days.";
	this.time_until = 0;
}

TempleEvent.prototype = {

	action: function (message, p, system) {
    let anomaly = new Ship([32,17], [0,0], 1, 0, 0);
    anomaly.char = "A";
    anomaly.name = "anomaly X72-C";
    anomaly.event = new AnomalyCollapseEvent(anomaly);
    system.ships.push(anomaly);
    message.text = this.message;
    
    var ship = new Ship([60,40], [2,1], 5, 3, 10);
    arrival = new ArrivalEvent(ship);
    arrival.time_until = 4;
    system.pending_events.push(arrival);
	}
}

function AnomalyCollapseEvent (anomaly) {
	this.message = `Your science officer scans the anomaly with a neutrino oscillation probe, accidentally triggering a Richtmyer-Meshkov instability. Gravity waves rock your ship violently as the anomaly begins collapsing into a black hole...SET THRUSTERS TO MAXIMUM!`;
	this.time_until = 0;
	this.anomaly = anomaly;
}

AnomalyCollapseEvent.prototype = {
  action: function (message, p, system) {
    black_hole = {
      name: 'BLACK HOLE',
      xCoord: this.anomaly.xCoord,
      yCoord: this.anomaly.yCoord,
      radius: 6,
      class: BODY_BLACK_HOLE,
      mass: 1000,
      events: null
    }
    system.planets.push(black_hole);
    this.anomaly.destroy();
    message.text = this.message;
  }
}


function MessageEvent (message, time_until) {
	this.message = "A subspace communication has been received from Altaris IV. " + message;
	this.time_until = time_until;
}

MessageEvent.prototype = {
  action: function (message, p, system) {
    message.text = this.message;
  }
}