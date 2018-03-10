mapDisplay = new ROT.Display({
  width:MAP_WIDTH, height:MAP_HEIGHT,
  layout:"rect", forceSquareRatio: false
});

sideBarDisplay = new ROT.Display({
  width:SIDEBAR_WIDTH, height:MAP_HEIGHT,
  layout:"rect", fg: "#0E4", forceSquareRatio: false
});

bottomBarDisplay = new ROT.Display({
  width:MAP_WIDTH+SIDEBAR_WIDTH, height:COMBAT_LOG_LENGTH,
  layout:"rect", fg: "#0E4", forceSquareRatio: false
});

popUpDisplay = new ROT.Display({
  width:80, height:23,
  layout:"rect", fg: "#0E4"
});

var combatLog = [];

function selectOption(situation, options)
{
  this.situation = situation;
	this.options = options;
}

selectOption.prototype = {
	handleEvent: function(event) {
    options = this.options;
    if(options.length > 26)
      alert("Too many options");
    var selectedIndex = event.keyCode - 65; //keypress 'a' corresponds to index 0 here.
    if(selectedIndex >= options.length)
      return;

		for(var i = 0; i < options.length; i++)
    {
      if(selectedIndex == i) {
        window.removeEventListener('keydown', this);
        clearPopup();
        options[i].o();
      }
    }
	},
  presentOptions: function() {
    s = this.situation;
    s += "\n";
    for(var i = 0; i < this.options.length; i++)
    {
      s += "\n" + String.fromCharCode(97 + i) + ") " + this.options[i].t;
    }
    document.getElementById('stuffOnTop').style.display = 'initial';
    popUpDisplay.clear();
    popUpDisplay.drawText(1, 1, s);
  },
  run: function() {
    this.presentOptions();
    window.addEventListener('keydown', this);
  }
};

getAcknowledgement = function(string, callbackFunction)
{
	document.getElementById('stuffOnTop').style.display = 'initial';
	popUpDisplay.clear();
	popUpDisplay.drawText(1, 1, string + "\n\n(press any key to continue)");

	cf = function(event) {
    event.preventDefault();
		window.removeEventListener('keydown', cf);
		clearPopup();
		callbackFunction();
	};

	window.addEventListener('keydown', cf);
}

getConfirmation = function(string, callbackFunction1, callbackFunction2)
{
	document.getElementById('stuffOnTop').style.display = 'initial';
	popUpDisplay.clear();
	popUpDisplay.drawText(1, 1, string + " Do you accept?\n\n(Y)es or (N)o");

	cf = function(event) {
		if(event.keyCode == 89)//y
		{
			window.removeEventListener('keydown', cf);
			clearPopup();
			callbackFunction1();
		}
		if(event.keyCode == 78)//n
		{
			window.removeEventListener('keydown', cf);
			clearPopup();
			callbackFunction2();
		}
	};

	window.addEventListener('keydown', cf);
}

gameOver = function(string)
{
	document.getElementById('stuffOnTop').style.display = 'initial';
	popUpDisplay.clear();
	popUpDisplay.drawText(1, 1, string);
  cf = function(event) {
    event.preventDefault();
		window.removeEventListener('keydown', cf);
	};
	window.addEventListener('keydown', cf);
}
