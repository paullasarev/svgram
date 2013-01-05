// ShapeContext module
// $Author$
// $Id$

define([], function() {

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
  this.spec_stroke_width = 8;
  this.spec_event = {};

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

  return ShapeContext;
});

