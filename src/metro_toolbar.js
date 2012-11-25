
function OnmousedownToolbarIcon(evt)
{
  evt.preventDefault();
  var id = evt.target.getAttributeNS(null,"id");
  ControlDragToolStart(id);
}

function OnmouseupToolbarIcon(evt)
{
  ControlDragAbort();
}

function OnclickToolbarIcon(evt) {
  var id = evt.target.getAttributeNS(null, "id");
  if (id == "toolbar.icon.delete") {
    ControlDeleteShape();
  } else if (id == "toolbar.icon.export") {
    ControlExportSvg();
  }
}

function ToolbarDragToolEnd()
{
}

function CreateToolbar(root, width, height, color)
{
}
