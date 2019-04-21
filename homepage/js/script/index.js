var scene, camera, renderer, controls, loader;
var vrMode, effect;

var orientationcontrols = null, dragcontrols;

var camera_r;
var camera_v = {x:0, y:0, z:0};
var camera_a = {x:0, y:0, z:0};
//horizontal turning is y, vertical turning is x

const TERRAIN_BASELINE = -500;

var is_mobile = isMobile();

var entities = [];
var frames = [];

var terrain = {
	terrainObj: {},
	colorMap: new ColorMap(
		{h: 0.83, s:1.0, l:0.7},
		{h: 0.5, s:1.0, l:0.7}),
	jiggling:false,
	delParams: {terrain_velocity:0}
};

var particleSprite = new THREE.TextureLoader().load('./images/disk.png');
var messages = [];

function init() {
	loader = new THREE.FontLoader();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
	camera.position.y = 100;
	camera.position.x = 0;
	camera.position.z = 0;
	camera.lookAt(0, 100, -100)

	scene = new THREE.Scene();
	scene.fog = new THREE.Fog(0xeff1e6, 1200, 1900);
	scene.add(camera);
	camera_r = camera.rotation;
	

	//create box
	var planeGeometry = new THREE.PlaneGeometry(2000, 2000, 10, 10);
	var planeMaterial = new THREE.MeshPhongMaterial({vertexColors:THREE.FaceColors});
	var backPlane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(backPlane);
	planes.push(backPlane);
	backPlane.translateZ(1000);
	backPlane.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI);

	var leftPlane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(leftPlane);
	planes.push(leftPlane);
	leftPlane.translateX(-1000);
	leftPlane.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);

	var rightPlane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(rightPlane);
	planes.push(rightPlane);
	rightPlane.translateX(1000);
	rightPlane.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI/2);

	var bottomPlane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(bottomPlane);
	planes.push(bottomPlane);
	bottomPlane.translateY(-1000);
	bottomPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), -Math.PI/2);

	var topPlane = new THREE.Mesh(planeGeometry, planeMaterial);
	scene.add(topPlane);
	planes.push(topPlane);
	topPlane.translateY(1000);
	topPlane.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/2);

	for(var i=0; i<planes.length; i++) {
		for(var j=0; j<planes[i].geometry.faces.length; j++) {
			var myColor = new THREE.Color();
			myColor.setHSL(.522222222, 0.59+(-0.2+Math.random()*0.4), 0.59+(-0.2+Math.random()*0.4));
			planes[i].geometry.faces[j].color = myColor;
		}
	}

	var frontGeometry = new THREE.PlaneGeometry(2000, 2000);
	var frontMaterial = new THREE.MeshPhongMaterial({color:0xe3e3e3});
	var frontPlane = new THREE.Mesh(frontGeometry,frontMaterial);
	scene.add(frontPlane);
	frontPlane.translateZ(-1000);
	// color: 0xe3e3e3
	planes.push(frontPlane);

	// set up lights
	var ambientLight = new THREE.AmbientLight( 0xaaaaaa );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xe3e3e3, 0.2, 0, 2.0 );
	pointLight.position.set( 800, 800, 500 );
	scene.add( pointLight );

	var pointLight = new THREE.PointLight( 0xeff1e6, 0.4, 0, 3.0 );
	pointLight.position.set( 0, 0, 0 );
	scene.add( pointLight );

	// set up instruction text
	loader.load( './js/fonts/questrialfont.json', function ( font ) {
		var messageMaterial = new THREE.MeshPhongMaterial({color:0x061e29});
		messageMaterial.fog = false;
		var messageRightGeometry = new THREE.TextGeometry("(tip: look right!)", {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
		} );
		var messageRightObj = new THREE.Mesh(messageRightGeometry, messageMaterial);

		messageRightGeometry.computeBoundingBox();
		var messageBox = messageRightGeometry.boundingBox;
		messageRightObj.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI/2);
		messageRightObj.position.x = -900;
		messageRightObj.translateX(-0.5*(messageBox.max.x-messageBox.min.x));
		scene.add(messageRightObj);

		var messageLeftGeometry = new THREE.TextGeometry("(tip: look left!)", {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
		} );
		var messageLeftObj = new THREE.Mesh(messageLeftGeometry,messageMaterial);

		messageLeftGeometry.computeBoundingBox();
		var messageBox = messageLeftGeometry.boundingBox;
		messageLeftObj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI/2);
		messageLeftObj.position.x = 900;
		messageLeftObj.translateX(-0.5*(messageBox.max.x-messageBox.min.x));
		scene.add(messageLeftObj);

		var messageBackGeometry = new THREE.TextGeometry("(tip: turn around!)", {
			font: font,
			size: 40,
			height: 5,
			curveSegments: 5,
		} );
		var messageBackObj = new THREE.Mesh(messageBackGeometry,messageMaterial);

		messageBackGeometry.computeBoundingBox();
		var messageBox = messageBackGeometry.boundingBox;
		messageBackObj.rotateOnAxis(new THREE.Vector3(0, 1, 0), -Math.PI);
		messageBackObj.position.z = 900;
		messageBackObj.translateX(-0.5*(messageBox.max.x-messageBox.min.x));
		scene.add(messageBackObj);

		messages.push(messageRightObj);
		messages.push(messageLeftObj);
		messages.push(messageBackObj);
	} );

	//render
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor (0xeff1e6, 1);
	renderer.setPixelRatio(window.devicePixelRatio);
  	renderer.setSize(window.innerWidth, window.innerHeight);
	effect = new THREE.VREffect(renderer, function (m) {

  	});
  	if (is_mobile) {
		orientationcontrols = new THREE.DeviceOrientationControls(camera);
	} else {

	}

	dragcontrols = new THREE.MouseControls(camera);
  	dragcontrols.orientation.y = 5.3; //+ Math.PI;

	//finish
	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	// onResize();
	dialogEngine.addState({
		message:"Hello!\nI'm a VR chatbot.\n\nNod your head if you\nunderstand me! (nod big!)",
		handlers: [handler_nod, handler_empty],
		children: [null, null]
	});
	// dialogEngine.addState({
	// 	message:"Are you enjoying\nBC Tech?",
	// 	handlers: [handler_glad, handler_heart],
	// 	children: [null, null]
	// });
	// dialogEngine.addState({
	// 	message: "Would you like to explore\nthe future with us?",
	// 	handlers: [handler_explore, handler_toobad],
	// 	children: [null, null]
	// });
	dialogEngine.addState({
		message: "Do you like lines?",
		handlers: [handler_lines, handler_dots],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Is this spicy enough?",
		handlers: [handler_spicy_0y, handler_spicy_0n],
		children: [null, {
			message: "What about now?",
			handlers: [handler_spicy_1y, handler_spicy_1n],
			children:[null, null]
		}]
	});
	dialogEngine.addState({
		message: "Are you happy with this ball?",
		handlers: [handler_ball_y, handler_ball_n],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Do you think it's alive enough?",
		handlers: [handler_alive_y, handler_alive_n],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Do you like warm colors?",
		handlers: [handler_color_y, handler_color_n],
		children: [null, null]
	});
	// dialogEngine.addState({
	// 	message: "Would you like to add more?",
	// 	handlers: [handler_add_y, handler_add_n],
	// 	children: [null, null]
	// });
	dialogEngine.addState({
		message: "Try shaking or nodding\nyour head now!",
		handlers: [handler_jiggle, handler_jiggle],
		children: [null, null]
	});

	var message1 = dialogEngine.sendMessage();
	loadMessage(message1);

	renderScene();
}
var terrain_velocity = 0; //0.1
var terrain_height = 0; //70
var terrain_location = 0;
var terrain_width = 0.002;
function updateTerrain() {
	if(terrainEnabled) {
		terrain_location += (terrain_velocity+terrain.delParams.terrain_velocity);
		var terrainVertices = terrain.terrainObj.geometry.vertices;
		var terrainColors = terrain.terrainObj.geometry.colors;
		var terrainFaces = terrain.terrainObj.geometry.faces;
		for(var i=0; i<terrainVertices.length; i++) {
			var myVertex = terrainVertices[i];
			myVertex.y = TERRAIN_BASELINE+noise.simplex3(
				myVertex.x*terrain_width, 
				myVertex.z*terrain_width, 
				terrain_location)*(terrain_height);

			if(terrainType == "dots") {
				var myColor = terrainColors[i];
				myHSL = terrain.colorMap.getColor(myVertex.y/70);
				myColor.setHSL(myHSL.h, myHSL.s, myHSL.l);
				terrain.terrainObj.geometry.colorsNeedUpdate=true;
			}
		}
		if(terrain.jiggling) {
			terrain.delParams.terrain_velocity *= 0.95;
			if(terrain.delParams.terrain_velocity<0.01) {
				jiggling = false;
			}
		}
		terrain.terrainObj.geometry.verticesNeedUpdate=true;
		
	}
}
var noCount = 0;
var yesCount = 0;
var sinceLastAction = 0;
var camera_hlimit = 0.8;
var camera_vlimit = 0.6;
var camera_hthreshold = 0.020;
var camera_vthreshold = 0.015;
var count_limit = 3;
function cameraControls() {
	if(sinceLastAction < 120) return;
	var camera_oldv = {
		x:camera_v.x,
		y:camera_v.y,
		z:camera_v.z
	};
	camera_v = {
		x:camera.rotation.x-camera_r.x,
		y:camera.rotation.y-camera_r.y,
		z:camera.rotation.z-camera_r.z
	};
	camera_a = { 
		x:camera_v.x - camera_oldv.x,
		y:camera_v.y - camera_oldv.y,
		z:camera_v.z - camera_oldv.z
	};
	camera_r = {
		x: camera.rotation.x,
		y: camera.rotation.y,
		z: camera.rotation.z
	}

	if(!(camera_r.y < camera_hlimit && camera_r.y > -camera_hlimit
	  && camera_r.x < camera_vlimit && camera_r.y > -camera_vlimit)) {
		yesCount = 0;
		noCount = 0;
		return;
	}
	if(Math.abs(camera_v.y)>camera_hthreshold) {
		noCount++;
	} else {
		if(noCount > 0) noCount--;
	}
	if(noCount>count_limit) {
		no();
		noCount = 0;
		sinceLastAction = 0;
	}

	if(Math.abs(camera_v.x)>camera_vthreshold) {
		yesCount++;
	} else {
		if(yesCount > 0) yesCount--;
	}
	if(yesCount>count_limit) {
		yes();
		yesCount = 0;
		sinceLastAction = 0;
	}
}
var lifecycle = 0;
function updateEllipsis() {
	if(messageObj && messageObj.children.length>1) {
		if(lifecycle % 60 == 0) {
			var num = ((lifecycle - (lifecycle % 60))/60) % 3;
			if(num == 0) {
				messageObj.children[1].visible = true;
				messageObj.children[2].visible = false;
				messageObj.children[3].visible = false;
			} else if(num==1) {
				messageObj.children[1].visible = true;
				messageObj.children[2].visible = true;
				messageObj.children[3].visible = false;
			} else if(num==2) {
				messageObj.children[1].visible = true;
				messageObj.children[2].visible = true;
				messageObj.children[3].visible = true;
			}
		}
	}
}
function animate() {
	if(giftObj) {
		giftObj.translateY(delGiftObj);
		delGiftObj += delGiftObjV;
	}
}
function renderOpacity() {
	for(var i=0; i<animators.length; i++) {
		animators[i].execute();
		if(animators[i].isComplete()) {
			animators[i].complete();
			animators.splice(i, 1);
		}
	}
}
function renderScene() {
	requestAnimationFrame(renderScene);
	cameraControls();
	animate();
	renderOpacity();

	// update entities
	for(var i=0; i<entities.length; i++) {
		if(entities[i].alive) {
			entities[i].loop();
		}
	}
	updateTerrain()
	updateEllipsis()

	sinceLastAction++;

	if (vrMode) {
		effect.render(scene, camera);
	} else {
		renderer.render(scene, camera);
	}
	if (is_mobile) {
		orientationcontrols.updateAlphaOffsetAngle(dragcontrols.orientation.y);
	} else {
		dragcontrols.update();
	}
	lifecycle++;
}


init();
