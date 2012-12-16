// $Author: paullasarev@gmail.com $
// $Id$

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperWidth = 0, PaperHeight = 0;

var PaperClientOffsetX = 0; PaperClientOffsetY = 0;

var PaperElement = null;
var PaperLinesElement = null;
var SelectedGroup = null;
var DragX = 0, DragY = 0;
var DragObject;
var Context;

function CreateContext(root_shapes, root_lines, paper_color, grid_step) {
  var context = new ShapeContext();
  
  context.Register(Rect);
  context.Register(Line);
  context.Register(Text);
  
  context.root_shapes = root_shapes;
  context.root_lines = root_lines;

  context.paper_color = paper_color;
  context.grid_step = grid_step;

  context.line_length = 80;
  
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
  context.knot_size = 20;
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
  
  return context;
}

function CreatePaper(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  var canvas = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas"});
  PaperOffsetX = offset_x;
  PaperOffsetY = offset_y;
  PaperWidth = width;
  PaperHeight = height;
  var GridStep = 20;

  var border = AddTagNS(canvas, svgNS, "rect", {id:"diagram.canvas.border", "x": offset_x + stroke, "y": offset_y + stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": borderColor, "stroke-width": stroke });
  SetAttr(border, {"filter":"url(#shadow)"}); 
  SetAttr(border, {onmousedown:"PaperMouseDown(evt)", onmousemove:"PaperMouseMove(evt)", onmouseup:"PaperMouseUp(evt)", });
  
  var grid = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas.grid"});
  for(var x = GridStep + stroke ; x < width ; x += GridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1: offset_x + x, y1: offset_y + stroke, x2:offset_x + x, y2: offset_y + height - stroke,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + (GridStep - 1)});
  }

  var paper = AddTagNS(svg, svgNS, "g", {id:"diagram.paper"});
  PaperLinesElement = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.lines"});
  PaperElement = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.shapes"});

  CalculatePaperClientOffset(paper);

  Context = CreateContext(PaperElement, PaperLinesElement, paperColor, GridStep);
}

function CalculatePaperClientOffset(element)
{
  var rect = element.getBoundingClientRect();
  PaperClientOffsetX = rect.left;
  PaperClientOffsetY = rect.top;
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

function DeselectPaper()
{
  if (SelectedGroup != null) {
    var oldspec = SelectedGroup.childNodes.item(1); //.firstChild;
    SetAttr(oldspec, { "opacity": 0 });
  }
}

function SelectSpec(spec) {
  DeselectPaper();
  SelectedGroup = spec.parentNode;
  SetAttr(spec, { "opacity": Context.spec_opacity });
}

function SelectPaperElement(specNode) {
  var spec = specNode.parentNode;
  SelectSpec(spec);
}

function EditPropertiesText(shape) {
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
}

function PaperEditProperties() {
  var shape = Context.LoadByGroup(SelectedGroup);
  if (shape.shape == "text") {
    EditPropertiesText(shape);
  } else {
    alert("PaperEditProperties: " + shape.shape);
  }
}

function PaperSetCursor(cursor){
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {"cursor" : cursor});
}

function SnapPosToGrid(pos, delta, grid_step) {
  return Math.round((pos + delta) / grid_step) * grid_step;
}

function PaperGetCurrentColor()
{
  Context.stroke_color = ControlGetShapeColor();
}

function PaperCreateRect(pos_x, pos_y, parentGroup)
{
  pos_x = SnapPosToGrid(pos_x, 0, Context.grid_step);
  pos_y = SnapPosToGrid(pos_y, 0, Context.grid_step);

  PaperGetCurrentColor();
  var rect = new Rect(Context, parentGroup, pos_x, pos_y);
  SelectSpec(rect.spec);
}

