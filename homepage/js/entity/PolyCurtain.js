function PolyCurtain(origin, length, radius) {
	this.origin = {x: 0, y:0, z:0};
	this.origin.x = origin.x; 
	this.origin.y = origin.y; 
	this.origin.z = origin.z;
	this.entityObj = {};
	this.spacing = 8;
	this.particles = [];
	this.alive = true;
	this.colormap = {};

	for(let i=0; i<length; i++) {
		let row = [];
		for(let j=0; j<radius; j++) {
			let rval = -0.5*this.spacing*(radius-1) + j * this.spacing;
			let zval = -0.5*this.spacing*(length-1) + i * this.spacing;
			let thetaval = zval/30;

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
		var geometry = new THREE.Geometry();
		var material = new THREE.MeshNormalMaterial();
		// material.fog = true;
		// material.lights = true;
		material.side = THREE.DoubleSide;
		
		let width = 10;
		let height = 10;
		let indices = [];
		let index = 0;

		let t_spacing = 30;
		let t_width = t_spacing * width;
		let t_left = -0.5*t_width;
		let t_height = t_spacing * height;
		let t_bottom = -0.5*t_height;

		//construct vertices
		for(i=0; i<width; i++) {
			let row = [];
			for(j=0; j<height; j++) {
				let radius = i*t_spacing+t_left;
				let z = j*t_spacing+t_bottom;
				let theta = z/100;
				geometry.vertices.push(new THREE.Vector3(
					radius*Math.cos(theta),
					radius*Math.sin(theta),
					z));
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

		geometry.verticesNeedUpdate = true;
		geometry.computeFaceNormals();
		geometry.normalsNeedUpdate = true;

		let entityObj = new THREE.Mesh(geometry, material);
		entityObj.position.x = this.origin.x;
		entityObj.position.y = this.origin.y;
		entityObj.position.z = this.origin.z;
		this.entityObj = entityObj;
		scene.add(entityObj);

	}	
	this.loop = function(){
		// let oldvertices = this.entityObj.geometry.vertices;
		// let oldcolors = this.entityObj.geometry.colors;
		// for(let i=0; i<this.particles.length; i++) {
		// 	this.particles[i].theta+=0.01;
		// }

		// for(let i=0; i<oldvertices.length; i++) {
		// 	oldvertices[i].x = this.particles[i].r * Math.cos(this.particles[i].theta);
		// 	oldvertices[i].y = this.particles[i].r * Math.sin(this.particles[i].theta);

		// 	this.entityObj.geometry.colors[i].offsetHSL(0.002, 0, 0);
		// }
		// this.entityObj.geometry.verticesNeedUpdate=true;
		// this.entityObj.geometry.colorsNeedUpdate=true;

		if(this.entityObj.position.z > 500) {
			this.entityObj.position.z = - 400;
		} else if(this.entityObj.position.z < -500) {
			this.entityObj.position.z = 400;
		} if(this.entityObj.position.x > 500) {
			this.entityObj.position.x = -400;
		} else if(this.entityObj.position.x < -500) {
			this.entityObj.position.x = 400;
		} if(this.entityObj.position.y > 500) {
			this.entityObj.position.y = -400;
		} else if(this.entityObj.position.y < -500) {
			this.entityObj.position.y = 400;
		}
	}
	this.kill = function(){
		scene.remove(this.entityObj);
		this.alive = false;
	}
}