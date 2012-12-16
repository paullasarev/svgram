// Rect shape
// $Author$
// $Id$

function Rect(context, parentGroup, x, y, width, height) {
	if (!context)
		return;
	
	x = parseInt(x);
	y = parseInt(y);
	width = parseInt(width ? width : context.width);
	height = parseInt(height ? height : context.height);
	var left = Math.round(x - width / 2);
	var top = Math.round(y - height / 2);
	var right = left + width;
	var bottom = top + height;
	
	var id = Shape.NewID();
  var root = Shape.AddRoot(context, parentGroup, context.root_shapes);
	var group = Shape.AddGroup(context, root, id, this.shape);
	var node = AddTagNS(group, context.svgNS, "rect", {
			"x" : left,
			"y" : top,
			"width" : width,
			"height" : height,
			"fill" : context.fill,
			"stroke" : context.stroke_color,
			"stroke-width" : context.stroke_width,
		});
	
	var spec = AddTagNS(group, context.svgNS, "g", {});
	var specRect = AddTagNS(spec, context.svgNS, "rect", {
			"x" : left,
			"y" : top,
			"width" : width,
			"height" : height,
		});
	Shape.AddSpecAttr(context, specRect);
	
	Shape.AddResizer(context, spec, right, bottom, 0);
	
	Shape.AddKnot(context, spec, left, y, "left");
	Shape.AddKnot(context, spec, right, y, "right");
	Shape.AddKnot(context, spec, x, top, "top");
	Shape.AddKnot(context, spec, x, bottom, "bottom");
	
	this.load(id, group, node, spec);
}

Rect.shape = "rect";
Rect.create = function () {
	return new Rect();
};

Rect.prototype = new Shape;
Rect.prototype.constructor = Rect;
Rect.prototype.shape = Rect.shape;
Rect.prototype.min_width = 60;
Rect.prototype.min_height = 40;

Rect.prototype.load = function (id, group, node, spec) {
	var left = node.getAttribute("x");
	var top = node.getAttribute("y");
	var width = node.getAttribute("width");
	var height = node.getAttribute("height");
  
	Shape.call(this, id, group, node, spec, left, top, width, height);
  
	this.resizers.push(spec.childNodes[1]);
	this.knots.push(spec.childNodes[2]);
	this.knots.push(spec.childNodes[3]);
	this.knots.push(spec.childNodes[4]);
	this.knots.push(spec.childNodes[5]);
  
  this.outline = spec.firstChild;
};

Rect.prototype.SetPosition = function (context, noPropagate) {
	SetAttr(this.node, {
		"x" : this.left, "y" : this.top,
		"width" : this.width, "height" : this.height
	});
  
	SetAttr(this.spec.firstChild, {
		"x" : this.left,"y" : this.top,
		"width" : this.width,"height" : this.height
	});
	
	Shape.MoveRect(this.resizers[0], this.right, this.bottom);
	
  Shape.MoveKnot(context, this.knots[0], this.left, this.y, noPropagate);
  Shape.MoveKnot(context, this.knots[1], this.right, this.y, noPropagate);
	Shape.MoveKnot(context, this.knots[2], this.x, this.top, noPropagate);
	Shape.MoveKnot(context, this.knots[3], this.x, this.bottom, noPropagate);
}
