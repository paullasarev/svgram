var ControlMode = "none";
var ControlToolId = "";

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
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "pointer"});
}

function ControlDragShapeStart() {
  ControlMode = "dragShape";
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, { cursor: "move" });
}

function ControlDragSizeStart() {
  ControlMode = "dragSize";
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, { cursor: "se-resize" });
}

function ControlDragAbort()
{
  ControlMode = "none";

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, { cursor: "default" });
}

function ControlDragEnd(pos_x, pos_y, target)
{
  if (ControlMode == "none")
    return;

  var mode = ControlMode;
  if (mode == "dragTool") {
    ToolbarDragToolEnd();

    if (ControlToolId == "toolbar.icon.rect") {
      PaperCreateRect(pos_x, pos_y);
    }
    else if (ControlToolId == "toolbar.icon.line") {
      PaperCreateLine(pos_x, pos_y);
    }
    else if (ControlToolId == "toolbar.icon.text") {
      PaperCreateText(pos_x, pos_y);
    }
    else {
      alert(ControlToolId);
    }
  }
  
  ControlDragMove(pos_x, pos_y, target);

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "default"});
  
  ControlMode = "none";
}

function ControlDragMove(pos_x, pos_y, target)
{
  if (ControlMode == "none")
    return;

  var mode = ControlMode;

  if (mode == "dragShape") {
    PaperMoveShape(pos_x, pos_y);
  }
  else if (mode == "dragSize") {
    PaperResizeShape(pos_x, pos_y, target);
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
	var wnd = window.open("data:image/svg+xml;base64,\n" + copySvgBase64, "Save_Print", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
	// var wnd = window.open("data:image/svg+xml", "Svg diagram", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
  // wnd.document.write(copySvgString);
}
