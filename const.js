const BODY_STAR_YELLOW = 0;
const BODY_STAR_RED = 1;
const BODY_STAR_BLUE = 2;
const BODY_STAR_ORANGE = 3;
const BODY_PLANET_BARREN = 4;
const BODY_PLANET_TERRAN = 5;
const BODY_PLANET_FROZEN = 6;
const BODY_PLANET_VOLCANIC = 7;
const BODY_PLANET_TOXIC = 8;
const BODY_GAS_1 = 9;
const BODY_GAS_2 = 10;
const BODY_GAS_3 = 11;
const BODY_GAS_4 = 12;


const TERRAIN_NONE_EMPTY = 0;
const TERRAIN_NONE_DIM_STAR = 1;
const TERRAIN_NONE_BRIGHT_STAR = 2;
const TERRAIN_STAR_YELLOW = 3;
const TERRAIN_CORONA_YELLOW = 4;
const TERRAIN_BARREN_1 = 5;
const TERRAIN_BARREN_2 = 6;
const TERRAIN_BARREN_3 = 7;
const TERRAIN_GRASS = 8;
const TERRAIN_WATER = 9;
const TERRAIN_ICE = 10;

const EAST = 0;
const WEST = 4;
const NORTH = 2;
const SOUTH = 6;
const NE = 1;
const NW = 3;
const SE = 7;
const SW = 5;
const CENTER = 8;

const DIRECTIONS = [];
DIRECTIONS[EAST] = [1, 0];
DIRECTIONS[WEST] = [-1, 0];
DIRECTIONS[NORTH] = [0, -1];
DIRECTIONS[SOUTH] = [0, 1];
DIRECTIONS[NE] = [1, -1];
DIRECTIONS[NW] = [-1, -1];
DIRECTIONS[SE] = [1, 1];
DIRECTIONS[SW] = [-1, 1];
DIRECTIONS[CENTER] = [0, 0];

const ARROWS = [];
ARROWS[EAST] = '\u25B6';
ARROWS[WEST] = '\u25C0';
ARROWS[NORTH] = '\u25B2';
ARROWS[SOUTH] = '\u25BC';
ARROWS[NE] = '\u25E5';
ARROWS[NW] = '\u25E4';
ARROWS[SE] = '\u25E2';
ARROWS[SW] = '\u25E3';
ARROWS[CENTER] = '\u25A0';

const OCTANT1 = Math.tan(Math.PI/8); //0.41
const OCTANT2 = Math.tan(3*Math.PI/8); //2.41
const OCTANT3 = Math.tan(5*Math.PI/8); //-2.41
const OCTANT4 = Math.tan(7*Math.PI/8); //-0.41