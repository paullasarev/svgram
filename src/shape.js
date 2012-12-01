function Shape(shape_class, id, group, node, x, y) {
  this.shape_class = shape_class;
  this.id = id;
  this.node = node;
  this.group = group;
  this.x = x;
  this.y = y;
}

Shape.prototype = {
  init: function(id, x, y) {
    this.id = id;
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
  var shape_class = group.getAttribute("shape");
  
  var shape = ShapeClasses[shape_class]();
  shape.load(shape_class, id, group, node);
  return shape;
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

Rect.prototype = {
  //shape_class: "rect",
  create: function() {
    return new Rect();
  },
  load: function(shape_class, id, group, node) {
    //var rect = new Rect();
    var x = node.getAttribute("x");
    var y = node.getAttribute("y");
    this.shape = new Shape(shape_class, id, group, node, x, y);
    //return rect;
  }, 
  attr: function(name, val) {
    return this.shape.attr(name, val);
  }
}

ShapeClasses["rect"] = Rect.prototype.create;

//shape delegation
Object.defineProperty(Rect.prototype, "node", {get: function () {return this.shape.node;}});
Object.defineProperty(Rect.prototype, "group", {get: function () {return this.shape.group;}});
Object.defineProperty(Rect.prototype, "shape_class", {get: function () {return this.shape.shape_class;}});
Object.defineProperty(Rect.prototype, "id", {get: function () {return this.shape.id;}});
Object.defineProperty(Rect.prototype, "x", {get: function () {return this.shape.x;}});
Object.defineProperty(Rect.prototype, "y", {get: function () {return this.shape.y;}});
