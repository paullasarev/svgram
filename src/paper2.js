// $Author: paullasarev@gmail.com $
// $Id$

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperWidth = 0, PaperHeight = 0;
var GridStep = 20;

// var TextWidth = 100;
// var TextHeight = 32 ;
// var TextFontSize = 24;
var PaperClientOffsetX = 0; PaperClientOffsetY = 0;

var PaperElement = null;
var PaperLinesElement = null;
var SelectedGroup = null;
var DragX = 0, DragY = 0;
var DragObject;
var Context;

function CreateContext(root_shapes, root_lines) {
  var context = new ShapeContext();
  
  context.Register(Rect);
  context.Register(Line);
  
  context.root_shapes = root_shapes;
  context.root_lines = root_lines;

  context.line_length = 60;
  
  //shape defaults
  context.width = 200;
  context.height = 100;
  context.stroke_color = "rgb(51, 51, 204)";
  context.stroke_width = 2;
  context.fill = "none";
  
  //spec defaults
  context.spec_opacity_initial = 0;
  context.spec_opacity = 0.15;
  context.spec_stroke_width = 8;

  //resizer defaults
  context.resizer_size = 8;
  context.resizer_color = "blue";

  //knot defaults
  context.knot_size = 10;
  context.knot_color = "blue";
  context.knot_stroke_color = "GhostWhite";
  context.knot_stroke_width = 20;

  //events
  context.spec_event.onmousedown = "SpecMouseDown(evt)";
  context.spec_event.onmouseup = "SpecMouseUp(evt)";
  context.spec_event.onmousemove = "SpecMouseMove(evt)";
  
  context.resizer_event.onmousedown = "ResizerMouseDown(evt)";
  context.resizer_event.onmousemove = "ResizerMouseMove(evt)";
  context.resizer_event.onmouseup = "ResizerMouseUp(evt)";
  
  context.knot_event.onmousemove = "KnotMouseMove(evt)";
  context.knot_event.onmouseup = "KnotMouseUp(evt)";
  
  return context;
}

function CreatePaper(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  var canvas = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas"});
  PaperOffsetX = offset_x;
  PaperOffsetE = offset_y;
  PaperWidth = width;
  PaperHeight = height;

  var border = AddTagNS(canvas, svgNS, "rect", {id:"diagram.canvas.border", "x": offset_x + stroke, "y": offset_y + stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": borderColor, "stroke-width": stroke });
  SetAttr(border, {"filter":"url(#shadow)"}); 
  SetAttr(border, {onmouseup:"PaperMouseUp(evt)", onmousemove:"PaperMouseMove(evt)"});
  
  var grid = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas.grid"});
  for(var x = GridStep + stroke ; x < width ; x += GridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1: offset_x + x, y1: offset_y + stroke, x2:offset_x + x, y2: offset_y + height - stroke,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + GridStep});
  }

  var paper = AddTagNS(svg, svgNS, "g", {id:"diagram.paper"});
  PaperLinesElement = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.lines"});
  PaperElement = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.shapes"});

  CalculatePaperClientOffset(paper);

  Context = CreateContext(PaperElement, PaperLinesElement);
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
    var oldspec = SelectedGroup.childNodes.item(1);
    SetAttr(oldspec, { "opacity": 0 });
  }
}

function SelectPaperElement(spec) {
  DeselectPaper();

  SelectedGroup = spec.parentNode;
  SetAttr(spec, { "opacity": Context.spec_opacity });
}

function PaperSetCursor(cursor){
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {"cursor" : cursor});
}

function PaperCreateRect(pos_x, pos_y)
{
  var rect = new Rect(Context, pos_x, pos_y);
}

function PaperCreateLine(pos_x, pos_y)
{
  var length = Context.line_length;
  var left = pos_x;
  var top = pos_y - length / 2;
  var right = pos_x;
  var bottom = pos_y + length/ 2;
  
  var line = new Line(Context, left, top, right, bottom);
}

function PaperCreateText(pos_x, pos_y)
{
}

function SnapShapeToGrid(shape, delta) {
  var gridX = Math.round((shape.x + delta.x) / GridStep) * GridStep;
  var gridY = Math.round((shape.y + delta.y) / GridStep) * GridStep;
  return {x: gridX - shape.x, y: gridY - shape.y};
}

function PaperMoveShape(pos_x, pos_y, isEnd)
{
  var delta = {x : pos_x - DragX, y : pos_y - DragY};
 
  var shape = Context.LoadByGroup(SelectedGroup);
  
  if (isEnd) {
    delta = SnapShapeToGrid(shape, delta);
  }
  
  shape.Move(delta.x, delta.y);
  
  DragX = pos_x;
  DragY = pos_y;
}

function SnapResizerToKnot(delta, resizer, knot) {
  if (resizer && resizer.tagName == "rect" && knot && knot.tagName == "circle") {
    var x = parseInt(resizer.getAttribute("x")) + parseInt(resizer.getAttribute("width")) / 2;
    var y = parseInt(resizer.getAttribute("y")) + parseInt(resizer.getAttribute("height")) / 2;
    var cx = parseInt(knot.getAttribute("cx"));
    var cy = parseInt(knot.getAttribute("cy"));
    return {x: cx - x, y: cy - y};
  }

  return delta;
}

function PaperResizeShape(pos_x, pos_y, dragObject, connectObject) {
  var delta = {x : pos_x - DragX, y : pos_y - DragY};

  delta = SnapResizerToKnot(delta, dragObject, connectObject);
  
  var shape = Context.LoadByGroup(SelectedGroup);
  shape.Resize(delta.x, delta.y, dragObject);
 
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

function PaperMouseUp(evt)
{
  evt.preventDefault();
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt));
  DeselectPaper();
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
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt));
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
  //alert("ResizerMouseUp:" + evt.target.tagName);
}

function KnotMouseUp(evt) {
  evt.preventDefault();
  ControlDragEnd(EventOffsetX(evt), EventOffsetY(evt), DragObject, evt.target);
  //alert("KnotMouseUp:" + evt.target.tagName);
}

function KnotMouseMove(evt) {
  evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(EventOffsetX(evt), EventOffsetY(evt), DragObject, evt.target);
  }
  //alert("KnotMouseMove:" + evt.target.tagName);
}

