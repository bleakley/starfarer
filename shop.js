function ShopEvent () {
	this.message = "You board the space station, looking to repair and refit your ship.";
	this.time_until = 0;
}

ShopEvent.prototype = {
	action: function (universe, callbackFunction) {
    system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
    let repairIncrement = 2;
    let armorIncrement = 2;
    var options = [];
    if (ps.hull < ps.hullMax)
      options.push({ t: `Repair up to ${repairIncrement} hull points for ${repairCost} BitCredits`, o: () => {
        if(ps.credits < repairCost) {
          getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
        } else {
          ps.credits -= repairCost;
          ps.hull = Math.min(ps.hull + repairIncrement, ps.hullMax);
          drawSideBar();
          this.action(universe, callbackFunction);
        }
      }});
    if (ps.crew < ps.maxCrew)
      options.push({ t: `Hire an additional crewmember for 1 BitCredit`, o: () => {
        if(ps.credits < 1) {
          getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
        } else {
          ps.credits -= 1;
          ps.crew++;
          drawSideBar();
          this.action(universe, callbackFunction);
        }
      }});
    options.push({ t: `Upgrade your auxilliary reactor for ${reactorUpgradeCost} BitCredits`, o: () => {
      if(ps.credits < reactorUpgradeCost) {
        getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
      } else {
        ps.credits -= reactorUpgradeCost;
        reactorUpgradeCost += 5;
        ps.energyRegen++;
        drawSideBar();
        this.action(universe, callbackFunction);
      }
    }});
    options.push({ t: `Upgrade your capacitor bank for ${capacitorUpgradeCost} BitCredits`, o: () => {
      if(ps.credits < capacitorUpgradeCost) {
        getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
      } else {
        ps.credits -= capacitorUpgradeCost;
        capacitorUpgradeCost += 5;
        ps.energyMax += 2;
        drawSideBar();
        this.action(universe, callbackFunction);
      }
    }});
    options.push({ t: `Upgrade your shield battery for ${shieldUpgradeCost} BitCredits`, o: () => {
      if(ps.credits < shieldUpgradeCost) {
        getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
      } else {
        ps.credits -= shieldUpgradeCost;
        shieldUpgradeCost += 5;
        ps.shieldsMax += 2;
        drawSideBar();
        this.action(universe, callbackFunction);
      }
    }});
    if (ps.maneuverCost > 1)
      options.push({ t: `Upgrade your sublight engines for ${propulsionUpgradeCost} BitCredits`, o: () => {
        if(ps.credits < propulsionUpgradeCost) {
          getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
        } else {
          ps.credits -= propulsionUpgradeCost;
          propulsionUpgradeCost += 5;
          ps.maneuverCost--;
          drawSideBar();
          this.action(universe, callbackFunction);
        }
      }});
      if (ps.maneuverCost < ps.energyMax) { // all this stuff increases your mass
        options.push({ t: `Install ${armorIncrement} additional units of armor plating for ${armorUpgradeCost} BitCredits and +1 mass`, o: () => {
          if(ps.credits < armorUpgradeCost) {
            getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
          } else {
            ps.credits -= armorUpgradeCost;
            armorUpgradeCost += 5;
            ps.maneuverCost++;
            ps.hull += armorIncrement;
            ps.hullMax += armorIncrement;
            drawSideBar();
            this.action(universe, callbackFunction);
          }
        }});
        options.push({ t: `Install additional crew berthing for ${crewUpgradeCost} BitCredits and +1 mass`, o: () => {
          if(ps.credits < crewUpgradeCost) {
            getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
          } else {
            ps.credits -= crewUpgradeCost;
            crewUpgradeCost += 5;
            ps.maneuverCost++;
            ps.minCrew += 1;
            ps.maxCrew += 5;
            drawSideBar();
            this.action(universe, callbackFunction);
          }
        }});
        options.push({ t: `Install additional detention cells for ${prisonerUpgradeCost} BitCredits and +1 mass`, o: () => {
          if(ps.credits < prisonerUpgradeCost) {
            getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
          } else {
            ps.credits -= prisonerUpgradeCost;
            prisonerUpgradeCost += 5;
            ps.maneuverCost++;
            ps.minCrew += 1;
            ps.maxPrisoners += 5;
            drawSideBar();
            this.action(universe, callbackFunction);
          }
        }});
      }


    options.push({ t: `Leave the station.`, o: () => {
      playerTurn();
    }});

    var so = new selectOption(this.message, options);
    so.run();

	}
}
