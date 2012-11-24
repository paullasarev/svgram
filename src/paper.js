
function onmouseupPaper(evt)
{
  evt.preventDefault();
  ControlDragToolEnd(evt.offsetX, evt.offsetY);
}

function onmousedownPaper(evt)
{
  evt.preventDefault();

}

var PaperOffsetX = 0, PaperOffsetY = 0;
var PaperElement;
var ShapeColor = "black";
var ShapeStroke = 2;
var ShapeWidth = 200;
var ShapeHeight = 100;

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

function PaperCreateRect(pos_x, pos_y)
{
  var rect = AddTagNS(PaperElement, svgNS, "rect", {"x": 0 + pos_x - ShapeWidth/2, "y": 0 + pos_y  - ShapeHeight/2, 
    "width": ShapeWidth, "height": ShapeHeight,
    "fill": "none", "stroke": GetShapeColor(), "stroke-width": ShapeStroke });
}

function PaperCreateLine(pos_x, pos_y)
{
}

function PaperCreateText(pos_x, pos_y)
{
}
