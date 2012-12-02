// $Author$
// $Id$

function Shape(id, group, node, spec, x, y, width, height) {
  if (!id)
    return;
  this.id = id;
  this.node = node;
  this.group = group;
  this.spec = spec;
  this.x = x;
  this.y = y;
  this.width = width;
  this.height = height;
}

Shape.prototype = {
  shape: "unknown",
  Attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  }
};

Shape.NewID = function() {
  return Math.uuid(15);
};

Shape.AddGroup = function(context, id, shape) {
  return AddTagNS(context.root, context.svgNS, "g", { "id": id, "shape": shape } );
};

Shape.AddSpecAttr = function(context, spec)
{
  SetAttr(spec, { 
    "fill": context.stroke_color,
    "opacity": context.spec_opacity_initial,
    "stroke": context.stroke_color,
    "stroke-width": context.stroke_width,
  });
  
  for(var event in context.spec_event) {
    var handler = context.spec_event[event];
    if (typeof(handler) === "string")
      spec.setAttribute(event, handler);
    else if (typeof(handler) === "function")
      spec.addEventListener(event.substring(2), handler, false);
  }
}


function ShapeContext()
{
  this.svgNS = "http://www.w3.org/2000/svg";
  
  //shape style defaults
  this.width = 160;
  this.height = 100;
  this.stroke_color = "black";
  this.stroke_width = 2;
  this.fill = "none";
  
  this.spec_opacity_initial = 0;
  this.spec_event = {};
  
  this.Classes = {
  };

  this.Register = function(shapeClass) {
    this.Classes[shapeClass.shape] = shapeClass.create;
  };

  this.LoadById = function (id) {
    var group = document.getElementById(id);
    var node = group.childNodes[0];
    var shape = group.getAttribute("shape");
    var spec = group.childNodes[1];
    
    var concreteShape = this.Classes[shape]();
    concreteShape.load(id, group, node, spec);
    return concreteShape;
  };
}

// Rect shape
function Rect(context, x, y, width, height) {
  if (!context) 
    return;

  width = width ? width : context.width;
  height = height ? height : context.height;
  
  var id = Shape.NewID();
  var group = Shape.AddGroup(context, id, this.shape);
  var node = AddTagNS(group, context.svgNS, "rect", {
    "x": x, "y": y,
    "width": width, "height": height,
    "fill": context.fill,
    "stroke": context.stroke_color,
    "stroke-width": context.stroke_width,
  });

  var spec = AddTagNS(group, context.svgNS, "rect", {
    "x": x, "y": y,
    "width": width, "height": height,
  });
  Shape.AddSpecAttr(context, spec);

  this.load(id, group, node, spec);
}

Rect.shape = "rect";
Rect.create = function() { return new Rect(); };

Rect.prototype = new Shape;
Rect.prototype.constructor = Rect;
Rect.prototype.shape = Rect.shape;
Rect.prototype.load = function(id, group, node, spec) {
  var x = node.getAttribute("x");
  var y = node.getAttribute("y");
  var width = node.getAttribute("width");
  var height = node.getAttribute("height");
  Shape.call(this, id, group, node, spec, x, y, width, height);
};

