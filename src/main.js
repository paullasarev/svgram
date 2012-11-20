function SetAttrNS(element, attributes)
{
  for(var name in attributes)
  {
    element.setAttributeNS(null, name, attributes[name]);
  }
}

function AddTagNS(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  parent.appendChild(tag);
  SetAttrNS(tag, attributes);
  return tag;
}

function CreateSvg(root, width, height, stroke)
{
  var svgNS = "http://www.w3.org/2000/svg";
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var gridStep = 20;
  
  var svg = AddTagNS(root, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": width + 50, "height": height + 50});

  var paper = AddTagNS(svg, svgNS, "g", {id:"diagram.paper"});

  var defs = AddTagNS(paper, svgNS, "defs");
  var filter = AddTagNS(defs, svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
  AddTagNS(filter, svgNS, "feOffset", {in:"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
  AddTagNS(filter, svgNS, "feGaussianBlur", {in:"offOut", result:"blurOut", stdDeviation:"8"});
  AddTagNS(filter, svgNS, "feBlend", {in:"SourceGraphic", in2:"blurOut", mode:"normal" });
  
  var border = AddTagNS(paper, svgNS, "rect", {id:"diagram.paper.border", "x":stroke, "y":stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": paperBorderColor, "stroke-width": stroke });
  SetAttrNS(border, {"filter":"url(#shadow)"}); 
  
  var grid = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.grid"});
  for(var x = gridStep ; x < width ; x += gridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1:x, y1:stroke, x2:x, y2: height - stroke,
      "stroke":paperBorderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + gridStep});
  }
}

function Init(root)
{
  CreateSvg(root, 800, 600, 2);
}