var clock, scene, camera, renderer, controls, stats, particles;

const TERRAIN_BASELINE = -300;

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


const cameraStates = {
	third: {x:1500, y:1000, z:800},
	first: {x:0, y:0, z:1},
}




function init() {
	stats = initStats();

	clock = new THREE.Clock();
	clock.start();

	camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 5000);
	changeCamera('first');

	scene = new THREE.Scene();
	scene.fog = new THREE.FogExp2(0x080811, 0.0015);
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

	var ambientLight = new THREE.AmbientLight( 0x444444 );
	scene.add( ambientLight );

	var directionalLight = new THREE.DirectionalLight( 0xffffff, 0.7 );
	directionalLight.position = new THREE.Vector3(500, 500, 500);
	// directionalLight.target = new THREE.Vector3(0, 0, 0);
	scene.add( directionalLight )

	// create terrain
	// let terrainGeometry = new THREE.Geometry();
	// var terrainMaterial = new THREE.PointsMaterial({
	// 	size: 15,
	// 	sizeAttenuation: true,
	// 	map: particleSprite,
	// 	alphaTest: 0.5,
	// 	transparent: true,
	// 	vertexColors: THREE.VertexColors
	// });
	// const tx = 100; const tz = 100; const tspace = 20;
	// const twidth = tx * tspace; const tdepth = tz * tspace;
	// const tleft = -twidth/2; const ttop = -tdepth/2;
	// for(let i=0; i<tx; i++) {
	// 	for(let j=0; j<tz; j++) {
	// 		var vertex = new THREE.Vector3();
	// 		vertex.x = tleft + tspace * i;
	// 		vertex.z = ttop + tspace * j;
	// 		vertex.y = TERRAIN_BASELINE;
	// 		terrainGeometry.vertices.push( vertex );
	// 		let mycolor = new THREE.Color();
	// 		terrainGeometry.colors.push(mycolor);
	// 	}
	// }
	// let terrainObj = new THREE.Points(terrainGeometry, terrainMaterial);

	let terrainGroup = new THREE.Group();

	let terrainGeometry = new THREE.Geometry();
	let terrainMaterial = new THREE.MeshPhongMaterial();
	terrainMaterial.flatShading = true;

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
			index_row.push(t_index);
			t_index++;
		}
		t_indices.push(index_row);
	}
	console.log(t_indices);
	//create faces
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

	let terrainObj = new THREE.Mesh(terrainGeometry, terrainMaterial);
	terrain.terrainObj = terrainObj;
	terrainGroup.add(terrainObj);

	let terrainWireframeMaterial = new THREE.MeshBasicMaterial();
	terrainWireframeMaterial.wireframe = true;
	terrainWireframeMaterial.color = new THREE.Color(0xc3c3c3)
	terrainMaterial.flatShading = true;
	let terrainWireframe = new THREE.Mesh(terrainGeometry, terrainWireframeMaterial);
	terrainGroup.add(terrainWireframe);

	scene.add(terrainGroup);

	terrainGeometry.computeVertexNormals();
	terrainGeometry.normalsNeedUpdate = true;

	updateTerrain();



	// create fabrics
	// for(let i=0; i<40; i++) {
	// 	let myfabric = new Fabric({
	// 		x:-500+Math.random()*1000, 
	// 		y:-500+Math.random()*1000, 
	// 		z:-500+Math.random()*1000}, 10, 10);
	// 	myfabric.init();
	// 	entities.push(myfabric);
	// }

	let total = 5;
	for(let i=0; i<total; i++) {
		let angleOffset = Math.random()*Math.PI/(3*total);
		let myTheta = (i/total+angleOffset)*Math.PI*2;
		let mycurtain = new PolyCurtain({
			x:Math.cos(myTheta) * 500, 
			y:0, 
			z:Math.sin(myTheta) * 500}, 90, 10);

		mycurtain.init();
		mycurtain.entityObj.rotateOnAxis(new THREE.Vector3(1, 0, 0), Math.PI/2)
		entities.push(mycurtain);
	}


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
}
function updateTerrain() {
	var terrainVertices = terrain.terrainObj.geometry.vertices;
	var terrainColors = terrain.terrainObj.geometry.colors;
	for(var i=0; i<terrainVertices.length; i++) {
		let myVertex = terrainVertices[i];
		myVertex.y = TERRAIN_BASELINE+noise.simplex3(myVertex.x/500, myVertex.z/500, clock.getElapsedTime()/10)*70;

		// let myColor = terrainColors[i];
		// myHSL = terrain.colorMap.getColor(myVertex.y/70);
		// myColor.setHSL(myHSL.h, myHSL.s, myHSL.l);
	}
	terrain.terrainObj.geometry.verticesNeedUpdate=true;
	// terrain.terrainObj.geometry.colorsNeedUpdate=true;
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

function changeCamera(perspective) {
	let cameraState = cameraStates[perspective];
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
changeCamera('first');