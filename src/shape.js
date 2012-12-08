// ShapeContext and Shape
// $Author$
// $Id$

function ShapeContext()
{
  this.svgNS = "http://www.w3.org/2000/svg";
  
  this.root_shapes = null;
  this.root_lines = null;
  
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
  this.spec_stroke_width = 8;

  //resizer defaults
  this.resizer_size = 8;
  this.resizer_color = "blue";
  this.resizer_event = {};

  //knot defaults
  this.knot_size = 8;
  this.knot_color = "blue";
  this.knot_stroke_color = "blue";
  this.knot_stroke_width = 8;
  this.knot_event = {};
  
  this.Classes = {
  };

  this.Register = function(shapeClass) {
    this.Classes[shapeClass.shape] = shapeClass.create;
  };

  this.LoadByGroup = function(group) {
    var node = group.childNodes[0];
    var shape = group.getAttribute("shape");
    var spec = group.childNodes[1];
    var id = group.getAttribute("id");
    
    var concreteShape = this.Classes[shape]();
    concreteShape.load(id, group, node, spec);
    return concreteShape;
  };
  
  this.LoadById = function(id) {
    var group = document.getElementById(id);
    return this.LoadByGroup(group);
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
  this.knots = [];
}

Shape.prototype = {
  shape: "unknown",
  Attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  },
  Move: function(dx, dy) {
    this.x += dx;
    this.y += dy;
    this.left += dx;
    this.top += dy;
    this.right += dx;
    this.bottom += dy;

    this.SetPosition();
  },
  Resize: function(dx, dy, resizer) {
    this.left -= dx;
    this.top -= dy;
    this.width += dx * 2;
    this.height += dy * 2;
    this.right = this.left + this.width;
    this.bottom = this.top + this.height;

    this.SetPosition();
  },
};

Shape.NewID = function() {
  return Math.uuid(15);
};

Shape.AddGroup = function(context, root, id, shape) {
  return AddTagNS(root, context.svgNS, "g", { "id": id, "shape": shape } );
};

Shape.AddEventHandlers = function(node, eventMap) {
  for(var event in eventMap) {
    var handler = eventMap[event];
    if (typeof(handler) === "string")
      node.setAttribute(event, handler);
    else if (typeof(handler) === "function")
      node.addEventListener(event.substring(2), handler, false);
  }
};

Shape.AddSpecAttr = function(context, spec)
{
  SetAttr(spec, { 
    "fill": context.stroke_color,
    "opacity": context.spec_opacity_initial,
    "stroke": context.stroke_color,
    "stroke-width": context.spec_stroke_width,
    "svgram": "spec",
  });
  
  Shape.AddEventHandlers(spec, context.spec_event);
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
    "stroke-width": context.spec_stroke_width,
    "id": Shape.NewID(),
    "svgram": "resizer",
  });

  Shape.AddEventHandlers(node, context.resizer_event);

  return node;
}

Shape.AddKnot = function(context, group, pos_x, pos_y)
{
  var node = AddTagNS(group, context.svgNS, "circle", {
    "cx": pos_x,
    "cy": pos_y,
    "r": context.knot_size / 2,
    "opacity": context.spec_opacity,
    "fill": context.knot_color,
    "stroke": context.knot_stroke_color, 
    "stroke-width": context.knot_stroke_width,
    "id": Shape.NewID(),
    "svgram": "knot",
  });

  Shape.AddEventHandlers(node, context.knot_event);
  
  return node;
}

Shape.AddDelta = function (node, attr, delta) {
  var val = parseInt(node.getAttribute(attr));
  node.setAttribute(attr, val + delta);
}

Shape.MoveRect = function(node, x, y)
{
  var rsize = parseInt(node.getAttribute("width"));
  SetAttr(node, {
    "x": Math.round(x - rsize / 2),
    "y": Math.round(y - rsize / 2),
  });
}

Shape.MoveCircle = function(node, x, y)
{
  SetAttr(node, {"cx": x, "cy": y});
}


