function MedicalDeliveryRequestEvent (origin, destination) {
  console.log("Delivery!", origin.system, origin, destination)
  let distance = Math.max(Math.abs(destination.xCoord - origin.xCoord), Math.abs(destination.yCoord - origin.yCoord));
  this.diseaseName = destination.system.universe.systems.random().name + " parasite";
  this.turns = Math.floor(distance/2) + randomNumber(10,40);
  this.reward = Math.floor(distance/5 + 1)*5;
  this.origin = origin;
  this.destination = destination;
	this.message = `${this.origin.name} is suffering from a category 4 ${this.diseaseName} outbreak! Local authorities have requested your assistance in retrieving vaccines from ${destination.name}. If the vaccines are brought within ${this.turns} days, then you will be compensated ${this.reward} BitCredits.`;
	this.time_until = 0;
}
MedicalDeliveryRequestEvent.prototype = {
  action: function (universe, callbackFunction) {
    this.startTurn = universe.turn;
    this.destination.events.push(new MedicalDeliveryPickupEvent(this));
    getAcknowledgement(this.message, callbackFunction);    
  }
}

function MedicalDeliveryPickupEvent (request) {
  this.request = request;
	this.message = `The xenoparasitology research lab on ${this.request.destination.name} provides you with a large supply of ${this.request.diseaseName} vaccines.`;
	this.time_until = 0;
}
MedicalDeliveryPickupEvent.prototype = {
  action: function (universe, callbackFunction) {
    let turnsRemaining = this.request.startTurn + this.request.turns - universe.turn;
    if (turnsRemaining > 0) {
      this.message += ` ${turnsRemaining} days remain to deliver the vaccines to ${this.request.origin.name}.`
      this.request.origin.events.push(new MedicalDeliveryDeliverEvent(this.request));
      getAcknowledgement(this.message, callbackFunction);    
    }
    else {
      this.message = `You inquire with the xenoparasitology research lab on ${this.request.destination.name} about the ${this.request.diseaseName} vaccines, but the chief medical officer tells you that it's too late for a delivery now.`;
      getAcknowledgement(this.message, callbackFunction);   
    }
  }
}

function MedicalDeliveryDeliverEvent (request) {
  this.request = request;
	this.message = "";
	this.time_until = 0;
}
MedicalDeliveryDeliverEvent.prototype = {
  action: function (universe, callbackFunction) {
    let turnsRemaining = this.request.startTurn + this.request.turns - universe.turn;
    if (turnsRemaining >= 0) {
      this.message = `The authorities on ${this.request.origin.name} thank you profusely for delivering the ${this.request.diseaseName} vaccines. ${this.request.reward} BitCredits have been added to your account.`;
      let ps = getPlayerShip(getPlayerSystem(universe).ships);
      ps.credits += this.request.reward;
    }
    else {
      this.message = `The authorities on ${this.request.origin.name} thank you for delivering the ${this.request.diseaseName} vaccines. \"Unfortunately we cannot compensate you for the delivery because it was ${-turnsRemaining} days late.\"`;
    }
    getAcknowledgement(this.message, callbackFunction);    
  }
}
