// $Id$

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperWidth = 0, PaperHeight = 0;
var ShapeColor = "black";
var ShapeStroke = 2;
var ShapeWidth = 200;
var ShapeHeight = 100;
var TextWidth = 100;
var TextHeight = 40;
var TextFontSize = 24;
var LineLength = 60;
var ResizerSize = 8;
var KnotRadius = 4;
var KnotIDPrefix = "knot";
var SpecOpacity = 0.3;
var SpecStrokeWidth = 8;

var PaperElement = null;
var PaperLinesElement = null;
var SelectedGroup = null;
var DragX = 0, DragY = 0;
//var KnotNode = null;

function CreatePaper(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  var gridStep = 20;
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
  for(var x = gridStep + stroke ; x < width ; x += gridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1: offset_x + x, y1: offset_y + stroke, x2:offset_x + x, y2: offset_y + height - stroke,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + gridStep});
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
    //SetAttr(oldspec, { "fill": "#aaa" });
    SetAttr(oldspec, { "opacity": 0 });
  }
}

function SelectPaperElement(spec) {
  DeselectPaper();

  SelectedGroup = spec.parentNode;
  //SetAttr(spec, { "fill": "yellow" });
  SetAttr(spec, { "opacity": SpecOpacity });
}

function AddKnot(group, pos_x, pos_y)
{
  var node = AddTagNS(group, svgNS, "circle", {"cx": pos_x, "cy": pos_y, "r": KnotRadius
    , "opacity": SpecOpacity
    , "fill": "blue", "stroke": "blue", "stroke-width": 7
    , "onmouseup": "KnotMouseUp(evt)"
    , "onmousemove": "KnotMouseMove(evt)"
    //, "onmouseout": "KnotMouseOut(evt)"
    , "pointer-events": "painted"
    , "id": KnotIDPrefix + Math.uuid(15)
    , "class": "knot"
    , "svgram": "knot"
    });
    
  //node.addEventListener("mouseup", KnotMouseUp, true);
  //node.addEventListener("mousemove", KnotMouseMove, true);
  //node.addEventListener("mouseout", KnotMouseOut, true);
  //node.addEventListener("mouseover", KnotMouseMove, true);
  return node;
}

function AddResizer(group, pos_x, pos_y)
{
  var node = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ResizerSize / 2, "y": pos_y - ResizerSize / 2,
    "width": ResizerSize, "height": ResizerSize,
    "opacity": SpecOpacity
    , "fill": "blue", "stroke": "blue", "stroke-width": SpecStrokeWidth
    //, "onmouseover": "ResizerMouseOver(evt)", "onmouseout": "ResizerMouseOut(evt)"
    , "onmousemove": "ResizerMouseMove(evt)"
    , "onmousedown": "ResizerMouseDown(evt)"
    , "onmouseup": "ResizerMouseUp(evt)"
    , "id": KnotIDPrefix + Math.uuid(15)
  });
  
  //node.addEventListener("mouseup", ResizerMouseUp, false);
  //node.addEventListener("mousemove", ResizerMouseMove, false);
  return node;
}

