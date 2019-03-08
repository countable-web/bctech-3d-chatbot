function Ball(origin) {
	this.origin = {x: 0, y:0, z:0};
	this.origin.x = origin.x; 
	this.origin.y = origin.y; 
	this.origin.z = origin.z;
	this.entityObj = {};
	this.spacing = 10;
	this.particles = [];
	this.alive = true;
	this.radius = 50;
	// this.params = {
	// 	noiseSpread: 0.015,
	// 	noiseSize: 0.25,
	// 	noiseVelocity: 0.5,
	// 	colorVelocity:0.005,
	// };
	this.params = {
		noiseSpread: 0.015,
		noiseSize: 0.15,
		noiseVelocity: 0.1,
		colorVelocity:0.0,
	};
	this.colorProgress = Math.random()*10;
	this.animated = false;
	this.lifetime = 0;
	this.noiseFn = function(x, y, z) {
		return noise.simplex3(
			this.params.noiseSpread*x,
			this.params.noiseSpread*y,
			this.lifetime*this.params.noiseSpread*this.params.noiseVelocity)
		+noise.simplex3(
			this.params.noiseSpread*x,
			this.lifetime*this.params.noiseSpread*this.params.noiseVelocity,
			this.params.noiseSpread*z);
		// noise.simplex3(
		// 	this.params.noiseSpread*x,
		// 	this.lifetime*this.params.noiseSpread*0.01,
		// 	this.params.noiseSpread*z)+
	}
	this.original_vertices = [];
	this.colorMap = new ColorMap({h:-0.1362, s:0.9, l:0.8},{h:.0916, s:0.9, l:0.8});
	// this.colorMap = new ColorMap({h:.519, s:0.9, l:0.8}, {h:.783, s: 0.9, l:0.8});


	this.init = function() {
		// make particles
		let ballGeometry = new THREE.SphereGeometry(this.radius, 25, 25);
		// let myColor = new THREE.Color();
		// let mapped = this.colorMap.getColor(this.colorProgress);
		// myColor.setHSL(mapped.h, mapped.s, mapped.l);
		let ballMaterial = new THREE.MeshPhongMaterial();

		// noise.simplex3()/
		for(i=0; i<ballGeometry.vertices.length; i++) {
			thisVertex = ballGeometry.vertices[i];
			this.original_vertices.push({x:thisVertex.x, y:thisVertex.y, z:thisVertex.z});
		}
		let entityObj = new THREE.Mesh(ballGeometry, ballMaterial);

		entityObj.position.x = this.origin.x;
		entityObj.position.y = this.origin.y;
		entityObj.position.z = this.origin.z;
		this.entityObj = entityObj;
		this.updateColor();
		scene.add(entityObj);
	}	
	this.updateNoise = function() {
		for(i=0; i<this.entityObj.geometry.vertices.length; i++) {
			thisVertex = this.entityObj.geometry.vertices[i];
			let noiseVal = this.noiseFn(thisVertex.x, thisVertex.y, thisVertex.z);
			//use this noise value as a factor (relative to 1)
			let factor = 1 + noiseVal*this.params.noiseSize;
			//multiply every vertex by the factor
			thisVertex.x = this.original_vertices[i].x * factor;
			thisVertex.y = this.original_vertices[i].y * factor;
			thisVertex.z = this.original_vertices[i].z * factor;
		}
		this.entityObj.geometry.verticesNeedUpdate = true;
	}
	this.updateColor = function() {
		let myColor = new THREE.Color();
		let mapped = this.colorMap.getColor(this.colorProgress);
		myColor.setHSL(mapped.h, mapped.s, mapped.l);
		this.entityObj.material.color = myColor;
	}
	this.loop = function(){
		if(!this.animated) return;
		this.lifetime++;
		// if(this.lifetime % 2 == 0) return;
		this.colorProgress+=this.params.colorVelocity;
		this.updateColor();

		this.entityObj.material.color.offsetHSL(this.params.colorVelocity, 0, 0);
		this.updateNoise();
		

		this.entityObj.position.x = this.origin.x;
		this.entityObj.position.y = this.origin.y;
		this.entityObj.position.z = this.origin.z;
	}
	this.kill = function(){
		scene.remove(this.entityObj);
		this.alive = false;
	}
}