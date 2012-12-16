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
  this.resizer_stroke_width = 8;
  this.resizer_event = {};

  //knot defaults
  this.knot_size = 8;
  this.knot_color = "blue";
  this.knot_stroke_color = "blue";
  this.knot_stroke_width = 8;
  this.knot_event = {};
  
  //text props
  this.text_width = 100;
  this.text_height = 40;
  this.text_font_size = 20;
  
  this.Classes = {};

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
    if (!group)
      return null;
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
  this.outline = "";
}

Shape.prototype = {
  shape: "unknown",
  min_width: 40,
  min_height: 20,
  
  Attr: function(name, val) {
    if (val != null)
      this.node.setAttribute(name, val);
    else
      return this.node.getAttribute(name);
  },
  
  Move: function(context, dx, dy, noPropagate) {
    this.x += dx;
    this.y += dy;
    this.left += dx;
    this.top += dy;
    this.right += dx;
    this.bottom += dy;

    this.SetPosition(context, noPropagate);

    var subs = this.GetSubShapes(context);
    for(var i = 0 ; i < subs.length ; ++i)
    {
      var sub = subs[i];
      sub.Move(context, dx, dy, true);
    }
  },
  
  Resize: function(context, dx, dy, resizer, orientation) {
    var left = this.left;
    var top = this.top;
    var right = this.right;
    var bottom = this.bottom;
    var width = this.width;
    var height = this.height;
    
    if (orientation == 'n-resize') {
      this.top += dy;
      this.height -= dy;
    } else if (orientation == 's-resize') {
      this.bottom += dy;
      this.height += dy;
    } else if (orientation == 'w-resize') {
      this.left += dx;
      this.width -= dx;
    } else if (orientation == 'e-resize') {
      this.right += dx;
      this.width += dx;
    } else {
      this.left -= dx;
      this.top -= dy;
      this.width += dx * 2;
      this.height += dy * 2;
    }

    //alert("Resize: width:" + this.width + " height:" + this.height);
    
    if (this.width < this.min_width || this.height < this.min_height) {
      this.left = left;
      this.top = top;
      this.right = right;
      this.bottom = bottom;
      this.width = width;
      this.height = height;
      ControlDragAbort();
      return;
    } else 
    {
      this.right = this.left + this.width;
      this.bottom = this.top + this.height;
      this.x = Math.round((this.right + this.left) / 2);
      this.y = Math.round((this.top + this.bottom) / 2);
    }
    
    this.SetPosition(context);
  },
  
  GetSubShapes: function(context) {
    var subs = null;
    if (this.subs) {
      subs = this.subs;
    } else if (this.group.childNodes.length > 2) {
      subs = this.group.childNodes[2];
    } else {
      return [];
    }
    
    var subShapes = [];
    for(var i = 0 ; i < subs.childNodes.length ; ++i)
    {
      var group = subs.childNodes[i];
      var shape = context.LoadByGroup(group);
      if (shape) {
        subShapes.push(shape);
      }
    }
     
    return subShapes;
   },
      
  AddSubs: function(context) {
    var subs = null;
    if (this.subs) {
      return this.subs;
    } else if (this.group.childNodes.length < 3) {
      subs = AddTagNS(this.group, context.svgNS, "g", {} );
    } else {
      subs = this.group.childNodes[2];
    }
    
    this.subs = subs;
    return subs;
  },
};

Shape.NewID = function() {
  return Math.uuid(15);
};

Shape.AddGroup = function(context, root, id, shape) {
  return AddTagNS(root, context.svgNS, "g", { "id": id, "shape": shape } );
};

Shape.PrependGroup = function(context, root, id, shape) {
  return PrependTagNS(root, context.svgNS, "g", { "id": id, "shape": shape } );
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

Shape.AddRoot = function(context, parentGroup, defaultRoot) {
  var root;
  if (parentGroup) {
    var parentShape = context.LoadByGroup(parentGroup);
    root = parentShape.AddSubs(context);
  } else {
    root = defaultRoot;
  }
  
  return root;
};


Shape.AddSpecAttr = function(context, spec)
{
  SetAttr(spec, { 
    //"fill": context.paper_color,//context.stroke_color,
    //"opacity": context.spec_opacity_initial,
    "opacity": 0,
    "stroke": context.stroke_color,
    "stroke-width": context.spec_stroke_width,
    "svgram": "spec",
  });
  
  Shape.AddEventHandlers(spec, context.spec_event);
};

Shape.AddResizer = function(context, group, pos_x, pos_y, resizer_no)
{
  var node = AddTagNS(group, context.svgNS, "rect", {
    "x": Math.round(pos_x - context.resizer_size / 2),
    "y": Math.round(pos_y - context.resizer_size / 2),
    "width": context.resizer_size,
    "height": context.resizer_size,
    //"opacity": context.spec_opacity,
    "fill": context.resizer_color,
    "stroke": context.resizer_color,
    "stroke-width": context.resizer_stroke_width,
    "id": Shape.NewID(),
    "svgram": "resizer",
    "resizer": resizer_no,
  });

  Shape.AddEventHandlers(node, context.resizer_event);

  return node;
};

Shape.AddKnot = function(context, group, pos_x, pos_y, knot_dir)
{
  var node = AddTagNS(group, context.svgNS, "circle", {
    "cx": pos_x,
    "cy": pos_y,
    "r": context.knot_size / 2,
    //"opacity": context.spec_opacity,
    "fill": context.knot_color,
    "stroke": context.knot_stroke_color, 
    "stroke-width": context.knot_stroke_width,
    "svgram": "knot",
    "knot-dir": knot_dir,
    "links": "",
  });

  Shape.AddEventHandlers(node, context.knot_event);
  
  return node;
};

Shape.MoveKnot = function (context, knot, pos_x, pos_y, noPropagate) {
  var old_x = parseInt(knot.getAttribute("cx"));
  var old_y = parseInt(knot.getAttribute("cy"));
	Shape.MoveCircle(knot, pos_x, pos_y);
  
  if (noPropagate)
    return;

  var dx = pos_x - old_x;
  var dy = pos_y - old_y;

  var link_str = knot.getAttribute("links");
  var links;
  if (!link_str)
    links = [];
  else
    links = link_str.split(",");

  for(var i=0; i < links.length; i++)
  {
    var link = links[i];
    var parts = link.split(":");
    var shape_id = parts[0];
    var resizer_no = parseInt(parts[1]);
    
    var shape = context.LoadById(shape_id);
    if (!shape)
      continue;
    shape.Resize(context, dx, dy, shape.resizers[resizer_no]);
  }
};

Shape.AddDelta = function (node, attr, delta) {
  var val = parseInt(node.getAttribute(attr));
  node.setAttribute(attr, val + delta);
};

Shape.MoveRect = function(node, x, y)
{
  var width = parseInt(node.getAttribute("width"));
  var height = parseInt(node.getAttribute("height"));
  SetAttr(node, {
    "x": Math.round(x - width / 2),
    "y": Math.round(y - height / 2),
  });
};

Shape.MoveCircle = function(node, x, y)
{
  SetAttr(node, {"cx": x, "cy": y});
};

