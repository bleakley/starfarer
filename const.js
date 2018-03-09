const MAP_WIDTH = 120;
const MAP_HEIGHT = 50;
const N_STAR_SYSTEMS = 8;
const N_CLUES = 8;

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
const BODY_QUASAR = 15;

var LARGE_BODIES = [{prob: 80, opt: BODY_STAR_YELLOW}, {prob: 10, opt: BODY_QUASAR}, {prob: 10, opt: BODY_BLACK_HOLE}];
var SMALL_BODIES = [{prob: 60, opt: BODY_PLANET_BARREN}, {prob: 10, opt: BODY_PLANET_TERRAN}, {prob: 30, opt: BODY_PLANET_FROZEN}];

var LARGE_BODY_NAMES = ["ARCTURUS", "ERIDANUS", "CYGNUS", "POLARIS", "NGC-1742", "NGC-9014", "NGC-4412", "NGC-8732", "UNKNOWN STAR ALPHA", "UNKNOWN STAR BETA", "UNKNOWN STAR GAMMA"];
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
const TERRAIN_QUASAR = 13;
const TERRAIN_QUASAR_JET = 14;

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

const DIRECTION_NAMES = [];
DIRECTION_NAMES[EAST] = 'east';
DIRECTION_NAMES[WEST] = 'west';
DIRECTION_NAMES[NORTH] = 'north';
DIRECTION_NAMES[SOUTH] = 'south';
DIRECTION_NAMES[NE] = 'northeast';
DIRECTION_NAMES[NW] = 'northwest';
DIRECTION_NAMES[SE] = 'southeast';
DIRECTION_NAMES[SW] = 'southwest';
DIRECTION_NAMES[CENTER] = 'center';

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

const OCTANT1 = Math.tan(Math.PI/8);   //0.41
const OCTANT2 = Math.tan(3*Math.PI/8); //2.41
const OCTANT3 = Math.tan(5*Math.PI/8); //-2.41
const OCTANT4 = Math.tan(7*Math.PI/8); //-0.41

const MOUNT_FWD = 0;
const MOUNT_STBD = 1;
const MOUNT_AFT = 2;
const MOUNT_PORT = 3;
const MOUNT_TURRET = 4;

const MOUNT_NAMES = [];
MOUNT_NAMES[MOUNT_FWD] = "FWD";
MOUNT_NAMES[MOUNT_STBD] = "STBD";
MOUNT_NAMES[MOUNT_AFT] = "AFT";
MOUNT_NAMES[MOUNT_PORT] = "PORT";
MOUNT_NAMES[MOUNT_TURRET] = "TRT";

const DAMAGE_NORMAL = 0;
const DAMAGE_ION = 1;
const DAMAGE_TRACTOR = 2;
const DAMAGE_NEUTRON = 3;
const DAMAGE_SIPHON = 4;
const DAMAGE_OVERLOAD = 5;
const DAMAGE_MINDCONTROL = 6;

var TILES = {};
TILES[TERRAIN_NONE_EMPTY] = [
		{prob: 99, opt: {character : ".", color : "#000", backgroundColor : "#000"}},
		{prob: 1, opt: {character : ".", color : "#006", backgroundColor : "#000"}}];
TILES[TERRAIN_NONE_DIM_STAR] = [
		{prob: 99, opt:  {character : ".", color : "#006", backgroundColor : "#000"}},
		{prob: 1, opt:  {character : ".", color : "#FFF", backgroundColor : "#000"}}];
TILES[TERRAIN_NONE_BRIGHT_STAR] = [
		{prob: 99, opt:  {character : ".", color : "#FFF", backgroundColor : "#000"}},
		{prob: 1, opt:  {character : ".", color : "#006", backgroundColor : "#000"}}];
TILES[TERRAIN_STAR_YELLOW] = [
		{prob: 51, opt:  {character : "~", color : "#D81", backgroundColor : "#DD4"}},
		{prob: 49, opt:  {character : "~", color : "#DD4", backgroundColor : "#D81"}}];
TILES[TERRAIN_CORONA_YELLOW] = [
		{prob: 67, opt:  {character : " ", color : "#FFF", backgroundColor : "#000"}},
		{prob: 33, opt:  {character : " ", color : "#FFF", backgroundColor : "#DD4"}}];
