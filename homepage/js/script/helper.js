

function initStats() {
	var statcontroller = new Stats();
	statcontroller.setMode(0);

	statcontroller.domElement.style.position="absolute";
	statcontroller.domElement.style.left="0";
	statcontroller.domElement.style.top="0";

	document.getElementById("Stats-output").appendChild(statcontroller.domElement);

	return statcontroller;
}

function ColorMap(startColor, endColor) {
	this.startColor = {
		h: startColor.h, 
		s: startColor.s, 
		l: startColor.l
	};
	this.endColor = {
		h: endColor.h, 
		s: endColor.s, 
		l: endColor.l
	};
	this.delColor = {
		h: endColor.h-startColor.h, 
		s: endColor.s-startColor.s, 
		l: endColor.l-startColor.l
	};
	this.getColor = function(percent) {
		var progress = ((percent % 2)+2)%2; // get positive mod
		if(progress<=1) { 
			return {
				h: this.startColor.h + progress * this.delColor.h,
				s: this.startColor.s + progress * this.delColor.s,
				l: this.startColor.l + progress * this.delColor.l,
			};
		} else {
			progress -= 1;
			return {
				h: this.endColor.h - progress * this.delColor.h,
				s: this.endColor.s - progress * this.delColor.s,
				l: this.endColor.l - progress * this.delColor.l,
			};

		}
		
	}
}

var createMultiMaterialObject = function ( geometry, materials ) {
	var group = new THREE.Group();
	for ( var i = 0, l = materials.length; i < l; i ++ ) {
		group.add( new THREE.Mesh( geometry, materials[ i ] ) );
	}
	return group;
}