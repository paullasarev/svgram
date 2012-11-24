
var PaperOffsetX = 0, PaperOffsetY = 0;
var ShapeColor = "black";
var ShapeStroke = 2;
var ShapeWidth = 200;
var ShapeHeight = 100;
var TextWidth = 100;
var TextHeight = 40;
var TextFontSize = 24;
var LineLength = 60;

var PaperElement = null;
var SelectedGroup = null;
var DragX = 0, DragY = 0;

function CreatePaper(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  var gridStep = 20;
  var canvas = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas"});
  PaperOffsetX = offset_x;
  PaperOffsetE = offset_y;
  
  var border = AddTagNS(canvas, svgNS, "rect", {id:"diagram.canvas.border", "x": offset_x + stroke, "y": offset_y + stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": borderColor, "stroke-width": stroke });
  SetAttr(border, {"filter":"url(#shadow)"}); 
  SetAttr(border, {onmouseup:"onmouseupPaper(evt)", onmouseup:"onmouseupPaper(evt)"});
  
  var grid = AddTagNS(svg, svgNS, "g", {id:"diagram.canvas.grid"});
  for(var x = gridStep + stroke ; x < width ; x += gridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1: offset_x + x, y1: offset_y + stroke, x2:offset_x + x, y2: offset_y + height - stroke,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + gridStep});
  }

  PaperElement = AddTagNS(svg, svgNS, "g", {id:"diagram.paper"});

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

function SelectPaperElement(spec) {
  if (SelectedGroup != null) {
    var oldspec = SelectedGroup.childNodes.item(1);
    SetAttr(oldspec, { "fill": "#aaa" });
    SetAttr(oldspec, { "opacity": 0 });
  }

  SelectedGroup = spec.parentNode;
  SetAttr(spec, { "fill": "yellow" });
  SetAttr(spec, { "opacity": 0.3 });
}

function AddKnot(group, pos_x, pos_y)
{
  var knot = AddTagNS(group, svgNS, "circle", {"cx": pos_x, "cy": pos_y, "r": 5
    , "opacity": 1
    , "fill": "blue", "stroke": "blue", "stroke-width": 10
    });
  return knot;
}

function PaperCreateRect(pos_x, pos_y)
{
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var rect = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ShapeWidth/2, "y": pos_y  - ShapeHeight/2,
    "width": ShapeWidth, "height": ShapeHeight,
    "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke
  });

  var rectSpec = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ShapeWidth/2, "y": pos_y - ShapeHeight/2,
    "width": ShapeWidth, "height": ShapeHeight,
    "opacity": 0
    , "fill": "#aaa", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "SpecMouseOver(evt)", "onmouseout": "SpecMouseOut(evt)"
    , "onmousedown": "SpecMouseDown(evt)", "onmouseup": "SpecMouseUp(evt)"
  });
  
  // Resizer
  var right = pos_x + ShapeWidth / 2;
  var bottom = pos_y + ShapeHeight / 2;
  var resizerSize = 10;
  AddTagNS(group, svgNS, "rect", {
    "x": right - resizerSize / 2, "y": bottom - resizerSize / 2,
    "width": resizerSize, "height": resizerSize,
    "opacity": 0
    , "fill": "blue", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "ResizerMouseOver(evt)", "onmouseout": "ResizerMouseOut(evt)"
    , "onmousedown": "ResizerMouseDown(evt)", "onmouseup": "ResizerMouseUp(evt)"
  });
  
  AddKnot(group, pos_x - ShapeWidth/2, pos_y);
  AddKnot(group, pos_x + ShapeWidth/2, pos_y);
  AddKnot(group, pos_x, pos_y - ShapeHeight/2);
  AddKnot(group, pos_x, pos_y + ShapeHeight/2);
}

