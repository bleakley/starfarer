function Ship(coords, momentum, type=SHIP_TYPE_OTHER, flag=SHIP_FLAG_UNKNOWN)
{
  this.name = TEAM_NAME[flag] + " " + SHIP_NAMES[type];
  this.xCoord = coords[0];
  this.yCoord = coords[1];
  this.char = SHIP_SYMBOL[type];
  this.player = false;
  this.xMoment = momentum[0];
  this.yMoment = momentum[1];
  this.xCursor = momentum[0];
  this.yCursor = momentum[1];
  this.facing = getEightWayDirection(momentum[0], momentum[1]);
  if (this.facing == CENTER)
    this.facing = EAST;
  this.weapons = [];

  this.warpCore = 20;
  this.warpCoreMax = 20;
  this.hullMax = SHIP_HULL[type];
  this.hull = SHIP_HULL[type];
  this.shields = SHIP_SHIELD[type];
  this.shieldsMax = SHIP_SHIELD[type];
  this.maneuverLevel = type == SHIP_TYPE_FIGHTER ? 2 : 1;
  this.maneuverCost = SHIP_MANEUVER_COST[type];
  this.energyRegen = SHIP_ENERGY_RECHARGE[type];
  this.energy = SHIP_ENERGY[type];
  this.energyMax = SHIP_ENERGY[type];
  this.accuracyBoost = 0;
  this.crew = SHIP_MAX_CREW[type];
  this.minCrew = SHIP_MIN_CREW[type];
  this.maxCrew = SHIP_MAX_CREW[type];
  this.maxPrisoners = Math.floor(SHIP_MAX_CREW[type]/2);
  this.prisoners = randomNumber(0, this.maxPrisoners);
  this.credits = SHIP_LOOT[type];
  this.type = type;
  this.flag = flag;
  this.hasOrbitron = false;
  if (flag == SHIP_FLAG_MERCHANT)
    this.credits = 2*SHIP_LOOT[type];
  switch (type) {
    case SHIP_TYPE_FIGHTER:
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.maxSpeed = 4;
      break;
    case SHIP_TYPE_SLOOP:
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.maxSpeed = 3;
      break;
    case SHIP_TYPE_FRIGATE:
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.maxSpeed = 3;
      break;
    case SHIP_TYPE_TRANSPORT:
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_TRACTOR_BEAM), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 2;
      break;
    case SHIP_TYPE_CARRIER:
      this.mountWeapon(new Weapon(WEAPON_HEAVY_ION), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_TRACTOR_BEAM), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 2;
      break;
    case SHIP_TYPE_BATTLESHIP:
      this.mountWeapon(new Weapon(WEAPON_SIEGE_LASER), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_HEAVY_LASER), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_HEAVY_LASER), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 2;
      break;
    case SHIP_TYPE_DREADNOUGHT:
      this.mountWeapon(new Weapon(WEAPON_HEAVY_LASER), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_HEAVY_LASER), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_HEAVY_LASER), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_NEUTRON_BEAM), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_NEUTRON_BEAM), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_NEUTRON_BEAM), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 3;
      break;
    case SHIP_TYPE_STATION:
      this.mountWeapon(new Weapon(WEAPON_SIEGE_LASER), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_SIEGE_LASER), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_SIEGE_LASER), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_SIEGE_LASER), MOUNT_AFT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 0;
      break;
    case SHIP_TYPE_WRAITH:
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 3;
      break;
    case SHIP_TYPE_ARBITER:
      this.mountWeapon(new Weapon(WEAPON_ION_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon([WEAPON_SIPHON, WEAPON_MINDCONTROL, WEAPON_ZERO_POINT, WEAPON_REACTOR_OVERCHARGE, WEAPON_SINGULARITY, WEAPON_NEURAL_STATIC_PROJECTOR, WEAPON_GRAVATIC_SHEAR, WEAPON_PURIFICATION].random()), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_FWD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_STBD);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_PORT);
      this.mountWeapon(new Weapon(WEAPON_LASER_CANNON), MOUNT_AFT);
      this.maxSpeed = 3;
      break;
  }
  switch (flag) {
    case SHIP_FLAG_UNKNOWN:
    case SHIP_FLAG_MERCHANT:
      this.followPlayer = false;
      this.attackPlayer = false;
      this.followEnemies = false;
      this.attackEnemies = false;
      this.prisoners = 0;
      this.maxPrisoners = 0;
      break;
    case SHIP_FLAG_PLAYER:
      this.followPlayer = false;
      this.attackPlayer = false;
      this.followEnemies = true;
      this.attackEnemies = true;
      break;
    case SHIP_FLAG_PIRATE:
      this.followPlayer = true;
      this.attackPlayer = true;
      this.followEnemies = false;
      this.attackEnemies = false;
      this.prisoners = Math.min(2*this.prisoners, this.maxPrisoners);
      break;
    case SHIP_FLAG_PRECURSOR:
    case SHIP_FLAG_KHAN:
      this.followPlayer = true;
      this.attackPlayer = true;
      this.followEnemies = false;
      this.attackEnemies = false;
      break;
  }
  this.destroyed = false;
  this.abandoned = false;
  this.toBeDisintegrated = false;
  this.mindControlByPlayerDuration = 0;
  this.mindControlByEnemyDuration = 0;
  this.currentWaypoint = null; //for npc navigation only
  this.event = null; // Event triggered by investigating this ship
  this.known_systems = [];
}

