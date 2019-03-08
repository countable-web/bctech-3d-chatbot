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
			curveSegments: 5,
			// bevelEnabled: true,
			// bevelThickness: 10,
			// bevelSize: 8,
			// bevelSegments: 2
		} );
		var messageMaterial = new THREE.MeshPhongMaterial({color:0xff0000});
		messageMaterial.fog = false;
		var messageMesh = new THREE.Mesh(messageGeometry,messageMaterial);

		messageGeometry.computeBoundingBox();
		var messageBox = messageGeometry.boundingBox;
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
	}, 1000);	
}
var handler_lines = function() {
	loadMessage("Perfect.");
	terrainType = "lines";
	handler_terrain();
}
var handler_dots = function() {
	loadMessage("Maybe dots are more your style.");
	terrainType = "dots";
	handler_terrain();
}
var showTerrain = function() {

}
var handler_terrain = function() {
	setTimeout(function() {
		loadMessage("It's time to break down\nsome boundaries.");
		setTimeout(function() {
			makeTerrain();
			destroyBox();
		}, 1000);
	}, 1000);	
}
var box;
var destroyBox = function() {
	scene.remove(box);
	box.geometry.dispose();
	box.material.dispose();
}


var terrainEnabled = false;
terrainType = "";
var makeTerrain = function() {
	let terrainGeometry = new THREE.Geometry();

	const tx = 100; const tz = 100; const tspace = 40;
	const twidth = tx * tspace; const tdepth = tz * tspace;
	const tleft = -twidth/2; const ttop = -tdepth/2;
	let t_indices = [];
	let t_index = 0;
	for(let i=0; i<tx; i++) {
		let index_row = [];
		for(let j=0; j<tz; j++) {
			var vertex = new THREE.Vector3();
			vertex.x = tleft + tspace * i;
			vertex.z = ttop + tspace * j;
			vertex.y = TERRAIN_BASELINE;
			terrainGeometry.vertices.push(vertex);

			if(terrainType=="dots") {
				let mycolor = new THREE.Color();
				terrainGeometry.colors.push(mycolor);
			}

			index_row.push(t_index);
			t_index++;
		}
		t_indices.push(index_row);
	}
	//create faces
	if(terrainType == "lines") {
		for(let i=0; i<tx-1; i++) {
			for(let j=0; j<tz-1; j++) {
				terrainGeometry.faces.push(new THREE.Face3(
					t_indices[i+1][j+1], 
					t_indices[i+1][j], 
					t_indices[i][j], null, new THREE.Color(1, 1, 1)));
				terrainGeometry.faces.push(new THREE.Face3(
					t_indices[i][j+1], 
					t_indices[i+1][j+1], 
					t_indices[i][j]));
			}
		}
	}

	if(terrainType == "lines") {
		let terrainWireframeMaterial = new THREE.MeshBasicMaterial();
		terrainWireframeMaterial.wireframe = true;
		terrainWireframeMaterial.color = new THREE.Color(0xc3c3c3)

		let terrainMaterial = new THREE.MeshPhongMaterial();
		terrainMaterial.flatShading = true;
		terrainMaterials = [terrainMaterial, terrainWireframeMaterial];
		let terrainObj = createMultiMaterialObject(terrainGeometry, terrainMaterials);
		terrain.terrainObj = terrainObj.children[0];
		terrainGeometry.computeVertexNormals();
		terrainGeometry.normalsNeedUpdate = true;
		scene.add(terrainObj);
	} else if(terrainType == "dots") {
		var terrainDotsMaterial = new THREE.PointsMaterial({
			size: 20,
			sizeAttenuation: true,
			map: particleSprite,
			alphaTest: 0.5,
			transparent: true,
			vertexColors: THREE.VertexColors
		});
		let terrainObj = new THREE.Points(terrainGeometry, terrainDotsMaterial);
		terrain.terrainObj = terrainObj;
		scene.add(terrainObj);
	}

	terrainEnabled = true;
	updateTerrain();
}