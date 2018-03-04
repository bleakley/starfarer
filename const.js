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
const BODY_BLACK_HOLE = 13;
const BODY_ANOMALY = 14;

var LARGE_BODIES = {80: BODY_STAR_YELLOW, 20: BODY_BLACK_HOLE};
var SMALL_BODIES = {60: BODY_PLANET_BARREN, 10: BODY_PLANET_TERRAN, 30: BODY_PLANET_FROZEN};

var LARGE_BODY_NAMES = ["ARCTURUS", "ERIDANUS", "CYGNUS", "UNKNOWN STAR"];
var SMALL_BODY_NAMES = ["CERES", "ERIDANUS III", "CYGNUS PRIME", "UNKNOWN PLANET", "ARCTURUS II"];

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
const TERRAIN_BLACK_HOLE = 11;
const TERRAIN_ANOMALY = 12;

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

const DIJKSTRA_AVOID_EDGE = 0;
const DIJKSTRA_AVOID_HAZARDS = 1;
const DIJKSTRA_SEEK_PLAYER = 2;
const DIJKSTRA_AVOID_PLAYER = 3;
const NUMBER_OF_AI_BEHAVIORS = 4;

var TILES = {};
TILES[TERRAIN_NONE_EMPTY] = {
		99: {character : ".", color : "#000", backgroundColor : "#000"},
		1: {character : ".", color : "#006", backgroundColor : "#000"}};
TILES[TERRAIN_NONE_DIM_STAR] = {
		99: {character : ".", color : "#006", backgroundColor : "#000"},
		1: {character : ".", color : "#FFF", backgroundColor : "#000"}};							
TILES[TERRAIN_NONE_BRIGHT_STAR] = {
		99: {character : ".", color : "#FFF", backgroundColor : "#000"},
		1: {character : ".", color : "#006", backgroundColor : "#000"}};	
TILES[TERRAIN_STAR_YELLOW] = {
		51: {character : "~", color : "#D81", backgroundColor : "#DD4"},
		49: {character : "~", color : "#DD4", backgroundColor : "#D81"}};		
TILES[TERRAIN_CORONA_YELLOW] = {
		67: {character : " ", color : "#FFF", backgroundColor : "#000"},
		33: {character : " ", color : "#FFF", backgroundColor : "#DD4"}}		
TILES[TERRAIN_BARREN_1] = {
		100: {character : "~", color : "#000", backgroundColor : "#999"}};
TILES[TERRAIN_BARREN_2] = {
		100: {character : "~", color : "#000", backgroundColor : "#BBB"}};
TILES[TERRAIN_BARREN_3] = {
		100: {character : "~", color : "#000", backgroundColor : "#555"}};
TILES[TERRAIN_GRASS] = {
		100: {character : "l", color : "#6f3", backgroundColor : "#0c0"}};	
TILES[TERRAIN_WATER] = {
		51: {character : "~", color : "#9CF", backgroundColor : "#00F"},
		49: {character : "-", color : "#9CF", backgroundColor : "#00F"}};		
TILES[TERRAIN_ICE] = {
		100: {character : "*", color : "#FFF", backgroundColor : "#9CF"}};		
TILES[TERRAIN_BLACK_HOLE] = {
		100: {character : " ", color : "#000", backgroundColor : "#000"}};	
TILES[TERRAIN_ANOMALY] = {
		95: {character : " ", color : "#99F", backgroundColor : "#33C"},
		5: {character : "?", color : "#99F", backgroundColor : "#33C"}};

var TERRAINS = {}
TERRAINS[BODY_STAR_YELLOW] = {100 : TERRAIN_STAR_YELLOW};
TERRAINS[BODY_PLANET_BARREN] = {32 : TERRAIN_BARREN_1, 33 : TERRAIN_BARREN_2, 34: TERRAIN_BARREN_3};
TERRAINS[BODY_PLANET_TERRAN] = {70: TERRAIN_WATER, 20 : TERRAIN_GRASS, 10 : TERRAIN_BARREN_1};
TERRAINS[BODY_PLANET_FROZEN] = {80: TERRAIN_ICE, 20 : TERRAIN_BARREN_1};
TERRAINS[BODY_ANOMALY] = {100: TERRAIN_ANOMALY};
TERRAINS[BODY_BLACK_HOLE] = {100: TERRAIN_BLACK_HOLE};
