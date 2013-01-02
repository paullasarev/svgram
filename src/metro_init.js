// $Author$
// $Id$

var browserName=navigator.appName; 
if (browserName=="Microsoft Internet Explorer")
{
  //alert("Sorry, Internet Explorer is not fully supported now. Please use instead Chrome or Firefox.");
}

function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  
  var svg = document.getElementById("diagram");
  SetAttr(svg, {"width" : width, "height" : height});

  CreatePaper(svg, width, height, stroke, 0, 0, paperColor, paperBorderColor);
}

function Init(root)
{
  var width = (window.innerWidth||document.documentElement.offsetWidth) - 200;
  var height = (window.innerHeight||document.documentElement.offsetHeight) - 20;
  CreateSvg(root, width, height, 2);
}