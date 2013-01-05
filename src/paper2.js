// $Author: paullasarev@gmail.com $
// $Id$

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperWidth = 0, PaperHeight = 0;

var PaperClientOffsetX = 0; PaperClientOffsetY = 0;

var PaperElement = null;
var PaperLinesElement = null;
var PaperResizer = null;
var PaperSpec = null;
var PaperSvg = null;
var PaperGrid = null;
var GridStep = 20;
var PaperStroke = null;
var PaperRoot = null;

var SelectedGroup = null;
var DragX = 0, DragY = 0;
var DragObject;
var Context;

var TheControl = null;
var ThePaper = null;


function AddPaperResizer(context, svg, x, y, width, height, stroke) {
  var paperResizerSize = 30;
  var strokeSize = 10;
  var paperResizer = AddTagNS(svg, svgNS, "rect", {
    "id": "diagram.resizer",
    "x": x + width - stroke * 1 - paperResizerSize + strokeSize /2 ,
    "y": y + height - stroke * 1- paperResizerSize + strokeSize/2, 
    "width": paperResizerSize, 
    "height": paperResizerSize,
    "opacity": context.spec_opacity,
    "fill": context.resizer_color,
    "stroke": context.paper_color,
    "stroke-width": strokeSize,
    "id": Shape.NewID(),
    "svgram": "resizer",
    });

  Shape.AddEventHandlers(paperResizer, context.paper_resizer_event);
  
  return paperResizer;  
}

function GetShapeColor()
{
  var colorButton = document.getElementById('buttonColor');
  if (colorButton != null)
  {
    ShapeColor = colorButton.style.backgroundColor;
  }
  
  return ShapeColor;
}

function SelectSpec(spec) {
  ThePaper.DeselectPaper();
  SelectedGroup = spec.parentNode;
  SetAttr(spec, { "opacity": Context.spec_opacity });
}

function SelectPaperElement(specNode) {
  var spec = specNode.parentNode;
  SelectSpec(spec);
}



function EventOffsetX(evt)
{
  return evt.clientX - PaperClientOffsetX;
}

function EventOffsetY(evt)
{
  return evt.clientY - PaperClientOffsetY;
}

function PaperMouseDown(evt)
{
  evt.preventDefault();
  ThePaper.DeselectPaper();
}

function PaperMouseUp(evt)
{
  evt.preventDefault();
  if (!TheControl.ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject)) {
    ThePaper.DeselectPaper();
  }
  
  DragObject = null;
}

function PaperMouseMove(evt)
{
  evt.preventDefault();
  TheControl.ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
}

function SpecMouseMove(evt) {
  evt.preventDefault();
  if (TheControl.ControlInDragMode()) {
    TheControl.ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
  }
}

function SpecMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);

  TheControl.ControlDragShapeStart();
}

function SpecMouseUp(evt) {
  evt.preventDefault();
  TheControl.ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), null, evt.target.parentNode.parentNode);
  DragObject = null;
}

function ResizerMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);
  DragObject = evt.target;

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);
  TheControl.ControlDragSizeStart();
}

function ResizerMouseMove(evt) {
  evt.preventDefault();
  if (TheControl.ControlInDragMode()) {
    TheControl.ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
  }
}

function ResizerMouseUp(evt) {
  evt.preventDefault();
  TheControl.ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject);
  DragObject = null;
}

function KnotMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);
  DragObject = evt.target;

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);

  var orientation = null;
  var knot_dir = DragObject.getAttribute("knot-dir");
  if (knot_dir == "top") {
    orientation = "n-resize";
  } else if (knot_dir == "bottom") {
    orientation = "s-resize";
  } else if (knot_dir == "left") {
    orientation = "w-resize";
  } else if (knot_dir == "right") {
    orientation = "e-resize";
  }

  TheControl.ControlDragSizeStart(orientation);
}

function KnotMouseUp(evt) {
  evt.preventDefault();
  var target = (TheControl.ControlDragSizeOrientation ? null : evt.target);
  TheControl.ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject, target);
}

function KnotMouseMove(evt) {
  evt.preventDefault();
  if (TheControl.ControlInDragMode()) {
    TheControl.ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject, evt.target);
  }
}

function PaperResizerMouseDown(evt) {
  evt.preventDefault();
  ThePaper.DeselectPaper();

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);
  TheControl.ControlDragPaperStart();
}

function PaperResizerMouseMove(evt) {
  evt.preventDefault();

  if (TheControl.ControlInDragMode()) {
    ThePaper.DeselectPaper();
    TheControl.ControlDragMove(EventOffsetX(evt), EventOffsetY(evt));
  }
}

