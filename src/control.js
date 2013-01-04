// $Author$
// $Id$

var ControlMode = "none";
var ControlToolId = "";
var ControlWasMoved = false;
var ControlDblClickTimer = null;
var SvgramVersion = "12.12.16";

function ControlInit() {
  ControlDragAbort();
}


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

define(["export_svg", "dhtmlx"], function(ExportSvg, Dhtmlx) {
  function Control() {
    this.Paper = null;
    this.Toolbar = null;
  }
  
  Control.prototype.Init = ControlInit;
  Control.prototype.ControlDragToolStart = ControlDragToolStart;
  Control.prototype.ControlDragAbort = ControlDragAbort;
  Control.prototype.ControlDeleteShape = ControlDeleteShape;
  
  Control.prototype.ControlAbout = function()
  {
		Dhtmlx.modalbox({ 
			title:"Svg diagram editor", 
			text:"SVGram is an <a href='http://www.w3.org/TR/SVG/'>SVG</a>-based <a href='http://en.wikipedia.org/wiki/Diagram'>diagram</a> editor<br>Version: "+SvgramVersion+"<br>Please see details on <a href='http://code.google.com/p/svgram/'>code.google.com/p/svgram</a>",
      buttons:["OK"],
		});
  };
  
  Control.prototype.ControlExportSvg = function()
  {
    this.Paper.DeselectPaper();
    this.ControlDragAbort();
    var exportSvg = new ExportSvg;
    exportSvg.Export();
  };
  
  return Control;
});

