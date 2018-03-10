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

var LARGE_BODY_NAMES = ["ARCTURUS", "ERIDANUS", "CYGNUS", "POLARIS", "NGC-1742", "NGC-9014", "NGC-4412", "NGC-8732", "NGC-4143", "ALPHA CENTAURI", "CORVUS", "CARINA"];
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

const AFT_MOUNT_PENALTY = 1;

const DAMAGE_NORMAL = 0;
const DAMAGE_ION = 1;
const DAMAGE_TRACTOR = 2;
const DAMAGE_NEUTRON = 3;
const DAMAGE_SIPHON = 4;
const DAMAGE_OVERLOAD = 5;
const DAMAGE_MINDCONTROL = 6;

const WEAPON_LASER_CANNON = 0;
const WEAPON_ION_CANNON = 1;
const WEAPON_TRACTOR_BEAM = 2;
const WEAPON_NEUTRON_BEAM = 3;
const WEAPON_HEAVY_LASER = 4;
const WEAPON_HEAVY_ION = 5;
const WEAPON_SIEGE_LASER = 6;
const WEAPON_SIPHON = 7;
const WEAPON_MINDCONTROL = 8;
const WEAPON_ZERO_POINT = 9;
const WEAPON_REACTOR_OVERCHARGE = 10;
const WEAPON_SINGULARITY = 11;
const WEAPON_NEURAL_STATIC_PROJECTOR = 12;
const WEAPON_GRAVATIC_SHEAR = 13;
const WEAPON_PURIFICATION = 14;

const SHIP_TYPE_FIGHTER = 0;
const SHIP_TYPE_SLOOP = 1;
const SHIP_TYPE_FRIGATE = 2;
const SHIP_TYPE_TRANSPORT = 3;
const SHIP_TYPE_CARRIER = 4;
const SHIP_TYPE_BATTLESHIP = 5;
const SHIP_TYPE_DREADNOUGHT = 6;
const SHIP_TYPE_STATION = 7;
const SHIP_TYPE_OTHER = 8;
const SHIP_TYPE_ARBITER = 9;
const SHIP_TYPE_WRAITH = 10;

const SHIP_FLAG_PLAYER = 0;
const SHIP_FLAG_MERCHANT = 1;
const SHIP_FLAG_PIRATE = 2;
const SHIP_FLAG_KHAN = 3;
const SHIP_FLAG_UNKNOWN = 4;
const SHIP_FLAG_PRECURSOR = 5;

const TEAM_NAME = {};
TEAM_NAME[SHIP_FLAG_PLAYER] = "Your";
TEAM_NAME[SHIP_FLAG_MERCHANT] = "Merchant";
TEAM_NAME[SHIP_FLAG_PIRATE] = "Pirate";
TEAM_NAME[SHIP_FLAG_KHAN] = "Khanate";
TEAM_NAME[SHIP_FLAG_UNKNOWN] = "Unknown";
TEAM_NAME[SHIP_FLAG_PRECURSOR] = "Precursor";

const SHIP_HULL = {};
SHIP_HULL[SHIP_TYPE_FIGHTER] = 2;
SHIP_HULL[SHIP_TYPE_SLOOP] = 4;
SHIP_HULL[SHIP_TYPE_FRIGATE] = 8;
SHIP_HULL[SHIP_TYPE_TRANSPORT] = 15;
SHIP_HULL[SHIP_TYPE_CARRIER] = 20;
SHIP_HULL[SHIP_TYPE_BATTLESHIP] = 35;
SHIP_HULL[SHIP_TYPE_DREADNOUGHT] = 50;
SHIP_HULL[SHIP_TYPE_STATION] = 30;
SHIP_HULL[SHIP_TYPE_OTHER] = 5;
SHIP_HULL[SHIP_TYPE_ARBITER] = 20;
SHIP_HULL[SHIP_TYPE_WRAITH] = 10;