function PaperCreateLine(pos_x, pos_y)
{
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  AddTagNS(group, svgNS, "line", {"x1": pos_x, "y1":pos_y - LineLength/2, "x2": pos_x, "y2": pos_y + LineLength/2
    , "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke });

  AddTagNS(group, svgNS, "line", {"x1": pos_x, "y1":pos_y - LineLength/2, "x2": pos_x, "y2": pos_y + LineLength/2
    , "fill": "#aaa", "stroke": GetShapeColor(), "stroke-width": 10
    , "onmouseover": "SpecMouseOver(evt)", "onmouseout": "SpecMouseOut(evt)"
    , "onmousedown": "SpecMouseDown(evt)", "onmouseup": "SpecMouseUp(evt)"
     });
  // Resizer 1
  var resizerSize = 10;
  AddTagNS(group, svgNS, "rect", {
    "x": pos_x - resizerSize / 2, "y": pos_y - LineLength / 2 - resizerSize / 2,
    "width": resizerSize, "height": resizerSize,
    "opacity": 0
    , "fill": "blue", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "ResizerMouseOver(evt)", "onmouseout": "ResizerMouseOut(evt)"
    , "onmousedown": "ResizerMouseDown(evt)", "onmouseup": "ResizerMouseUp(evt)"
  });
  // Resizer 2
  var resizerSize = 10;
  AddTagNS(group, svgNS, "rect", {
    "x": pos_x - resizerSize / 2, "y": pos_y + LineLength / 2 - resizerSize / 2,
    "width": resizerSize, "height": resizerSize,
    "opacity": 0
    , "fill": "blue", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "ResizerMouseOver(evt)", "onmouseout": "ResizerMouseOut(evt)"
    , "onmousedown": "ResizerMouseDown(evt)", "onmouseup": "ResizerMouseUp(evt)"
  });
}

function PaperCreateText(pos_x, pos_y)
{
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var text = AddTagNS(group, svgNS, "text", {
    x: pos_x, y: pos_y,
    "text-anchor": "middle",
    "alignment-baseline": "middle",
    "text-align": "start",
    "font-size": TextFontSize
  });
  var text_body = document.createTextNode("Text");
  text.appendChild(text_body); 
  
  var rectSpec = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - TextWidth/2, "y": pos_y  - TextHeight/2,
    "width": TextWidth, "height": TextHeight,
    "opacity": 0
    , "fill": "#aaa", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "SpecMouseOver(evt)", "onmouseout": "SpecMouseOut(evt)"
    , "onmousedown": "SpecMouseDown(evt)", "onmouseup": "SpecMouseUp(evt)"
  });
  // Resizer
  var right = pos_x + TextWidth / 2;
  var bottom = pos_y + TextHeight / 2;
  var resizerSize = 10;
  AddTagNS(group, svgNS, "rect", {
    "x": right - resizerSize / 2, "y": bottom - resizerSize / 2,
    "width": resizerSize, "height": resizerSize,
    "opacity": 0
    , "fill": "blue", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "ResizerMouseOver(evt)", "onmouseout": "ResizerMouseOut(evt)"
    , "onmousedown": "ResizerMouseDown(evt)", "onmouseup": "ResizerMouseUp(evt)"
  });
}

function AddDelta(node, attr, delta) {
  var val = parseInt(node.getAttribute(attr));
  node.setAttribute(attr, val + delta);
}

function PaperMoveShape(pos_x, pos_y) {
  var deltaX = pos_x - DragX;
  var deltaY = pos_y - DragY;
  for (var i = 0; i < SelectedGroup.childNodes.length; i++) {
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
    } else {
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
  }
}

