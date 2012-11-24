
function OnmousedownToolbarIcon(evt)
{
  evt.preventDefault();
  var id = evt.target.getAttributeNS(null,"id");
  ControlDragToolStart(id);
}

function OnmouseupToolbarIcon(evt)
{
  ControlDragAbort();
//  onmouseoverToolbarIcon(evt);
}

function OnclickToolbarIcon(evt) {
  var id = evt.target.getAttributeNS(null, "id");
  if (id == "toolbar.icon.delete") {
    ControlDeleteShape();
  }
}

function ToolbarDragToolEnd()
{
}

function CreateToolbar(root, width, height, color)
{
}
