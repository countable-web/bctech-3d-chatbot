var clock, scene, camera, renderer, controls, stats, particles;
var mouse = {x:0, y:0};
var arrows = {x:0, y:0};

var particles = [];

function init() {
	stats = initStats();

	clock = new THREE.Clock();
	clock.start();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
	//first, let's render a wireframe 1000-wide cube, where everything is going to happen.

	camera.position.z = 3000;
	camera.position.y = 1000;
	camera.position.x = 0;
	camera.lookAt(0, 0, 0);


	scene = new THREE.Scene();
	// scene.fog = new THREE.FogExp2(0x000000, 0.001);
	scene.add(camera);
	

	var cubeGeometry = new THREE.BoxGeometry(1000, 1000, 1000);
	var cubeMaterial = new THREE.MeshLambertMaterial({color: 0x00ff00});
	var cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
	// scene.add(cube);

	var wireframe = new THREE.WireframeGeometry(cubeGeometry);
	var line = new THREE.LineSegments(wireframe);
	scene.add(line);

	var ambientLight = new THREE.AmbientLight( 0x000000 );
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


	var geometry = new THREE.Geometry();
	sprite = new THREE.TextureLoader().load('./images/disk.png');
	//make particles
	for(var zval=-1000; zval<1000; zval++) {
		var vertex = new THREE.Vector3();
		vertex.x = 2000 * Math.random() - 1000;
		vertex.y = 2000 * Math.random() - 1000;
		vertex.z = zval;

		geometry.vertices.push( vertex );
		geometry.colors.push(new THREE.Color(0xffffff));
	}



	material = new THREE.PointsMaterial({size: 20, sizeAttenuation: true, map: sprite, alphaTest: 0.5, transparent: true, vertexColors: THREE.VertexColors} );

	particles = new THREE.Points(geometry, material);

	// particles.
	scene.add(particles);
	console.log(geometry);

	//render
	renderer = new THREE.WebGLRenderer();

	//finish
	document.getElementById("WebGL-output").appendChild(renderer.domElement);
	onResize();
	renderScene();
}

function renderScene() {
	updateParticles();
	stats.update();
	requestAnimationFrame(renderScene);
	renderer.render(scene, camera);
}

function updateParticles() {
	var time = clock.getElapsedTime();

	// camera.position.x += (  mouse.x - camera.position.x*0.6) * 0.1;
	// camera.position.y += (- mouse.y - camera.position.y*0.6) * 0.1;
	camera.position.y += arrows.y * 20;
	camera.position.x += arrows.x * 20;

	camera.lookAt(scene.position);

	for(var i=0; i<particles.geometry.vertices.length; i++) {
		particles.geometry.vertices[i].z+=30;
		if(particles.geometry.vertices[i].z>1000) {
			particles.geometry.vertices[i].z=-1000;
		}
	}
	particles.geometry.verticesNeedUpdate=true;
	// h = time * 0.1 % 360;
	// material.color.setHSL(h, 0.5, 0.5);
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
		arrows.y = 1;
	} else if(event.keyCode == 39) { // right
		arrows.x = 1;
	} else if(event.keyCode == 40) { // down
		arrows.y = -1;
	} else if(event.keyCode == 37) { // left
		arrows.x = -1;
	}
}
window.addEventListener('keydown',onKeydown,false);
function onKeyup( event ) {
	arrows.x = 0; arrows.y = 0;
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