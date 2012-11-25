// $Id$

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperWidth = 0, PaperHeight = 0;
var GridStep = 20;
var ShapeColor = "black";
var ShapeStroke = 2;
var ShapeWidth = 200;
var ShapeHeight = 100;
var TextWidth = 100;
var TextHeight = 32 ;
var TextFontSize = 24;
var LineLength = 60;
var ResizerSize = 8;
var KnotRadius = 4;
var KnotIDPrefix = "knot";
var SpecOpacity = 0.15;
var SpecStrokeWidth = 8;

var PaperElement = null;
var PaperLinesElement = null;
var SelectedGroup = null;
var DragX = 0, DragY = 0;
var DragLine = "";

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
  SetAttr(spec, { "opacity": SpecOpacity });
}

function AddKnot(group, pos_x, pos_y)
{
  var node = AddTagNS(group, svgNS, "circle", {"cx": pos_x, "cy": pos_y, "r": KnotRadius
    , "opacity": SpecOpacity
    , "fill": "blue", "stroke": "blue", "stroke-width": 7
    , "onmouseup": "KnotMouseUp(evt)"
    , "onmousemove": "KnotMouseMove(evt)"
    , "pointer-events": "painted"
    , "id": KnotIDPrefix + Math.uuid(15)
    , "class": "knot"
    , "svgram": "knot"
    });
    
  return node;
}

function AddResizer(group, pos_x, pos_y)
{
  var node = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ResizerSize / 2, "y": pos_y - ResizerSize / 2,
    "width": ResizerSize, "height": ResizerSize,
    "opacity": SpecOpacity
    , "fill": "blue", "stroke": "blue", "stroke-width": SpecStrokeWidth
    , "onmousemove": "ResizerMouseMove(evt)"
    , "onmousedown": "ResizerMouseDown(evt)"
    , "onmouseup": "ResizerMouseUp(evt)"
    , "id": KnotIDPrefix + Math.uuid(15)
  });
  
  return node;
}

function AddSpecAttr(spec)
{
  var color = GetShapeColor();
  SetAttr(spec, { 
    "fill": color, "opacity": 0
    , "stroke": color, "stroke-width": SpecStrokeWidth
    , "onmousemove": "SpecMouseMove(evt)"
    , "onmousedown": "SpecMouseDown(evt)"
    , "onmouseup": "SpecMouseUp(evt)"
    });
}

function PaperCreateRect(pos_x, pos_y)
{
  var left = pos_x - ShapeWidth / 2;
  var top = pos_y - ShapeHeight / 2;
  var right = pos_x + ShapeWidth / 2;
  var bottom = pos_y + ShapeHeight / 2;
  
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var rect = AddTagNS(group, svgNS, "rect", {
    "x": left, "y": top, "width": ShapeWidth, "height": ShapeHeight,
    "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke
  });

  var spec = AddTagNS(group, svgNS, "rect", {"x": left, "y": top, "width": ShapeWidth, "height": ShapeHeight});
  AddSpecAttr(spec);

  AddResizer(group, right, bottom);
  
  AddKnot(group, left, pos_y);
  AddKnot(group, right, pos_y);
  AddKnot(group, pos_x, top);
  AddKnot(group, pos_x, bottom);
}