function AddSpecAttr(spec)
{
  var color = GetShapeColor();
  SetAttr(spec, { 
    "fill": color, "opacity": 0
    , "stroke": color, "stroke-width": SpecStrokeWidth
    //, "onmouseover": "SpecMouseOver(evt)", "onmouseout": "SpecMouseOut(evt)"
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

  AddResizer(group, left, top);
  AddResizer(group, right, bottom);
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

function ConnectKnots(knot1, knot2) {
  var knot1id = knot1.getAttribute("id");
  var knot2id = knot2.getAttribute("id");
  //alert(knot1id + " " + knot2id);
  knot1.setAttribute("connknot", knot2id);
  knot2.setAttribute("connknot", knot1id);
}

function AdjustConnKnot(node, deltaX, deltaY) {
  var connknot = node.getAttribute("connknot");
  if (!connknot) return;
  AdjustKnot(connknot, deltaX, deltaY);
}

function AdjustKnot(knotid, deltaX, deltaY) {
  var knot = document.getElementById(knotid);
  if (!knot) 
    return;
  
  PaperResizeShapeDelta(deltaX, deltaY, knot.parentNode, knot);
}

function AddDelta(node, attr, delta) {
  var val = parseInt(node.getAttribute(attr));
  node.setAttribute(attr, val + delta);
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
  PaperResizeShapeDelta(deltaX, deltaY, SelectedGroup, target);
 
  DragX = pos_x;
  DragY = pos_y;
}
function PaperResizeShapeDelta(deltaX, deltaY, group, target/*optional*/) {
  var node = group.childNodes.item(0);
  var tagName = node.tagName;
  if (tagName == "rect") {
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    //selector
    node = group.childNodes.item(1);
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    //resizer
    node = group.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);
    //knotes
    node = group.childNodes.item(3);
    AddDelta(node, "cy", deltaY / 2);
    AdjustConnKnot(node, 0, deltaY / 2);
    node = group.childNodes.item(4);
    AddDelta(node, "cx", deltaX);
    AddDelta(node, "cy", deltaY/2);
    AdjustConnKnot(node, deltaX, deltaY / 2);
    node = group.childNodes.item(5);
    AddDelta(node, "cx", deltaX/2);
    AdjustConnKnot(node, deltaX/2, 0);
    node = group.childNodes.item(6);
    AddDelta(node, "cx", deltaX/2);
    AddDelta(node, "cy", deltaY);
    AdjustConnKnot(node, deltaX / 2, deltaY);
  }
  else if (tagName == "text") {
    var fontsize = parseInt(node.getAttribute("font-size"));
    var specSize = parseInt(group.childNodes.item(1).getAttribute("height"));
    var scale = (specSize + deltaY) / specSize.toFixed(2);
    fontsize = Math.round(fontsize * scale);
    node.setAttribute("font-size", fontsize);
    AddDelta(node, "x", deltaX/2);
    AddDelta(node, "y", deltaY/2);

    node = group.childNodes.item(1);
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    node = group.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);
  }
  else if (tagName == "line") {
    var x1 = parseInt(node.getAttribute("x1"));
    var y1 = parseInt(node.getAttribute("y1"));
    var x2 = parseInt(node.getAttribute("x2"));
    var y2 = parseInt(node.getAttribute("y2"));
    var sourceX = DragX;
    var sourceY = DragY;
    var dist1 = (sourceX - x1) * (sourceX - x1) + (sourceY - y1) * (sourceY - y1);
    var dist2 = (sourceX - x2) * (sourceX - x2) + (sourceY - y2) * (sourceY - y2);
    if (dist1 < dist2) {
      node.setAttribute("x1", x1 + deltaX);
      node.setAttribute("y1", y1 + deltaY);
      node = group.childNodes.item(1);  // Spec
      AddDelta(node, "x1", deltaX);
      AddDelta(node, "y1", deltaY);
      node = group.childNodes.item(2);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
      if (target && target.tagName == "circle") {
        var knot = group.childNodes.item(2);
        ConnectKnots(knot, target);
      }
    }
    else {
      node.setAttribute("x2", x2 + deltaX);
      node.setAttribute("y2", y2 + deltaY);
      node = group.childNodes.item(1);  // Spec
      AddDelta(node, "x2", deltaX);
      AddDelta(node, "y2", deltaY);
      node = group.childNodes.item(3);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
      if (target && target.tagName == "circle") {
        var knot = group.childNodes.item(3);
        ConnectKnots(knot, target);
      }
    }
  }
}

function PaperDeleteSelectedShape() {
  if (SelectedGroup == null) return;

  var parent = SelectedGroup.parentNode;
  parent.removeChild(SelectedGroup);
  SelectedGroup = null;
}

function onmousedownPaper(evt) {
  evt.preventDefault();
}

function PaperMouseUp(evt)
{
  //evt.preventDefault();
  ControlDragEnd(evt.offsetX, evt.offsetY);
  DeselectPaper();
}

function PaperMouseMove(evt)
{
  //evt.preventDefault();
  ControlDragMove(evt.offsetX, evt.offsetY);
}

function SpecMouseMove(evt) {
  //evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}

// function SpecMouseOver(evt) {
  // //evt.preventDefault();
  // if (ControlInDragMode())
    // return;
  // //SetAttr(evt.target, { "opacity": SpecOpacity } ); //0.5
// }

function SpecMouseOut(evt) {
  //evt.preventDefault();
  if (ControlInDragMode())
    return;
  //if (SelectedGroup == evt.target.parentNode)
  //  SetAttr(evt.target, { "opacity": SpecOpacity });
  ///else
  //SetAttr(evt.target, { "opacity": 0 });
}

function SpecMouseDown(evt) {
  //evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = evt.offsetX;
  DragY = evt.offsetY;
  ControlDragShapeStart();
}

function SpecMouseUp(evt) {
  //evt.preventDefault();
  ControlDragEnd(evt.offsetX, evt.offsetY);
}

// function ResizerMouseOver(evt) {
  // //evt.preventDefault();
  // //SetAttr(evt.target, { "opacity": SpecOpacity });
// }

function ResizerMouseOut(evt) {
  //evt.preventDefault();
  //SetAttr(evt.target, { "opacity": 0 });
}

function ResizerMouseMove(evt) {
  //evt.preventDefault();
  if (ControlInDragMode()) {
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}

function ResizerMouseDown(evt) {
  //evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = evt.offsetX;
  DragY = evt.offsetY;
  ControlDragSizeStart();
}

function ResizerMouseUp(evt) {
  //evt.preventDefault();
  //  alert("ResizerMouseUp");
  //alert("ResizerMouseUp");
  // if (KnotNode == null)
    // alert("KnotNode null");
  // else
    // alert("KnotNode set");
  ControlDragEnd(evt.offsetX, evt.offsetY, evt.target);
  //KnotNode = null;
}

function KnotMouseUp(evt) {
  //evt.preventDefault();
  //alert('KnotMouseUp');
    
  ControlDragEnd(evt.offsetX, evt.offsetY, evt.target);
}

// function KnotMouseOut(evt) {
  // KnotNode = null;
// }

function KnotMouseMove(evt) {
  //evt.preventDefault();
  //alert('KnotMouseMove');
  if (ControlInDragMode()) {
//    KnotNode = evt.target;
    ControlDragMove(evt.offsetX, evt.offsetY);
  }
}

