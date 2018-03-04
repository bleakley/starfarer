function ArrivalEvent (ship) {
	this.message = `Cherenkov radiation detected from an unknown object dropping out of hyperspace, bearing ${ship.xMoment} ${ship.yMoment}.`;
	this.time_until = 0;
	this.ship = ship;
}

ArrivalEvent.prototype = {

	action: function (message, p, map, ships, pending_events) {
    ships.push(this.ship);
    message.text = this.message;
	}
}

function TempleEvent () {
	this.message = "Your landing party searches a crumbling precursor temple and finds a digicodex containing the coordinates of a nearby anomaly. However, while accessing the digicodex, your tech specialist accidentally activated the temple's subspace transponder. Your navigator has estimated that if any ships in the nearest star system picked up the transmission, they could arrive in as few as 4 days.";
	this.time_until = 0;
}

TempleEvent.prototype = {

	action: function (message, p, map, ships, pending_events) {
    let anomaly = new Ship([80,10], [0,0], 1, 0, 0);
    anomaly.char = "A";
    anomaly.name = "anomaly X72-C";
    ships.push(anomaly);
    message.text = this.message;

    var ship = new Ship([60,40], [2,1], 5, 3, 10);
    arrival = new ArrivalEvent(ship);
    arrival.time_until = 4;
    pending_events.push(arrival);
	}
}
