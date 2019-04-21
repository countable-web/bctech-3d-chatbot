// an object that creates a continuous color mapping of any real number onto a color
function ColorMap(startColor, endColor) {
	this.startColor = {
		h: startColor.h, 
		s: startColor.s, 
		l: startColor.l,
	};
	this.endColor = {
		h: endColor.h, 
		s: endColor.s, 
		l: endColor.l,
	};
	this.delColor = {
		h: endColor.h-startColor.h, 
		s: endColor.s-startColor.s, 
		l: endColor.l-startColor.l,
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