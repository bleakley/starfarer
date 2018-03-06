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
  this.facing = getEightWayDirection(momentum[0], momentum[1]);
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
  let wep = new Weapon('Laser Cannon', 10, 3, 50, 2);
  wep.mount = MOUNT_STBD;
  let wep2 = new Weapon('Ion Cannon', 10, 4, 50, 2);
  wep2.ion = true;
  wep2.mount = MOUNT_PORT;
  let wep3 = new Weapon('Tractor Beam', 10, 2, 30, 2);
  wep3.tractor = true;
  wep3.mount = MOUNT_FWD;
  this.weapons = [wep3, wep, wep2];
  this.destroyed = false;
  this.maxSpeed = 3; // this is for AI only
  this.followPlayer = true;
  this.attackPlayer = false;
  this.event = null; // Event triggered by investigating this ship
}

Ship.prototype = {
	powerDown: function() {
		this.shields = 0;
    this.energy = 0;
	},
  regenerateSystems: function() {
    if(this.energy >= this.energyMax) {
      this.shields = Math.min(this.shields + 1, this.shieldsMax);
    }
    if(this.energy > this.energyMax) {
      this.energy--; // if you are overcharged, you slowly leak extra energy
    } else {
      this.energy = Math.min(this.energy + this.energyRegen, this.energyMax);
    }
    this.weapons.forEach((w) => { w.readyToFire = true; });
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
  takeTractorDamage: function(damage) {
    let damageAfterShields = Math.max(0, damage - Math.max(0, this.shields));
    this.shields = Math.max(0, this.shields - damage);
    if (this.shields > 0)
      return this.destroyed;
    if (this.xMoment > 0)
		  this.xMoment = Math.max(0, this.xMoment - damage);
    if (this.xMoment < 0)
      this.xMoment = Math.min(0, this.xMoment + damage);
    if (this.yMoment > 0)
		  this.yMoment = Math.max(0, this.yMoment - damage);
    if (this.yMoment < 0)
      this.yMoment = Math.min(0, this.yMoment + damage);
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
  getTurnsUntilCollision: function(map) {
    for (let i = 0; i < 4; i++) {
      if(!_.has(map, [this.xCoord+this.xMoment*i, this.yCoord+this.yMoment*i, 'forbiddenToAI']))
        continue;
      let space = map[this.xCoord+this.xMoment*i][this.yCoord+this.yMoment*i];
      if (space.forbiddenToAI) {
        return i;
      }
    }
    return 5;
  },
  plotBetterCourse: function(map, astar) {

    let caution = 3;

    if (this.energy < this.maneuverCost)
      return; //don't bother

    let nextX = this.xCoord + this.xMoment;
    let nextY = this.yCoord + this.yMoment;
    let distToTargetX = Math.abs(astar._toX - nextX);
    let distToTargetY = Math.abs(astar._toY - nextY);
    let distToTarget = Math.max(distToTargetX, distToTargetY);

    if (nextX >= MAP_WIDTH || nextX < 0 || nextY >= MAP_HEIGHT || nextY < 0) {
      // dont' go off the map!
      let directionBackToMapX = MAP_WIDTH/2-this.xMoment;
      let directionBackToMapY = MAP_HEIGHT/2-this.yMoment;
      this.xCursor = this.xMoment + Math.sign(directionBackToMapX);
      this.yCursor = this.yMoment + Math.sign(directionBackToMapY);
      return;
    }

    let currentSpeed = Math.max(Math.abs(this.xMoment), Math.abs(this.yMoment));
    let desiredSpeed = Math.min(currentSpeed + 1, this.maxSpeed);
    //reduce desired speed here if too close to destination
    if (desiredSpeed && distToTarget/desiredSpeed < caution)
      desiredSpeed--;

    if (desiredSpeed && this.getTurnsUntilCollision(map) < caution) {
      desiredSpeed = Math.max(1, desiredSpeed - 1);
    }

    let desiredCourse = [0, 0];

    if (this.followPlayer) {
      let stepCount = 0;
      astar.compute(nextX, nextY, function(x, y) {
        if (stepCount == desiredSpeed) {
          desiredCourse = [x,y];
        }
        stepCount++;
      });
    }

    //slow down!
    while (desiredCourse[0] + this.xMoment - nextX > desiredSpeed)
      desiredCourse[0]--;
    while (desiredCourse[1] + this.yMoment - nextY > desiredSpeed)
      desiredCourse[1]--;
    while (desiredCourse[0] + this.xMoment - nextX < -desiredSpeed)
      desiredCourse[0]++;
    while (desiredCourse[1] + this.yMoment - nextY < -desiredSpeed)
      desiredCourse[1]++;

    this.xCursor = this.xMoment + Math.sign(desiredCourse[0] - nextX);
    this.yCursor = this.yMoment + Math.sign(desiredCourse[1] - nextY);

	},
  getHighlightColor: function() {
    if (this.player)
      return "#0E4";
    if (this.attackPlayer)
      return "red";
    return "yellow";
  },
  toggleSelectedWeapon: function() { //only useful for player
    let selectedWeapon = _.find(this.weapons, (w) => w.selected);
    let startingIndex = 0;
    if (selectedWeapon) {
      startingIndex = Math.min(this.weapons.length - 1, _.indexOf(this.weapons, selectedWeapon) + 1);
    }

    let nextUnselectedWeapon = _.find(this.weapons, (w) => { return !w.selected && w.readyToFire && this.energy >= w.energy; }, startingIndex);
    if (!nextUnselectedWeapon)
      nextUnselectedWeapon = _.find(this.weapons, (w) => { return !w.selected && w.readyToFire && this.energy >= w.energy; });

    if (nextUnselectedWeapon) {
      nextUnselectedWeapon.selected = true;
      if(selectedWeapon)
        selectedWeapon.selected = false;
    }
  },
  fireSelectedWeapon: function() { //only useful for player
    let selectedWeapon = _.find(this.weapons, (w) => w.selected);
    if(selectedWeapon) {
      this.fireWeapon(selectedWeapon);
    }
  },
  fireWeapon: function(weapon) {
    if (weapon.readyToFire && this.energy >= weapon.energy) {
      console.log(`firing ${weapon.name}`);
      this.energy -= weapon.energy;
      weapon.readyToFire = false;
      this.toggleSelectedWeapon();
    }
  },
}
