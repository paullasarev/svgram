// Text shape
// $Author$
// $Id$

function Text(context, parentGroup, x, y) {
  if (!context)
    return;

  x = parseInt(x);
  y = parseInt(y);
  var width = context.text_width;
  var height = context.text_height;
  var left = x - width / 2;
  var top = y - height / 2;
  var right = left + width;
  var bottom = top + height;

  var id = Shape.NewID();
  var root = Shape.AddRoot(context, parentGroup, context.root_lines);
  var group = Shape.AddGroup(context, root, id, this.shape);
  var node = AddTagNS(group, svgNS, "text", {
    "x" : x, "y" : y,
    "width" : right - left, "height" : bottom - top,
    "text-anchor" : "middle",
    "dominant-baseline" : "central",
    "font-size" : context.text_font_size,
    //"fill" : context.stroke_color,
    "font-family": "Arial",
    });

  var text_body = document.createTextNode("Text");
  node.appendChild(text_body); 

	var spec = AddTagNS(group, context.svgNS, "g", {});
  var outline = AddTagNS(spec, svgNS, "rect", {"x" : left, "y" : top, "width" : width, "height" : height });
  Shape.AddSpecAttr(context, outline);
  SetAttr(outline, {
    "opacity": 1,
    "fill": context.paper_color,
    "stroke": context.stroke_color,
    "stroke-width": 1,
    }
  );

  Shape.AddResizer(context, spec, right, bottom);

  this.load(id, group, node, spec);
}

Text.shape = "text";
Text.create = function () {
  return new Text();
};

Text.prototype = new Shape;
Text.prototype.constructor = Text;
Text.prototype.shape = Text.shape;
Text.prototype.min_width = 40;
Text.prototype.min_height = 20;


Text.prototype.load = function (id, group, node, spec) {
  var x = parseInt(node.getAttribute("x"));
  var y = parseInt(node.getAttribute("y"));
  var width = parseInt(node.getAttribute("width"));
  var height = parseInt(node.getAttribute("height"));
  var left = x - width / 2;
  var top = y - height / 2;
  var right = left + width;
  var bottom = top + height;
  Shape.call(this, id, group, node, spec, left, top, width, height);
  this.resizers.push(spec.childNodes[1]);
  this.outline = spec.firstChild;
};

Text.prototype.SetPosition = function (context) {
  SetAttr(this.node, { "x" : this.x, "y" : this.y, 
    "width" : this.width,"height" : this.height,
  });

  SetAttr(this.spec.firstChild, {
    "x" : this.left,"y" : this.top,
    "width" : this.width,"height" : this.height,
  });

  Shape.MoveRect(this.resizers[0], this.right, this.bottom);
}

Text.prototype.Resize = function (context, dx, dy, resizer) {
  var height = this.height;
  Shape.prototype.Resize.call(this, context, dx, dy, resizer);

  var new_height = this.height;
  var font_size = parseInt(this.node.getAttribute("font-size"));
  var new_font_size = Math.round(font_size * (new_height/height));
  this.node.setAttribute("font-size", new_font_size);
}

define(["shape"], function(ShapeModule) {
  function TextModule() {
  }

  return TextModule;
});