Ship.prototype = {
  mountWeapon: function(weapon, mount) {
    weapon.mount = mount;
    weapon.readyToFire = false;
    weapon.selected = false;
    this.weapons.push(weapon);
	},
	powerDown: function() {
		this.shields = 0;
    this.energy = 0;
    this.weapons.forEach((w) => {
      w.selected = false;
      w.readyToFire = false;
    });
	},
  regenerateSystems: function() {
    if(percentChance(this.crew-this.minCrew) && this.hull < this.hullMax && this.energy > 0) {
      addTextToCombatLog(`The extra crew of the ${this.name} focus on damage control, and recover 1 point of hull.`);
      this.hull = Math.min(this.hull + 1, this.hullMax);
    }

    if(this.shields > this.shieldsMax) {
      this.shields--; // if you are overcharged, you slowly leak extra shields
    } else if(this.energy >= this.energyMax/2) {
      this.shields = Math.min(this.shields + 1, this.shieldsMax);
    }

    if(this.energy >= this.energyMax/2) {
      this.warpCore = Math.min(this.warpCore + 1, this.warpCoreMax);
    }

    if(this.energy > 2*this.energyMax) {
      addTextToCombatLog(`DANGER! Reactor meltdown in progress on board ${this.name}!`);
      this.takeHullDamage(1); // reactor meltdown!
    }

    if(percentChance(-1*(this.crew-this.minCrew)) && this.energyRegen > 0) {
      addTextToCombatLog(`With insufficient manning, the ${this.name} is unable to make use of reactor output.`);
    } else if(this.energy > this.energyMax) {
      this.energy--; // if you are overcharged, you slowly leak extra energy
    } else {
      this.energy = Math.min(this.energy + this.energyRegen, this.energyMax);
    }

    this.weapons.forEach((w) => { w.readyToFire = true; });
    this.mindControlByPlayerDuration = Math.max(0, this.mindControlByPlayerDuration - 1);
    this.mindControlByEnemyDuration = Math.max(0, this.mindControlByEnemyDuration - 1);
	},
  stop: function() {
    this.xMoment = 0;
    this.yMoment = 0;
    this.xCursor = 0;
    this.yCursor = 0;
  },
  loseCrew: function(number) {
    this.crew = Math.max(0, this.crew - number);
    if (this.crew <= 0 && this.minCrew > 0) {
      this.abandoned = true;
      this.energyRegen = 0;
      this.maneuverLevel = 0;
      this.crew = 0;
      this.powerDown();
      let weaponLoot = this.getLootWeapon();

      if (!this.destroyed) // no double dipping
        this.event = new LootAbandonedShipEvent(this);
      addTextToCombatLog(this.name + ' has lost all crew and is defenseless.');
    }
  },
  takeDamage: function(damage, damageType, attacker) {
    switch (damageType) {
      case DAMAGE_NORMAL:
        this.takeNormalDamage(damage);
        break;
      case DAMAGE_ION:
        this.takeIonDamage(damage);
        break;
      case DAMAGE_TRACTOR:
        this.takeTractorDamage(damage);
        break;
      case DAMAGE_NEUTRON:
        this.takeNeutronDamage(damage);
        break;
      case DAMAGE_MINDCONTROL:
        this.takeMindControlDamage(damage, attacker);
        break;
      case DAMAGE_SIPHON:
        this.takeSiphonDamage(damage, attacker);
        break;
      case DAMAGE_OVERLOAD:
        this.takeOverchargeDamage(damage);
        break;
    }
    return this.destroyed;
	},
	takeNormalDamage: function(damage) {
		let damageAfterShields = Math.max(0, damage - Math.max(0, this.shields));
    this.shields = Math.max(0, this.shields - damage);
    this.hull = Math.max(0, this.hull - damageAfterShields);
    if (percentChance(damageAfterShields*20)) {
      this.loseCrew(1);
      this.prisoners = Math.max(0, this.prisoners - 1);
    }
    if (!this.hull)
      this.destroy();
	},
  takeHullDamage: function(damage) {
    this.hull = Math.max(0, this.hull - damage);
    if (!this.hull)
      this.destroy();
	},
  takeIonDamage: function(damage) {
		let damageAfterShields = Math.max(0, damage - Math.max(0, this.shields));
    this.shields = Math.max(0, this.shields - damage);
    this.energy -= damageAfterShields; // can go negative
	},
  takeTractorDamage: function(damage) {
    if (this.shields > 0)
      return;
    if (this.xMoment > 0)
		  this.xMoment = Math.max(0, this.xMoment - damage);
    if (this.xMoment < 0)
      this.xMoment = Math.min(0, this.xMoment + damage);
    if (this.yMoment > 0)
		  this.yMoment = Math.max(0, this.yMoment - damage);
    if (this.yMoment < 0)
      this.yMoment = Math.min(0, this.yMoment + damage);
	},
  takeNeutronDamage: function(damage) {
    if (this.shields > 0)
      return;
    this.prisoners = Math.max(0, this.prisoners - damage);
    this.loseCrew(damage);
	},
  takeMindControlDamage: function(damage, attacker) {
    if (this.shields > 0)
      return;
    if (this.player)
      return;
    console.log(`${this.name} hit with mindcontrol by ${attacker.name} of the team ${TEAM_NAME[attacker.flag]}`);
    switch (attacker.flag) {
      case SHIP_FLAG_KHAN:
      case SHIP_FLAG_PIRATE:
      case SHIP_FLAG_PRECURSOR:
      default:
        this.mindControlByPlayerDuration = 0;
        this.mindControlByEnemyDuration += damage;
        break;
      case SHIP_FLAG_PLAYER:
        this.mindControlByEnemyDuration = 0;
        this.mindControlByPlayerDuration += damage;
        break;
    }
    console.log(`${this.name} mindcontrol by (player: ${this.mindControlByPlayerDuration}) (enemy: ${this.mindControlByEnemyDuration})`);
	},
  takeSiphonDamage: function(damage, attacker) {
    let amountSiphoned = Math.min(this.shields, damage);
    this.shields = Math.max(0, this.shields - damage);
    attacker.shields += amountSiphoned;
	},
  takeOverchargeDamage: function(damage) {
    this.energy += damage;
	},
  getLootWeapon: function() {
    switch (this.type) {
      case SHIP_TYPE_FIGHTER:
        return WEAPON_LASER_CANNON;
      case SHIP_TYPE_SLOOP:
        return WEAPON_LASER_CANNON;
      case SHIP_TYPE_FRIGATE:
        return [WEAPON_LASER_CANNON, WEAPON_ION_CANNON].random();
      case SHIP_TYPE_TRANSPORT:
        return [WEAPON_TRACTOR_BEAM, WEAPON_ION_CANNON].random();
      case SHIP_TYPE_CARRIER:
        return [WEAPON_HEAVY_ION, WEAPON_ION_CANNON].random();
      case SHIP_TYPE_BATTLESHIP:
        return [WEAPON_SIEGE_LASER, WEAPON_HEAVY_LASER, WEAPON_LASER_CANNON].random();
      case SHIP_TYPE_DREADNOUGHT:
        return [WEAPON_HEAVY_LASER, WEAPON_NEUTRON_BEAM].random();
      case SHIP_TYPE_STATION:
        return [WEAPON_SIEGE_LASER, WEAPON_LASER_CANNON].random();
      case SHIP_TYPE_WRAITH:
        return [WEAPON_LASER_CANNON, WEAPON_ION_CANNON].random();
      case SHIP_TYPE_ARBITER:
        return _.find(this.weapons, (w) => { return w.artifact }).type;
    }
  },
  destroy: function() {
    if (!this.destroyed) {
      this.hull = 0;
      this.char = '#';
      this.energyRegen = 0;
      this.maneuverLevel = 0;
      this.crew = 0;
      this.prisoners = 0;
      this.powerDown();
      this.destroyed = true;
      this.credits = Math.floor(this.credits/2);
      let weaponLoot = this.getLootWeapon();

      if (!this.abandoned) // no double dipping
        this.event = new LootDestroyedShipEvent(this);
      console.log(this.name + ' is destroyed');
    }
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

    let currentSpeed = freeDiagonalDistance([this.xMoment, this.yMoment], [0,0]);
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
    if (this.mindControlByPlayerDuration || this.mindControlByEnemyDuration)
      return "purple";
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
    if (this.canFireWeapon(weapon)) {
      console.log(`firing ${weapon.name}`);
      this.energy -= weapon.energy;
      weapon.readyToFire = false;
      this.toggleSelectedWeapon();
    } else {
      console.log(`${this.name} does not have enough energy to fire ${weapon.name}`);
    }
  },
  canFireWeapon: function(weapon) {
    return weapon.readyToFire && this.energy >= weapon.energy;
  },
  activeWeapon: function() {
    return _.find(this.weapons, (w) => { return this.canFireWeapon(w) && w.selected; });
  },
  canBeHitByWeapon: function(attacker, weapon) {
    if (freeDiagonalDistance([attacker.xCoord, attacker.yCoord], [this.xCoord, this.yCoord]) > weapon.range)
      return false;
    return this.inFiringArc(attacker, weapon);
  },
  inFiringArc: function(attacker, weapon) {
    if (this.xCoord == attacker.xCoord && this.yCoord == attacker.yCoord)
      return false; //can't hit someone right on top of you
    let octant = getFiringOctant(attacker.facing, weapon.mount);
    // doing this based off the direction vector left as an exercise for the reader
    switch (octant) {
      case SE:
        return this.yCoord >= attacker.yCoord && this.xCoord >= attacker.xCoord;
      case SW:
        return this.yCoord >= attacker.yCoord && this.xCoord <= attacker.xCoord;
      case NW:
        return this.yCoord <= attacker.yCoord && this.xCoord <= attacker.xCoord;
      case NE:
        return this.yCoord <= attacker.yCoord && this.xCoord >= attacker.xCoord;
      case EAST:
        return this.xCoord > attacker.xCoord && Math.abs(this.yCoord - attacker.yCoord) <= this.xCoord - attacker.xCoord;
      case WEST:
        return this.xCoord < attacker.xCoord && Math.abs(this.yCoord - attacker.yCoord) <= attacker.xCoord - this.xCoord;
      case NORTH:
        return this.yCoord < attacker.yCoord && Math.abs(this.xCoord - attacker.xCoord) <= attacker.yCoord - this.yCoord;
      case SOUTH:
        return this.yCoord > attacker.yCoord && Math.abs(this.xCoord - attacker.xCoord) <= this.yCoord - attacker.yCoord;
    }
    return true;
  },
  getChanceToHit: function(weapon, target) {
    let distance = freeDiagonalDistance([this.xCoord, this.yCoord], [target.xCoord, target.yCoord]);
    let targetSpeed = target.speed();
    if (distance > weapon.range) {
     return { prob: 0, modifiers: ['Out of range'] }
    }
    if (!target.inFiringArc(this, weapon)) {
      return { prob: 0, modifiers: ['Not in firing arc'] };
    }

    let totalHitProb = weapon.accuracy;
    let hitModifiers = [`+${weapon.accuracy.toString().padEnd(2)} Base weapon accuracy`];
    if (this.accuracyBoost) {
      totalHitProb += this.accuracyBoost;
      hitModifiers.push(`+${this.accuracyBoost.toString().padEnd(2)} Targeting computer`);
    }
    totalHitProb -= distance;
    hitModifiers.push(`-${distance.toString().padEnd(2)} Distance`);
    let speedMod = 5*targetSpeed;
    totalHitProb -= speedMod;
    hitModifiers.push(`-${speedMod.toString().padEnd(2)} Target speed`);
    let firingDirection = unitVector(this.xCoord - target.xCoord, this.yCoord - target.yCoord);
    let transverseMod = Math.floor(10*crossProduct(firingDirection, [target.xMoment, target.yMoment]));
    totalHitProb -= transverseMod;
    hitModifiers.push(`-${transverseMod.toString().padEnd(2)} Transverse velocity`);
    return { prob: Math.min(95, Math.max(5, totalHitProb)), modifiers: hitModifiers };
  },
  fireAt: function(weapon, target) {
    this.fireWeapon(weapon);
    if (weapon.makeNeutralsHostile) {
      target.attackPlayer = true;
      target.followPlayer = true;
    }
    let prob = this.getChanceToHit(weapon, target).prob;
    if (percentChance(prob)) {
      let initiallyDestroyed = target.destroyed;
      let initialShields = target.shields;
      target.takeDamage(weapon.damage, weapon.damageType, this);
      let messageString = `${this.name} fires at ${target.name} with its ${weapon.name} (${prob}%) and hits`;
      if (!initiallyDestroyed && target.destroyed) {
        addTextToCombatLog(messageString + `, destroying it.`);
      } else {
        switch (weapon.damageType) {
          case DAMAGE_NORMAL:
            addTextToCombatLog(messageString + `, dealing ${weapon.damage} damage.`);
            break;
          case DAMAGE_ION:
            addTextToCombatLog(messageString + `, draining shields and energy for ${weapon.damage} damage.`);
            break;
          case DAMAGE_TRACTOR:
            if (target.shields > 0)
              addTextToCombatLog(messageString + `, but the target's shields prevent the weapon from taking effect.`);
            else
              addTextToCombatLog(messageString + `, reducing the target's speed to ${target.speed()}.`);
            break;
          case DAMAGE_NEUTRON:
            if (target.shields > 0)
              addTextToCombatLog(messageString + `, but the target's shields prevent the weapon from taking effect.`);
            else
              addTextToCombatLog(messageString + `, dealing ${weapon.damage} directly to the crew.`);
            break;
          case DAMAGE_MINDCONTROL:
            if (target.shields > 0)
              addTextToCombatLog(messageString + `, but the target's shields prevent the weapon from taking effect.`);
            else
              addTextToCombatLog(messageString + `, seizing control of the hostile crew's minds.`);
            break;
          case DAMAGE_SIPHON:
            if (initialShields <= 0)
              addTextToCombatLog(messageString + `, but the target has no shields to drain.`);
            else
              addTextToCombatLog(messageString + `, draining the target's shields of ${initialShields-target.shields} points.`);
            break;
          case DAMAGE_OVERLOAD:
            addTextToCombatLog(messageString + `, sending a massive surge of energy directly into the target's reactor.`);
            break;
          default:
            addTextToCombatLog(messageString);
            break;
        }
      }
      return true;
    }
    addTextToCombatLog(`${this.name} fires at ${target.name} with its ${weapon.name} (${prob}%) and misses`);
    return false;
  },
  speed: function() {
    return freeDiagonalDistance([this.xMoment, this.yMoment], [0, 0]);
  }
}
