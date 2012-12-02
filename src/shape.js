// ShapeContext and Shape
// $Author$
// $Id$

function ShapeContext()
{
  this.svgNS = "http://www.w3.org/2000/svg";
  
  //shape defaults
  this.width = 160;
  this.height = 100;
  this.stroke_color = "black";
  this.stroke_width = 2;
  this.fill = "none";
  
  //spec defaults
  this.spec_opacity_initial = 0;
  this.spec_opacity = 0.15;
  this.spec_event = {};

  //resizer defaults
  this.resizer_size = 8;
  this.resizer_color = "blue";
  this.resizer_event = {};

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

function Shape(id, group, node, spec, left, top, width, height) {
  if (!id)
    return;

  this.id = id;
  this.node = node;
  this.group = group;
  this.spec = spec;
  this.width = parseInt(width);
  this.height = parseInt(height);
  this.left = parseInt(left);
  this.top = parseInt(top);
  this.right = this.left + this.width;
  this.bottom = this.top + this.height;
  this.x = Math.round(this.left + this.width / 2);
  this.y = Math.round(this.top + this.height / 2);
  this.resizers = [];
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
    "svgram": "spec",
  });
  
  for(var event in context.spec_event) {
    var handler = context.spec_event[event];
    if (typeof(handler) === "string")
      spec.setAttribute(event, handler);
    else if (typeof(handler) === "function")
      spec.addEventListener(event.substring(2), handler, false);
  }
}

Shape.AddResizer = function(context, group, pos_x, pos_y)
{
  var node = AddTagNS(group, context.svgNS, "rect", {
    "x": Math.round(pos_x - context.resizer_size / 2),
    "y": Math.round(pos_y - context.resizer_size / 2),
    "width": context.resizer_size,
    "height": context.resizer_size,
    "opacity": context.spec_opacity,
    "fill": context.resizer_color,
    "stroke": context.resizer_color,
    "stroke-width": context.stroke_width,
    "id": Shape.NewID(),
    "svgram": "resizer",
  });

  for(var event in context.resizer_event) {
    var handler = context.resizer_event[event];
    if (typeof(handler) === "string")
      node.setAttribute(event, handler);
    else if (typeof(handler) === "function")
      node.addEventListener(event.substring(2), handler, false);
  }

  return node;
}


