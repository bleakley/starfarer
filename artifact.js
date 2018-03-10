function ArtifactClueEvent (origin, destination) {
  this.destination = destination;
  this.origin = origin;
	this.message = `You speak with a local xenopaleontologist, and learn that a powerful Precursor artifact is thought to be buried near the anti-Jovian pole of the planet ${destination.name}. You thank the xenopaleontologist and promise that your science officer will cite her work in any reports resulting from discoveries made on ${destination.name}.`;
	this.time_until = 0;
}
ArtifactClueEvent.prototype = {
  action: function (universe, callbackFunction) {
    this.destination.events.push(new ArtifactDiscoveryEvent(this));
    getAcknowledgement(this.message, callbackFunction);    
  }
}

function ArtifactDiscoveryEvent (clue) {
  this.clue = clue;
	this.message = `You focus your superconducting interferometer at the anti-Jovian pole of the planet's surface and quickly detect a magnetic anomaly. Just as the xenopalenotologist on ${this.clue.origin.name} had expected, a strange Precursor device was buried there!`;
  let options = [ WEAPON_SIPHON, WEAPON_MINDCONTROL, WEAPON_ZERO_POINT, WEAPON_REACTOR_OVERCHARGE, WEAPON_SINGULARITY, WEAPON_NEURAL_STATIC_PROJECTOR, WEAPON_GRAVATIC_SHEAR, WEAPON_PURIFICATION];
  this.artifact = new Weapon(options.random())
  this.time_until = 0;
}
ArtifactDiscoveryEvent.prototype = {
  action: function (universe, callbackFunction) {
    let ps = getPlayerShip(getPlayerSystem(universe).ships);
    getAcknowledgement(this.message, () => {equipWeapon(ps, this.artifact, callbackFunction)} );    
  }
}
