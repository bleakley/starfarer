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
}

Universe.prototype = {  
}