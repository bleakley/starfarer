// Construct an object representing a star system
function System () {

  this.planets = [];
  this.planets.push(
    {
      name: LARGE_BODY_NAMES.random(),
      xCoord: MAP_WIDTH/2,
      yCoord: MAP_HEIGHT/2,
      radius: randomNumber(4,6),
      class: randomOption(LARGE_BODIES),
      mass: randomNumber(1,4)*100,
      events: null
    });

  var n_planets = randomNumber(0, 3);
  for (i = 0; i < n_planets; i++) {

    let r = randomNumber(2,3);
    var collision = true;
    for (var attempts = 0; attempts < 1000; attempts++) {
      x = randomNumber(8,MAP_WIDTH-8);
      y = randomNumber(8,MAP_HEIGHT-8);
      collision = false;
      for (var count = 0; count < this.planets.length; count++) {
        if (Math.abs(this.planets[count].xCoord - x) < this.planets[count].radius + r + 1)
          collision = true;
        if (Math.abs(this.planets[count].yCoord - y) < this.planets[count].radius + r + 1)
          collision = true;
      }
      console.log(collision)
      if (!collision)
        break;
    }

    if (!collision) {
      this.planets.push({
        name: SMALL_BODY_NAMES.random(),
        xCoord: x,
        yCoord: y,
        radius: r,
        class: randomOption(SMALL_BODIES),
        mass: randomNumber(1,4),
        events: [new TempleEvent()]
      });
    }
  }

  this.map = [];
  this.generateMap();

  this.ships = [];

  var n_ships = randomNumber(0, 4);
  for (var count = 0; count < n_ships; count++) {
    let s = new Ship(this.randomUnoccupiedSpace(), [1,-2], 5, 3, 10);
    this.ships.push(s);
  }

  var n_stations = randomNumber(0, 1);
  for (var count = 0; count < n_stations; count++) {
    let s = new Ship(this.randomUnoccupiedSpace(), [0,0], 20, 10, 30);
    s.char = "S";
    s.maxSpeed = 0;
    s.credits = 100;
    s.followPlayer = false;
    s.attackPlayer = false;
    s.name = "Space Station KL-72X"
    s.event = new SpaceStationEvent();
    this.ships.push(s);
  }

  this.pending_events = [];

  this.bgm = bgms.random();

}

System.prototype = {
  generateMap: function()
  {
    for(var i = 0; i < MAP_WIDTH; i++) {
      this.map[i] = [];
      for(var j = 0; j < MAP_HEIGHT; j++) {
        this.map[i][j] = {
          terrain: randomOption([{ prob: 80, opt: TERRAIN_NONE_EMPTY}, {prob: 15, opt: TERRAIN_NONE_DIM_STAR}, {prob: 5, opt: TERRAIN_NONE_BRIGHT_STAR}]),
          body: null,
          forbiddenToAI: false
        }
      }
    }

    this.planets.forEach((p) => {

      if(p.class == BODY_QUASAR) {
        p.radius = 3; //smaller than other stellar bodies
        p.name = 'QUASAR';
      }

      console.log(p);
      if (_.has(JETS, p.class)) {
        drawJet(p.xCoord, p.yCoord, p.radius+1, (x, y) => {
          this.map[x][y].terrain = randomOption(JETS[p.class]);
          this.map[x][y].forbiddenToAI = true;
        });
      }
      if (_.has(CORONAS, p.class)) {
        drawSquareBody(p.xCoord, p.yCoord, p.radius+1, (x, y) => {
          this.map[x][y].terrain = randomOption(CORONAS[p.class]);
          this.map[x][y].forbiddenToAI = true;
        });
      }
      drawPseudoSphericalBody(p.xCoord, p.yCoord, p.radius, (x, y) => {
        this.map[x][y].body = p;
        this.map[x][y].terrain = randomOption(TERRAINS[p.class]);
        this.map[x][y].forbiddenToAI = true;
      });
    });

  },
  removeShip: function(s) {
    let index = this.ships.indexOf(s);
    if (index > -1) {
      this.ships.splice(index, 1);
    }
  },
  randomUnoccupiedSpace: function() {
    var collision = true;
     while (collision) {
      x = randomNumber(2,MAP_WIDTH-2);
      y = randomNumber(2,MAP_HEIGHT-2);
      collision = false;
      this.ships.forEach( (s) => {
        if (s.xCoord == x && s.yCoord == y)
          collision = true;
      });
      if (this.map[x][y].body != null)
        collision = true;
      console.log(collision)
    }
    return([x,y]);
  }
}
