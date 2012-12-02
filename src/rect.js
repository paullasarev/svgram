// Rect shape
// $Author$
// $Id$

function Rect(context, x, y, width, height) {
  if (!context) 
    return;

  x = parseInt(x);
  y = parseInt(y);
  width = parseInt(width ? width : context.width);
  height = parseInt(height ? height : context.height);
  var left = Math.round(x - width / 2);
  var top = Math.round(y - height / 2);  
  var right = left + width;
  var bottom = top + height;
  
  var id = Shape.NewID();
  var group = Shape.AddGroup(context, id, this.shape);
  var node = AddTagNS(group, context.svgNS, "rect", {
    "x": left, "y": top,
    "width": width, "height": height,
    "fill": context.fill,
    "stroke": context.stroke_color,
    "stroke-width": context.stroke_width,
  });

  var spec = AddTagNS(group, context.svgNS, "rect", {
    "x": left, "y": top,
    "width": width, "height": height,
  });
  Shape.AddSpecAttr(context, spec);

  Shape.AddResizer(context, group, right, bottom);
  
  Shape.AddKnot(context, group, left, y);
  Shape.AddKnot(context, group, right, y);
  Shape.AddKnot(context, group, x, top);
  Shape.AddKnot(context, group, x, bottom);

  this.load(id, group, node, spec);
}

Rect.shape = "rect";
Rect.create = function() { return new Rect(); };

Rect.prototype = new Shape;
Rect.prototype.constructor = Rect;
Rect.prototype.shape = Rect.shape;
Rect.prototype.load = function(id, group, node, spec) {
  var left = node.getAttribute("x");
  var top = node.getAttribute("y");
  var width = node.getAttribute("width");
  var height = node.getAttribute("height");
  Shape.call(this, id, group, node, spec, left, top, width, height);
  this.resizers.push(group.childNodes[2]);
  this.knots.push(group.childNodes[3]);
  this.knots.push(group.childNodes[4]);
  this.knots.push(group.childNodes[5]);
  this.knots.push(group.childNodes[6]);
};

Rect.prototype.Move = function(dx, dy) {
  Shape.prototype.Move.call(this, dx, dy);
  
  var group = this.group;
  for (var i = 0 ; i < group.childNodes.length ; i++)
  {
    var node = group.childNodes.item(i);
    var tagName = node.tagName;
    if (tagName == "circle") {
      AddDelta(node, "cx", dx);
      AddDelta(node, "cy", dy);
    } else {
      AddDelta(node, "x", dx);
      AddDelta(node, "y", dy);
    }
  }
};


