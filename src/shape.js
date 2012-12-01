function Shape() {
}

Shape.prototype = {
  Classes: {},
  Attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  },
  shape_init: function(shape, id, group, node, x, y) {
    this.shape = shape;
    this.id = id;
    this.node = node;
    this.group = group;
    this.x = x;
    this.y = y;
  },
  LoadById: function (id) {
    var group = document.getElementById(id);
    var node = group.childNodes[0];
    var shape_class = group.getAttribute("shape");
    
    var shape = Shape.prototype.Classes[shape_class]();
    shape.load(id, group, node);
    return shape;
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
Rect.prototype.shape_class = "rect";
Rect.prototype.load = function(id, group, node) {
    var x = node.getAttribute("x");
    var y = node.getAttribute("y");
    this.shape_init(this.shape_class, id, group, node, x, y);
  };

Shape.prototype.Classes[Rect.prototype.shape_class] = function() { return new Rect(); };
