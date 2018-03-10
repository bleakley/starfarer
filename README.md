# Rogue Starfarer
Rogue Starfarer is interstellar exploration roguelike created for the 2018 7DRL competition.

## How to Build
Just open up `index.html` in your browser.

## How to Play
The green 'X' indicates the position that your ship will move to in the next turn, based on your momentum. You can fire your rockets to plot your course by moving the green 'X' with the arrow keys or numpad. The '0' indicates your course if you make no adjustments. Press space to end the turn.

Beware that the amount you can adjust your ship's course in any one turn is limited by the energy reserves and propulsion of your ship! The `Maneuver: -3/Δ` on the sidebar indicates that adjusting your trajectory will cost you 3 energy. The more weapons and armor you add to you ship, the more it will cost to maneuver, and the more you upgrade your engines, the less it will cost.

The green arrow indicates the the direction your ship is currently facing. Your ship's facing changes automatically based on your trajectory.

Weapons are mounted on particular hull zones and each weapon can only fire out of that hull zone. Each weapon has its own firing arc determined by its range, hull zone, and your ship's facing. Press 'w' to cycle through weapons, press 'tab' to cycle through eligible targets within the weapon's arc, and press 'f' to fire. You can also target and fire on ships using the mouse.

## Ship Systems
### Reactor and Energy Storage
Your ship has a state-of-the-art fusion reactor that continously produces energy which is stored in your ship's capacitor banks. Maneuvering and firing weapons consumes energy. If your current energy is at least 50% of maximum, your shields and warp core will slowly recharge. In normal circumstances your energy reserves will never exceed your maximum. However, if any special item or effect raises your energy reserves above twice your maximum, your reactor will overload and begin to melt down, dealing 1 point of hull damage per turn.

### Crew
Your ship has a minimum and maximum crew. For every crewmember you have above the minimum, there is a chance every turn that you will repair 1 point of hull damage. For every crewmember you have below the minimum, there is a chance that your reactor will produce no energy that turn.

### Warp Core
Your ship has a warp core which allows it to jump between star systems. To do so you must have the hyperspace coordinates for the new system and your warp core must be fully charged (20/20). Your warp core will recharge 1 point per turn while your ship's energy reserves are above 50%. Jump to hyperspace by pressing the 'j' key.

### Shields
Your shields reduce damage from most types of attacks. Your shields will naturally recharge when you are above 50% of your maximum energy.

### Weapon Types
There are four main types of weapons: lasers, ion cannons, tractor beams, and neutron beams. Lasers deal damage to shields first, and to hull second. Ion cannons deal damage to shields first and to energy reserves second. Note that ion cannons can reduce a ship's energy reserves to negative levels. Tractor beams reduce a ship's speed, but only work if the target's shields are already down. Neutron beams deal damage directly to a ship's crew, but like tractor beams they are completely blocked by any amount of shields.

Each weapon can only fire once per turn, and only if sufficient energy is available. Mounting a weapon increases your ship's mass (increasing your maneuver cost) and increases your minimum crew requirement. Beyond this, there are no restrictions to the number of weapons you can affix to a hull zone.

Rumors of persist of ancient precusor relics that are far more powerful than the standard types of weapons listed above.

### Boarding Tubes
Boarding tubes can bridge the vacuum of space and slice through even the thickest armor. If you and an enemy ship are adjacent, and either ship is at 0 speed, a boarding action will be initiated. Your crewmemebers will fight directly, though an entire shipboard battle can rarely be resolved in a single turn.

## Exploration
The universe is filled with strange events and mysterious sites to explore. You can land on any planet by flying over it and coming to a stop. If you collide with a planet while traveling faster than speed 1, you will suffer damage. You can board a destroyed or abandoned ship by flying over it. Note that destroyed ships will continue on their original trajectories, so you may find that a tractor beam is helpful to bring them to a stop.

You will also find perplexing anomalies in space and merchant stations that can repair and refit your ship. You can interact with these by flying over them. 
