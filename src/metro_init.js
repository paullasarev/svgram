
function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  paperHeight = height;
  paperWidth = width;
  
  var svg = document.getElementById("diagram");

  // CreateShadowFilter(svg);
  // CreateToolbar(svg, 100, height, paperColor);
  CreatePaper(svg, width, height, 0, 0, 0, paperColor, paperBorderColor);
}

var paperWidth;
var paperHeight;
function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}