const SHIP_SHIELD = {};
SHIP_SHIELD[SHIP_TYPE_FIGHTER] = 2;
SHIP_SHIELD[SHIP_TYPE_SLOOP] = 3;
SHIP_SHIELD[SHIP_TYPE_FRIGATE] = 4;
SHIP_SHIELD[SHIP_TYPE_TRANSPORT] = 10;
SHIP_SHIELD[SHIP_TYPE_CARRIER] = 10;
SHIP_SHIELD[SHIP_TYPE_BATTLESHIP] = 15;
SHIP_SHIELD[SHIP_TYPE_DREADNOUGHT] = 20;
SHIP_SHIELD[SHIP_TYPE_STATION] = 5;
SHIP_SHIELD[SHIP_TYPE_OTHER] = 5;
SHIP_SHIELD[SHIP_TYPE_ARBITER] = 20;
SHIP_SHIELD[SHIP_TYPE_WRAITH] = 10;

const SHIP_ENERGY = {};
SHIP_ENERGY[SHIP_TYPE_FIGHTER] = 8;
SHIP_ENERGY[SHIP_TYPE_SLOOP] = 10;
SHIP_ENERGY[SHIP_TYPE_FRIGATE] = 10;
SHIP_ENERGY[SHIP_TYPE_TRANSPORT] = 10;
SHIP_ENERGY[SHIP_TYPE_CARRIER] = 15;
SHIP_ENERGY[SHIP_TYPE_BATTLESHIP] = 15;
SHIP_ENERGY[SHIP_TYPE_DREADNOUGHT] = 30;
SHIP_ENERGY[SHIP_TYPE_STATION] = 15;
SHIP_ENERGY[SHIP_TYPE_OTHER] = 5;
SHIP_ENERGY[SHIP_TYPE_ARBITER] = 40;
SHIP_ENERGY[SHIP_TYPE_WRAITH] = 20;

const SHIP_ENERGY_RECHARGE = {};
SHIP_ENERGY_RECHARGE[SHIP_TYPE_FIGHTER] = 1;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_SLOOP] = 1;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_FRIGATE] = 1;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_TRANSPORT] = 2;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_CARRIER] = 3;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_BATTLESHIP] = 3;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_DREADNOUGHT] = 5;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_STATION] = 5;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_OTHER] = 1;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_ARBITER] = 8;
SHIP_ENERGY_RECHARGE[SHIP_TYPE_WRAITH] = 6;

const SHIP_MIN_CREW = {};
SHIP_MIN_CREW[SHIP_TYPE_FIGHTER] = 1;
SHIP_MIN_CREW[SHIP_TYPE_SLOOP] = 5;
SHIP_MIN_CREW[SHIP_TYPE_FRIGATE] = 5;
SHIP_MIN_CREW[SHIP_TYPE_TRANSPORT] = 20;
SHIP_MIN_CREW[SHIP_TYPE_CARRIER] = 40;
SHIP_MIN_CREW[SHIP_TYPE_BATTLESHIP] = 30;
SHIP_MIN_CREW[SHIP_TYPE_DREADNOUGHT] = 50;
SHIP_MIN_CREW[SHIP_TYPE_STATION] = 25;
SHIP_MIN_CREW[SHIP_TYPE_OTHER] = 5;
SHIP_MIN_CREW[SHIP_TYPE_ARBITER] = 0;
SHIP_MIN_CREW[SHIP_TYPE_WRAITH] = 0;

const SHIP_MAX_CREW = {};
SHIP_MAX_CREW[SHIP_TYPE_FIGHTER] = 1;
SHIP_MAX_CREW[SHIP_TYPE_SLOOP] = 10;
SHIP_MAX_CREW[SHIP_TYPE_FRIGATE] = 20;
SHIP_MAX_CREW[SHIP_TYPE_TRANSPORT] = 80;
SHIP_MAX_CREW[SHIP_TYPE_CARRIER] = 120;
SHIP_MAX_CREW[SHIP_TYPE_BATTLESHIP] = 60;
SHIP_MAX_CREW[SHIP_TYPE_DREADNOUGHT] = 200;
SHIP_MAX_CREW[SHIP_TYPE_STATION] = 150;
SHIP_MAX_CREW[SHIP_TYPE_OTHER] = 10;
SHIP_MAX_CREW[SHIP_TYPE_ARBITER] = 40;
SHIP_MAX_CREW[SHIP_TYPE_WRAITH] = 10;

