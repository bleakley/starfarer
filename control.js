function selectOption(situation, options)
{
	//var so = Object.create(selectOption.methods);
  this.situation = situation;
	this.options = options;
	//return so;
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
    drawPopup(s);
  },
  run: function() {
    this.presentOptions();
    window.addEventListener('keydown', this);
  }
};

getAcknowledgement = function(string, callbackFunction, callbackParameter)
{
	document.getElementById('stuffOnTop').style.display = 'initial';
	popUpDisplay.clear();
	popUpDisplay.drawText(1, 1, string + "\n\n(press any key to continue)");

	cf = function() {
		window.removeEventListener('keydown', cf);
		clearPopup();
		callbackFunction(callbackParameter);
	};

	window.addEventListener('keydown', cf);
}

getConfirmation = function(string, callbackFunction1, callbackFunction2, callbackParameter)
{
	document.getElementById('stuffOnTop').style.display = 'initial';
	popUpDisplay.clear();
	popUpDisplay.drawText(1, 1, string + " Do you accept?\n\n(Y)es or (N)o");

	cf = function(event) {
		if(event.keyCode == 89)//y
		{
			window.removeEventListener('keydown', cf);
			clearPopup();
			callbackFunction1(callbackParameter);
		}
		if(event.keyCode == 78)//n
		{
			window.removeEventListener('keydown', cf);
			clearPopup();
			callbackFunction2(callbackParameter);
		}
	};

	window.addEventListener('keydown', cf);
}