function PaperCreateLine(pos_x, pos_y)
{
  var left = pos_x;
  var top = pos_y - LineLength / 2;
  var right = pos_x;
  var bottom = pos_y + LineLength / 2;
  
  var group = AddTagNS(PaperLinesElement, svgNS, "g", { } );
  AddTagNS(group, svgNS, "line", {"x1": left, "y1":top, "x2": right, "y2": bottom
    , "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke });

  var spec = AddTagNS(group, svgNS, "line", {"x1": left, "y1":top, "x2": right, "y2": bottom});
  AddSpecAttr(spec);

  var node = AddResizer(group, left, top);
  SetAttr(node, {"line_end":"begin"});
  node = AddResizer(group, right, bottom);
  SetAttr(node, {"line_end":"end"});
}

function PaperCreateText(pos_x, pos_y)
{
  var left = pos_x - TextWidth / 2;
  var top = pos_y - TextHeight / 2;
  var right = pos_x + TextWidth / 2;
  var bottom = pos_y + TextHeight / 2;
  
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var text = AddTagNS(group, svgNS, "text", {x: pos_x, y: pos_y, "text-anchor": "middle", "font-size": TextFontSize});
  
  var text_body = document.createTextNode("Text");
  text.appendChild(text_body); 
  
  var spec = AddTagNS(group, svgNS, "rect", {"x": left, "y": top, "width": TextWidth, "height": TextHeight});
  AddSpecAttr(spec);

  AddResizer(group, right, bottom);
}

function ConnectKnots(resizer, knot2, line_end) {
  var knot1id = resizer.getAttribute("id");
  var knot2id = knot2.getAttribute("id");
  //alert(knot1id + " " + knot2id);
  resizer.setAttribute("connknot", knot2id);
  resizer.setAttribute("connend", line_end);
  knot2.setAttribute("connknot", knot1id);
  knot2.setAttribute("connend", line_end);
}

function AdjustDelta(resizer, knot, deltaX, deltaY)
{
  var x = parseInt(resizer.getAttribute("x")) + ResizerSize/2;
  var y = parseInt(resizer.getAttribute("y")) + ResizerSize/2;
  var cx = parseInt(knot.getAttribute("cx"));
  var cy = parseInt(knot.getAttribute("cy"));
  
  return {deltaX: cx - x, deltaY: cy - y};
}


function AdjustConnKnot(node, deltaX, deltaY) {
  var connknot = node.getAttribute("connknot");
  if (!connknot) 
    return;
  AdjustKnot(connknot, deltaX, deltaY);
}

function AdjustKnot(knotid, deltaX, deltaY) {
  var knot = document.getElementById(knotid);
  if (!knot) 
    return;
  
  var connend = knot.getAttribute("connend");
  PaperResizeShapeDelta(deltaX, deltaY, knot.parentNode, knot, connend);
}

function AdjustToGrig(pos)
{
  var rest = pos % GridStep;
  var grids = Math.round(pos / GridStep);
  if (rest >= GridStep / 2)
    grids++;
    
  return grids * GridStep;
}

function AddDelta(node, attr, delta) {
  var val = parseInt(node.getAttribute(attr));
  node.setAttribute(attr, val + delta);
}

function AddHalfDelta(node, attr, base, range)
{
  var val = parseInt(node.getAttribute(attr));
  var need = base + range / 2;
  node.setAttribute(attr, need);
  return need - val;
}

function PaperMoveShape(pos_x, pos_y)
{
  var deltaX = pos_x - DragX;
  var deltaY = pos_y - DragY;
  
  for (var i = 0; i < SelectedGroup.childNodes.length; i++)
  {
    var node = SelectedGroup.childNodes.item(i);
    var tagName = node.tagName;
    if (tagName == "line") {
      AddDelta(node, "x1", deltaX);
      AddDelta(node, "y1", deltaY);
      AddDelta(node, "x2", deltaX);
      AddDelta(node, "y2", deltaY);
    }
    else if (tagName == "circle") {
      AddDelta(node, "cx", deltaX);
      AddDelta(node, "cy", deltaY);
      var connknot = node.getAttribute("connknot");
      if (connknot) {
        var connend = node.getAttribute("connend");
        AdjustKnot(connknot, deltaX, deltaY);
      }
    } else {
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
  }
  
  DragX = pos_x;
  DragY = pos_y;
}

function PaperResizeShape(pos_x, pos_y, target) {
  var deltaX = pos_x - DragX;
  var deltaY = pos_y - DragY;
  PaperResizeShapeDelta(deltaX, deltaY, SelectedGroup, target, DragLine);
 
  DragX = pos_x;
  DragY = pos_y;
}

function PaperResizeShapeDelta(deltaX, deltaY, group, target, connend) {
  var node = group.childNodes.item(0);
  var tagName = node.tagName;
  if (tagName == "rect") {
 
    AddDelta(node, "x", -deltaX);
    AddDelta(node, "y", -deltaY);
    AddDelta(node, "width", deltaX * 2);
    AddDelta(node, "height", deltaY * 2);
    
    var x = parseInt(node.getAttribute("x"));
    var y = parseInt(node.getAttribute("y"));
    var width = parseInt(node.getAttribute("width"));
    var height = parseInt(node.getAttribute("height"));
    //selector
    node = group.childNodes.item(1);
    AddDelta(node, "x", -deltaX);
    AddDelta(node, "y", -deltaY);
    AddDelta(node, "width", deltaX * 2);
    AddDelta(node, "height", deltaY * 2);
    //resizer
    node = group.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);
    //knotes
    node = group.childNodes.item(3);
    var deltaY2 = AddHalfDelta(node, "cy", y, height);
    AddDelta(node, "cx", -deltaX);
    AdjustConnKnot(node, -deltaX, deltaY2);
    node = group.childNodes.item(4);
    AddDelta(node, "cx", deltaX);
    AddDelta(node, "cy", deltaY2);
    AdjustConnKnot(node, deltaX, deltaY2);
    node = group.childNodes.item(5);
    AddDelta(node, "cy", -deltaY);
    var deltaX2 = AddHalfDelta(node, "cx", x, width);
    AdjustConnKnot(node, deltaX2, -deltaY);
    node = group.childNodes.item(6);
    AddDelta(node, "cx", deltaX2);
    AddDelta(node, "cy", deltaY);
    AdjustConnKnot(node, deltaX2, deltaY);
  }
  else if (tagName == "text") {
    var fontsize = parseInt(node.getAttribute("font-size"));
    var specSize = parseInt(group.childNodes.item(1).getAttribute("height"));
    var scale = (specSize + deltaY) / specSize.toFixed(2);
    fontsize = Math.round(fontsize * scale);
    node.setAttribute("font-size", fontsize);

    //spec
    node = group.childNodes.item(1);
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    var x = parseInt(node.getAttribute("x"));
    var y = parseInt(node.getAttribute("y"));
    var width = parseInt(node.getAttribute("width"));
    var height = parseInt(node.getAttribute("height"));

    //resizer
    node = group.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);

    //text
    node = group.childNodes.item(0);
    AddHalfDelta(node, "x", x, width);
    AddHalfDelta(node, "y", y, height);
  }
  else if (tagName == "line") {
    var x1 = parseInt(node.getAttribute("x1"));
    var y1 = parseInt(node.getAttribute("y1"));
    var x2 = parseInt(node.getAttribute("x2"));
    var y2 = parseInt(node.getAttribute("y2"));
    var sourceX = DragX;
    var sourceY = DragY;
    var is_line_begin = false;
    if (connend) {
      is_line_begin = (connend == "begin");
    } else {
      var dist1 = (sourceX - x1) * (sourceX - x1) + (sourceY - y1) * (sourceY - y1);
      var dist2 = (sourceX - x2) * (sourceX - x2) + (sourceY - y2) * (sourceY - y2);
      is_line_begin = (dist1 < dist2);
      alert(" " + dist1 + " " + dist2);
    }
    
    if (is_line_begin) {
      if (target && target.tagName == "circle") {
        var resizer = group.childNodes.item(2);
        ConnectKnots(resizer, target, "begin");
        newVal = AdjustDelta(resizer, target, deltaX, deltaY);
        deltaX = newVal.deltaX;
        deltaY = newVal.deltaY;
      }
      node.setAttribute("x1", x1 + deltaX);
      node.setAttribute("y1", y1 + deltaY);
      node = group.childNodes.item(1);  // Spec
      AddDelta(node, "x1", deltaX);
      AddDelta(node, "y1", deltaY);
      node = group.childNodes.item(2);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
    else {
      if (target && target.tagName == "circle") {
        var resizer = group.childNodes.item(3);
        ConnectKnots(resizer, target, "end");
        newVal = AdjustDelta(resizer, target, deltaX, deltaY);
        deltaX = newVal.deltaX;
        deltaY = newVal.deltaY;
      }
      node.setAttribute("x2", x2 + deltaX);
      node.setAttribute("y2", y2 + deltaY);
      node = group.childNodes.item(1);  // Spec
      AddDelta(node, "x2", deltaX);
      AddDelta(node, "y2", deltaY);
      node = group.childNodes.item(3);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
  }
}

function PaperDeleteSelectedShape() {
  if (SelectedGroup == null) return;

  var parent = SelectedGroup.parentNode;
  parent.removeChild(SelectedGroup);
  SelectedGroup = null;
}

function PaperMouseUp(evt)
{
  ControlDragEnd(evt.offsetX, evt.offsetY);
  DeselectPaper();
}

function PaperMouseMove(evt)
{
  ControlDragMove(evt.offsetX, evt.offsetY);
}

function SpecMouseMove(evt) {
  if (ControlInDragMode()) {
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}

function SpecMouseDown(evt) {
  SelectPaperElement(evt.target);

  DragX = evt.offsetX;
  DragY = evt.offsetY;
  ControlDragShapeStart();
}

function SpecMouseUp(evt) {
  ControlDragEnd(evt.offsetX, evt.offsetY);
}

function ResizerMouseMove(evt) {
  if (ControlInDragMode()) {
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}

function ResizerMouseDown(evt) {
  SelectPaperElement(evt.target);

  DragX = evt.offsetX;
  DragY = evt.offsetY;
  DragLine = evt.target.getAttribute("line_end");
  ControlDragSizeStart();
}

function ResizerMouseUp(evt) {
  ControlDragEnd(evt.offsetX, evt.offsetY, evt.target);
}

function KnotMouseUp(evt) {
  ControlDragEnd(evt.offsetX, evt.offsetY, evt.target);
}

function KnotMouseMove(evt) {
  if (ControlInDragMode()) {
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}