const SHIP_MANEUVER_COST = {};
SHIP_MANEUVER_COST[SHIP_TYPE_FIGHTER] = 1;
SHIP_MANEUVER_COST[SHIP_TYPE_SLOOP] = 2;
SHIP_MANEUVER_COST[SHIP_TYPE_FRIGATE] = 3;
SHIP_MANEUVER_COST[SHIP_TYPE_TRANSPORT] = 5;
SHIP_MANEUVER_COST[SHIP_TYPE_CARRIER] = 6;
SHIP_MANEUVER_COST[SHIP_TYPE_BATTLESHIP] = 6;
SHIP_MANEUVER_COST[SHIP_TYPE_DREADNOUGHT] = 6;
SHIP_MANEUVER_COST[SHIP_TYPE_STATION] = 100;
SHIP_MANEUVER_COST[SHIP_TYPE_OTHER] = 2;
SHIP_MANEUVER_COST[SHIP_TYPE_ARBITER] = 5;
SHIP_MANEUVER_COST[SHIP_TYPE_WRAITH] = 1;

const SHIP_NAMES = {};
SHIP_NAMES[SHIP_TYPE_FIGHTER] = "Fighter";
SHIP_NAMES[SHIP_TYPE_SLOOP] = "Sloop";
SHIP_NAMES[SHIP_TYPE_FRIGATE] = "Frigate";
SHIP_NAMES[SHIP_TYPE_TRANSPORT] = "Assault Transport";
SHIP_NAMES[SHIP_TYPE_CARRIER] = "Strike Carrier";
SHIP_NAMES[SHIP_TYPE_BATTLESHIP] = "Battleship";
SHIP_NAMES[SHIP_TYPE_DREADNOUGHT] = "Dreadnought";
SHIP_NAMES[SHIP_TYPE_STATION] = "Station";
SHIP_NAMES[SHIP_TYPE_OTHER] = "Vessel";
SHIP_NAMES[SHIP_TYPE_ARBITER] = "Arbiter"; //ancient precursor vessel, random artifact
SHIP_NAMES[SHIP_TYPE_WRAITH] = "Wraith"; //ancient precursor vessel

const SHIP_SYMBOL = {};
SHIP_SYMBOL[SHIP_TYPE_FIGHTER] = "f";
SHIP_SYMBOL[SHIP_TYPE_SLOOP] = "S";
SHIP_SYMBOL[SHIP_TYPE_FRIGATE] = "F";
SHIP_SYMBOL[SHIP_TYPE_TRANSPORT] = "T";
SHIP_SYMBOL[SHIP_TYPE_CARRIER] = "C";
SHIP_SYMBOL[SHIP_TYPE_BATTLESHIP] = "B";
SHIP_SYMBOL[SHIP_TYPE_DREADNOUGHT] = "D";
SHIP_SYMBOL[SHIP_TYPE_STATION] = "S";
SHIP_SYMBOL[SHIP_TYPE_OTHER] = "V";
SHIP_SYMBOL[SHIP_TYPE_ARBITER] = "A";
SHIP_SYMBOL[SHIP_TYPE_WRAITH] = "W";

const SHIP_LOOT = {};
SHIP_LOOT[SHIP_TYPE_FIGHTER] = 0;
SHIP_LOOT[SHIP_TYPE_SLOOP] = 5;
SHIP_LOOT[SHIP_TYPE_FRIGATE] = 10;
SHIP_LOOT[SHIP_TYPE_TRANSPORT] = 100;
SHIP_LOOT[SHIP_TYPE_CARRIER] = 150;
SHIP_LOOT[SHIP_TYPE_BATTLESHIP] = 150;
SHIP_LOOT[SHIP_TYPE_DREADNOUGHT] = 500;
SHIP_LOOT[SHIP_TYPE_STATION] = 200;
SHIP_LOOT[SHIP_TYPE_OTHER] = 10;
SHIP_LOOT[SHIP_TYPE_ARBITER] = 200;
SHIP_LOOT[SHIP_TYPE_WRAITH] = 50;

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
		{prob: 55, opt:  {character : " ", color : "#99F", backgroundColor : "#000"}},
		{prob: 15, opt:  {character : "?", color : "purple", backgroundColor : "#000"}},
		{prob: 15, opt:  {character : "?", color : "green", backgroundColor : "#000"}},
		{prob: 15, opt:  {character : "?", color : "blue", backgroundColor : "#000"}}];
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

