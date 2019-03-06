var clock, scene, camera, renderer, controls, stats, particles;
var cameraTranslate = {x:0, y:0, z:0};
var cameraRotate = {x:0, y:0, z:0};

var entities = [];
var frames = [];


const cameraStates = {
	third: {x:150, y:100, z:80},
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
	var boxGeometry = new THREE.BoxGeometry(100, 100, 100);
	var boxWireframe = new THREE.WireframeGeometry(boxGeometry);
	var boxLines = new THREE.LineSegments(boxWireframe);
	scene.add(boxLines);
	frames.push(boxLines);

	// debugging purposes - set up ball (represents user)
	var playerGeometry = new THREE.BoxGeometry(8, 8, 8);
	var playerWireFrame = new THREE.WireframeGeometry(playerGeometry);
	var playerLines = new THREE.LineSegments(playerWireFrame);
	scene.add(playerLines);
	frames.push(playerLines);

	//set up lights
	var ambientLight = new THREE.AmbientLight( 0x888888 );
	scene.add( ambientLight );
	var light = new THREE.PointLight( 0xe3e3e3, 1, 100 );
	light.position.set( 50, 50, 50 );
	scene.add( light );
	var light = new THREE.PointLight( 0xe3e3e3, 1, 100 );
	light.position.set( -50, 50, -50 );
	scene.add( light );

	//render
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor (0x333333, 1);


	// create fabrics
	// let myEntity = new PolyCurtain({x:0, y:0, z:0}, 30, 10);
	// myEntity.init();
	// entities.push(myEntity);
	var geometry = new THREE.Geometry();
	var material = new THREE.MeshNormalMaterial();
	material.side = THREE.DoubleSide;
	var mesh = new THREE.Mesh(geometry, material);
	scene.add(mesh);

	let width = 10;
	let height = 20;
	let indices = [];
	let index = 0;

	let t_spacing = 10;
	let t_width = t_spacing * width;
	let t_left = -0.5*t_width;
	let t_height = t_spacing * height;
	let t_bottom = -0.5*t_height;

	//construct vertices
	for(i=0; i<width; i++) {
		let row = [];
		for(j=0; j<height; j++) {
			geometry.vertices.push(new THREE.Vector3(i*t_spacing+t_left,0,j*t_spacing+t_bottom));
			row.push(index);
			index++;
		}
		indices.push(row);
	}
	//construct faces
	for(i=0; i<width-1; i++) {
		for(j=0; j<height-1; j++) {
			geometry.faces.push(new THREE.Face3(indices[i+1][j+1], indices[i+1][j], indices[i][j]));
			geometry.faces.push(new THREE.Face3(indices[i][j+1], indices[i+1][j+1], indices[i][j]));
		}
	}

	for(i=0; i<geometry.vertices.length; i++) {
		let myv = geometry.vertices[i];
		// myv.x += -5+Math.random()*10;
		// myv.z += -5+Math.random()*10;
		let r = myv.x;
		myv.x = r*Math.cos(myv.z/30);
		myv.y = r*Math.sin(myv.z/30);
		// myv.y = 10*noise.simplex3(myv.x/10, myv.z/10,0);
	}
	geometry.verticesNeedUpdate = true;
	geometry.computeFaceNormals();
	geometry.normalsNeedUpdate = true;

	// geometry.vertices.push(new THREE.Vector3(50, -50, 0));
	// geometry.vertices.push(new THREE.Vector3(-50, 50, 0));
	// geometry.vertices.push(new THREE.Vector3(-50, -50, -30));
	// geometry.vertices.push(new THREE.Vector3(50, 50, -30));

	// // geometry.faces.push(new THREE.Face3(0, 1, 2, null, new THREE.Color(0.9, 0.7, 0.75)));
	// // geometry.faces.push(new THREE.Face3(0, 3, 1, null, new THREE.Color(0.6, 0.85, 0.7)));

	// var colors = [new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0), new THREE.Color(0, 0, 1)];
	// geometry.faces.push(new THREE.Face3(0, 1, 2, null, colors));
	// geometry.faces.push(new THREE.Face3(0, 3, 1, null, colors));

	// geometry.computeFaceNormals();
	// geometry.computeVertexNormals();
	// geometry.normalsNeedUpdate = true;
	

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

init();
toggleVisible('lines');