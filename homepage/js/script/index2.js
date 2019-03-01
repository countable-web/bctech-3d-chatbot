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