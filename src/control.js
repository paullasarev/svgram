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

function ControlDragToolStart(toolId)
{
  ControlMode = "dragTool";
  ControlToolId = toolId;
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "move"});
}

function ControlDragShapeStart() {
  ControlMode = "dragShape";
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, { cursor: "move" });
}

function ControlDragSizeStart() {
  ControlMode = "dragSize";
  var diagram = document.getElementById("diagram");
  SetAttr(diagram, { cursor: "move" });
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
  ControlMode = "none";

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
  else if (mode == "dragShape") {
    PaperMoveShape(pos_x, pos_y);
  }
  else if (mode == "dragSize") {
    PaperResizeShape(pos_x, pos_y, target);
  }

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "default"});
}

function ControlDeleteShape() {
  PaperDeleteSelectedShape();
}

function ControlExportSvg() {
  DeselectPaper();
  OpenSavePrintWindow();
}

function DeleteAllChildIfItHave_svgram(parent)
{
  for (var i = parent.childNodes.length-1; i >=0; i--) {
    var node = parent.childNodes[i];
    var attrSvgram = node.getAttribute('svgram');
    if (attrSvgram!= null && attrSvgram != "") {
      parent.removeChild(node);
      continue;
    }

    DeleteAllChildIfItHave_svgram(parent.childNodes[i]);
  }
}

var copySvg;
function OpenSavePrintWindow()
{
	var svg = document.getElementById('diagram');
	copySvg = svg.cloneNode(false);
	copySvg.id = 'newDiagram';
	var svg_paper_root = document.getElementById('diagram.paper').cloneNode(true);
	DeleteAllChildIfItHave_svgram(svg_paper_root);	
	copySvg.appendChild(svg_paper_root);	
	var serializer = new XMLSerializer();
	copySvgString = serializer.serializeToString(copySvg);	
	copySvgBase64 = Base64.encode(copySvgString);	
	var wnd = window.open("data:image/svg+xml;base64,\n" + copySvgBase64, "Save_Print", "menubar,width="+ paperWidth +",height=" + paperHeight);
}