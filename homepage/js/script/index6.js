var clock, scene, camera, renderer, controls, stats, particles, loader;

const TERRAIN_BASELINE = -500;

var entities = [];
var frames = [];

// declare a new sprite
var terrain = {
	terrainObj: {},
	colorMap: new ColorMap(
		{h: 0.83, s:1.0, l:0.7},
		{h: 0.5, s:1.0, l:0.7}),
};

var particleSprite = new THREE.TextureLoader().load('./images/disk.png');

function init() {
	stats = initStats();

	clock = new THREE.Clock();
	clock.start();

	loader = new THREE.FontLoader();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
	camera.position.y = 100;
	camera.position.x = 0;
	camera.position.z = 0;

	scene = new THREE.Scene();
	// scene.fog = new THREE.Fog(0x080811, 300, 2100);
	scene.fog = new THREE.Fog(0x080811, 500, 2500);
	scene.add(camera);
	

	//create box
	var cubeGeometry = new THREE.BoxGeometry(2000, 2000, 2000);
	var cubeMaterial = new THREE.MeshPhongMaterial({color: 0xe3e3e3});
	cubeMaterial.side = THREE.BackSide;
	var cubeMesh = new THREE.Mesh(cubeGeometry, cubeMaterial);
	scene.add(cubeMesh);
	box = cubeMesh;

	// set up lights
	var ambientLight = new THREE.AmbientLight( 0x888888 );
	scene.add( ambientLight );

	var pointLight = new THREE.PointLight( 0xe3e3e3, 1.0, 0, 3.0 );
	pointLight.position.set( 0, 0, 0 );
	scene.add( pointLight );
	

	// var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
	// directionalLight.position = new THREE.Vector3(500, 500, 500);
	// scene.add( directionalLight )

	dialogEngine.addState({
		message:"Hello. Are you enjoying\n BC Tech?",
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
		message: "Would you like to change things more?",
		handlers: [handler_change_y, handler_change_n],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Do you like warm colors?",
		handlers: [handler_color_y, handler_color_n],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Do you think this looks good?",
		handlers: [handler_cube, handler_sphere],
		children: [null, null]
	});
	dialogEngine.addState({
		message: "Would you like to add more?",
		handlers: [handler_cube, handler_sphere],
		children: [null, null]
	});

	let message1 = dialogEngine.sendMessage();
	loadMessage(message1);
	

	


	//render
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor (0x080811, 1);
	// renderer.setClearColor (0x888888, 1);

	//finish
	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	onResize();
	renderScene();

	var orbit = new THREE.OrbitControls( camera, renderer.domElement );
	orbit.enableZoom = false;
	camera.lookAt(0, 100, 10);
}
var terrain_velocity = 0; //0.1
var terrain_height = 0; //70
var terrain_location = 0;
var terrain_width = 0.002;
function updateTerrain() {
	if(terrainEnabled) {
		terrain_location += terrain_velocity;
		var terrainVertices = terrain.terrainObj.geometry.vertices;
		var terrainColors = terrain.terrainObj.geometry.colors;
		var terrainFaces = terrain.terrainObj.geometry.faces;
		for(var i=0; i<terrainVertices.length; i++) {
			let myVertex = terrainVertices[i];
			myVertex.y = TERRAIN_BASELINE+noise.simplex3(myVertex.x*terrain_width, myVertex.z*terrain_width, terrain_location)*terrain_height;

			if(terrainType == "dots") {
				let myColor = terrainColors[i];
				myHSL = terrain.colorMap.getColor(myVertex.y/70);
				myColor.setHSL(myHSL.h, myHSL.s, myHSL.l);
				terrain.terrainObj.geometry.colorsNeedUpdate=true;
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
function renderScene() {

	//update entities
	// for(let i=0; i<entities.length; i++) {
	// 	if(entities[i].alive) {
	// 		entities[i].loop();
	// 	}
	// }

	updateTerrain()

	stats.update();
	requestAnimationFrame(renderScene);
	renderer.render(scene, camera);
}


init();