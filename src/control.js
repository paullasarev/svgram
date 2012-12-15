// $Author$
// $Id$

var ControlMode = "none";
var ControlToolId = "";
var ControlWasMoved = false;
var ControlDblClickTimer = null;

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

function ControlDragSizeStart() {
  if (ControlMode == "DblClick")
	return;
  ControlMode = "dragSize";
  ControlWasMoved = false;
  PaperSetCursor("se-resize");
}

function ControlDragAbort()
{
  ControlMode = "none";
  PaperSetCursor("default");
}

function ControlDragEnd(pos_x, pos_y, dragObject, connectObject)
{
  if (ControlMode == "none")
    return;

  if (ControlMode == "DblClick") {
	  ControlMode = "none";
	  PaperEditProperties();
	  return;
	}
	
  if (!ControlWasMoved) {
	PaperSetCursor("default");
    ControlMode = "DblClick";
	ControlDblClickTimer = setTimeout(function() { 
	  ControlMode = "none";
    }, 300);
	
	return;
  }
  
  if (ControlMode == "dragTool") {
    ToolbarDragToolEnd();

    if (ControlToolId == "toolbar.icon.rect") {
      PaperCreateRect(pos_x, pos_y);
    }
    else if (ControlToolId == "toolbar.icon.line") {
      PaperCreateLine(pos_x, pos_y, connectObject);
    }
    else if (ControlToolId == "toolbar.icon.text") {
      PaperCreateText(pos_x, pos_y);
    }
    else {
      alert(ControlToolId);
    }
  }
  
  ControlDragMove(pos_x, pos_y, dragObject, connectObject, true);

  ControlMode = "none";
  PaperSetCursor("default");
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
    PaperResizeShape(pos_x, pos_y, dragObject, connectObject, isEnd);
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
			text:"SVGram is a svg-based diagram editor<br><br>The project home is <a href='http://code.google.com/p/svgram/'>code.google.com/p/svgram</a>",
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
