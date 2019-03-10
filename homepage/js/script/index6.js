var scene, camera, renderer, controls, loader;
var vrMode, effect;

var orientationcontrols = null, dragcontrols;

var camera_r;
var camera_v = {x:0, y:0, z:0};
var camera_a = {x:0, y:0, z:0};
//horizontal turning is y, vertical turning is x

const TERRAIN_BASELINE = -500;

var isMobile = function () {
	var check = false;
	(function (a) {
		if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0, 4))) {
			check = true;
		}
	})(navigator.userAgent || navigator.vendor || window.opera);
	return check;
};

var is_mobile = isMobile();
// is_mobile = true;

var entities = [];
var frames = [];

// declare a new sprite
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
	scene.fog = new THREE.Fog(0xeff1e6, 500, 2500);
	scene.add(camera);
	camera_r = camera.rotation;
	

	//create box
	var cubeGeometry = new THREE.BoxGeometry(2000, 2000, 2000, 10, 10, 10);
	var cubeMaterial = new THREE.MeshPhongMaterial({vertexColors:THREE.FaceColors});
	cubeMaterial.side = THREE.BackSide;
	var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cubeMesh);
	box = cubeMesh;
	for(var i=0; i<cubeGeometry.faces.length; i++) {
		var myColor = new THREE.Color();
		myColor.setHSL(.58, 0.7+Math.random()*0.3, 0.3+Math.random()*0.7);
		cubeGeometry.faces[i].color = myColor;
	}

	var planeGeometry = new THREE.PlaneGeometry(2000, 2000);
	var planeMaterial = new THREE.MeshPhongMaterial({color:0xe3e3e3});
	var planeMesh = new THREE.Mesh(planeGeometry,planeMaterial);
	scene.add(planeMesh);
	planeMesh.translateZ(-950);
	// color: 0xe3e3e3
	plane = planeMesh;

	// set up lights
	var ambientLight = new THREE.AmbientLight( 0xaaaaaa );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xe3e3e3, 0.2, 0, 2.0 );
	pointLight.position.set( 800, 800, 500 );
	scene.add( pointLight );

	var pointLight = new THREE.PointLight( 0xeff1e6, 0.4, 0, 3.0 );
	pointLight.position.set( 0, 0, 0 );
	scene.add( pointLight );
	// var pointLight = new THREE.PointLight( 0xe3e3e3, 0.5, 0, 3.0 );
	// pointLight.position.set( 500, 500, 500 );
	// scene.add( pointLight );
	// var pointLight = new THREE.PointLight( 0xe3e3e3, 0.5, 0, 3.0 );
	// pointLight.position.set( 500, 500, 500 );
	// scene.add( pointLight );

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
		var messageRightObj = new THREE.Mesh(messageRightGeometry,messageMaterial);

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
	//
	}
	// renderer.setClearColor (0x888888, 1);

	dragcontrols = new THREE.MouseControls(camera);
  	dragcontrols.orientation.y = 5.3; //+ Math.PI;

	//finish
	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	// onResize();
	dialogEngine.addState({
		message:"Hello!\nI'm an AI chatbot.\n\nNod your head if you\nunderstand me!",
		handlers: [handler_nod, handler_empty],
		children: [null, null]
	});
	dialogEngine.addState({
		message:"Try shaking your head now!",
		handlers: [handler_empty, handler_shake],
		children: [null, null]
	});
	dialogEngine.addState({
		message:"Are you enjoying\nBC Tech?",
		handlers: [handler_glad, handler_heart],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Would you like to explore\nthe future with us?",
		handlers: [handler_explore, handler_toobad],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Do you like lines?",
		handlers: [handler_lines, handler_dots],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Is this spicy enough?",
		handlers: [handler_jazzy_0y, handler_jazzy_0n],
		children: [null, {
			message: "What about now?",
			handlers: [handler_jazzy_1y, handler_jazzy_1n],
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
	dialogEngine.addState({
		message: "Would you like to add more?",
		handlers: [handler_add_y, handler_add_n],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Try shaking or nodding\nyour head now!",
		handlers: [handler_jiggle, handler_jiggle],
		children: [null, null]
	});

	let message1 = dialogEngine.sendMessage();
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
			let myVertex = terrainVertices[i];
			myVertex.y = TERRAIN_BASELINE+noise.simplex3(
				myVertex.x*terrain_width, 
				myVertex.z*terrain_width, 
				terrain_location)*(terrain_height);

			if(terrainType == "dots") {
				let myColor = terrainColors[i];
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
		// way too slow - borderline impossible to run.
		// should be possible with a custom shader

		// if(terrainType == "lines") {
		// 	for(var i=0; i<terrainFaces.length; i++) {
		// 		terrainFaces[i].color.offsetHSL(0.001, 0, 0);
		// 	}
		// 	terrain.terrainObj.geometry.elementsNeedUpdate=true;
		// }
		terrain.terrainObj.geometry.verticesNeedUpdate=true;
		
	}
}
let noCount = 0;
let yesCount = 0;
function cameraControls() {
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

	//known issue: angles are more sensitive when looking upward
	if(Math.abs(camera_a.y)>0.01) {
		noCount++;
	} else {
		if(noCount > 0) noCount--;
	}
	if(noCount>10) {
		no();
		noCount = 0;
	}

	if(Math.abs(camera_a.x)>0.01) {
		yesCount++;
	} else {
		if(yesCount > 0) yesCount--;
	}
	if(yesCount>10) {
		yes();
		yesCount = 0;
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
			}else if(num==1) {
				messageObj.children[1].visible = true;
				messageObj.children[2].visible = true;
				messageObj.children[3].visible = false;
			}else if(num==2) {
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
		animators[i].obj.children.map(
			(child) => {child.material.opacity+=animators[i].del});
		if(animators[i].obj.children[0].material.opacity>1) {
			animators.splice(i, 1);
		} else if(animators[i].obj.children[0].material.opacity<0) {
			scene.remove(animators[i].obj);
			for(j=0; j<animators[i].obj.children.length; j++) {
				animators[i].obj.children[j].geometry.dispose();
				animators[i].obj.children[j].material.dispose();
			}
		}
	}
}
function renderScene() {
	requestAnimationFrame(renderScene);

	cameraControls();

	animate();

	renderOpacity();

	// update entities
	for(let i=0; i<entities.length; i++) {
		if(entities[i].alive) {
			entities[i].loop();
		}
	}
	updateTerrain()
	updateEllipsis()

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
function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);

init();
console.log("pushed!");