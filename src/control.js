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

function ControlDragToolAbort()
{
  if (ControlMode != "dragTool")
  {
    return;
  }
    
  ControlMode = "none";
}

function ControlDragToolEnd(pos_x, pos_y)
{
  if (ControlMode != "dragTool")
  {
    return;
  }
    
  ControlMode = "none";
  
  ToolbarDragToolEnd();

  var diagram = document.getElementById("diagram");
  SetAttr(diagram, {cursor: "default"});

  if (ControlToolId == "toolbar.icon.rect")
  {
    PaperCreateRect(pos_x, pos_y);
  }
  else
  {
    alert(ControlToolId);
  }
}
