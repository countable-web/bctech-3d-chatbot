let TIMEOUT_TIME = 5000;


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

function loadMessage(newMessage, talking) {
	if(messageObj) {
		// scene.remove(messageObj);
		// for(i=0; i<messageObj.children.length; i++) {
		// 	messageObj.children[i].geometry.dispose();
		// 	messageObj.children[i].material.dispose();
		// }
		fade(messageObj, "out");
	}

	loader.load( './js/fonts/questrialfont.json', function ( font ) {
		var messageGroup = new THREE.Group();

		var messageGeometry = new THREE.TextGeometry(newMessage, {
			font: font,
			size: 50,
			height: 5,
			curveSegments: 5,
		} );
		var messageMaterial = new THREE.MeshPhongMaterial({color:0x061e29});
		messageMaterial.fog = false;
		messageMaterial.transparent = true;
		messageMaterial.opacity = 0;
		var messageMesh = new THREE.Mesh(messageGeometry,messageMaterial);

		messageGeometry.computeBoundingBox();
		var messageBox = messageGeometry.boundingBox;
		messageMesh.translateX(-0.5*(messageBox.max.x-messageBox.min.x));
		messageMesh.position.z = -900;
		messageGroup.add(messageMesh);

		messageObj = messageGroup;

		fade(messageObj, "in");


		if(talking) {
			var messageDotGeometry = new THREE.TextGeometry(".", {
				font: font,
				size: 40,
				height: 5,
				curveSegments: 5,
			} );
			var messageDotObj1 = new THREE.Mesh(messageDotGeometry,messageMaterial);
			var messageDotObj2 = new THREE.Mesh(messageDotGeometry,messageMaterial);
			var messageDotObj3 = new THREE.Mesh(messageDotGeometry,messageMaterial);
			messageDotObj1.position.z = -900;
			messageDotObj2.position.z = -900;
			messageDotObj3.position.z = -900;
			let lineCount = newMessage.split("\n").length;

			messageDotObj1.translateY(-lineCount*60-30);
			messageDotObj2.translateY(-lineCount*60-30);
			messageDotObj3.translateY(-lineCount*60-30);
			messageDotObj1.translateX(-20);
			messageDotObj3.translateX(20);
			messageGroup.add(messageDotObj1);
			messageGroup.add(messageDotObj2);
			messageGroup.add(messageDotObj3);
		}
		scene.add(messageGroup);
	} );
}
var animators = [];
function fade(fadeobj, fadetype) {
	if(fadetype=="in") {
		animators.push({
			obj:fadeobj,
			execute: function() {
				this.obj.children.map(
					(child) => {child.material.opacity+=0.05});
			},
			isComplete: function() {
				if(this.obj.children[0].material.opacity>1) {
					return true;
				} else {
					return false;
				}
			},
			complete:function() {
				//do nothing
			}
		});
	} else if(fadetype=="out") {
		animators.push({
			obj:fadeobj,
			execute: function() {
				this.obj.children.map(
					(child) => {child.material.opacity-=0.05});
			},
			isComplete: function() {
				if(this.obj.children[0].material.opacity<0) {
					return true;
				} else {
					return false;
				}
			},
			complete:function() {
				scene.remove(this.obj);
				for(i=0; i<this.obj.children.length; i++) {
					this.obj.children[i].geometry.dispose();
					this.obj.children[i].material.dispose();
				}
			}
		});
	}
}

