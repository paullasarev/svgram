
function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var toolbarWidth = 100;
  var paperOffset = 110;
  
  var svg = AddTagNS(root, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": paperOffset + width + 50, "height": height + 50, draggable:"false"});
  SetAttr(svg, {"xmlns:xlink": xlinkNS, "xmlns": svgNS});

  CreateShadowFilter(svg);
  CreateToolbar(svg, toolbarWidth, height, paperColor);
  CreatePaper(svg, width, height, stroke, paperOffset, 0, paperColor, paperBorderColor);
}

function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}