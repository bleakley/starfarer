function Ship(coords, momentum, hull, shields, energy)
{
  this.name = 'unknown ship';
  this.xCoord = coords[0];
  this.yCoord = coords[1];
  this.char = "@";
  this.player = false;
  this.xMoment = momentum[0];
  this.yMoment = momentum[1];
  this.xCursor = momentum[0];
  this.yCursor = momentum[1];
  this.hull = hull;
  this.hullMax = hull;
  this.shields = shields;
  this.shieldsMax = shields;
  this.maneuverLevel = 1;
  this.maneuverCost = 3;
  this.energyRegen = 1;
  this.energy = energy;
  this.energyMax = energy;
  this.credits = 10;
  this.destroyed = false;
  this.maxSpeed = 3; // this is for AI only
  this.dijkstra = [];
  this.dijkstra[DIJKSTRA_AVOID_EDGE] = 1;
  this.dijkstra[DIJKSTRA_AVOID_HAZARDS] = 1;
  this.dijkstra[DIJKSTRA_SEEK_PLAYER] = 0;
  this.dijkstra[DIJKSTRA_AVOID_PLAYER] = 0;
}

Ship.prototype = {
	powerDown: function() {
		this.shields = 0;
    this.energy = 0;
	},
  stop: function() {
    this.xMoment = 0;
    this.yMoment = 0;
    this.xCursor = 0;
    this.yCursor = 0;
  },
	takeDamage: function(damage) {
		let damageAfterShields = Math.max(0, damage - Math.max(0, this.shields));
    this.shields = Math.max(0, this.shields - damage);
    this.hull = Math.max(0, this.hull - damageAfterShields);
    if (!this.hull)
      this.destroy();
    return this.destroyed;
	},
  takeHullDamage: function(damage) {
    this.hull = Math.max(0, this.hull - damage);
    if (!this.hull)
      this.destroy();
    return this.destroyed;
	},
  takeIonDamage: function(damage) {
		let damageAfterShields = Math.max(0, damage - Math.max(0, this.shields));
    this.shields = Math.max(0, this.shields - damage);
    this.energy -= damageAfterShields; // can go negative
    return this.destroyed;
	},
  destroy: function() {
    this.hull = 0;
    this.char = '#';
    this.energyRegen = 0;
    this.maneuverLevel = 0;
    this.powerDown();
    this.destroyed = true;
    console.log(this.name + ' is destroyed');
	},
  plotBetterCourse: function(map, astar) {

    let nextX = this.xCoord + this.xMoment;
    let nextY = this.yCoord + this.yMoment;

    if (nextX >= MAP_WIDTH || nextX < 0 || nextY >= MAP_HEIGHT || nextY < 0) {
      // dont' go off the map!
      let directionBackToMapX = MAP_WIDTH/2-this.xMoment;
      let directionBackToMapY = MAP_HEIGHT/2-this.yMoment;
      this.xCursor = this.xMoment + Math.sign(directionBackToMapX);
      this.yCursor = this.yMoment + Math.sign(directionBackToMapY);
      console.log(`off the map coordinates: ${this.xCoord}, ${this.yCoord}`);
      console.log(`off the map cursors: ${this.xCursor}, ${this.yCursor}`);
      return;
    }

    let currentSpeed = Math.max(Math.abs(this.xMoment), Math.abs(this.yMoment));
    let desiredSpeed = Math.min(currentSpeed + 1, this.maxSpeed);

    /*console.log('plotting course');
    console.log(`current postition is ${this.xCoord},${this.yCoord}`);
    console.log(`next postition is ${nextX},${nextY}`);*/
    let desiredCourse = [0, 0];

    let stepCount = 0;
    astar.compute(nextX, nextY, function(x, y) {
      if (stepCount == desiredSpeed) {
        desiredCourse = [x,y];
        //console.log(`${x},${y}`);
      }
      stepCount++;
    });

    //let desireToConserveFuel = 1;
    console.log(desiredCourse);

    //slow down!
    while (desiredCourse[0] + this.xMoment - nextX > this.maxSpeed)
      desiredCourse[0]--;
    while (desiredCourse[1] + this.yMoment - nextY > this.maxSpeed)
      desiredCourse[1]--;
    while (desiredCourse[0] + this.xMoment - nextX < -this.maxSpeed)
      desiredCourse[0]++;
    while (desiredCourse[1] + this.yMoment - nextY < -this.maxSpeed)
      desiredCourse[1]++;

    this.xCursor = this.xMoment + Math.sign(desiredCourse[0] - nextX);
    this.yCursor = this.yMoment + Math.sign(desiredCourse[1] - nextY);

	}
}
