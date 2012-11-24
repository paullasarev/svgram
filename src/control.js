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

function ControlDragEnd(pos_x, pos_y)
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
    PaperResizeShape(pos_x, pos_y);
  }

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "default"});
}

function ControlDeleteShape() {
  PaperDeleteSelectedShape();
}

function ControlExportSvg() {
  alert("Export");
}