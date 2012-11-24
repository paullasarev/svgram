
var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperElement = null;
var ShapeColor = "black";
var ShapeStroke = 2;
var ShapeWidth = 200;
var ShapeHeight = 100;
var TextWidth = 100;
var TextHeight = 50;
var SelectedGroup = null;
var LineLength = 60;
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

function PaperCreateRect(pos_x, pos_y)
{
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var rect = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ShapeWidth/2, "y": pos_y  - ShapeHeight/2,
    "width": ShapeWidth, "height": ShapeHeight,
    "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke
  });

  var rectSpec = AddTagNS(group, svgNS, "rect", {
    "x": pos_x - ShapeWidth/2, "y": pos_y  - ShapeHeight/2,
    "width": ShapeWidth, "height": ShapeHeight,
    "opacity": 0
    , "fill": "#aaa", "stroke": "blue", "stroke-width": 10
    , "onmouseover": "SpecMouseOver(evt)", "onmouseout": "SpecMouseOut(evt)"
    , "onmousedown": "SpecMouseDown(evt)", "onmouseup": "SpecMouseUp(evt)"
  });
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
}

function PaperCreateText(pos_x, pos_y)
{
  var group = AddTagNS(PaperElement, svgNS, "g", { } );
  var text = AddTagNS(group, svgNS, "text", {x: pos_x, y: pos_y, "text-anchor":"middle"}); 
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
    else {
      AddDelta(node, "x", deltaX);
      AddDelta(node, "y", deltaY);
    }
  }
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