var TERRAIN_EFFECTS = {};
TERRAIN_EFFECTS[TERRAIN_STAR_YELLOW] = {
	minSpeedForDamage: 0,
	damage: 10,
	damageType: DAMAGE_NORMAL,
	stopOnDeath: true,
	disintegrateOnDeath: true,
	stopForEvent: false
};
TERRAIN_EFFECTS[TERRAIN_QUASAR] = {
	minSpeedForDamage: 0,
	damage: 10,
	damageType: DAMAGE_NORMAL,
	stopOnDeath: true,
	disintegrateOnDeath: true,
	stopForEvent: false
};
TERRAIN_EFFECTS[TERRAIN_BLACK_HOLE] = {
	minSpeedForDamage: 0,
	damage: 100,
	damageType: DAMAGE_NORMAL,
	stopOnDeath: true,
	disintegrateOnDeath: true,
	stopForEvent: false
};
TERRAIN_EFFECTS[TERRAIN_CORONA_YELLOW] = {
	minSpeedForDamage: 0,
	damage: 3,
	damageType: DAMAGE_ION,
	stopOnDeath: false,
	disintegrateOnDeath: false,
	stopForEvent: false
};
TERRAIN_EFFECTS[TERRAIN_QUASAR_JET] = {
	minSpeedForDamage: 0,
	damage: 10,
	damageType: DAMAGE_ION,
	stopOnDeath: false,
	disintegrateOnDeath: false,
	stopForEvent: false
};
TERRAIN_EFFECTS[TERRAIN_ANOMALY] = {
	minSpeedForDamage: 0,
	damage: 2,
	damageType: DAMAGE_ION,
	stopOnDeath: false,
	disintegrateOnDeath: false,
	stopForEvent: false
};

const terrestialTerrain = {
	minSpeedForDamage: 1,
	damage: 2,
	damageType: DAMAGE_NORMAL,
	stopOnDeath: true,
	disintegrateOnDeath: false,
	stopForEvent: true
};

const harmlessTerrain = {
	minSpeedForDamage: 10,
	damage: 0,
	damageType: DAMAGE_NORMAL,
	stopOnDeath: false,
	disintegrateOnDeath: false,
	stopForEvent: false
};

TERRAIN_EFFECTS[TERRAIN_NONE_EMPTY] = harmlessTerrain;
TERRAIN_EFFECTS[TERRAIN_NONE_DIM_STAR] = harmlessTerrain;
TERRAIN_EFFECTS[TERRAIN_NONE_BRIGHT_STAR] = harmlessTerrain;
TERRAIN_EFFECTS[TERRAIN_BARREN_1] = terrestialTerrain;
TERRAIN_EFFECTS[TERRAIN_BARREN_2] = terrestialTerrain;
TERRAIN_EFFECTS[TERRAIN_BARREN_3] = terrestialTerrain;
TERRAIN_EFFECTS[TERRAIN_WATER] = terrestialTerrain;
TERRAIN_EFFECTS[TERRAIN_ICE] = terrestialTerrain;
TERRAIN_EFFECTS[TERRAIN_GRASS] = terrestialTerrain;

var notEnoughEnergy = new Audio('sounds/Battlecruiser_EnergyLow00.mp3');
var bgm1 = new Audio('sounds/bgm_01.mp3');
bgm1.loop = true;
var bgm2 = new Audio('sounds/bgm_02.mp3');
bgm2.loop = true;

bgms = [bgm1, bgm2];
