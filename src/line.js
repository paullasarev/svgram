// Line shape
// $Author$
// $Id$

function Line(context, parentGroup, x1, y1, x2, y2) {
	if (!context)
		return;
	
	x1 = parseInt(x1);
	y1 = parseInt(y1);
	x2 = parseInt(x2);
	y2 = parseInt(y2);
	
	var id = Shape.NewID();
  var root = Shape.AddRoot(parentGroup, context.root_lines);
	var group = Shape.PrependGroup(context, root, id, this.shape);
	var node = AddTagNS(group, context.svgNS, "line", {
			"x1" : x1,
			"y1" : y1,
			"x2" : x2,
			"y2" : y2,
			"fill" : context.fill,
			"stroke" : context.stroke_color,
			"stroke-width" : context.stroke_width,
		});
	
	var spec = AddTagNS(group, context.svgNS, "g", {});
	var spec1 = AddTagNS(spec, context.svgNS, "line", {
			"x1" : x1,
			"y1" : y1,
			"x2" : x2,
			"y2" : y2,
		});
	Shape.AddSpecAttr(context, spec1);
	
	Shape.AddResizer(context, spec, x1, y1, 0);
	Shape.AddResizer(context, spec, x2, y2, 1);
	
	this.load(id, group, node, spec);
}

Line.shape = "line";
Line.create = function () {
	return new Line();
};

Line.prototype = new Shape;
Line.prototype.constructor = Line;
Line.prototype.shape = Line.shape;

Line.prototype.load = function (id, group, node, spec) {
	var left = parseInt(node.getAttribute("x1"));
	var top = parseInt(node.getAttribute("y1"));
	var right = parseInt(node.getAttribute("x2"));
	var bottom = parseInt(node.getAttribute("y2"));
	var width = right - left;
	var height = bottom - top;
  
	Shape.call(this, id, group, node, spec, left, top, width, height);
  
	this.resizers.push(spec.childNodes[1]);
	this.resizers.push(spec.childNodes[2]);
  this.outline = spec.firstChild;
};

Line.prototype.SetPosition = function (context) {
	SetAttr(this.node, {
		"x1" : this.left,
		"y1" : this.top,
		"x2" : this.right,
		"y2" : this.bottom
	});
  
	SetAttr(this.spec.firstChild, {
		"x1" : this.left,
		"y1" : this.top,
		"x2" : this.right,
		"y2" : this.bottom
	});
	
	Shape.MoveRect(this.resizers[0], this.left, this.top);
	Shape.MoveRect(this.resizers[1], this.right, this.bottom);
}

Line.prototype.Resize = function (context, dx, dy, resizer) {
	if (resizer == this.resizers[0]) {
		this.left += dx;
		this.top += dy;
	} else if (resizer == this.resizers[1]) {
		 this.right += dx;
		 this.bottom += dy;
	} else {
    return;
  }
	
	this.width = this.right - this.left;
	this.height = this.bottom - this.top;
  
  this.x = Math.round(this.left + this.width / 2);
  this.y = Math.round(this.top + this.height / 2);
	
	this.SetPosition(context);
}