TILES[TERRAIN_BARREN_1] = [
		{prob: 100, opt:  {character : "~", color : "#000", backgroundColor : "#999"}}];
TILES[TERRAIN_BARREN_2] = [
		{prob: 100, opt:  {character : "~", color : "#000", backgroundColor : "#BBB"}}];
TILES[TERRAIN_BARREN_3] = [
		{prob: 100, opt:  {character : "~", color : "#000", backgroundColor : "#555"}}];
TILES[TERRAIN_GRASS] = [
		{prob: 100, opt:  {character : "\"", color : "#460", backgroundColor : "#0c0"}}];
TILES[TERRAIN_WATER] = [
		{prob: 65, opt:  {character : "~", color : "#9CF", backgroundColor : "#00F"}},
		{prob: 35, opt:  {character : " ", color : "#9CF", backgroundColor : "#00F"}}];
TILES[TERRAIN_ICE] = [
		{prob: 100, opt:  {character : "*", color : "#FFF", backgroundColor : "#9CF"}}];
TILES[TERRAIN_BLACK_HOLE] = [
		{prob: 100, opt:  {character : " ", color : "#000", backgroundColor : "#000"}}];
TILES[TERRAIN_ANOMALY] = [
		{prob: 95, opt:  {character : " ", color : "#99F", backgroundColor : "#33C"}},
		{prob: 5, opt:  {character : "?", color : "#99F", backgroundColor : "#33C"}}];
TILES[TERRAIN_QUASAR] = [
		{prob: 51, opt:  {character : "~", color : "#73A", backgroundColor : "#CEF"}},
		{prob: 49, opt:  {character : "~", color : "#CEF", backgroundColor : "#73A"}}];
TILES[TERRAIN_QUASAR_JET] = [
		{prob: 40, opt:  {character : ":", color : "#314", backgroundColor : "#637"}},
		{prob: 60, opt:  {character : ".", color : "#000", backgroundColor : "#000"}}];
TILES[TERRAIN_CORONA_YELLOW] = [
		{prob: 60, opt:  {character : ":", color : "#CA1", backgroundColor : "#742"}},
		{prob: 40, opt:  {character : ".", color : "#000", backgroundColor : "#000"}}];

var TERRAINS = {};
TERRAINS[BODY_STAR_YELLOW] = [{prob: 100, opt: TERRAIN_STAR_YELLOW}];
TERRAINS[BODY_PLANET_BARREN] = [{prob: 33, opt: TERRAIN_BARREN_1}, {prob: 33, opt: TERRAIN_BARREN_2}, {prob: 34, opt: TERRAIN_BARREN_3}];
TERRAINS[BODY_PLANET_TERRAN] = [{prob: 70, opt: TERRAIN_WATER}, {prob: 20, opt: TERRAIN_GRASS}, {prob: 10, opt: TERRAIN_BARREN_1}];
TERRAINS[BODY_PLANET_FROZEN] = [{prob: 80, opt: TERRAIN_ICE}, {prob: 20, opt: TERRAIN_BARREN_1}];
TERRAINS[BODY_ANOMALY] = [{prob: 100, opt: TERRAIN_ANOMALY}];
TERRAINS[BODY_BLACK_HOLE] = [{prob: 100, opt: TERRAIN_BLACK_HOLE}];
TERRAINS[BODY_QUASAR] = [{prob: 100, opt: TERRAIN_QUASAR}];

var CORONAS = {};
CORONAS[BODY_QUASAR] = [{prob: 100, opt: TERRAIN_QUASAR_JET}];
CORONAS[BODY_STAR_YELLOW] = [{prob: 100, opt: TERRAIN_CORONA_YELLOW}];

var JETS = {};
JETS[BODY_QUASAR] = [{prob: 100, opt: TERRAIN_QUASAR_JET}];

var notEnoughEnergy = new Audio('sounds/Battlecruiser_EnergyLow00.mp3');
var bgm1 = new Audio('sounds/bgm_01.mp3');
bgm1.loop = true;
var bgm2 = new Audio('sounds/bgm_02.mp3');
bgm2.loop = true;

bgms = [bgm1, bgm2];
