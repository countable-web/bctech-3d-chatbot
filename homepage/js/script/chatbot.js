const TIMEOUT_TIME = 100;


var dialogEngine = (function() {
	var states = [];
	var index = 0;
	var childState = null;
	var respond_bool = false;
	return {
		canRespond: function() {
			console.log(index);
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
			let myHandler;
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
	if(dialogEngine.canRespond()) dialogEngine.receiveMessage(0);
}
function no() {
	if(dialogEngine.canRespond()) dialogEngine.receiveMessage(1);
}

var handler_countable = function() {
	setTimeout(function() {
		loadMessage("We are Countable.\nWe build tomorrow's internet, today.");
		setTimeout(function() {
			loadMessage(dialogEngine.sendMessage());
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
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
	}, TIMEOUT_TIME);	
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
		loadMessage("Here at Countable,\nwe break boundaries.");
		setTimeout(function() {
			makeTerrain();
			destroyBox();
			handler_jazzy();
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);	
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
				var face_indices = [t_indices[i][j],t_indices[i+1][j],t_indices[i][j+1],t_indices[i+1][j+1]];

				terrainGeometry.faces.push(new THREE.Face3(
					face_indices[3], 
					face_indices[1], 
					face_indices[0]));
				terrainGeometry.faces.push(new THREE.Face3(
					face_indices[2], 
					face_indices[3], 
					face_indices[0]));
			}
		}
	}
	console.log(terrainGeometry.faces);

	if(terrainType == "lines") {
		let terrainWireframeMaterial = new THREE.MeshBasicMaterial();
		terrainWireframeMaterial.wireframe = true;
		terrainWireframeMaterial.color = new THREE.Color(0xc3c3c3)

		let terrainMaterial = new THREE.MeshPhongMaterial({vertexColors:THREE.VertexColors});
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

var handler_jazzy = function() {
	setTimeout(function() {
		loadMessage('This is kind of lame...');
		setTimeout(function() {
			loadMessage("Let's spice things up.");
			setTimeout(function() {
				loadMessage(dialogEngine.sendMessage());
				terrain_velocity = 0.003;
				terrain_height = 70;
				terrain_width = 0.002;
			}, TIMEOUT_TIME)
		}, TIMEOUT_TIME)
	}, TIMEOUT_TIME);
}
var handler_jazzy_0y  = function(){
	loadMessage("We appreciate your taste in subtlety.");
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var handler_jazzy_0n  = function(){
	terrain_velocity = 0.005;
	terrain_height = 90;
	terrain_width = 0.0025;

	loadMessage(dialogEngine.sendMessage());
};
var handler_jazzy_1y  = function(){
	loadMessage("We appreciate your sense of moderation.");
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var handler_jazzy_1n  = function(){
	terrain_velocity = 0.007;
	terrain_height = 150;
	terrain_width = 0.0030;
	loadMessage("We appreciate your desire to aim big.");
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var myBall;
var handler_future = function() {
	loadMessage("It's finally time to explore the future...");
	setTimeout(function() {
		loadMessage("But we're going to need your help.");
		setTimeout(function() {
			loadMessage("We're going to start with this ball.");
			setTimeout(function() {
				myBall = new Ball({x:0, y:-200, z:-300});
				myBall.init();
				entities.push(myBall);

				loadMessage(dialogEngine.sendMessage());
			}, TIMEOUT_TIME);
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var handler_ball_y = function() {
	loadMessage("You have excellent taste.");
	setTimeout(function() {
		loadMessage("Let's give it some life.")
		setTimeout(function() {
			handler_life();
		}, TIMEOUT_TIME);
	},TIMEOUT_TIME);
}
var handler_ball_n = function() {
	loadMessage("Alright, here's a new one.");
	setTimeout(function() {
		loadMessage("What do you mean, it's the same one?");
			setTimeout(function() {
				loadMessage("It's at least half a micrometer bigger.");
				setTimeout(function() {
					loadMessage("Let's give it some life.");
					setTimeout(function() {
						handler_life();
					}, TIMEOUT_TIME);
				}, TIMEOUT_TIME);
			}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var handler_life = function() {
	myBall.animated = true;
	loadMessage(dialogEngine.sendMessage());
}
var handler_alive_y = function() {
	loadMessage("Always one for subtlety.");
	setTimeout(function() {
		handler_alive_finish();
	}, TIMEOUT_TIME)
}
var handler_alive_n = function() {
	loadMessage("You sure love some spirit!");
	myBall.params.noiseVelocity=0.5;
	myBall.params.noiseSize=0.25;
	setTimeout(function() {
		handler_alive_finish();
	}, TIMEOUT_TIME)
}
var handler_alive_finish = function() {
	loadMessage(dialogEngine.sendMessage());
}
var handler_color_y = function() {
	loadMessage("Well, that's awfully convenient!");
	myBall.params.colorVelocity = 0.01;
	setTimeout(function() {
		handler_fill_sky();
	},TIMEOUT_TIME);
}
var newmap = null;
var handler_color_n = function() {
	loadMessage("Hopefully this suits your style.");
	newmap = new ColorMap({h:.519, s:0.9, l:0.8}, {h:.783, s: 0.9, l:0.8});
	myBall.colorMap = newmap;
	myBall.params.colorVelocity = 0.01;
	setTimeout(function() {
		handler_fill_sky();
	},TIMEOUT_TIME);
}
var addBalls = function(number) {
	for(let i=0; i<number; i++) {
		// oy = 700+Math.random()*1000;
		oy = 300+Math.random()*600;
		ox = -2000+Math.random()*4000;
		oz = -2000+Math.random()*4000;
		var newBall = new Ball({x:ox, y:oy, z:oz});
		if(newmap!= null) {
			newBall.colorMap = newmap;
		}
		newBall.init();
		newBall.params = myBall.params;
		newBall.animated = true;
		entities.push(newBall);
	}
}
var handler_fill_sky = function() {
	// myBall.origin.y = 
	loadMessage("It's time to fill the world\nwith your creation!");
	addBalls(25);
	myBall.origin.x = -1000+Math.random()*2000;
	myBall.origin.z = -1000+Math.random()*2000;
	myBall.origin.y = 300+Math.random()*600;
	setTimeout(function() {
		loadMessage(dialogEngine.sendMessage());
	},TIMEOUT_TIME);
}
var handler_add_y = function() {
	loadMessage("Go big or go home!")
	addBalls(25);
	setTimeout(function() {
		handler_finish();
	},TIMEOUT_TIME);
}
var handler_add_n = function() {
	loadMessage("Always good to show restraint.");
	setTimeout(function() {
		handler_finish();
	},TIMEOUT_TIME);
	
}
var handler_finish = function() {
	loadMessage("Try shaking your head!\nYou can explore as long as you want.\nTalk to one of us to \nlearn more about Countable.")
	yes = jiggle_all;
	no = jiggle_all;
}
var jiggle_all = function() {
	for(let i=0; i<entities.length; i++) {
		entities[i].jiggle();
	}
}