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
  plotCourse: function(map) {
    let courseOptions = [];
    for (let d = 0; d < 9; d++) {
      let totalSatisfaction = 0;
      for (let b = 0; b < NUMBER_OF_AI_BEHAVIORS; b++) {
        let satisfaction = map[this.xCoord+this.xMoment+DIRECTIONS[d][0]][this.yCoord+this.yMoment+DIRECTIONS[d][1]].dijkstra[b];
        totalSatisfaction += satisfaction;
      }
      if (Math.max(this.xMoment+DIRECTIONS[d][0], this.yMoment+DIRECTIONS[d][1]) > this.maxSpeed) {
        totalSatisfaction += 999;
      }
      courseOptions[d] = totalSatisfaction;
    }
    let bestDirection = courseOptions.indexOf(Math.min(...courseOptions));
    this.xCursor = this.xMoment + DIRECTIONS[bestDirection][0];
    this.yCursor = this.yMoment + DIRECTIONS[bestDirection][1];
	}
}
