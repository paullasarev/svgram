var ControlMode = "none";

function ControlDragToolActive()
{
  if (ControlMode == "dragTool")
  {
    return true;
  }

  return false;
}

function ControlDragToolStart()
{
  ControlMode = "dragTool";
  var paper = document.getElementById("diagram");
  SetAttr(paper, {cursor: "move"});
}

function ControlDragToolEnd()
{
  if (ControlMode == "dragTool")
  {
    ControlMode = "none";
    
    var select = document.getElementById("diagram.toolbar.select");
    SetAttr(select, {opacity: 0});

    var paper = document.getElementById("diagram");
    SetAttr(paper, {cursor: "default"});
  }
}