function yes() {
	if(dialogEngine.canRespond()) dialogEngine.receiveMessage(0);
}
function no() {
	if(dialogEngine.canRespond()) dialogEngine.receiveMessage(1);
}
var delGiftObj = 0;
var delGiftObjV = 0;
var handler_countable = function() {
	setTimeout(function() {
		loadMessage("Time to put this away.", true)
		delGiftObj = -1;
		delGiftObjV = -2;
		setTimeout(function() {
			loadMessage("At Countable,\nwe build tomorrow's\ninternet, today.", true);
			setTimeout(function() {
				loadMessage(dialogEngine.sendMessage());
			}, TIMEOUT_TIME);
		}, TIMEOUT_TIME);
	},TIMEOUT_TIME);
}
var giftObj;
var handler_glad = function() {
	loadMessage("Awesome.\nWe're glad to hear that.", true);
	var smileyShape = new THREE.Shape();
	smileyShape.moveTo( 80, 40 );
	smileyShape.absarc( 40, 40, 40, 0, Math.PI * 2, false );
	var smileyEye1Path = new THREE.Path();
	smileyEye1Path.moveTo( 35, 20 );
	smileyEye1Path.absellipse( 25, 20, 10, 10, 0, Math.PI * 2, true );
	smileyShape.holes.push( smileyEye1Path );
	var smileyEye2Path = new THREE.Path();
	smileyEye2Path.moveTo( 65, 20 );
	smileyEye2Path.absarc( 55, 20, 10, 0, Math.PI * 2, true );
	smileyShape.holes.push( smileyEye2Path );
	var smileyMouthPath = new THREE.Path();
	smileyMouthPath.moveTo( 20, 40 );
	smileyMouthPath.quadraticCurveTo( 40, 60, 60, 40 );
	smileyMouthPath.bezierCurveTo( 70, 45, 70, 50, 60, 60 );
	smileyMouthPath.quadraticCurveTo( 40, 80, 20, 60 );
	smileyMouthPath.quadraticCurveTo( 5, 50, 20, 40 );
	smileyShape.holes.push( smileyMouthPath );

	var extrudeSettings = { depth: 8, bevelEnabled: true, bevelSegments: 20, steps: 2, bevelSize: 5, bevelThickness: 5 };

	var geometry = new THREE.ExtrudeGeometry( smileyShape, extrudeSettings );

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0x29b5a3}) );
	mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI)
	mesh.position.y = -1050;
	animate_giftobj(mesh);
	mesh.position.z = -900;
	scene.add(mesh);
	giftObj = mesh;

	setTimeout(function() {
		loadMessage("In fact, we designed this\nsmiley just for you.", true);
		setTimeout(function() {
		    handler_countable();
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var animate_giftobj = function(myobj) {
	animators.push({
		obj:myobj,
		execute: function(){
			this.obj.translateY(-10);
		},
		isComplete:function() {
			return this.obj.position.y>-300;
		},
		complete:function() {
			// delGiftObj = 0;
		}

	});
}
var handler_heart = function() {
	loadMessage("That's unfortunate.\nHave a heart on us.", true);

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

	var mesh = new THREE.Mesh( geometry, new THREE.MeshPhongMaterial({color:0x29b5a3}) );
	mesh.rotateOnAxis(new THREE.Vector3(0, 0, 1), Math.PI)
	mesh.position.y = -1050;
	animate_giftobj(mesh);
	mesh.position.z = -900;
	scene.add(mesh);
	giftObj = mesh;

	setTimeout(function() {
		loadMessage("We\nmade it just for you.", true);
		setTimeout(function() {
			handler_countable();
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var handler_explore = function() {
	loadMessage("Awesome. Let's begin.", true);
	handler_dotslines();
}
var handler_toobad = function() {
	loadMessage("Well, that's too bad.\nYou're coming with us, anyway.", true);
	handler_dotslines();
}
var handler_dotslines = function() {
	setTimeout(function() {
		loadMessage(dialogEngine.sendMessage());
	}, TIMEOUT_TIME);	
}
var handler_lines = function() {
	loadMessage("Perfect.", true);
	terrainType = "lines";
	handler_terrain();
}
var handler_dots = function() {
	loadMessage("Maybe dots are more your style.", true);
	terrainType = "dots";
	handler_terrain();
}
var showTerrain = function() {

}
var handler_terrain = function() {
	setTimeout(function() {
		loadMessage("Let's break some barriers.", true);
		setTimeout(function() {
			makeTerrain();
			destroyBox();
			handler_spicy();
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);	
}
var planes = [];
var destroyBox = function() {
	animators.push({
		execute:function() {
			for(var i=0; i<planes.length; i++) {
				planes[i].translateZ(-50);
			}
		},
		isComplete:function() {
			return planes[0].position.z > 10000;
		},
		complete: function() {
			for(var i=0; i<planes.length; i++) {
				scene.remove(planes[i]);
				planes[i].geometry.dispose();
				planes[i].material.dispose();
			}
		}
	})
}


var terrainEnabled = false;
terrainType = "";
var makeTerrain = function() {
	let terrainGeometry = new THREE.Geometry();

	var tx, tz, tspace;
	if(terrainType=="lines") {
		tx = 100; tz = 100; tspace = 40;
	} else if(terrainType=="dots") {
		tx = 100; tz = 100; tspace = 40;
	}
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
				var myColor1 = new THREE.Color(0xb7dee2);
				var myColor2 = new THREE.Color(0xb7dee2);
				myColor1.offsetHSL(-0.05+Math.random()*0.1, -0.1+Math.random()*0.2, -0.4+Math.random()*0.4);
				myColor2.offsetHSL(-0.05+Math.random()*0.1, -0.1+Math.random()*0.2, -0.4+Math.random()*0.4);
				terrainGeometry.faces.push(new THREE.Face3(
					face_indices[3], 
					face_indices[1], 
					face_indices[0], null, myColor1));
				terrainGeometry.faces.push(new THREE.Face3(
					face_indices[2], 
					face_indices[3], 
					face_indices[0], null, myColor2));
			}
		}
	}

	if(terrainType == "lines") {
		let terrainWireframeMaterial = new THREE.MeshBasicMaterial();
		//terrainWireframeMaterial.wireframe = true;
		terrainWireframeMaterial.color = new THREE.Color(0x061e29)

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
function jiggle_terrain() {
	terrain.jiggling = true;
	terrain.delParams.terrain_velocity = 0.1;
}

var handler_spicy = function() {
	setTimeout(function() {
		loadMessage('This is kind of boring...',true);
		setTimeout(function() {
			loadMessage("Let's spice things up.", true);
			setTimeout(function() {
				loadMessage(dialogEngine.sendMessage());
				animators.push({
					lifetime:0,
					execute:function() {
						terrain_velocity+=.00006;
						terrain_height+=1.4;
						this.lifetime++;
					},
					isComplete:function() {
						return this.lifetime==50;
					},
					complete:function() {
						
					}
				});
			}, TIMEOUT_TIME)
		}, TIMEOUT_TIME)
	}, TIMEOUT_TIME);
}
var handler_spicy_0y  = function(){
	loadMessage("We appreciate your\ntaste in subtlety!", true);
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var handler_spicy_0n  = function(){
	animators.push({
		lifetime:0,
		execute:function() {
			terrain_velocity+=.00004;
			terrain_height+=0.4;
			terrain_width+=.00001;
			this.lifetime++;
		},
		isComplete:function() {
			return this.lifetime==50;
		},
		complete:function() {
			
		}
	});

	loadMessage(dialogEngine.sendMessage());
};
var handler_spicy_1y  = function(){
	loadMessage("We appreciate your\nsense of moderation!", true);
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var handler_spicy_1n  = function(){
	terrain_velocity = 0.007;
	terrain_height = 150;
	terrain_width = 0.0030;

	animators.push({
		lifetime:0,
		execute:function() {
			terrain_velocity+=.00004;
			terrain_height+=1.2;
			terrain_width+=.00001;
			this.lifetime++;
		},
		isComplete:function() {
			return this.lifetime==50;
		},
		complete:function() {
			
		}
	});

	// terrain_velocity = 0.005;
	// terrain_height = 90;
	// terrain_width = 0.0025;
	loadMessage("We appreciate your\ndesire to aim big!", true);
	setTimeout(function() {
		handler_future();
	}, TIMEOUT_TIME);
};
var myBall;
var handler_future = function() {
	loadMessage("It's finally time to\nexplore the future...", true);
	setTimeout(function() {
		loadMessage("But we're going to\nneed your help.", true);
		setTimeout(function() {
			loadMessage("We're going to start\nwith this ball.", true);
			setTimeout(function() {
				myBall = new Ball({x:0, y:-200, z:-300});
				myBall.init();
				entities.push(myBall);
				myBall.params.noiseSize = 0;

				loadMessage(dialogEngine.sendMessage());
			}, TIMEOUT_TIME);
		}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var handler_ball_y = function() {
	loadMessage("You have excellent taste.", true);
	setTimeout(function() {
		loadMessage("Well, that's it.", true);
		setTimeout(function() {
			loadMessage("This is the future.", true);
			setTimeout(function() {
				loadMessage("Just kidding...", true);
				setTimeout(function() {
					loadMessage("Let's give it some life.",true);
					setTimeout(function() {
						handler_life();
					}, TIMEOUT_TIME);
				},TIMEOUT_TIME);
			},TIMEOUT_TIME);
		},TIMEOUT_TIME);
		
	},TIMEOUT_TIME);
}
var handler_ball_n = function() {
	loadMessage("Alright, here's a new one.", true);
	setTimeout(function() {
		loadMessage("What do you mean,\nit's the same one?", true);
			setTimeout(function() {
				loadMessage("It's at least half\na micrometer bigger.", true);
				setTimeout(function() {
					loadMessage("Let's give it some life.", true);
					setTimeout(function() {
						handler_life();
					}, TIMEOUT_TIME);
				}, TIMEOUT_TIME);
			}, TIMEOUT_TIME);
	}, TIMEOUT_TIME);
}
var handler_life = function() {
	myBall.animated = true;
	animators.push({
		execute:function() {
			myBall.params.noiseSize+=0.002;
		},
		isComplete:function() {
			return myBall.params.noiseSize>0.15;
		},
		complete:function() {}
	})

	loadMessage(dialogEngine.sendMessage());
}
var handler_alive_y = function() {
	loadMessage("Always one for subtlety.", true);
	setTimeout(function() {
		handler_alive_finish();
	}, TIMEOUT_TIME)
}
var handler_alive_n = function() {
	loadMessage("You sure love some spirit!", true);
	myBall.params.noiseVelocity=0.5;
	animators.push({
		execute:function() {
			myBall.params.noiseSize+=0.002
		},
		isComplete:function() {
			return myBall.params.noiseSize>0.25;
		},
		complete:function() {}
	})
	setTimeout(function() {
		handler_alive_finish();
	}, TIMEOUT_TIME)
}
var handler_alive_finish = function() {
	loadMessage(dialogEngine.sendMessage());
}
var handler_color_y = function() {
	loadMessage("Well, that's awfully convenient!", true);
	myBall.params.colorVelocity = 0.01;
	setTimeout(function() {
		handler_fill_sky();
	},TIMEOUT_TIME);
}
var newmap = null;
var handler_color_n = function() {
	loadMessage("Hopefully this suits your style.", true);
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
		oy = Math.random()*600;
		ox = -1500+Math.random()*3000;
		oz = -1500+Math.random()*3000;
		var newBall = new Ball({x:ox, y:oy, z:oz});
		if(newmap!= null) {
			newBall.colorMap = newmap;
		}
		newBall.init();
		newBall.params = myBall.params;
		newBall.animated = true;
		newBall.moving = true;
		entities.push(newBall);
	}
}
var handler_fill_sky = function() {
	// myBall.origin.y = 
	loadMessage("It's time to fill the world\nwith our creation...", true);
	addBalls(15);
	// myBall.origin.x = -1000+Math.random()*2000;
	// myBall.origin.z = -1000+Math.random()*2000;
	// myBall.origin.y = 300+Math.random()*600;
	myBall.moving = true;
	setTimeout(function() {
		loadMessage("Take a look around you!", true);
		setTimeout(function() {
			loadMessage(dialogEngine.sendMessage());
		}, TIMEOUT_TIME);
	},TIMEOUT_TIME);
}
var handler_add_y = function() {
	loadMessage("Go big or go home!", true)
	addBalls(15);
	setTimeout(function() {
		handler_finish();
	},TIMEOUT_TIME);
}
var handler_add_n = function() {
	loadMessage("Always good to show restraint.", true);
	setTimeout(function() {
		handler_finish();
	},TIMEOUT_TIME);
	
}
var handler_jiggle = function(){
	jiggle_all();
	yes = jiggle_all;
	no = yes;
	loadMessage("You can explore as long as you want!",true);
	camera_hlimit = 10;
	camera_vlimit = 10;
	setTimeout(function() {
		loadMessage("Thank you for coming\nalong for the journey!")
		setTimeout(function() {
			loadMessage("Talk to one of us to learn\nmore about Countable.");
		},TIMEOUT_TIME)
	},TIMEOUT_TIME)
}
var handler_finish = function() {
	loadMessage(dialogEngine.sendMessage());
}
var jiggle_all = function() {
	for(let i=0; i<entities.length; i++) {
		entities[i].jiggle();
	}
	jiggle_terrain();
}
var handler_empty = function() {
	dialogEngine.addIndex(-1);
	dialogEngine.setRespond(true);
}
var handler_nod = function() {
	loadMessage("Cool!", true);
	setTimeout(function() {
		loadMessage("You can respond to\nquestions by nodding\nor shaking your head.", true);
		setTimeout(function() {
			loadMessage("But if you see '...' then\nit means I'm still talking.", true);
			setTimeout(function() {
				loadMessage(dialogEngine.sendMessage());
			}, TIMEOUT_TIME);
		},TIMEOUT_TIME)
	},TIMEOUT_TIME);
}
var handler_shake = function() {
	loadMessage("Great job!", true);
	// setTimeout(function() {
		// loadMessage("Before we get started...", true);
		setTimeout(function() {
			loadMessage("Let's practice that with\nanother question.", true);
			setTimeout(function() {
				loadMessage(dialogEngine.sendMessage());
			},TIMEOUT_TIME);
		},TIMEOUT_TIME);	
	// },TIMEOUT_TIME);
}
