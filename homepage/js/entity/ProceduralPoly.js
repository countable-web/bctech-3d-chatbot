var geometry = new THREE.Geometry();
var material = new THREE.MeshNormalMaterial();
var mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

geometry.vertices.push(new THREE.Vector3(50, -50, 0));
geometry.vertices.push(new THREE.Vector3(-50, 50, 0));
geometry.vertices.push(new THREE.Vector3(-50, -50, -30));
geometry.vertices.push(new THREE.Vector3(50, 50, -30));

// geometry.faces.push(new THREE.Face3(0, 1, 2, null, new THREE.Color(0.9, 0.7, 0.75)));
// geometry.faces.push(new THREE.Face3(0, 3, 1, null, new THREE.Color(0.6, 0.85, 0.7)));

var colors = [new THREE.Color(1, 0, 0), new THREE.Color(0, 1, 0), new THREE.Color(0, 0, 1)];
geometry.faces.push(new THREE.Face3(0, 1, 2, null, colors));
geometry.faces.push(new THREE.Face3(0, 3, 1, null, colors));

// geometry.computeFaceNormals();
geometry.computeVertexNormals();
geometry.normalsNeedUpdate = true;