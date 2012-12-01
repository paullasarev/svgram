function Shape() {
}

Shape.prototype = {
  shape_init: function(shape, id, group, node, x, y) {
    this.shape = shape;
    this.id = id;
    this.node = node;
    this.group = group;
    this.x = x;
    this.y = y;
  },
  attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  }
}

var ShapeClasses = {};

function LoadShape(id) {
  var group = document.getElementById(id);
  var node = group.childNodes[0];
  var shape = group.getAttribute("shape");
  
  var shapeObject = ShapeClasses[shape]();
  shapeObject.load(shape, id, group, node);
  return shapeObject;
}

function Rect(root, x, y) {
  if (!root) 
    return;

  var id = Math.uuid(15);
  var group = AddTagNS(root, svgNS, "g", { "id": id, "shape": "rect" } );
  var node = AddTagNS(group, svgNS, "rect", {
    "x": x, "y": y,
    //"width": width, "height": height,
    "fill": "none"
    //"stroke": GetShapeColor(), "stroke-width": ShapeStroke,
  });

  this.load("rect", id, group, node);
}

Rect.prototype = new Shape;
Rect.prototype.constructor = Rect;

Rect.prototype.load = function(shape, id, group, node) {
    var x = node.getAttribute("x");
    var y = node.getAttribute("y");
    this.shape_init(shape, id, group, node, x, y);
  };

ShapeClasses["rect"] = function() { return new Rect(); };
