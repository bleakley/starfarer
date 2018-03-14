function Weapon(type)
{
  this.type = type;
  switch (type) {
    case WEAPON_LASER_CANNON:
      this.name = 'Laser Cannon';
      this.cost = 10;
      this.range = 15;
      this.damage = 3;
      this.energy = 2;
      this.accuracy = 100;
      this.damageType = DAMAGE_NORMAL;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_ION_CANNON:
      this.name = 'Ion Cannon';
      this.cost = 12;
      this.range = 15;
      this.damage = 4;
      this.energy = 2;
      this.accuracy = 100;
      this.damageType = DAMAGE_ION;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_TRACTOR_BEAM:
      this.name = 'Tractor Beam';
      this.cost = 15;
      this.range = 10;
      this.damage = 1;
      this.energy = 4;
      this.accuracy = 100;
      this.damageType = DAMAGE_TRACTOR;
      this.makeNeutralsHostile = false;
      this.artifact = false;
      break;
    case WEAPON_NEUTRON_BEAM:
      this.name = 'Neutron Beam';
      this.cost = 15;
      this.range = 10;
      this.damage = 5;
      this.energy = 3;
      this.accuracy = 100;
      this.damageType = DAMAGE_NEUTRON;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_HEAVY_LASER:
      this.name = 'Heavy Laser Cannon';
      this.cost = 25;
      this.range = 20;
      this.damage = 7;
      this.energy = 6;
      this.accuracy = 90;
      this.damageType = DAMAGE_NORMAL;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_HEAVY_ION:
      this.name = 'Heavy Ion Cannon';
      this.cost = 30;
      this.range = 20;
      this.damage = 8;
      this.energy = 6;
      this.accuracy = 90;
      this.damageType = DAMAGE_ION;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_SIEGE_LASER:
      this.name = 'Heavy Siege Laser';
      this.cost = 40;
      this.range = 30;
      this.damage = 5;
      this.energy = 10;
      this.accuracy = 100;
      this.damageType = DAMAGE_NORMAL;
      this.makeNeutralsHostile = true;
      this.artifact = false;
      break;
    case WEAPON_SIPHON:
      this.name = 'Shield Siphon Beam';
      this.cost = 100;
      this.range = 10;
      this.damage = 3;
      this.energy = 5;
      this.accuracy = 100;
      this.damageType = DAMAGE_SIPHON;
      this.makeNeutralsHostile = true;
      this.artifact = true;
      break;
    case WEAPON_MINDCONTROL:
      this.name = 'Mind Control Ray';
      this.cost = 100;
      this.range = 10;
      this.damage = 6;
      this.energy = 10;
      this.accuracy = 100;
      this.damageType = DAMAGE_MINDCONTROL;
      this.makeNeutralsHostile = false;
      this.artifact = true;
      break;
    case WEAPON_ZERO_POINT:
      this.name = 'Zero Point Energy Cannon';
      this.cost = 100;
      this.range = 15;
      this.damage = 4;
      this.energy = 0;
      this.accuracy = 100;
      this.damageType = DAMAGE_NORMAL;
      this.makeNeutralsHostile = true;
      this.artifact = true;
      break;
    case WEAPON_REACTOR_OVERCHARGE:
      this.name = 'Reactor Overcharge Beam';
      this.cost = 100;
      this.range = 15;
      this.damage = 10;
      this.energy = 11;
      this.accuracy = 100;
      this.damageType = DAMAGE_OVERLOAD;
      this.makeNeutralsHostile = false;
      this.artifact = true;
      break;
    case WEAPON_SINGULARITY:
      this.name = 'Singularity Gun';
      this.cost = 100;
      this.range = 20;
      this.damage = 20;
      this.energy = 15;
      this.accuracy = 85;
      this.damageType = DAMAGE_NORMAL;
      this.makeNeutralsHostile = true;
      this.artifact = true;
      break;
    case WEAPON_NEURAL_STATIC_PROJECTOR:
      this.name = 'Quantum Static Projector';
      this.cost = 100;
      this.range = 10;
      this.damage = 25;
      this.energy = 10;
      this.accuracy = 85;
      this.damageType = DAMAGE_ION;
      this.makeNeutralsHostile = true;
      this.artifact = true;
      break;
    case WEAPON_GRAVATIC_SHEAR:
      this.name = 'Gravatic Shear Inducer';
      this.cost = 100;
      this.range = 15;
      this.damage = 5;
      this.energy = 10;
      this.accuracy = 100;
      this.damageType = DAMAGE_TRACTOR;
      this.makeNeutralsHostile = false;
      this.artifact = true;
      break;
    case WEAPON_PURIFICATION:
      this.name = 'Purification Ray';
      this.cost = 100;
      this.range = 15;
      this.damage = 15;
      this.energy = 9;
      this.accuracy = 85;
      this.damageType = DAMAGE_NEUTRON;
      this.makeNeutralsHostile = true;
      this.artifact = true;
      break;
  }

  this.readyToFire = false;
  this.mount = MOUNT_FWD;
  this.selected = false;

  switch (this.damageType) {
    case DAMAGE_NORMAL:
      this.symbol = "\u2022";
      this.color = "red";
      break;
    case DAMAGE_ION:
      this.symbol = "\u2022";
      this.color = "#00F";
      break;
    case DAMAGE_TRACTOR:
      this.symbol = "\u25CB";
      this.color = "green";
      break;
    case DAMAGE_NEUTRON:
      this.symbol = "\u25CB";
      this.color = "white";
      break;
    case DAMAGE_SIPHON:
    case DAMAGE_OVERLOAD:
      this.symbol = "\u25CB";
      this.color = "blue";
      break;
    case DAMAGE_MINDCONTROL:
      this.symbol = "\u25CB";
      this.color = "purple";
      break;
  }
}

Weapon.prototype = {
}

/*

highlight ships on mouseover
cursor, direction, and highlight color depends on passive/agressive stance
###
#B>
###
press W- cycle/select weapon
when weapon is selected, it automatically selects the closest hostile target in range/arc.
cycle through targets with tab/mouse
when a weapon is selected, draw the cone of fire on the map
ESC should clear selected weapon
targeting/accuracy data should display next to target on the map
+ Base weapon accuracy
+ Targeting computer level
+ Enemy mass?
- Enemy ECM level
- Enemy distance
- Enemy speed
- Transverse velocity
press F or click mouse- fire weapon


@ player
A anomaly
D dreadnought (boss ship)
B battleship (slow, poor maneuverability, very strong weapons and armor)
C carrier (slow, poor maneuverability, strong armor, summons fighters)



== Weapon Types ==
Laser Cannon
Ion Cannon
Tractor Beam
Neutron Beam

== Artifact Weapons ==
Zero Point Energy Cannon
Mind Control Beam
Shield Siphon Beam
Reactor Overcharge Beam

w     toggle active weapon
tab   select target
f     fire weapon
b     board ship or station
h     jump to hyperspace
s     toggle active systems
a     activate system
arrow keys to plot course
esc   to untarget a ship
l     view log
q     view quest log
a-z   select option in a shop


== Active Systems ==
fighter launch bay
drone launch bay
fighter recall beacon
flux capacitor
shield capacitor
regenerative nanite swarm
inertial dampener
micro jump coil
holographic projector

== Passive Systems ==

*/
