// $Author$
// $Id$

var ControlMode = "none";
var ControlToolId = "";
var ControlWasMoved = false;
var ControlDblClickTimer = null;
var SvgramVersion = "12.12.16";

function ControlDragToolActive()
{
  if (ControlMode == "dragTool")
  {
    return true;
  }

  return false;
}

function ControlInDragMode()
{
  if (ControlMode != "none")
  {
    return true;
  }

  return false;
}

function ControlInDragSizeMode()
{
  return ControlMode == "dragSize";
}

function ControlDragToolStart(toolId)
{
  ControlMode = "dragTool";
  ControlToolId = toolId;
  ControlWasMoved = false;
  PaperSetCursor("move");
}

function ControlDragShapeStart() {
  if (ControlMode == "DblClick")
	  return;
  ControlMode = "dragShape";
  ControlWasMoved = false;
  PaperSetCursor("move");
}

function ControlDragSizeStart(orientation) {
  if (ControlMode == "DblClick")
	return;
  ControlMode = "dragSize";
  ControlWasMoved = false;
  ControlDragSizeOrientation = orientation;
  var cursor = (orientation ? orientation : "se-resize");
    
  PaperSetCursor(cursor);
}


function ControlDragPaperStart()
{
  ControlMode = "resizePaper";
  ControlWasMoved = false;
  PaperSetCursor("se-resize");
}

function ControlDragAbort()
{
  ControlMode = "none";
  PaperSetCursor("default");
  ControlDragSizeOrientation = null;
}

function ControlDragEnd(pos_x, pos_y, dragObject, connectObject)
{
  if (ControlMode == "none")
    return false;

  if (ControlMode == "DblClick") {
	  ControlMode = "none";
	  PaperEditProperties();
	  return false;
	}
	
  if (!ControlWasMoved) {
    PaperSetCursor("default");
      ControlMode = "DblClick";
    ControlDblClickTimer = setTimeout(function() { 
      ControlMode = "none";
      }, 300);
    
    return true;
  }
  
  if (ControlMode == "dragTool") {
    ToolbarDragToolEnd();
    
    var targetObject = null;
    if (connectObject) { 
      if (connectObject.getAttribute("shape")) {
        targetObject = connectObject;
        connectObject = null;
      } else {
        var group = connectObject.parentNode.parentNode;
        if (group.parentNode.getAttribute("id") != "diagram.paper.shapes") {
          targetObject = group.parentNode.parentNode;
        }
      }
    }

    if (ControlToolId == "toolbar.icon.rect") {
      PaperCreateRect(pos_x, pos_y, targetObject);
    }
    else if (ControlToolId == "toolbar.icon.line") {
      PaperCreateLine(pos_x, pos_y, connectObject, targetObject);
    }
    else if (ControlToolId == "toolbar.icon.text") {
      PaperCreateText(pos_x, pos_y, targetObject);
    }
    else {
      alert(ControlToolId);
    }
    
    ControlDragAbort();
    return true;
  }
  
  ControlDragMove(pos_x, pos_y, dragObject, connectObject, true);

  ControlDragAbort();
  
  return true;
}

function ControlGetShapeColor()
{
  var colorButton = document.getElementById('buttonColor');
  if (colorButton != null)
  {
    return colorButton.style.backgroundColor;
  }
  
  return null;
}

function ControlDragMove(pos_x, pos_y, dragObject, connectObject, isEnd)
{
  if (ControlMode == "none")
    return;

  ControlWasMoved = true;
  var mode = ControlMode;

  if (mode == "dragShape") {
    PaperMoveShape(pos_x, pos_y, isEnd);
  }
  else if (mode == "dragSize") {
    PaperResizeShape(pos_x, pos_y, dragObject, connectObject, isEnd, ControlDragSizeOrientation);
  }
  else if (mode == "resizePaper") {
    PaperResizePaper(pos_x, pos_y, isEnd);
  }
}

function ControlDeleteShape() {
  PaperDeleteSelectedShape();
  ControlDragAbort();
}

function ControlExportSvg() {
  DeselectPaper();
  OpenSavePrintWindow();
  ControlDragAbort();
}

function ControlAbout() {
		dhtmlx.modalbox({ 
			title:"Svg diagram editor", 
			text:"SVGram is an <a href='http://www.w3.org/TR/SVG/'>SVG</a>-based <a href='http://en.wikipedia.org/wiki/Diagram'>diagram</a> editor<br>Version: "+SvgramVersion+"<br>Please see details on <a href='http://code.google.com/p/svgram/'>code.google.com/p/svgram</a>",
      buttons:["OK"],
		});
}

function FilterSvgNodes(parent)
{
  var attr = parent.getAttribute('cursor');
  if (attr) {
     parent.removeAttribute('cursor');
  }
  
  var attributesToRemove = {svgram:"", onmouseover:"", onmouseup:"", onmousedown:"", onmouseout:""};
  next_node:
  for (var i = parent.childNodes.length - 1 ; i >= 0 ; i--) 
  {
    var node = parent.childNodes[i];
    
    if(node.tagName == "text")
      continue;
    
    for(var name in attributesToRemove)
    {
      attr = node.getAttribute(name);
      if (attr) {
        parent.removeChild(node);
        continue next_node;
      }
    }

    FilterSvgNodes(parent.childNodes[i]);
  }
}

function OpenSavePrintWindow()
{
	var svg = document.getElementById('diagram');
	var copySvg = svg.cloneNode(false);
	copySvg.id = 'newDiagram';
  
	var svg_paper_root = document.getElementById('diagram.paper').cloneNode(true);
	copySvg.appendChild(svg_paper_root);	
	FilterSvgNodes(copySvg);	
  
	var serializer = new XMLSerializer();
  var copySvgString = vkbeautify.xml(serializer.serializeToString(copySvg));
	var copySvgBase64 = Base64.encode(copySvgString);	
	var wnd = window.open("data:image/svg+xml;charset=utf-8;base64,\n" + copySvgBase64, "Save_Print", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
	// var wnd = window.open("data:image/svg+xml", "Svg diagram", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
  // wnd.document.write(copySvgString);
}