function PaperResizeShape(pos_x, pos_y) {
  var deltaX = pos_x - DragX;
  var deltaY = pos_y - DragY;
  var node = SelectedGroup.childNodes.item(0);
  var tagName = node.tagName;
  if (tagName == "rect") {
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    //selector
    node = SelectedGroup.childNodes.item(1);
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    //resizer
    node = SelectedGroup.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);
    //knotes
    node = SelectedGroup.childNodes.item(3);
    AddDelta(node, "cy", deltaY/2);
    node = SelectedGroup.childNodes.item(4);
    AddDelta(node, "cx", deltaX);
    AddDelta(node, "cy", deltaY/2);
    node = SelectedGroup.childNodes.item(5);
    AddDelta(node, "cx", deltaX/2);
    node = SelectedGroup.childNodes.item(6);
    AddDelta(node, "cx", deltaX/2);
    AddDelta(node, "cy", deltaY);
  }
  else if (tagName == "text") {
    var fontsize = parseInt(node.getAttribute("font-size"));
    var specSize = parseInt(SelectedGroup.childNodes.item(1).getAttribute("height"));
    var scale = (specSize + deltaY) / specSize.toFixed(2);
    fontsize = Math.round(fontsize * scale);
    node.setAttribute("font-size", fontsize);
    AddDelta(node, "x", deltaX/2);
    AddDelta(node, "y", deltaY/2);

    node = SelectedGroup.childNodes.item(1);
    AddDelta(node, "width", deltaX);
    AddDelta(node, "height", deltaY);
    node = SelectedGroup.childNodes.item(2);
    AddDelta(node, "x", deltaX);
    AddDelta(node, "y", deltaY);
  }
  else if (tagName == "line") {
    var x1 = parseInt(node.getAttribute("x1"));
    var y1 = parseInt(node.getAttribute("y1"));
    var x2 = parseInt(node.getAttribute("x2"));
    var y2 = parseInt(node.getAttribute("y2"));
    var dist1 = (DragX - x1) * (DragX - x1) + (DragY - y1) * (DragY - y1);
    var dist2 = (DragX - x2) * (DragX - x2) + (DragY - y2) * (DragY - y2);
    if (dist1 < dist2) {
      node.setAttribute("x1", x1 + deltaX);
      node.setAttribute("y1", y1 + deltaY);
      node = SelectedGroup.childNodes.item(1);  // Spec
      AddDelta(node, "x1", deltaX);
      AddDelta(node, "y1", deltaY);
      node = SelectedGroup.childNodes.item(2);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
    else {
      node.setAttribute("x2", x2 + deltaX);
      node.setAttribute("y2", y2 + deltaY);
      node = SelectedGroup.childNodes.item(1);  // Spec
      AddDelta(node, "x2", deltaX);
      AddDelta(node, "y2", deltaY);
      node = SelectedGroup.childNodes.item(3);  // Resizer 1
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
  }
}

function PaperDeleteSelectedShape() {
  if (SelectedGroup == null)
    return;

  var parent = SelectedGroup.parentNode;
  parent.removeChild(SelectedGroup);
  SelectedGroup = null;
}

function onmousedownPaper(evt) {
  evt.preventDefault();

}
function onmouseupPaper(evt)
{
  evt.preventDefault();
  ControlDragEnd(evt.offsetX, evt.offsetY);
}

function SpecMouseOver(evt) {
  SetAttr(evt.target, { "opacity": 0.5 } );
}

function SpecMouseOut(evt) {
  if (SelectedGroup == evt.target.parentNode)
    SetAttr(evt.target, { "opacity": 0.3 });
  else
    SetAttr(evt.target, { "opacity": 0 });
}

function SpecMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = evt.offsetX; DragY = evt.offsetY;
  ControlDragShapeStart();
}

function SpecMouseUp(evt) {
  evt.preventDefault();
  ControlDragEnd(evt.offsetX, evt.offsetY);
}

function ResizerMouseOver(evt) {
  SetAttr(evt.target, { "opacity": 0.5 });
}

function ResizerMouseOut(evt) {
    SetAttr(evt.target, { "opacity": 0 });
}

function ResizerMouseDown(evt) {
  evt.preventDefault();
  SelectPaperElement(evt.target);

  DragX = evt.offsetX; DragY = evt.offsetY;
  ControlDragSizeStart();
}

function ResizerMouseUp(evt) {
  evt.preventDefault();
  ControlDragEnd(evt.offsetX, evt.offsetY);
}
