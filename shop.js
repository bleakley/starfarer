function ShopEvent () {
	this.message = "You board the space station, looking to repair and refit your ship.";
	this.time_until = 0;
}

ShopEvent.prototype = {
	action: function (universe, callbackFunction) {
    system = getPlayerSystem(universe);
    ps = getPlayerShip(system.ships);
    var options = [];
    if (ps.hull < ps.hullMax)
      options.push({ t: `Repair up to 2 hull points for ${repairCost} BitCredits`, o: () => {
        if(ps.credits < repairCost) {
          getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
        } else {
          ps.credits -= repairCost;
          ps.hull = Math.min(ps.hull + 2, ps.hullMax);
          drawSideBar();
          this.action(universe, callbackFunction);
        }
      }});
    options.push({ t: `Upgrade your auxilliary reactor for ${reactorUpgradeCost} BitCredits`, o: () => {
      if(ps.credits < repairCost) {
        getAcknowledgement(`You can't afford that!`, () => { this.action(universe, callbackFunction); });
      } else {
        ps.credits -= reactorUpgradeCost;
        reactorUpgradeCost += 5;
        ps.energyRegen++;
        drawSideBar();
        this.action(universe, callbackFunction);
      }
    }});

    options.push({ t: `Leave the station.`, o: () => {
      playerTurn();
    }});

    var so = new selectOption(this.message, options);
    so.run();

	}
}
