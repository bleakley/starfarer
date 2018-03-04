function Weapon(range, damage, accuracy, energy)
{
  this.name = 'unknown weapon';
  this.range = range;
  this.damage = damage;
  this.energy = energy;
  this.accuracy = accuracy;
  this.ion = false;
  this.tractor = false;
  this.readyToFire = false;
}

Weapon.prototype = {
}
