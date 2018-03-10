function Planet (xCoord, yCoord, radius, system) {
  this.xCoord = x,
  this.yCoord = y,
  this.radius = radius,
  this.class = randomOption(SMALL_BODIES),
  this.name = SMALL_BODY_NAMES.random(),
  this.mass = randomNumber(1,4),
  this.events = [];
  this.system = system;
}

Planet.prototype = {
  addRandomEvent: function() {
    var options = [];
    options.push({opt: new TempleEvent(), prob: 10});
    options.push({opt: new FindTribeEvent(), prob: 10});
    
    let candidate_destinations = [];
    this.system.planets.forEach( (p) => {
     if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class == BODY_PLANET_FROZEN) {
       if (p != this)
        candidate_destinations.push(p);
      }
    });  
    if(candidate_destinations.length >= 1) {
      let destination = candidate_destinations.random();
      options.push({opt: new MedicalDeliveryRequestEvent (this, destination), prob: 10});
    }
    this.events.push(randomOption(options)); 
  }
}