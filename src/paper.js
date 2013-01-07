// $Author$
// $Id$

define(["uuid","common","shape_context", "shape","rect","line","text"], 
function(Uuid, Common, ShapeContext, Shape, Rect, Line, Text) {
  
function Paper() 
{
  this.Control = null;
  
  this.PaperOffsetX = 0;
  this.PaperOffsetY = 0;
  
  this.PaperWidth = 0;
  this.PaperHeight = 0;
  
  this.PaperClientOffsetX = 0;
  this.PaperClientOffsetY = 0;
  
  this.PaperElement = null;
  this.PaperLinesElement = null;
  this.PaperResizer = null;
  this.PaperSpec = null;
  this.PaperSvg = null;
  this.PaperGrid = null;

  this.GridStep = 20;
  this.PaperStroke = null;
  this.PaperRoot = null;
  this.SelectedGroup = null;

  this.DragX = 0;
  this.DragY = 0;
  
  this.DragObject = null;
  this.Context = null;
  
}

Paper.prototype.EventOffsetX = function(evt)
{
  return evt.clientX - this.PaperClientOffsetX;
}

Paper.prototype.EventOffsetY = function(evt)
{
  return evt.clientY - this.PaperClientOffsetY;
}
  
Paper.prototype.CreatePaper = function(svg, width, height, stroke, offset_x, offset_y, paperColor, borderColor)
{
  this.PaperSvg = svg;
  var paperGroup = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.canvas"});
  this.PaperOffsetX = offset_x;
  this.PaperOffsetY = offset_y;
  this.PaperWidth = width;
  this.PaperHeight = height;
  PaperBorderColor = borderColor;
  this.PaperStroke = stroke;

  this.PaperSpec = Common.AddTagNS(paperGroup, Common.svgNS, "rect", {id:"diagram.canvas.border", 
    "x": offset_x + stroke, "y": offset_y + stroke, 
    "width": width - stroke * 2, "height" : height - stroke * 2,
    "fill": paperColor, 
    "stroke": borderColor, 
    "stroke-width": stroke });
  //Common.SetAttr(this.PaperSpec, {"filter":"url(#shadow)"}); 
  Common.Bind(this.PaperSpec, "mousedown", this, "PaperMouseDown");
  Common.Bind(this.PaperSpec, "mousemove", this, "PaperMouseMove");
  Common.Bind(this.PaperSpec, "mouseup", this, "PaperMouseUp");
  
  this.PaperGrid = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.canvas.grid"});
  this.CreateGrid(this.PaperGrid, width, height, borderColor);

  this.PaperRoot = Common.AddTagNS(svg, Common.svgNS, "g", {id:"diagram.paper"});
  this.PaperLinesElement = Common.AddTagNS(this.PaperRoot, Common.svgNS, "g", {id:"diagram.paper.lines"});
  this.PaperElement = Common.AddTagNS(this.PaperRoot, Common.svgNS, "g", {id:"diagram.paper.shapes"});
  
  this.CalculatePaperClientOffset(this.PaperSvg);

  this.Context = this.CreateContext(this.PaperElement, this.PaperLinesElement, paperColor, this.GridStep);

  this.PaperResizer = this.AddPaperResizer(this.Context, svg, offset_x, offset_y, width, height, stroke);
  
};

Paper.prototype.CreateContext = function(root_shapes, root_lines, paper_color, grid_step)
{
  var context = new ShapeContext();
  
  context.Register(Rect);
  context.Register(Line);
  context.Register(Text);
  
  context.root_shapes = root_shapes;
  context.root_lines = root_lines;

  context.paper_color = paper_color;
  context.grid_step = grid_step;

  context.line_length = 40;
  
  //shape defaults
  context.width = 160;
  context.height = 80;
  context.stroke_color = "rgb(51, 51, 204)";
  context.stroke_width = 2;
  context.fill = "none";
  
  //spec defaults
  context.spec_opacity_initial = 0;
  context.spec_opacity = 0.15;
  context.spec_stroke_width = 12;

  //resizer defaults
  context.resizer_size = 8;
  context.resizer_color = "blue";
  context.resizer_stroke_width = 8;

  //knot defaults
  context.knot_size = 18;
  context.knot_color = "blue";
  context.knot_stroke_color = paper_color;
  context.knot_stroke_width = 10;

  //text props
  context.text_width = 100;
  context.text_height = 20;
  context.text_font_size = 20;

  //events
  context.spec_event.onmousedown = this.SpecMouseDown.bind(this);
  context.spec_event.onmouseup = this.SpecMouseUp.bind(this);
  context.spec_event.onmousemove = this.SpecMouseMove.bind(this);

  context.resizer_event.onmousedown = this.ResizerMouseDown.bind(this);
  context.resizer_event.onmousemove = this.ResizerMouseMove.bind(this);
  context.resizer_event.onmouseup = this.ResizerMouseUp.bind(this);

  context.knot_event.onmousedown = this.KnotMouseDown.bind(this);
  context.knot_event.onmousemove = this.KnotMouseMove.bind(this);
  context.knot_event.onmouseup = this.KnotMouseUp.bind(this);

  context.paper_resizer_event = {};
  context.paper_resizer_event.onmousedown = this.PaperResizerMouseDown.bind(this);
  context.paper_resizer_event.onmousemove = this.PaperResizerMouseMove.bind(this);
  context.paper_resizer_event.onmouseup = this.PaperResizerMouseUp.bind(this);

  return context;
};

Paper.prototype.CreateGrid = function(grid, width, height, borderColor)
{
  var offset_x = this.PaperOffsetX;
  var offset_y = this.PaperOffsetY; 
  Common.RemoveAllChilds(grid);
  var gridStep = this.GridStep;
  for(var x = gridStep ; x < width ; x += gridStep)
  {
    Common.AddTagNS(grid, Common.svgNS, "line", {x1: offset_x + x, y1: offset_y + gridStep, x2:offset_x + x, y2: offset_y + height,
      "stroke":borderColor, "stroke-width":"0.5", "stroke-dasharray": "1," + (gridStep - 1)});
  }
};

Paper.prototype.PaperSetCursor = function(cursor)
{
  var diagram = document.getElementById("diagram");
  Common.SetAttr(diagram, {"cursor" : cursor});
};

Paper.prototype.DeselectPaper = function()
{
  if (this.SelectedGroup != null) {
    var oldspec = this.SelectedGroup.childNodes.item(1);
    Common.SetAttr(oldspec, { "opacity": 0 });
    
    this.SelectedGroup = null;
    this.DragObject = null;
  }
};

Paper.prototype.PaperEditProperties = function()
{
  var shape = this.Context.LoadByGroup(this.SelectedGroup);
  if (shape.shape == "text") {
    this.EditPropertiesText(shape);
  } else {
    alert("PaperEditProperties: " + shape.shape);
  }
};

Paper.prototype.EditPropertiesText = function(shape)
{
  var text = shape.node.textContent;
  text = text.replace(/'/g, '&#039;');
  
  var box = dhtmlx.modalbox({
	title:"Text properties",
	text:"<div><label>text: <input class='inform' name='textvalue' id='text-property' type='text' value='" + text + "'></label></div>",
	buttons:["Save", "Cancel"],
	callback: function (result) {
	  if (result == 1)
      return;
	  var prop = box.querySelector("input");
	  var newText = prop.value;
	  shape.node.textContent = newText;
	}
 });
};

Paper.prototype.PaperCreateRect = function(pos_x, pos_y, parentGroup)
{
  pos_x = this.SnapPosToGrid(pos_x, 0, this.Context.grid_step);
  pos_y = this.SnapPosToGrid(pos_y, 0, this.Context.grid_step);

  this.PaperGetCurrentColor();
  var rect = new Rect(this.Context, parentGroup, pos_x, pos_y);
  this.SelectSpec(rect.spec);
};

Paper.prototype.PaperCreateLine = function(pos_x, pos_y, knot, parentGroup)
{
  pos_x = this.SnapPosToGrid(pos_x, 0, this.Context.grid_step);
  pos_y = this.SnapPosToGrid(pos_y, 0, this.Context.grid_step);

  var orientation = "v";
  var resizer;
  if (knot) {
    var knot_dir = knot.getAttribute("knot-dir");
    if (knot_dir == "top") {
      resizer = 1;
      orientation = "v";
    } else if (knot_dir == "bottom") {
      resizer = 0;
      orientation = "v";
    } else if (knot_dir == "left") {
      resizer = 1;
      orientation = "h";
    } else if (knot_dir == "right") {
      resizer = 0;
      orientation = "h";
    }
  }
  
  var length2 = this.Context.line_length / 2;
  var left, top, right, bottom;

  if (orientation == "v") {
    left = pos_x;
    top = pos_y - length2;
    right = pos_x;
    bottom = pos_y + length2;
  } else {
    left = pos_x - length2;
    top = pos_y;
    right = pos_x + length2;
    bottom = pos_y;
  }

  this.PaperGetCurrentColor();
  var line = new Line(this.Context, parentGroup, left, top, right, bottom);

  if (knot) {
    delta = this.ConnectResizerToKnot({x:pos_x, y:pos_y}, line.resizers[resizer], knot);
    line.Move(this.Context, delta.x, delta.y);
  }

  this.SelectSpec(line.spec);
};

Paper.prototype.PaperCreateText = function(pos_x, pos_y, parentGroup)
{
  this.PaperGetCurrentColor();
  var shape = new Text(this.Context, parentGroup, pos_x, pos_y);

  this.SelectSpec(shape.spec);
}

Paper.prototype.PaperGetCurrentColor = function()
{
  this.Context.stroke_color = this.Control.ControlGetShapeColor();
}

Paper.prototype.PaperMoveShape = function(pos_x, pos_y, isEnd)
{
  var delta = {x : pos_x - this.DragX, y : pos_y - this.DragY};
 
  var shape = this.Context.LoadByGroup(this.SelectedGroup);
  
  if (isEnd) {
    delta = this.SnapShapeToGrid(shape, delta, this.Context.grid_step);
  }
  
  shape.Move(this.Context, delta.x, delta.y);
  
  this.DragX = pos_x;
  this.DragY = pos_y;
};

Paper.prototype.PaperResizeShape = function(pos_x, pos_y, dragObject, connectObject, isEnd, orientation)
{
  var delta = {x : pos_x - this.DragX, y : pos_y - this.DragY};
  if (orientation == "n-resize" || orientation == "s-resize") {
    delta.x = 0;
  } else if (orientation == "w-resize" || orientation == "e-resize") {
    delta.y = 0;
  }

  var shape = this.Context.LoadByGroup(this.SelectedGroup);

  if (isEnd) {
    var grid_step = (shape.shape == "text" ? 2 : this.Context.grid_step);
    delta = this.SnapResizerToGrid(dragObject, delta, grid_step);
  }
  
  delta = this.ConnectResizerToKnot(delta, dragObject, connectObject);
  
  if (!shape.Resize(this.Context, delta.x, delta.y, dragObject, orientation))
  {
    this.Control.ControlDragAbort();
  }
 
  this.DragX = pos_x;
  this.DragY = pos_y;
};

Paper.prototype.PaperResizePaper = function(pos_x, pos_y, isEnd)
{
  var delta_x = pos_x - this.DragX;
  var delta_y = pos_y - this.DragY;

  this.DragX = pos_x;
  this.DragY = pos_y;
  
  Shape.AddDelta(this.PaperResizer, "x", delta_x);
  Shape.AddDelta(this.PaperResizer, "y", delta_y);

  Shape.AddDelta(this.PaperSpec, "width", delta_x);
  Shape.AddDelta(this.PaperSpec, "height", delta_y);

  Shape.AddDelta(this.PaperSvg, "width", delta_x);
  Shape.AddDelta(this.PaperSvg, "height", delta_y); 
  var width = parseInt(this.PaperSvg.getAttribute("width")) - this.PaperOffsetX;
  var height = parseInt(this.PaperSvg.getAttribute("height")) - this.PaperOffsetY;

  this.CreateGrid(this.PaperGrid, width, height, PaperBorderColor);
  this.CalculatePaperClientOffset(this.PaperSvg);

  if (isEnd) {
    //alert("PaperResizePaper");
  }
};

Paper.prototype.CalculatePaperClientOffset = function(element)
{
  var rect = element.getBoundingClientRect();
  this.PaperClientOffsetX = parseInt(rect.left);
  this.PaperClientOffsetY = parseInt(rect.top);
};

Paper.prototype.ConnectResizerToKnot = function(delta, resizer, knot) 
{
  if (resizer && knot 
    && resizer.tagName == "rect" && resizer.getAttribute("svgram") == "resizer"
    && knot.tagName == "circle" && knot.getAttribute("svgram") == "knot")
  {
    var links_str = knot.getAttribute("links");
    var links;
    if (!links_str)
      links = [];
    else
      links = links_str.split(",");

    var shape_id = resizer.parentNode.parentNode.getAttribute("id");
    var resizer_no = resizer.getAttribute("resizer");
    var link_id = shape_id + ":" + resizer_no;
    if (links.indexOf(link_id) == -1)
      links.push(link_id);

    links_str = links.join(); 
    knot.setAttribute("links", links_str);
  
    var x = parseInt(resizer.getAttribute("x")) + parseInt(resizer.getAttribute("width")) / 2;
    var y = parseInt(resizer.getAttribute("y")) + parseInt(resizer.getAttribute("height")) / 2;
    var cx = parseInt(knot.getAttribute("cx"));
    var cy = parseInt(knot.getAttribute("cy"));
    
    return {x: cx - x, y: cy - y};
  }

  return delta;
};

Paper.prototype.SnapResizerToGrid = function(resizer, delta, grid_step)
{
  if (!resizer)
    return delta;
    
  var x, y;
  if(resizer.tagName == "rect") {
    x = parseInt(resizer.getAttribute("x")) + parseInt(resizer.getAttribute("width")) / 2;
    y = parseInt(resizer.getAttribute("y")) + parseInt(resizer.getAttribute("height")) / 2;
  } else if(resizer.tagName == "circle") {
    x = parseInt(resizer.getAttribute("cx"));
    y = parseInt(resizer.getAttribute("cy"));
  } else {
    return delta;
  }

  var gridX = this.SnapPosToGrid(x, delta.x, grid_step);
  var gridY = this.SnapPosToGrid(y, delta.y, grid_step);
  return {x: gridX - x, y: gridY - y};
};

Paper.prototype.SnapShapeToGrid = function (shape, delta, grid_step)
{
  var gridX = this.SnapPosToGrid(shape.x, delta.x, grid_step);
  var gridY = this.SnapPosToGrid(shape.y, delta.y, grid_step);
  return {x: gridX - shape.x, y: gridY - shape.y};
};

Paper.prototype.SnapPosToGrid = function (pos, delta, grid_step)
{
  return Math.round((pos + delta) / grid_step) * grid_step;
};

Paper.prototype.PaperDeleteSelectedShape = function()
{
  if (this.SelectedGroup == null)
    return;

  var parent = this.SelectedGroup.parentNode;
  parent.removeChild(this.SelectedGroup);
  this.SelectedGroup = null;
};

Paper.prototype.AddPaperResizer = function(context, svg, x, y, width, height, stroke)
{
  var paperResizerSize = 30;
  var strokeSize = 10;
  var paperResizer = Common.AddTagNS(svg, Common.svgNS, "rect", {
    "id": "diagram.resizer",
    "x": x + width - stroke * 1 - paperResizerSize + strokeSize /2 ,
    "y": y + height - stroke * 1- paperResizerSize + strokeSize/2, 
    "width": paperResizerSize, 
    "height": paperResizerSize,
    "opacity": context.spec_opacity,
    "fill": context.resizer_color,
    "stroke": context.paper_color,
    "stroke-width": strokeSize,
    "id": Shape.NewID(),
    "svgram": "resizer",
    });

  Shape.AddEventHandlers(paperResizer, context.paper_resizer_event);
  
  return paperResizer;  
};

Paper.prototype.SelectSpec = function(spec)
{
  this.DeselectPaper();
  this.SelectedGroup = spec.parentNode;
  Common.SetAttr(spec, { "opacity": this.Context.spec_opacity });
};

Paper.prototype.SelectPaperElement = function(specNode)
{
  var spec = specNode.parentNode;
  this.SelectSpec(spec);
};

Paper.prototype.PaperMouseDown = function(evt)
{
  evt.preventDefault();
  this.DeselectPaper();
};

Paper.prototype.PaperMouseUp = function(evt)
{
  evt.preventDefault();
  if (!this.Control.ControlDragEnd(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject)) {
    this.DeselectPaper();
  }
  
  this.DragObject = null;
};

Paper.prototype.PaperMouseMove = function(evt)
{
  evt.preventDefault();
  this.Control.ControlDragMove(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject);
};

Paper.prototype.SpecMouseMove = function (evt)
{
  evt.preventDefault();
  if (this.Control.ControlInDragMode()) {
    this.Control.ControlDragMove(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject);
  }
};

Paper.prototype.SpecMouseDown = function(evt)
{
  evt.preventDefault();
  this.SelectPaperElement(evt.target);

  this.DragX = this.EventOffsetX(evt);
  this.DragY = this.EventOffsetY(evt);

  this.Control.ControlDragShapeStart();
};

Paper.prototype.SpecMouseUp = function(evt)
{
  evt.preventDefault();
  this.Control.ControlDragEnd(this.EventOffsetX(evt), this.EventOffsetY(evt), null, evt.target.parentNode.parentNode);
  this.DragObject = null;
};

Paper.prototype.ResizerMouseDown = function(evt)
{
  evt.preventDefault();
  this.SelectPaperElement(evt.target);
  this.DragObject = evt.target;

  this.DragX = this.EventOffsetX(evt);
  this.DragY = this.EventOffsetY(evt);
  this.Control.ControlDragSizeStart();
};

Paper.prototype.ResizerMouseMove = function(evt)
{
  evt.preventDefault();
  if (this.Control.ControlInDragMode()) {
    this.Control.ControlDragMove(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject);
  }
};

Paper.prototype.ResizerMouseUp = function(evt)
{
  evt.preventDefault();
  this.Control.ControlDragEnd(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject);
  this.DragObject = null;
};

Paper.prototype.KnotMouseDown = function(evt)
{
  evt.preventDefault();
  this.SelectPaperElement(evt.target);
  this.DragObject = evt.target;

  this.DragX = this.EventOffsetX(evt);
  this.DragY = this.EventOffsetY(evt);

  var orientation = null;
  var knot_dir = this.DragObject.getAttribute("knot-dir");
  if (knot_dir == "top") {
    orientation = "n-resize";
  } else if (knot_dir == "bottom") {
    orientation = "s-resize";
  } else if (knot_dir == "left") {
    orientation = "w-resize";
  } else if (knot_dir == "right") {
    orientation = "e-resize";
  }

  this.Control.ControlDragSizeStart(orientation);
};

Paper.prototype.KnotMouseUp = function(evt)
{
  evt.preventDefault();
  var target = (this.Control.ControlDragSizeOrientation ? null : evt.target);
  this.Control.ControlDragEnd(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject, target);
};

Paper.prototype.KnotMouseMove = function(evt)
{
  evt.preventDefault();
  if (this.Control.ControlInDragMode()) {
    this.Control.ControlDragMove(this.EventOffsetX(evt), this.EventOffsetY(evt), this.DragObject, evt.target);
  }
};

Paper.prototype.PaperResizerMouseDown = function(evt)
{
  evt.preventDefault();
  this.DeselectPaper();

  this.DragX = this.EventOffsetX(evt);
  this.DragY = this.EventOffsetY(evt);
  this.Control.ControlDragPaperStart();
};

Paper.prototype.PaperResizerMouseMove = function(evt)
{
  evt.preventDefault();

  if (this.Control.ControlInDragMode()) {
    this.DeselectPaper();
    this.Control.ControlDragMove(this.EventOffsetX(evt), this.EventOffsetY(evt));
  }
};

Paper.prototype.PaperResizerMouseUp = function(evt)
{
  evt.preventDefault();
  this.Control.ControlDragEnd(this.EventOffsetX(evt), this.EventOffsetY(evt));
};


return Paper;
});