function ToolbarDragToolBegin(icon)
{
  var id = icon.getAttributeNS(null,"id");
  var select = document.getElementById("diagram.toolbar.select");
  var select_x = icon.getAttributeNS(null,"select_x");
  var select_y = icon.getAttributeNS(null,"select_y");

  SetAttr(select, {x: select_x, y: select_y, opacity: 1});
}

function ToolbarDragToolEnd()
{
  var select = document.getElementById("diagram.toolbar.select");
  SetAttr(select, {opacity: 0});
}

function onmouseoverToolbarIcon(evt)
{
  if (ControlDragToolActive())
  {
    return;
  }
  
  ToolbarDragToolBegin(evt.target);
}

function onmouseoutToolbarIcon(evt)
{
  if (ControlDragToolActive())
  {
    return;
  }
  
  ToolbarDragToolEnd();
}

function onmousedownToolbarIcon(evt)
{
  evt.preventDefault();
  var id = evt.target.getAttributeNS(null,"id");
  if (id == "toolbar.icon.delete") {
  } else if (id == "toolbar.icon.export") {
  } else {
    ControlDragToolStart(id);
  }
}

function onmouseupToolbarIcon(evt)
{
  var id = evt.target.getAttributeNS(null, "id");
  if (id == "toolbar.icon.delete") {
    ControlDeleteShape();
  } else if (id == "toolbar.icon.export") {
    ControlExportSvg();
  } else {
    ControlDragAbort();
  }
  onmouseoverToolbarIcon(evt);
}

function onmouseupToolbar(evt)
{
  ControlDragAbort();
}

function CreateToolbar(root, width, height, color)
{
  var stroke = 1;
  var toolbar = AddTagNS(root, svgNS, "g", {id:"diagram.toolbar", onmouseup:"onmouseupToolbar(evt)"});
  
  var border = AddTagNS(toolbar, svgNS, "rect", {id:"diagram.toolbar.border", "x": stroke, "y": stroke, 
    "width": width - stroke * 2, "height": height - stroke * 2,
    "fill": color, "stroke": "black", "stroke-width": 1 });
  SetAttr(border, {"filter":"url(#shadow)"});
  
  var icons = {
    "rect": "Inkscape_icons_draw_rectangle.svg",
    "line": "Inkscape_icons_connector_orthogonal.svg",
    "text": "Inkscape_icons_dialog_text_and_font.svg",
    //"crop": "crop.svg",
    "export": "Inkscape_icons_document_export.svg",
    //"import": "Inkscape_icons_document_import.svg",
    "delete": "Inkscape_icons_draw_eraser_delete_objects.svg",
  };

  var columns = 2;
  var col = 0, offsetX = 10, stepX = 40;
  var row = 0, offsetY = 5, stepY = 40;
  var select_h = 36;
  var select_w = 40;
  var select_rx = 8;
  var select = AddTagNS(toolbar, svgNS, "rect", {id: "diagram.toolbar.select", x:0, y:0, height:select_h, width:select_w, rx:select_rx, 
    fill: "#eee", "stroke-width": 1, "stroke": "#333", "stroke-opacity":0.5, "opacity": 0 });

  for(icon in icons)
  {
    var pos_x = offsetX + col * stepX;
    var pos_y = offsetY + row * stepY;
    var select_x = pos_x - 4;
    var select_y = pos_y - 2;
    
    var iconBody = icons[icon];
    var image;
    if (iconBody[0] == "M")
    {
      var path = AddTagNS(toolbar, svgNS, "path", {transform:"scale(1) translate(" + pos_x + "," + pos_y + ")", d: iconBody});
      SetAttr(path, {"stroke-width": 1, "fill-opacity": 1});
      SetAttr(path, { "stroke" : "#333"});
      SetAttr(path, { "fill": "#aaa"});
      image = AddTagNS(toolbar, svgNS, "rect", {x: pos_x, y: pos_y, height:32, width:32, "opacity": 0});
    }
    else
    {
      image = AddTagNS(toolbar, svgNS, "image", {x: pos_x, y: pos_y, height:32, width:32});
      SetAttrNS2(image, xlinkNS, {"xlink:href" : "icons/" + iconBody});
    }
    
    SetAttr(image, { id: "toolbar.icon." + icon
      , onmouseover:"onmouseoverToolbarIcon(evt)", onmouseout:"onmouseoutToolbarIcon(evt)"
      , onmousedown:"onmousedownToolbarIcon(evt)", onmouseup:"onmouseupToolbarIcon(evt)"
      , draggable:"false"
      , select_x:select_x, select_y:select_y});
    
    ++col;
    if (col == columns)
    {
      col = 0;
      ++row;
    }
  }
}

