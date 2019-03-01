var clock, scene, camera, renderer, controls, stats, particles;
var mouse = {x:0, y:0};
var cameraTranslate = {x:0, y:0, z:0};
var cameraRotate = {x:0, y:0, z:0};

var entities = [];
var frames = [];


const cameraStates = {
	third: {x:1500, y:1000, z:800},
	first: {x:0, y:0, z:1},
}


function init() {
	stats = initStats();

	clock = new THREE.Clock();
	clock.start();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
	changeCamera('third');



	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x000000, 0.001);
	scene.add(camera);
	

	// debugging purposes - set up bounding cube
	var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
	var cubeWireframe = new THREE.WireframeGeometry(cubeGeometry);
	var cubeLines = new THREE.LineSegments(cubeWireframe);
	scene.add(cubeLines);
	frames.push(cubeLines);

	// debugging purposes - set up ball (represents user)
	var ballGeometry = new THREE.SphereGeometry(10, 4, 4);
	var ballWireFrame = new THREE.WireframeGeometry(ballGeometry);
	var ballLines = new THREE.LineSegments(ballWireFrame);
	scene.add(ballLines);
	frames.push(ballLines);

	//set up lights

	var ambientLight = new THREE.AmbientLight( 0x8888ff );
	scene.add( ambientLight );

	var lights = [];
	lights[ 0 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 1 ] = new THREE.PointLight( 0xffffff, 1, 0 );
	lights[ 2 ] = new THREE.PointLight( 0xffffff, 1, 0 );

	lights[ 0 ].position.set( 0, 200, 0 );
	lights[ 1 ].position.set( 100, 200, 100 );
	lights[ 2 ].position.set( - 100, - 200, - 100 );

	scene.add( lights[ 0 ] );
	scene.add( lights[ 1 ] );
	scene.add( lights[ 2 ] );

	// create fabrics
	for(let i=0; i<40; i++) {
		let myfabric = new Fabric({
			x:-500+Math.random()*1000, 
			y:-500+Math.random()*1000, 
			z:-500+Math.random()*1000}, 10, 10);
		myfabric.init();
		entities.push(myfabric);
	}

	//render
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor (0x333333, 1);

	//finish
	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	onResize();
	renderScene();

	var orbit = new THREE.OrbitControls( camera, renderer.domElement );
	orbit.enableZoom = false;
}

function renderScene() {
	// updateParticles();

	camera.position.y += cameraTranslate.y * 20;
	camera.position.x += cameraTranslate.x * 20;
	camera.position.z += cameraTranslate.z * 20;

	camera.rotation.x += cameraRotate.y * 0.01;
	camera.rotation.y += cameraRotate.x * 0.01;

	for(let i=0; i<entities.length; i++) {
		if(entities[i].alive) {
			entities[i].loop();
		}
	}

	stats.update();
	requestAnimationFrame(renderScene);
	renderer.render(scene, camera);
}

function changeCamera(perspective) {
	let cameraState = cameraStates[perspective];
	console.log(perspective);
	console.log(cameraStates[perspective]);
	camera.position.x = cameraState.x;
	camera.position.y = cameraState.y;
	camera.position.z = cameraState.z;
	camera.lookAt(0, 0, 0);
}
function toggleVisible(object) {
	if(object == 'lines') {
		frames[0].visible = !frames[0].visible;
		frames[1].visible = !frames[1].visible;
	}
}



function onResize() {
	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
	renderer.setSize(window.innerWidth, window.innerHeight);
}
window.addEventListener('resize', onResize, false);
function onMouseMove( event ) {
	mouse.x = event.clientX - window.innerWidth / 2;
	mouse.y = event.clientY - window.innerHeight / 2;
}
window.addEventListener('mousemove', onMouseMove, false);

function onKeydown( event ) {
	if(event.keyCode == 38) { // up
		cameraTranslate.y = 1;
	} else if(event.keyCode == 39) { // right
		cameraTranslate.x = 1;
	} else if(event.keyCode == 40) { // down
		cameraTranslate.y = -1;
	} else if(event.keyCode == 37) { // left
		cameraTranslate.x = -1;
	} else if(event.keyCode == 90) { // z
		cameraTranslate.z = 1;
	} else if(event.keyCode == 88) { // x
		cameraTranslate.z = -1;
	} else if(event.keyCode == 87) { // w
		cameraRotate.y = 1;
	} else if(event.keyCode == 83) { // s
		cameraRotate.y = -1;
	} else if(event.keyCode == 65) { // a
		cameraRotate.x = -1;
	} else if(event.keyCode == 68) { // d
		cameraRotate.x = 1;
	}
}
window.addEventListener('keydown',onKeydown,false);
function onKeyup( event ) {
	cameraTranslate.x = 0; cameraTranslate.y = 0; cameraTranslate.z = 0;
	cameraRotate.x = 0; cameraRotate.y = 0;
}
window.addEventListener('keyup',onKeyup,false);


function initStats() {
	var statcontroller = new Stats();
	statcontroller.setMode(0);

	statcontroller.domElement.style.position="absolute";
	statcontroller.domElement.style.left="0";
	statcontroller.domElement.style.top="0";

	document.getElementById("Stats-output").appendChild(statcontroller.domElement);

	return statcontroller;
}

init();