function PaperCreateLine(pos_x, pos_y, knot, parentGroup)
{
  pos_x = SnapPosToGrid(pos_x, 0, Context.grid_step);
  pos_y = SnapPosToGrid(pos_y, 0, Context.grid_step);

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

  PaperGetCurrentColor();
  var line = new Line(Context, parentGroup, left, top, right, bottom);

  if (knot) {
    delta = ConnectResizerToKnot({x:pos_x, y:pos_y}, line.resizers[resizer], knot);
    line.Move(Context, delta.x, delta.y);
  }

  SelectSpec(line.spec);
}

function PaperCreateText(pos_x, pos_y, parentGroup)
{
  PaperGetCurrentColor();
  var shape = new Text(Context, parentGroup, pos_x, pos_y);

  SelectSpec(shape.spec);
}

function SnapShapeToGrid(shape, delta, grid_step) {
  var gridX = SnapPosToGrid(shape.x, delta.x, grid_step);
  var gridY = SnapPosToGrid(shape.y, delta.y, grid_step);
  return {x: gridX - shape.x, y: gridY - shape.y};
}

function PaperMoveShape(pos_x, pos_y, isEnd)
{
  var delta = {x : pos_x - DragX, y : pos_y - DragY};
 
  var shape = Context.LoadByGroup(SelectedGroup);
  
  if (isEnd) {
    delta = SnapShapeToGrid(shape, delta, Context.grid_step);
  }
  
  shape.Move(Context, delta.x, delta.y);
  
  DragX = pos_x;
  DragY = pos_y;
}

function ConnectResizerToKnot(delta, resizer, knot) 
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
}

function SnapResizerToGrid(resizer, delta, grid_step) {
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

  var gridX = SnapPosToGrid(x, delta.x, grid_step);
  var gridY = SnapPosToGrid(y, delta.y, grid_step);
  return {x: gridX - x, y: gridY - y};
}

function PaperResizeShape(pos_x, pos_y, dragObject, connectObject, isEnd, orientation) {
  var delta = {x : pos_x - DragX, y : pos_y - DragY};
  if (orientation == "n-resize" || orientation == "s-resize") {
    delta.x = 0;
  } else if (orientation == "w-resize" || orientation == "e-resize") {
    delta.y = 0;
  }

  var shape = Context.LoadByGroup(SelectedGroup);

  if (isEnd) {
    var grid_step = (shape.shape == "text" ? 2 : Context.grid_step);
    delta = SnapResizerToGrid(dragObject, delta, grid_step);
  }
  
  delta = ConnectResizerToKnot(delta, dragObject, connectObject);
  
  shape.Resize(Context, delta.x, delta.y, dragObject, orientation);
 
  DragX = pos_x;
  DragY = pos_y;
}

function PaperDeleteSelectedShape() {
  if (SelectedGroup == null) return;

  var parent = SelectedGroup.parentNode;
  parent.removeChild(SelectedGroup);
  SelectedGroup = null;
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
  DeselectPaper();
}

function PaperMouseUp(evt)
{
  evt.preventDefault();
  if (!ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject)) {
    DeselectPaper();
  }
  
  DragObject = null;
}

function PaperMouseMove(evt)
{
  evt.preventDefault();
  ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
}

function SpecMouseMove(evt) {
  evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
  }
}

function SpecMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);

  ControlDragShapeStart();
}

function SpecMouseUp(evt) {
  evt.preventDefault();
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), null, evt.target.parentNode.parentNode);
  DragObject = null;
}

function ResizerMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);
  DragObject = evt.target;

  DragX = EventOffsetX(evt);
  DragY = EventOffsetY(evt);
  ControlDragSizeStart();
}

function ResizerMouseMove(evt) {
  evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject);
  }
}

function ResizerMouseUp(evt) {
  evt.preventDefault();
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject);
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

  ControlDragSizeStart(orientation);
}

function KnotMouseUp(evt) {
  evt.preventDefault();
  var target = (ControlDragSizeOrientation ? null : evt.target);
  //alert("KnotMouseUp: " + target);
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject, target);
}

function KnotMouseMove(evt) {
  evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject, evt.target);
  }
}

