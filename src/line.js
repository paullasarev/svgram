// Line shape
// $Author$
// $Id$

function Line(context, x1, y1, x2, y2) {
  if (!context) 
    return;

  x1 = parseInt(x1);
  y1 = parseInt(y1);
  x2 = parseInt(x2);
  y2 = parseInt(y2);
  
  // width = parseInt(width ? width : context.width);
  // height = parseInt(height ? height : context.height);
  // var left = Math.round(x - width / 2);
  // var top = Math.round(y - height / 2);  
  // var right = left + width;
  // var bottom = top + height;
  
  var id = Shape.NewID();
  var group = Shape.AddGroup(context, id, this.shape);
  var node = AddTagNS(group, context.svgNS, "line", {
    "x1": x1, "y1": y1, "x2": x2, "y2": y2,
    "fill": context.fill,
    "stroke": context.stroke_color,
    "stroke-width": context.stroke_width,
  });

  var spec = AddTagNS(group, context.svgNS, "line", {
    "x1": x1, "y1": y1, "x2": x2, "y2": y2,
  });
  Shape.AddSpecAttr(context, spec);

  Shape.AddResizer(context, group, x1, y1);
  Shape.AddResizer(context, group, x2, y2);
  
  this.load(id, group, node, spec);
}

Line.shape = "line";
Line.create = function() { return new Line(); };

Line.prototype = new Shape;
Line.prototype.constructor = Line;
Line.prototype.shape = Line.shape;
Line.prototype.load = function(id, group, node, spec) {
  var left = parseInt(node.getAttribute("x1"));
  var top = parseInt(node.getAttribute("y1"));
  var right = parseInt(node.getAttribute("x2"));
  var bottom = parseInt(node.getAttribute("y2"));
  var width = right - left;
  var height = bottom - top;
  Shape.call(this, id, group, node, spec, left, top, width, height);
  this.resizers.push(group.childNodes[2]);
  this.resizers.push(group.childNodes[3]);
};

Line.prototype.SetPosition = function() {
  SetAttr(this.node, {"x": this.left, "y": this.top, "width": this.width, "height": this.height});
  SetAttr(this.spec, {"x": this.left, "y": this.top, "width": this.width, "height": this.height});
  
  Shape.MoveRect(this.resizers[0], this.right, this.bottom);
  
  Shape.MoveCircle(this.knots[0], this.left, this.y);
  Shape.MoveCircle(this.knots[1], this.right, this.y);
  Shape.MoveCircle(this.knots[2], this.x, this.top);
  Shape.MoveCircle(this.knots[3], this.x, this.bottom);
}
