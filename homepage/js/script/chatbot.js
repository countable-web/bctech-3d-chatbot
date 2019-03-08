var dialogEngine = (function() {
	var states = [];
	var index = 0;
	var childState = null;
	return {
		getStates: function() {
			return states;
		},
		addState: function(newState) {
			states.push(newState);
		},
		sendMessage: function() {
			//TODO check for end state
			//(index == states.length-1)
			if(childState != null) {
				return childState.message;
			} else {
				return states[index].message;
			}
		},
		receiveMessage: function(choice) {
			//start by running handler
			if(childState != null) {
				childState.handlers[choice]();
			} else {
				states[index].handlers[choice]();
			}
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
		},
	};
})();

var messageObj;
var newMessageObj;

function loadMessage(newMessage) {
	if(messageObj) {
		scene.remove(messageObj);
		messageObj.geometry.dispose();
		messageObj.material.dispose();
	}

	loader.load( './js/fonts/opensansreg.json', function ( font ) {
		var messageGeometry = new THREE.TextGeometry(newMessage, {
			font: font,
			size: 80,
			height: 5,
			curveSegments: 12,
			bevelEnabled: true,
			bevelThickness: 10,
			bevelSize: 8,
			bevelSegments: 5
		} );
		var messageMaterial = new THREE.MeshPhongMaterial({color:0xff0000});
		var messageMesh = new THREE.Mesh(messageGeometry,messageMaterial);

		messageGeometry.computeBoundingBox();
		var messageBox = messageGeometry.boundingBox;
		console.log(messageBox);
		messageMesh.translateX(-0.5*(messageBox.max.x-messageBox.min.x));
		messageMesh.position.z = -900;
		scene.add(messageMesh);

		messageObj = messageMesh;
	} );
}
function yes() {
	dialogEngine.receiveMessage(0);
}
function no() {
	dialogEngine.receiveMessage(1);
}

var handler_countable = function() {
	setTimeout(function() {
		loadMessage("We are Countable.\nWe build tomorrow's internet, today.");
		setTimeout(function() {
			loadMessage(dialogEngine.sendMessage());
		}, 3000);
	}, 3000);
}
var handler_glad = function() {
	loadMessage("Awesome. We're glad to hear that.");
	handler_countable();
}
var handler_heart = function() {
	loadMessage("That's unfortunate.\nHave a heart on us.");

	var heartShape = new THREE.Shape();
	heartShape.moveTo( 25, 25 );
	heartShape.bezierCurveTo( 25, 25, 20, 0, 0, 0 );
	heartShape.bezierCurveTo( - 30, 0, - 30, 35,- 30, 35 );
	heartShape.bezierCurveTo( - 30, 55, - 10, 77, 25, 95 );
	heartShape.bezierCurveTo( 60, 77, 80, 55, 80, 35 );
	heartShape.bezierCurveTo( 80, 35, 80, 0, 50, 0 );
	heartShape.bezierCurveTo( 35, 0, 25, 25, 25, 25 );

	var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 20, steps: 2, bevelSize: 20, bevelThickness: 10 };

	var geometry = new THREE.ExtrudeGeometry( heartShape, extrudeSettings );

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0xff0000}) );
	mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI)
	mesh.position.y = -300;
	mesh.position.z = -900;
	scene.add(mesh);

	handler_countable();
}
var handler_explore = function() {
	loadMessage("Awesome. Let's begin.");
	handler_dotslines();
}
var handler_toobad = function() {
	loadMessage("Well, that's too bad.\nYou're coming with us, anyway.");
	handler_dotslines();
}
var handler_dotslines = function() {
	setTimeout(function() {
		loadMessage(dialogEngine.sendMessage());
	}, 3000);	
}
var handler_lines = function() {
	loadMessage("Perfect.");
	handler_terrain();
}
var handler_dots = function() {
	loadMessage("Maybe dots are more your style.");
	handler_terrain();
}
var showTerrain = function() {

}
var handler_terrain = function() {
	setTimeout(function() {
		loadMessage("It's time to break down some boundaries.");
		setTimeout(function() {
			showTerrain();
		}, 3000);
	}, 3000);	
}