function onmouseoverToolbarIcon(evt)
{
  if (ControlDragToolActive())
  {
    return;
  }
  
  var id = evt.target.getAttributeNS(null,"id");
  var select = document.getElementById("diagram.toolbar.select");
  var select_x = evt.target.getAttributeNS(null,"select_x");
  var select_y = evt.target.getAttributeNS(null,"select_y");

  SetAttr(select, {x: select_x, y: select_y, opacity: 1});
}

function onmouseoutToolbarIcon(evt)
{
  if (ControlDragToolActive())
  {
    return;
  }
  
  var select = document.getElementById("diagram.toolbar.select");
  SetAttr(select, {opacity: 0});
}

function onmousedownToolbarIcon(evt)
{
  evt.preventDefault();
  ControlDragToolStart();
}

function onmouseupToolbarIcon(evt)
{
  ControlDragToolEnd();
  onmouseoverToolbarIcon(evt);
}

function onmouseupToolbar(evt)
{
  ControlDragToolEnd();
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
    "rect1": "M3.083,7.333v16.334h24.833V7.333H3.083z M19.333,20.668H6.083V10.332h18.25V20.668z",
    "rect2": "Inkscape_icons_draw_rectangle.svg",
    "line1": "M21.786,12.876l7.556-4.363l-7.556-4.363v2.598H2.813v3.5h18.973V12.876zM10.368,18.124l-7.556,4.362l7.556,4.362V24.25h18.974v-3.501H10.368V18.124z",
    "line2": "Inkscape_icons_connector_orthogonal.svg",
    "crop1": "crop.svg",
    "crop2": "crop2.svg",
    "select":"M24.303,21.707V8.275l4.48-4.421l-2.021-2.048l-4.126,4.07H8.761V2.083H5.882v3.793H1.8v2.877h4.083v15.832h15.542v4.609h2.878v-4.609H29.2v-2.878H24.303zM19.72,8.753L8.761,19.565V8.753H19.72zM10.688,21.706l10.735-10.591l0.001,10.592L10.688,21.706z",
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
