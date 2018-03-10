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
    options.push({opt: new TempleEvent(), prob: 50});
    options.push({opt: new FindTribeEvent(), prob: 50});
    this.events.push(randomOption(options)); 
  }
}