function Planet (xCoord, yCoord, type, radius, system) {
  this.xCoord = x;
  this.yCoord = y;
  this.radius = radius;
  this.class = type;
  this.events = [];
  this.system = system;
  switch (this.class) {
    case BODY_ANOMALY:
      this.name = getAnomalyName();
      this.mass = -1;
      break;
    default:
      this.name = randomSmallBodyName(this);
      this.mass = randomNumber(1,4);
      break;
  }
}

Planet.prototype = {
  addAnomalyEvent: function() {
    var options = [];
    options.push({opt: new AnomalyScienceEvent(), prob: 10});
    this.events.push(randomOption(options));
  },
  addRandomEvent: function() {
    var options = [];
    options.push({opt: new TempleEvent(), prob: 10});
    options.push({opt: new FindTribeEvent(), prob: 10});
    options.push({opt: new ApexPredatorEvent(), prob: 10});

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

    candidate_destinations = [];
    this.system.universe.systems.forEach( (sys) => {
      if (sys != this.system) {
        sys.planets.forEach( (p) => {
          if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class == BODY_PLANET_FROZEN) {
            candidate_destinations.push(p);
          }
        });
      }
    });

    if(candidate_destinations.length >= 1) {
      var destination = candidate_destinations.random();
      options.push({opt: new ArtifactClueEvent (this, destination), prob: 5});
    }

    this.events.push(randomOption(options));
  }
}
