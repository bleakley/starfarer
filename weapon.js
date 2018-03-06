function Weapon(name, range, damage, accuracy, energy)
{
  this.name = name;
  this.range = range;
  this.damage = damage;
  this.energy = energy;
  this.accuracy = accuracy;
  this.ion = false;
  this.tractor = false;
  this.readyToFire = false;
  this.mount = MOUNT_FWD;
  this.selected = false;
}

Weapon.prototype = {
}
