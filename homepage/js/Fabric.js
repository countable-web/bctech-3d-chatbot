function Fabric(origin, dimx, dimy) {
	this.origin = {x: 0, y:0, z:0};
	this.origin.x = origin.x; 
	this.origin.y = origin.y; 
	this.origin.z = origin.z;
	this.fabricObj = {};
	this.spacing = 10;
	this.particles = [];
	this.alive = true;

	for(let i=0; i<dimx; i++) {
		let row = [];
		for(let j=0; j<dimy; j++) {
			row.push({
				x: -0.5*this.spacing*(dimx-1) + j * this.spacing,
				y: -0.5*this.spacing*(dimy-1) + i * this.spacing,
				z: 0,
			});
		}
		this.particles.push(row);
	}

	this.init = function() {
		// make particles
		let fabricGeometry = new THREE.Geometry();
		// let fabricGeometry = new THREE.BufferGeometry();
		var particleMaterial = new THREE.PointsMaterial({
			size: 10,
			sizeAttenuation: false,
			map: particleSprite,
			alphaTest: 0.5,
			transparent: true,
			vertexColors: THREE.VertexColors
		});
		// particleMaterial.color.setHSL(myhue, 0.3, 0.7);
		let myhue = Math.random();

		let vertices = [];
		for(let i=0; i<this.particles.length; i++) {
			for(let j=0; j<this.particles[i].length; j++) {
				var vertex = new THREE.Vector3();	
				vertex.x = this.particles[i][j].x;
				vertex.y = this.particles[i][j].y;
				vertex.z = this.particles[i][j].z;
				fabricGeometry.vertices.push( vertex );
				let mycolor = new THREE.Color();
				mycolor.setHSL(myhue, 0.3, 0.7);
				fabricGeometry.colors.push(mycolor);
			}
		}

		let fabricObj = new THREE.Points(fabricGeometry, particleMaterial);
		fabricObj.position.x = this.origin.x;
		fabricObj.position.y = this.origin.y;
		fabricObj.position.z = this.origin.z;
		this.fabricObj = fabricObj;
		scene.add(fabricObj);
	}	
	this.loop = function(){
		this.origin.z+=3;

		this.fabricObj.position.x = this.origin.x;
		this.fabricObj.position.y = this.origin.y;
		this.fabricObj.position.z = this.origin.z;

		let oldvertices = this.fabricObj.geometry.vertices;
		// let oldcolors = this.fabricObj.geometry.colors;

		for(let i=0; i<oldvertices.length; i++) {
			oldvertices[i].z+=1*Math.sin(clock.getElapsedTime()*4)+
									1*Math.sin(0.5*oldvertices[i].y+clock.getElapsedTime()*4);
			
			this.fabricObj.geometry.colors[i].offsetHSL(0.01, 0, 0);
		}
		this.fabricObj.geometry.verticesNeedUpdate=true;
		this.fabricObj.geometry.colorsNeedUpdate=true;

		if(this.origin.z>510) { this.origin.z = -500; }
		if(this.origin.z<-510) { this.origin.z = 500; }
	}
	this.kill = function(){
		scene.remove(this.fabricObj);
		this.alive = false;
	}
}