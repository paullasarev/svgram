//function Shape() {
function Shape(id, group, node, x, y) {
  if (!id)
    return;
  this.id = id;
  this.node = node;
  this.group = group;
  this.x = x;
  this.y = y;
}

Shape.prototype = {
  Classes: {},
  shape: "unknown",
  Attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  },
  LoadById: function (id) {
    var group = document.getElementById(id);
    var node = group.childNodes[0];
    var shape = group.getAttribute("shape");
    
    var concreteShape = Shape.prototype.Classes[shape]();
    concreteShape.load(id, group, node);
    return concreteShape;
  }
}

// Rect shape
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

  this.load(id, group, node);
}

Rect.prototype = new Shape;
Rect.prototype.constructor = Rect;
Rect.prototype.shape = "rect";
Rect.prototype.load = function(id, group, node) {
    var x = node.getAttribute("x");
    var y = node.getAttribute("y");
    //this.shape_init(id, group, node, x, y);
    Shape.call(this, id, group, node, x, y);
  };

Shape.prototype.Classes[Rect.prototype.shape] = function() { return new Rect(); };
