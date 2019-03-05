var particleSprite = new THREE.TextureLoader().load('./images/disk.png');

function Curtain(origin, length, radius) {
	this.origin = {x: 0, y:0, z:0};
	this.origin.x = origin.x; 
	this.origin.y = origin.y; 
	this.origin.z = origin.z;
	this.entityObj = {};
	this.spacing = 5;
	this.particles = [];
	this.alive = true;
	this.colormap = {};

	for(let i=0; i<length; i++) {
		let row = [];
		for(let j=0; j<radius; j++) {
			let rval = -0.5*this.spacing*(radius-1) + j * this.spacing;
			let zval = -0.5*this.spacing*(length-1) + i * this.spacing;
			let thetaval = zval/20;

			// let xval = r * Math.sin(zval/20);
			// let yval = r * Math.cos(zval/20);

			this.particles.push({
				r: rval, 
				theta: thetaval,
				z: zval,
			});
		}
	}

	this.init = function() {
		// make particles
		let entityGeometry = new THREE.Geometry();

		var particleMaterial = new THREE.PointsMaterial({
			size: 10,
			sizeAttenuation: true,
			map: particleSprite,
			alphaTest: 0.5,
			transparent: true,
			vertexColors: THREE.VertexColors
		});
		// particleMaterial.color.setHSL(myhue, 0.3, 0.7);
		let myhue = Math.random();
		let startcolor = {h:myhue, s: 0.7, l: 0.8};
		let endcolor = {h:(myhue+0.25) % 1, s:0.7, l:0.8};
		this.colormap = new ColorMap(startcolor, endcolor);

		let vertices = [];
		let particle_index =0 ;
		for(let i=0; i<this.particles.length; i++) {
				var vertex = new THREE.Vector3();
			let currR = this.particles[i].r;
			let currTheta = this.particles[i].theta;
			vertex.x = currR * Math.cos(currTheta);
			vertex.y = currR * Math.sin(currTheta);
			vertex.z = this.particles[i].z;

			entityGeometry.vertices.push( vertex );

			let mycolor = new THREE.Color();
			let newcolor = this.colormap.getColor(currR/25);
			mycolor.setHSL(newcolor.h, newcolor.s, newcolor.l);
			entityGeometry.colors.push(mycolor);
		}

		let entityObj = new THREE.Points(entityGeometry, particleMaterial);
		entityObj.position.x = this.origin.x;
		entityObj.position.y = this.origin.y;
		entityObj.position.z = this.origin.z;
		this.entityObj = entityObj;
		scene.add(entityObj);

	}	
	this.loop = function(){
		this.entityObj.position.x = this.origin.x;
		this.entityObj.position.y = this.origin.y;
		this.entityObj.position.z = this.origin.z;

		let oldvertices = this.entityObj.geometry.vertices;
		let oldcolors = this.entityObj.geometry.colors;
		for(let i=0; i<this.particles.length; i++) {
			this.particles[i].theta+=0.01;
		}

		for(let i=0; i<oldvertices.length; i++) {
			oldvertices[i].x = this.particles[i].r * Math.cos(this.particles[i].theta);
			oldvertices[i].y = this.particles[i].r * Math.sin(this.particles[i].theta);



		// 	// oldvertices[i].z+=1*Math.sin(clock.getElapsedTime()*4)+
		// 	// 						1*Math.sin(0.5*oldvertices[i].y+clock.getElapsedTime()*4);
			
			this.entityObj.geometry.colors[i].offsetHSL(0.002, 0, 0);
		}
		this.entityObj.geometry.verticesNeedUpdate=true;
		this.entityObj.geometry.colorsNeedUpdate=true;

	}
	this.kill = function(){
		scene.remove(this.entityObj);
		this.alive = false;
	}
}