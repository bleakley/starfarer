function Weapon(name, range, damage, accuracy, energy, damageType)
{
  this.name = name;
  this.range = range;
  this.damage = damage;
  this.energy = energy;
  this.accuracy = accuracy;
  this.damageType = damageType;
  this.readyToFire = false;
  this.mount = MOUNT_FWD;
  this.selected = false;
  this.makeNeutralsHostile = true;
  switch (damageType) {
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
