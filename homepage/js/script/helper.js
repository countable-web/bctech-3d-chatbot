var mouse = {x:0, y:0};
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
	this.progess = 0;
	this.nudge = function(amount) {
		this.progress += amount ? amount : 0.01;
		if(progress>1) this.progress-=1;
	}
	this.getColor = function(percent) {
		var myprogress = this.progress;
		if(percent) { myprogress = percent; } 
		if(myprogress<0) { myprogress+=1; } 
		else if (myprogress>1) { myprogress-=1; }
		return {
			h: this.startColor.h + myprogress * this.delColor.h,
			s: this.startColor.s + myprogress * this.delColor.s,
			l: this.startColor.l + myprogress * this.delColor.l,
		};
	}
}