var browserName=navigator.appName; 
if (browserName=="Microsoft Internet Explorer")
{
  alert("Sorry, Internet Explorer is not fully supported now. Please use instead Chrome or Firefox.");
}

function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  
  var svg = document.getElementById("diagram");

  CreatePaper(svg, width, height, 0, 0, 0, paperColor, paperBorderColor);
}

function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}