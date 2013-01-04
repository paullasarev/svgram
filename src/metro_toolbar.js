
// function OnmousedownToolbarIcon(evt)
// {
  // evt.preventDefault();
  // var id = evt.target.getAttributeNS(null,"id");
  // ControlDragToolStart(id);
// }

// function OnmouseupToolbarIcon(evt)
// {
  // ControlDragAbort();
// }

// function OnclickToolbarIcon(evt) {
  // var id = evt.target.getAttributeNS(null, "id");
  // if (id == "toolbar.icon.delete") {
    // ControlDeleteShape();
  // } else if (id == "toolbar.icon.export") {
    // ControlExportSvg();
  // } else if (id == "toolbar.icon.about") {
    // ControlAbout();
  // }
// }

function ToolbarDragToolEnd()
{
}

define(["common"], function(Common) {
  function Toolbar() {
    this.Control = null;
  }
  
  Toolbar.prototype.CreateToolbar = function(root, width, height, color) 
  {
    var list = Common.Select(root, "#shape-button button");
    for(var index in list) {
      var node = list[index];
      Common.Bind(node, "mousedown", this, "OnMouseDown");
      Common.Bind(node, "mouseup", this, "OnMouseUp");
    }

    var list = Common.Select(root, "#shape-action-button button");
    for(var index in list) {
      var node = list[index];
      Common.Bind(node, "click", this, "OnClick");
    }
  };

  Toolbar.prototype.ToolbarDragToolEnd = function() {
  };

  Toolbar.prototype.OnMouseDown = function(evt)
  {
    evt.preventDefault();
    var id = evt.target.getAttributeNS(null,"id");
    this.Control.ControlDragToolStart(id);
  };

  Toolbar.prototype.OnMouseUp = function(evt)
  {
    this.Control.ControlDragAbort();
  };

  Toolbar.prototype.OnClick = function(evt) 
  {
    var id = evt.target.getAttributeNS(null, "id");
    if (id == "toolbar.icon.delete") {
      this.Control.ControlDeleteShape();
    } else if (id == "toolbar.icon.export") {
      this.Control.ControlExportSvg();
    } else if (id == "toolbar.icon.about") {
      this.Control.ControlAbout();
    }
  };
  
  return Toolbar;
});
