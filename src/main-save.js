var xlinkNS = "http://www.w3.org/1999/xlink";
var svgNS = "http://www.w3.org/2000/svg";

function SetAttr(element, attributes)
{
  for(var name in attributes)
  {
    element.setAttribute(name, attributes[name]);
  }
}

function SetAttrNS2(element, namespace, attributes)
{
  for(var name in attributes)
  {
    element.setAttributeNS(namespace, name, attributes[name]);
  }
}

function AddTagNS(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  parent.appendChild(tag);
  SetAttr(tag, attributes);
  return tag;
}

function CreateShadowFilter(paper)
{
  var defs = AddTagNS(paper, svgNS, "defs");
  var filter = AddTagNS(defs, svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
  AddTagNS(filter, svgNS, "feOffset", {in:"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
  AddTagNS(filter, svgNS, "feGaussianBlur", {in:"offOut", result:"blurOut", stdDeviation:"8"});
  AddTagNS(filter, svgNS, "feBlend", {in:"SourceGraphic", in2:"blurOut", mode:"normal" });
}

var State = "none";

function onmouseoverToolbarIcon(evt)
{
  if (State == "dragTool")
  {
    return;
  }
  
  var id = evt.target.getAttributeNS(null,"id");
  var select = document.getElementById("diagram.toolbar.select");
  var select_x = evt.target.getAttributeNS(null,"select_x");
  var select_y = evt.target.getAttributeNS(null,"select_y");

  SetAttr(select, {x: select_x, y: select_y, opacity: 1});
}

function onmouseoutToolbarIcon(evt)
{
  if (State == "dragTool")
  {
    return;
  }
  
  var select = document.getElementById("diagram.toolbar.select");
  SetAttr(select, {opacity: 0});
}

function DragStart()
{
  State = "dragTool";
  var paper = document.getElementById("diagram");
  SetAttr(paper, {cursor: "move"});
}

function onmousedownToolbarIcon(evt)
{
  evt.preventDefault();
  var id = evt.target.getAttributeNS(null,"id");
  if (id == "toolbar.icon.select")
  {
  OpenSavePrintWindow();
	return;
  }
  
  DragStart();
}

function DeleteAllChildIfItHave_svgram(parent)
{
	for (var i = 0; i < parent.childNodes.length; i++) {
		if ( parent.childNodes[i].hasOwnProperty('svgram') ) {
			parent.childNodes[i]. DELETE
			continue;
		}	
		//recursia		
		DeleteAllChildIfItHave_svgram(parent.childNodes[i]);
	}
}

var wnd;
var copySvg;

function OpenSavePrintWindow()
{
	if(copySvg == null)
	{
		var svg = document.getElementById('diagram');
		copySvg = svg.cloneNode(false);
		copySvg.id = 'newDiagram';
		copySvg.style.display = 'none';
		document.body.appendChild(copySvg);	
	}
	//clear all childs (if var copySvg = svg.cloneNode(true))
	//while (copySvg.hasChildNodes()) {
		//copySvg.removeChild(copySvg.firstChild);
	//}
	var svg_paper_root = document.getElementById('diagram.paper.root').cloneNode(true);
	DeleteAllChildIfItHave_svgram(svg_paper_root);	
	copySvg.appendChild(svg_paper_root);	
	var serializer = new XMLSerializer();
	copySvgString = serializer.serializeToString(copySvg);	
	copySvgBase64 = Base64.encode(copySvgString);	
	wnd = window.open("data:image/svg+xml;base64,\n" + copySvgBase64, "Save_Print", "menubar,width="+ paperWidth +",height=" + paperHeight);
}

function AddXmlVersionAndDoctypeTags(newWind)
{
//	newWind.document.replaceChild(svg, newWind.document.getElementById('svgforreplace'));
//	newWind.document.body.appendChild("br");//('<?xml version="1.0" encoding="utf-8" standalone="yes"?><!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">');
}

function DragEnd()
{
  if (State == "dragTool")
  {
    State = "none";
    
    var select = document.getElementById("diagram.toolbar.select");
    SetAttr(select, {opacity: 0});

    var paper = document.getElementById("diagram");
    SetAttr(paper, {cursor: "default"});
  }
}

function onmouseupPaper(evt)
{
  DragEnd();
}

function onmouseupToolbarIcon(evt)
{
  DragEnd();
  onmouseoverToolbarIcon(evt);
}

function onmouseupToolbar(evt)
{
  DragEnd();
}

function CreateToolbar(root, width, height, color)
{
  var stroke = 1;
  var toolbar = AddTagNS(root, svgNS, "g", {id:"diagram.toolbar", onmouseup:"onmouseupToolbar(evt)"});
  
  var border = AddTagNS(toolbar, svgNS, "rect", {id:"diagram.toolbar.border", "x": stroke, "y": stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": color, "stroke": "black", "stroke-width": 1 });
  SetAttr(border, {"filter":"url(#shadow)"});
  
  var icons = {
    "rect1": "M3.083,7.333v16.334h24.833V7.333H3.083z M19.333,20.668H6.083V10.332h18.25V20.668z",
    "rect2": "Inkscape_icons_draw_rectangle.svg",
    "line1": "M21.786,12.876l7.556-4.363l-7.556-4.363v2.598H2.813v3.5h18.973V12.876zM10.368,18.124l-7.556,4.362l7.556,4.362V24.25h18.974v-3.501H10.368V18.124z",
    "line2": "Inkscape_icons_connector_orthogonal.svg",
    "crop1": "crop.svg",
    "crop2": "crop2.svg",
    "select":"M24.303,21.707V8.275l4.48-4.421l-2.021-2.048l-4.126,4.07H8.761V2.083H5.882v3.793H1.8v2.877h4.083v15.832h15.542v4.609h2.878v-4.609H29.2v-2.878H24.303zM19.72,8.753L8.761,19.565V8.753H19.72zM10.688,21.706l10.735-10.591l0.001,10.592L10.688,21.706z",
  };

  var columns = 2;
  var col = 0, offsetX = 10, stepX = 40;
  var row = 0, offsetY = 5, stepY = 40;
  var select_h = 36;
  var select_w = 40;
  var select_rx = 8;
  var select = AddTagNS(toolbar, svgNS, "rect", {id: "diagram.toolbar.select", x:0, y:0, height:select_h, width:select_w, rx:select_rx, 
    fill: "#eee", "stroke-width": 1, "stroke": "#333", "stroke-opacity":0.5, "opacity": 0 });

  for(icon in icons)
  {
    var pos_x = offsetX + col * stepX;
    var pos_y = offsetY + row * stepY;
    var select_x = pos_x - 4;
    var select_y = pos_y - 2;
    
    var iconBody = icons[icon];
    var image;
    if (iconBody[0] == "M")
    {
      var path = AddTagNS(toolbar, svgNS, "path", {transform:"scale(1) translate(" + pos_x + "," + pos_y + ")", d: iconBody});
      SetAttr(path, {"stroke-width": 1, "fill-opacity": 1});
      SetAttr(path, { "stroke" : "#333"});
      SetAttr(path, { "fill": "#aaa"});
      image = AddTagNS(toolbar, svgNS, "rect", {x: pos_x, y: pos_y, height:32, width:32, "opacity": 0});
    }
    else
    {
      image = AddTagNS(toolbar, svgNS, "image", {x: pos_x, y: pos_y, height:32, width:32});
      SetAttrNS2(image, xlinkNS, {"xlink:href" : "icons/" + iconBody});
    }
    
    SetAttr(image, { id: "toolbar.icon." + icon
      , onmouseover:"onmouseoverToolbarIcon(evt)", onmouseout:"onmouseoutToolbarIcon(evt)"
      , onmousedown:"onmousedownToolbarIcon(evt)", onmouseup:"onmouseupToolbarIcon(evt)"
      , draggable:"false"
      , select_x:select_x, select_y:select_y});
    
    ++col;
    if (col == columns)
    {
      col = 0;
      ++row;
    }
  }
}

var paperWidth;
var paperHeight;
var svg;

function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var gridStep = 20;
  var toolbarWidth = 100;
  var paperOffset = 110;
  paperHeight = height;
  paperWidth = width;
  
  svg = CreateSvgRootAndHeaders(root, paperOffset + width + 50, height + 50);

  CreateShadowFilter(svg);
  CreateToolbar(svg, toolbarWidth, height, paperColor);
  
  var paper = AddTagNS(svg, svgNS, "g", {id:"diagram.paper", onmouseup:"onmouseupPaper(evt)"});
  
  var border = AddTagNS(paper, svgNS, "rect", {id:"diagram.paper.border", "x": paperOffset + stroke, "y": stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": paperColor, "stroke": paperBorderColor, "stroke-width": stroke });
  SetAttr(border, {"filter":"url(#shadow)"}); 
  
  var grid = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.grid"});
  for(var x = gridStep + stroke ; x < width ; x += gridStep)
  {
    AddTagNS(grid, svgNS, "line", {x1:paperOffset + x, y1: stroke, x2:paperOffset + x, y2: height - stroke,
      "stroke":paperBorderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + gridStep});
  }

  var d_root = AddTagNS(paper, svgNS, "g", {id:"diagram.paper.root"});
  
  var rect1 = AddTagNS(d_root, svgNS, "rect", {"x": paperOffset + 100, "y": 100, 
    "width": 200, "height": 100, "fill": "none", "stroke": "black", "stroke-width": 2 });
  var rect1 = AddTagNS(d_root, svgNS, "rect", {"x": paperOffset + 150, "y": 150, 
    "width": 200, "height": 100, "fill": "none", "stroke": "black", "stroke-width": 2 });
  
}
function CreateSvgRootAndHeaders(root, width, height)
{
  var svg = AddTagNS(root, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": width, "height": height, draggable:"false"});
  SetAttr(svg, {"xmlns:xlink": xlinkNS, "xmlns": svgNS});
  return svg;
}

function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}