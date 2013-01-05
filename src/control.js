// $Author$
// $Id$

define(["export_svg", "dhtmlx"], function(ExportSvg, Dhtmlx) {

Control.prototype.SvgramVersion = "12.12.16";

function Control() 
{
  this.Paper = null;
  this.Toolbar = null;
  this.ControlMode = "none";
  this.ControlToolId = "";
  this.ControlWasMoved = false;
  this.ControlDblClickTimer = null;
  this.ControlDragSizeOrientation = null;
}
  
Control.prototype.Init = function()
{
  this.ControlDragAbort();
};

Control.prototype.ControlDragToolStart = function(toolId)
{
  this.ControlMode = "dragTool";
  this.ControlToolId = toolId;
  this.ControlWasMoved = false;
  PaperSetCursor("move");
};

Control.prototype.ControlDragPaperStart = function ()
{
  this.ControlMode = "resizePaper";
  this.ControlWasMoved = false;
  PaperSetCursor("se-resize");
};

Control.prototype.ControlDragAbort = function()
{
  this.ControlMode = "none";
  PaperSetCursor("default");
  this.ControlDragSizeOrientation = null;
};

Control.prototype.ControlDragEnd = function(pos_x, pos_y, dragObject, connectObject)
{
  if (this.ControlMode == "none")
    return false;

  if (this.ControlMode == "DblClick") {
	  this.ControlMode = "none";
	  PaperEditProperties();
	  return false;
	}
	
  if (!this.ControlWasMoved) {
    PaperSetCursor("default");
      this.ControlMode = "DblClick";
    this.ControlDblClickTimer = setTimeout(function() { 
      this.ControlMode = "none";
      }, 300);
    
    return true;
  }
  
  if (this.ControlMode == "dragTool") {
    this.Toolbar.ToolbarDragToolEnd();
    
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

    if (this.ControlToolId == "toolbar.icon.rect") {
      PaperCreateRect(pos_x, pos_y, targetObject);
    }
    else if (this.ControlToolId == "toolbar.icon.line") {
      PaperCreateLine(pos_x, pos_y, connectObject, targetObject);
    }
    else if (this.ControlToolId == "toolbar.icon.text") {
      PaperCreateText(pos_x, pos_y, targetObject);
    }
    else {
      alert(this.ControlToolId);
    }
    
    this.ControlDragAbort();
    return true;
  }
  
  this.ControlDragMove(pos_x, pos_y, dragObject, connectObject, true);

  this.ControlDragAbort();
  
  return true;
};

Control.prototype.ControlDragMove = function(pos_x, pos_y, dragObject, connectObject, isEnd)
{
  if (this.ControlMode == "none")
    return;

  this.ControlWasMoved = true;
  var mode = this.ControlMode;

  if (mode == "dragShape") {
    PaperMoveShape(pos_x, pos_y, isEnd);
  }
  else if (mode == "dragSize") {
    PaperResizeShape(pos_x, pos_y, dragObject, connectObject, isEnd, this.ControlDragSizeOrientation);
  }
  else if (mode == "resizePaper") {
    PaperResizePaper(pos_x, pos_y, isEnd);
  }
};

Control.prototype.ControlInDragMode = function ()
{
  if (this.ControlMode != "none")
  {
    return true;
  }

  return false;
};

Control.prototype.ControlDragShapeStart = function()
{
  if (this.ControlMode == "DblClick")
	  return;
  this.ControlMode = "dragShape";
  this.ControlWasMoved = false;
  PaperSetCursor("move");
};

Control.prototype.ControlDragSizeStart = function(orientation)
{
  if (this.ControlMode == "DblClick")
    return;
  this.ControlMode = "dragSize";
  this.ControlWasMoved = false;
  this.ControlDragSizeOrientation = orientation;
  var cursor = (orientation ? orientation : "se-resize");
    
  PaperSetCursor(cursor);
};

Control.prototype.ControlDeleteShape = function()
{
  PaperDeleteSelectedShape();
  this.ControlDragAbort();
};

Control.prototype.ControlAbout = function()
{
  Dhtmlx.modalbox({ 
    title:"Svg diagram editor", 
    text:"SVGram is an <a href='http://www.w3.org/TR/SVG/'>SVG</a>-based <a href='http://en.wikipedia.org/wiki/Diagram'>diagram</a> editor<br>Version: "+this.SvgramVersion+"<br>Please see details on <a href='http://code.google.com/p/svgram/'>code.google.com/p/svgram</a>",
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

Control.prototype.ControlGetShapeColor = function()
{
  return this.Toolbar.GetShapeColor();
};

return Control;
});

