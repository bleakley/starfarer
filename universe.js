function Universe () {
  this.systems = [];
  
  for (var count = 0; count < N_STAR_SYSTEMS; count++) {
    this.systems.push(new System());
  }

  // Determine location of the Orbitron Device
  var candidate_planets = [];
  this.systems.forEach( (sys) => {
    sys.planets.forEach( (p) => {
      if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class == BODY_PLANET_FROZEN) {
        candidate_planets.push(p);
      }
    })
  })
  this.orbitron_planet = candidate_planets.random(); // Planet that holds the Orbitron Device
  this.orbitron_planet.events = [new FindOrbitronEvent()];
  this.orbitron_system = null; // System that the Orbitron Device is in
  this.systems.forEach( (sys) => {
    if (sys.planets.indexOf(this.orbitron_planet) > -1) {
      this.orbitron_system = sys;
    }
  });

  for (var count = 0; count < N_CLUES; count++){
    p = candidate_planets.random();
    if (p!=this.orbitron_planet){
      p.events = [new TempleClueEvent(this.orbitron_system, this.orbitron_planet)];
    }
  }
  
  this.build_connections();
  
  this.systems.forEach( (sys) => {
    sys.planets.forEach( (p) => {
      if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class == BODY_PLANET_FROZEN)
        if (p.events.length == 0){
          p.events.push(new TempleEvent);
      }
    });
  });
}

Universe.prototype = {  
  build_connections: function () {
    var disconnected_systems = this.systems.slice();
    disconnected_systems.splice(0, 1);
    var connected_systems = [this.systems[0]];
    
    while (disconnected_systems.length > 0) {
      var source = connected_systems.random();
      var destination = disconnected_systems[disconnected_systems.length-1]
      let connection_type = randomNumber(1,2);
      switch(connection_type) {
          case 1:
            if (source.planets.length > 0) {
              let p = source.planets.random();
               if (p.class == BODY_PLANET_BARREN || p.class == BODY_PLANET_TERRAN || p.class ==    BODY_PLANET_FROZEN) {
                 if (p.events.length == 0) {
                  p.events.push(new TempleFindCoordinatesEvent(destination))
                  connected_systems.push(destination);
                  disconnected_systems.pop();
                 }
               }
            }
            break;
          case 2:
            let anomaly = new Ship(source.randomUnoccupiedSpace(), [0,0], 1, 0, 0);
            anomaly.char = "A";
            anomaly.name = "unknown anomaly";
            anomaly.event = new AnomalyWarpEvent(destination);
            source.ships.push(anomaly);
            connected_systems.push(destination);
            disconnected_systems.pop();
            console.log(source,destination)
      }    
    }
  
  },
}