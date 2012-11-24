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

function ControlDragToolEnd()
{
  if (ControlMode != "dragTool")
  {
    return;
  }
    
  ControlMode = "none";
  
  ToolbarDragToolEnd();

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "default"});
}