function PaperResizerMouseUp(evt) {
  evt.preventDefault();
  TheControl.ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt));
}

define(["uuid","common","shape","rect","line","text"], 
function(Uuid, Common, ShapeModule, RectModule, LineModule, TextModule) {
  
function Paper() 
{
  this.Control = null;
}
  
Paper.prototype.CreatePaper = function(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  PaperSvg = svg;
  var paperGroup = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.canvas"});
  PaperOffsetX = offset_x;
  PaperOffsetY = offset_y;
  PaperWidth = width;
  PaperHeight = height;
  PaperBorderColor = borderColor;
  PaperStroke = stroke;

  PaperSpec = Common.AddTagNS(paperGroup, Common.svgNS, "rect", {id:"diagram.canvas.border", 
    "x": offset_x + stroke, "y": offset_y + stroke, 
    "width": width - stroke * 2, "height" : height - stroke * 2,
    "fill": paperColor, 
    "stroke": borderColor, 
    "stroke-width": stroke });
  //Common.SetAttr(PaperSpec, {"filter":"url(#shadow)"}); 
  Common.SetAttr(PaperSpec, {onmousedown:"PaperMouseDown(evt)", onmousemove:"PaperMouseMove(evt)", onmouseup:"PaperMouseUp(evt)", });
  
  PaperGrid = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.canvas.grid"});
  this.CreateGrid(PaperGrid, width, height, borderColor);

  PaperRoot = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.paper"});
  PaperLinesElement = Common.AddTagNS(PaperRoot, Common.svgNS, "g", {id:"diagram.paper.lines"});
  PaperElement = Common.AddTagNS(PaperRoot, Common.svgNS, "g", {id:"diagram.paper.shapes"});
  
  this.CalculatePaperClientOffset(PaperSvg);

  Context = this.CreateContext(PaperElement, PaperLinesElement, paperColor, GridStep);

  PaperResizer = AddPaperResizer(Context, svg, offset_x, offset_y, width, height, stroke);
  
  TheControl = this.Control;
  ThePaper = this;
};

Paper.prototype.CreateContext = function(root_shapes, root_lines, paper_color, grid_step)
{
  var context = new ShapeContext();
  
  context.Register(Rect);
  context.Register(Line);
  context.Register(Text);
  
  context.root_shapes = root_shapes;
  context.root_lines = root_lines;

  context.paper_color = paper_color;
  context.grid_step = grid_step;

  context.line_length = 40;
  
  //shape defaults
  context.width = 160;
  context.height = 80;
  context.stroke_color = "rgb(51, 51, 204)";
  context.stroke_width = 2;
  context.fill = "none";
  
  //spec defaults
  context.spec_opacity_initial = 0;
  context.spec_opacity = 0.15;
  context.spec_stroke_width = 12;

  //resizer defaults
  context.resizer_size = 8;
  context.resizer_color = "blue";
  context.resizer_stroke_width = 8;

  //knot defaults
  context.knot_size = 18;
  context.knot_color = "blue";
  context.knot_stroke_color = paper_color;
  context.knot_stroke_width = 10;

  //text props
  context.text_width = 100;
  context.text_height = 20;
  context.text_font_size = 20;
  
  //events
  context.spec_event.onmousedown = "SpecMouseDown(evt)";
  context.spec_event.onmouseup = "SpecMouseUp(evt)";
  context.spec_event.onmousemove = "SpecMouseMove(evt)";
  
  context.resizer_event.onmousedown = "ResizerMouseDown(evt)";
  context.resizer_event.onmousemove = "ResizerMouseMove(evt)";
  context.resizer_event.onmouseup = "ResizerMouseUp(evt)";
  
  context.knot_event.onmousedown = "KnotMouseDown(evt)";
  context.knot_event.onmousemove = "KnotMouseMove(evt)";
  context.knot_event.onmouseup = "KnotMouseUp(evt)";
  
  context.paper_resizer_event = {};
  context.paper_resizer_event.onmousedown = "PaperResizerMouseDown(evt)";
  context.paper_resizer_event.onmousemove = "PaperResizerMouseMove(evt)";
  context.paper_resizer_event.onmouseup = "PaperResizerMouseUp(evt)";
  
  return context;
};

Paper.prototype.CreateGrid = function(grid, width, height, borderColor)
{
  var offset_x = PaperOffsetX;
  var offset_y = PaperOffsetY; 
  Common.RemoveAllChilds(grid);
  for(var x = GridStep ; x < width ; x += GridStep)
  {
    Common.AddTagNS(grid, Common.svgNS, "line", {x1: offset_x + x, y1: offset_y + GridStep, x2:offset_x + x, y2: offset_y + height,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + (GridStep - 1)});
  }
};

Paper.prototype.PaperSetCursor = function(cursor)
{
  var diagram = document.getElementById("diagram");
  Common.SetAttr(diagram, {"cursor" : cursor});
};

Paper.prototype.DeselectPaper = function()
{
  if (SelectedGroup != null) {
    var oldspec = SelectedGroup.childNodes.item(1);
    SetAttr(oldspec, { "opacity": 0 });
    
    SelectedGroup = null;
    DragObject = null;
  }
};

Paper.prototype.PaperEditProperties = function()
{
  var shape = Context.LoadByGroup(SelectedGroup);
  if (shape.shape == "text") {
    this.EditPropertiesText(shape);
  } else {
    alert("PaperEditProperties: " + shape.shape);
  }
};

Paper.prototype.EditPropertiesText = function(shape)
{
  var text = shape.node.textContent;
  text = text.replace(/'/g, '&#039;');
  
  var box = dhtmlx.modalbox({
	title:"Text properties",
	text:"<div><label>text: <input class='inform' name='textvalue' id='text-property' type='text' value='" + text + "'></label></div>",
	buttons:["Save", "Cancel"],
	callback: function (result) {
	  if (result == 1)
      return;
	  var prop = box.querySelector("input");
	  var newText = prop.value;
	  shape.node.textContent = newText;
	}
 });
};

Paper.prototype.PaperCreateRect = function(pos_x, pos_y, parentGroup)
{
  pos_x = this.SnapPosToGrid(pos_x, 0, Context.grid_step);
  pos_y = this.SnapPosToGrid(pos_y, 0, Context.grid_step);

  this.PaperGetCurrentColor();
  var rect = new Rect(Context, parentGroup, pos_x, pos_y);
  SelectSpec(rect.spec);
};

Paper.prototype.PaperCreateLine = function(pos_x, pos_y, knot, parentGroup)
{
  pos_x = this.SnapPosToGrid(pos_x, 0, Context.grid_step);
  pos_y = this.SnapPosToGrid(pos_y, 0, Context.grid_step);

  var orientation = "v";
  var resizer;
  if (knot) {
    var knot_dir = knot.getAttribute("knot-dir");
    if (knot_dir == "top") {
      resizer = 1;
      orientation = "v";
    } else if (knot_dir == "bottom") {
      resizer = 0;
      orientation = "v";
    } else if (knot_dir == "left") {
      resizer = 1;
      orientation = "h";
    } else if (knot_dir == "right") {
      resizer = 0;
      orientation = "h";
    }
  }
  
  var length2 = Context.line_length / 2;
  var left, top, right, bottom;

  if (orientation == "v") {
    left = pos_x;
    top = pos_y - length2;
    right = pos_x;
    bottom = pos_y + length2;
  } else {
    left = pos_x - length2;
    top = pos_y;
    right = pos_x + length2;
    bottom = pos_y;
  }

  this.PaperGetCurrentColor();
  var line = new Line(Context, parentGroup, left, top, right, bottom);

  if (knot) {
    delta = this.ConnectResizerToKnot({x:pos_x, y:pos_y}, line.resizers[resizer], knot);
    line.Move(Context, delta.x, delta.y);
  }

  SelectSpec(line.spec);
};

Paper.prototype.PaperCreateText = function(pos_x, pos_y, parentGroup)
{
  this.PaperGetCurrentColor();
  var shape = new Text(Context, parentGroup, pos_x, pos_y);

  SelectSpec(shape.spec);
}

Paper.prototype.PaperGetCurrentColor = function()
{
  Context.stroke_color = this.Control.ControlGetShapeColor();
}

Paper.prototype.PaperMoveShape = function(pos_x, pos_y, isEnd)
{
  var delta = {x : pos_x - DragX, y : pos_y - DragY};
 
  var shape = Context.LoadByGroup(SelectedGroup);
  
  if (isEnd) {
    delta = this.SnapShapeToGrid(shape, delta, Context.grid_step);
  }
  
  shape.Move(Context, delta.x, delta.y);
  
  DragX = pos_x;
  DragY = pos_y;
};

Paper.prototype.PaperResizeShape = function(pos_x, pos_y, dragObject, connectObject, isEnd, orientation)
{
  var delta = {x : pos_x - DragX, y : pos_y - DragY};
  if (orientation == "n-resize" || orientation == "s-resize") {
    delta.x = 0;
  } else if (orientation == "w-resize" || orientation == "e-resize") {
    delta.y = 0;
  }

  var shape = Context.LoadByGroup(SelectedGroup);

  if (isEnd) {
    var grid_step = (shape.shape == "text" ? 2 : Context.grid_step);
    delta = this.SnapResizerToGrid(dragObject, delta, grid_step);
  }
  
  delta = this.ConnectResizerToKnot(delta, dragObject, connectObject);
  
  if (!shape.Resize(Context, delta.x, delta.y, dragObject, orientation))
  {
    this.Control.ControlDragAbort();
  }
 
  DragX = pos_x;
  DragY = pos_y;
};

Paper.prototype.PaperResizePaper = function(pos_x, pos_y, isEnd)
{
  var delta_x = pos_x - DragX;
  var delta_y = pos_y - DragY;

  DragX = pos_x;
  DragY = pos_y;
  
  Shape.AddDelta(PaperResizer, "x", delta_x);
  Shape.AddDelta(PaperResizer, "y", delta_y);

  Shape.AddDelta(PaperSpec, "width", delta_x);
  Shape.AddDelta(PaperSpec, "height", delta_y);

  Shape.AddDelta(PaperSvg, "width", delta_x);
  Shape.AddDelta(PaperSvg, "height", delta_y); 
  var width = parseInt(PaperSvg.getAttribute("width"));
  var height = parseInt(PaperSvg.getAttribute("height"));

  this.CreateGrid(PaperGrid, width, height, PaperBorderColor);
  this.CalculatePaperClientOffset(PaperSvg);

  if (isEnd) {
    //alert("PaperResizePaper");
  }
};

Paper.prototype.CalculatePaperClientOffset = function(element)
{
  var rect = element.getBoundingClientRect();
  PaperClientOffsetX = parseInt(rect.left);
  PaperClientOffsetY = parseInt(rect.top);
};

Paper.prototype.ConnectResizerToKnot = function(delta, resizer, knot) 
{
  if (resizer && knot 
    && resizer.tagName == "rect" && resizer.getAttribute("svgram") == "resizer"
    && knot.tagName == "circle" && knot.getAttribute("svgram") == "knot")
  {
    var links_str = knot.getAttribute("links");
    var links;
    if (!links_str)
      links = [];
    else
      links = links_str.split(",");

    var shape_id = resizer.parentNode.parentNode.getAttribute("id");
    var resizer_no = resizer.getAttribute("resizer");
    var link_id = shape_id + ":" + resizer_no;
    if (links.indexOf(link_id) == -1)
      links.push(link_id);

    links_str = links.join(); 
    knot.setAttribute("links", links_str);
  
    var x = parseInt(resizer.getAttribute("x")) + parseInt(resizer.getAttribute("width")) / 2;
    var y = parseInt(resizer.getAttribute("y")) + parseInt(resizer.getAttribute("height")) / 2;
    var cx = parseInt(knot.getAttribute("cx"));
    var cy = parseInt(knot.getAttribute("cy"));
    
    return {x: cx - x, y: cy - y};
  }

  return delta;
};

Paper.prototype.SnapResizerToGrid = function(resizer, delta, grid_step)
{
  if (!resizer)
    return delta;
    
  var x, y;
  if(resizer.tagName == "rect") {
    x = parseInt(resizer.getAttribute("x")) + parseInt(resizer.getAttribute("width")) / 2;
    y = parseInt(resizer.getAttribute("y")) + parseInt(resizer.getAttribute("height")) / 2;
  } else if(resizer.tagName == "circle") {
    x = parseInt(resizer.getAttribute("cx"));
    y = parseInt(resizer.getAttribute("cy"));
  } else {
    return delta;
  }

  var gridX = this.SnapPosToGrid(x, delta.x, grid_step);
  var gridY = this.SnapPosToGrid(y, delta.y, grid_step);
  return {x: gridX - x, y: gridY - y};
};

Paper.prototype.SnapShapeToGrid = function (shape, delta, grid_step)
{
  var gridX = this.SnapPosToGrid(shape.x, delta.x, grid_step);
  var gridY = this.SnapPosToGrid(shape.y, delta.y, grid_step);
  return {x: gridX - shape.x, y: gridY - shape.y};
};

Paper.prototype.SnapPosToGrid = function (pos, delta, grid_step)
{
  return Math.round((pos + delta) / grid_step) * grid_step;
};

Paper.prototype.PaperDeleteSelectedShape = function()
{
  if (SelectedGroup == null)
    return;

  var parent = SelectedGroup.parentNode;
  parent.removeChild(SelectedGroup);
  SelectedGroup = null;
};


return Paper;
});