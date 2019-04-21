var dialogEngine = (function() {
	var states = [];
	var index = 0;
	var childState = null;
	var respond_bool = false;
	return {
		addIndex: function(amount) {
			index+=amount;
		},
		getIndex: function(amount) {
			return index;
		},
		setRespond: function(response) {
			respond_bool = response;
		},
		canRespond: function() {
			return respond_bool;
		},
		getStates: function() {
			return states;
		},
		addState: function(newState) {
			states.push(newState);
		},
		sendMessage: function() {
			//TODO check for end state
			//(index == states.length-1)
			respond_bool = true;
			if(childState != null) {
				return childState.message;
			} else {
				return states[index].message;
			}
		},
		receiveMessage: function(choice) {
			//start by saving handlers
			var myHandler;
			if(childState != null) {
				myHandler = childState.handlers[choice];
			} else {
				myHandler = states[index].handlers[choice];
			}
			respond_bool = false;
			//update states
			if(childState == null) { // base case
				if(states[index].children[choice] == null) {
					//continue as normal
					index++;
				} else {
					//enter child case
					childState = states[index].children[choice];
				}
			} else { //childState case
				if(childState.children[choice] == null) {
					// terminate the case
					index++;
					childState = null;
				} else {
					childState = childState.children[choice];
				}
			}
			myHandler();
		},
	};
})();