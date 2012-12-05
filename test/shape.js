// $Author$
// $Id$

var TestContext;
var TestEvtCounter;

module("shapes", {
  setup: function() {
    TestContext = new ShapeContext;
    TestContext.Register(Rect);
    TestContext.root = TestMakeSvg(800, 600);
    
    TestEvtCounter = 0;
  },
  teardown: function() {
    TextContext = null;
  }
});

function MapSize(map)
{
  var count = 0;
  for(key in map)
    count++;
  return count;
}

function testEvent(node, eventType, requred) {
  TestEvtCounter = 0;
  var event = document.createEvent ("MouseEvents");
  event.initMouseEvent(eventType, true, false);
  node.dispatchEvent(event);
  equal(TestEvtCounter, requred);
}

function TestMakeSvg(width, height)
{
  var fixture = document.getElementById("qunit-fixture");
  var svg = AddTagNS(fixture, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": width, "height": height, draggable:"false"});
  SetAttr(svg, {"xmlns:xlink": xlinkNS, "xmlns": svgNS});
  return svg;
}

test("create svg", function() {
  notEqual(TestContext.root, null);
});

test("create rect", function() {
  var rect = new Rect(TestContext, 100, 200, 160, 120);
  notEqual(rect, null);
  
  equal(rect.x, 100);
  equal(rect.y, 200);
  equal(rect.left, 100 - 160/2);
  equal(rect.right, 100 + 160/2);
  equal(rect.top, 200 - 120/2);
  equal(rect.bottom, 200 + 120/2);
  equal("rect", rect.node.tagName);
  equal(rect.node.getAttribute("x"), rect.left);
  equal(rect.node.getAttribute("y"), rect.top);
  ok(rect.id);

  notEqual(rect.group, null);
  equal(rect.group.getAttribute("id"), rect.id);
  equal(rect.group.getAttribute("shape"), "rect");
});

test("rect shape", function() {
  var rect = new Rect(TestContext, 100, 200);
  equal(rect.x, 100);
  equal(rect.y, 200);
  equal(rect.node, rect.node);
  equal(rect.id, rect.id);
  equal(rect.shape, "rect");
  
  equal(rect.Attr("x"), rect.left);
  rect.Attr("x", 200);
  equal(rect.Attr("x"), 200);

  ok(rect instanceof Rect); 
  ok(rect instanceof Shape); 
});

test("load rect by ID", function() {
  var rect = new Rect(TestContext, 100, 200);
  var id = rect.id;
  
  var rect2 = TestContext.LoadById(id);
  notEqual(rect2, rect);
  ok(rect2 instanceof Rect); 
  ok(rect2 instanceof Shape); 
  
  equal(rect2.id, rect.id);
  equal(rect2.x, rect.x);
  equal(rect2.y, rect.y);
  equal(rect2.shape, "rect");

  notEqual(rect.Attr("tagName"), "rect");
  notEqual(rect2.Attr("tagName"), "rect");
  notEqual(rect2.group, null);
});

test("load rect by group", function() {
  var rect = new Rect(TestContext, 100, 200);
  var group = rect.group;
  
  var rect2 = TestContext.LoadByGroup(group);
  notEqual(rect2, rect);
  ok(rect2 instanceof Rect); 
  ok(rect2 instanceof Shape); 
  
  equal(rect2.id, rect.id);
  equal(rect2.x, rect.x);
  equal(rect2.y, rect.y);
  equal(rect2.shape, "rect");

  notEqual(rect.Attr("tagName"), "rect");
  notEqual(rect2.Attr("tagName"), "rect");
  notEqual(rect2.group, null);
});

test("width and height", function() {
  equal(TestContext.width, 160);
  equal(TestContext.height, 100);

  var rect1 = new Rect(TestContext, 100, 200);
  equal(rect1.width, 160);
  equal(rect1.height, 100);
  
  var rect = new Rect(TestContext, 100, 200, 800, 600);
  equal(rect.x, 100);
  equal(rect.y, 200);
  equal(rect.width, 800);
  equal(rect.height, 600);
  equal(rect.left, 100 - 800/2);
  equal(rect.right, 100 + 800/2);
  equal(rect.top, 200 - 600/2);
  equal(rect.bottom, 200 + 600/2);
});

test("rect properties", function() {
  equal(TestContext.stroke_color, "black");
  equal(TestContext.stroke_width, 2);
  equal(TestContext.fill, "none");
  
  TestContext.stroke_color = "blue"
  TestContext.stroke_width = 4;
  TestContext.fill = "red";
  
  var rect = new Rect(TestContext, 100, 200, 800, 600);
  
  equal(rect.Attr("stroke"), "blue");
  equal(rect.Attr("stroke-width"), "4");
  equal(rect.Attr("fill"), "red");
});

test("rect spec", function() {
  equal(TestContext.spec_opacity_initial, 0);
  equal(TestContext.spec_opacity, 0.15);
  TestContext.spec_opacity_initial = 0.33;

  var rect = new Rect(TestContext, 110, 200);
  notEqual(rect.spec, undefined);

  var spec = rect.spec;
  equal(spec.tagName, "rect");
  
  equal(spec.getAttribute("x"), rect.left);
  equal(spec.getAttribute("y"), rect.top);
  equal(spec.getAttribute("width"), rect.width);
  equal(spec.getAttribute("height"), rect.height);

  equal(spec.getAttribute("fill"), TestContext.stroke_color);
  equal(spec.getAttribute("opacity"), "0.33");
  equal(spec.getAttribute("stroke"), TestContext.stroke_color);
  equal(spec.getAttribute("stroke-width"), TestContext.stroke_width);

  equal(spec.getAttribute("svgram"), "spec");
});

test("spec script events", function() {
  equal(MapSize(TestContext.spec_event), 0);

  TestContext.spec_event.onmousedown = "SpecMouseDown";
  TestContext.spec_event.onmouseup = "SpecMouseUp";
  TestContext.spec_event.onmousemove = "SpecMouseMove";

  var rect = new Rect(TestContext, 110, 200);

  equal(rect.spec.getAttribute("onmousedown"), "SpecMouseDown");
  equal(rect.spec.getAttribute("onmouseup"), "SpecMouseUp");
  equal(rect.spec.getAttribute("onmousemove"), "SpecMouseMove");
});

test("spec function events", function() {
  TestContext.spec_event.onmousedown = function(evt) {TestEvtCounter++;};
  TestContext.spec_event.onmouseup = function(evt) {TestEvtCounter++;};
  TestContext.spec_event.onmousemove = function(evt) {TestEvtCounter++;};

  var rect = new Rect(TestContext, 110, 200);

  equal(rect.spec.getAttribute("onmousedown"), null);
  equal(rect.spec.getAttribute("onmouseup"), null);
  equal(rect.spec.getAttribute("onmousemove"), null);
  
  testEvent(rect.spec, "mousedown", 1);
  testEvent(rect.spec, "mouseup", 1);
  testEvent(rect.spec, "mousemove", 1);
  testEvent(rect.spec, "contextmenu", 0);
});

test("rect resizer", function() {
  equal(TestContext.resizer_size, 8);
  equal(TestContext.resizer_color, "blue");
  var rsize = 10;
  TestContext.resizer_size = rsize;
  TestContext.resizer_color = "red";

  var rect = new Rect(TestContext, 100, 200);
  notEqual(rect.spec, undefined);

  equal(rect.resizers.length, 1);
  var resizer = rect.resizers[0];

  equal(resizer.tagName, "rect");
  
  equal(resizer.getAttribute("x"), rect.right - rsize / 2);
  equal(resizer.getAttribute("y"), rect.bottom - rsize / 2);
  equal(resizer.getAttribute("width"), rsize);
  equal(resizer.getAttribute("height"), rsize);

  equal(resizer.getAttribute("fill"), TestContext.resizer_color);
  equal(resizer.getAttribute("opacity"), TestContext.spec_opacity);
  equal(resizer.getAttribute("stroke"), TestContext.resizer_color);
  equal(resizer.getAttribute("stroke-width"), TestContext.stroke_width);
  
  equal(resizer.getAttribute("id").length, 15);
  equal(resizer.getAttribute("svgram"), "resizer");
});

test("resizer script events", function() {
  equal(MapSize(TestContext.resizer_event), 0);

  TestContext.resizer_event.onmousedown = "ResizerMouseDown";
  TestContext.resizer_event.onmousemove = "ResizerMouseMove";
  TestContext.resizer_event.onmouseup = "ResizerMouseUp";

  var rect = new Rect(TestContext, 110, 200);

  var resizer = rect.resizers[0];
  equal(resizer.getAttribute("onmousedown"), "ResizerMouseDown");
  equal(resizer.getAttribute("onmousemove"), "ResizerMouseMove");
  equal(resizer.getAttribute("onmouseup"), "ResizerMouseUp");
});

test("resizer function events", function() {
  TestContext.resizer_event.onmousedown = function(evt) {TestEvtCounter++;};
  TestContext.resizer_event.onmousemove = function(evt) {TestEvtCounter++;};
  TestContext.resizer_event.onmouseup = function(evt) {TestEvtCounter++;};

  var rect = new Rect(TestContext, 110, 200);
  var resizer = rect.resizers[0];

  equal(resizer.getAttribute("onmousedown"), null);
  equal(resizer.getAttribute("onmouseup"), null);
  equal(resizer.getAttribute("onmousemove"), null);
  
  testEvent(resizer, "mousedown", 1);
  testEvent(resizer, "mouseup", 1);
  testEvent(resizer, "mousemove", 1);
  testEvent(resizer, "contextmenu", 0);
});

function checkKnot(knot, cx, cy, rsize) {
  equal(knot.tagName, "circle");
  
  equal(knot.getAttribute("cx"), cx);
  equal(knot.getAttribute("cy"), cy);
  equal(knot.getAttribute("r"), rsize / 2);

  equal(knot.getAttribute("fill"), TestContext.knot_color);
  equal(knot.getAttribute("opacity"), TestContext.spec_opacity);
  equal(knot.getAttribute("stroke"), TestContext.knot_color);
  equal(knot.getAttribute("stroke-width"), TestContext.stroke_width);
  
  equal(knot.getAttribute("id").length, 15);
  equal(knot.getAttribute("svgram"), "knot");
}

test("rect knots", function() {
  equal(TestContext.knot_size, 8);
  equal(TestContext.knot_color, "blue");
  var rsize = 10;
  TestContext.knot_size = rsize;
  TestContext.knot_color = "red";

  var rect = new Rect(TestContext, 100, 200);
  notEqual(rect.spec, undefined);

  equal(rect.knots.length, 4);
  checkKnot(rect.knots[0], rect.left, rect.y, rsize);
  checkKnot(rect.knots[1], rect.right, rect.y, rsize);
  checkKnot(rect.knots[2], rect.x, rect.top, rsize);
  checkKnot(rect.knots[3], rect.x, rect.bottom, rsize);
});

function checkKnotScriptEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), "KnotMouseMove");
  equal(knot.getAttribute("onmouseup"), "KnotMouseUp");
}

test("knot script events", function() {
  equal(MapSize(TestContext.knot_event), 0);

  TestContext.knot_event.onmousemove = "KnotMouseMove";
  TestContext.knot_event.onmouseup = "KnotMouseUp";

  var rect = new Rect(TestContext, 110, 200);

  checkKnotScriptEvent(rect.knots[0]);
  checkKnotScriptEvent(rect.knots[1]);
  checkKnotScriptEvent(rect.knots[2]);
  checkKnotScriptEvent(rect.knots[3]);
});

function checkKnotFunctionEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), null);
  equal(knot.getAttribute("onmouseup"), null);
  
  testEvent(knot, "mousemove", 1);
  testEvent(knot, "mouseup", 1);
  testEvent(knot, "contextmenu", 0);
}

test("knot function events", function() {
  TestContext.knot_event.onmousemove = function(evt) {TestEvtCounter++;};
  TestContext.knot_event.onmouseup = function(evt) {TestEvtCounter++;};

  var rect = new Rect(TestContext, 110, 200);
  
  checkKnotFunctionEvent(rect.knots[0]);
  checkKnotFunctionEvent(rect.knots[1]);
  checkKnotFunctionEvent(rect.knots[2]);
  checkKnotFunctionEvent(rect.knots[3]);
});

function checkRect(node, left, top, width, height) {
  equal(node.getAttribute("x"), left);
  equal(node.getAttribute("y"), top);
  equal(node.getAttribute("width"), width);
  equal(node.getAttribute("height"), height);
}

function checkCircle(node, cx, cy, radius) {
  equal(node.getAttribute("cx"), cx);
  equal(node.getAttribute("cy"), cy);
  equal(node.getAttribute("r"), radius);
}

function checkShape(shape, x, y, width, height, left, top, right, bottom) {
  equal(shape.x, x);
  equal(shape.y, y);
  equal(shape.width, width);
  equal(shape.height, height);
  equal(shape.left, left);
  equal(shape.right, right);
  equal(shape.top, top);
  equal(shape.bottom, bottom);
}

function checkRectPosition(rect, x, y, width, height, left, top, right, bottom) {
  checkShape(rect, x, y, width, height, left, top, right, bottom);
  checkRect(rect.node, left, top, width, height);
  checkRect(rect.spec, left, top, width, height);

  var rsize = TestContext.resizer_size;
  var rsize2 = rsize/2;
  checkRect(rect.resizers[0], right - rsize2, bottom - rsize2, rsize, rsize);

  checkCircle(rect.knots[0], left, y, rsize2);
  checkCircle(rect.knots[1], right, y, rsize2);
  checkCircle(rect.knots[2], x, top, rsize2);
  checkCircle(rect.knots[3], x, bottom, rsize2);
}

test("rect move", function() {
  var x = 300;
  var y = 400;
  var width = 200;
  var height = 100;
  var rect = new Rect(TestContext, x, y, width, height);
  
  var dx = 20;
  var dy = 10;
  
  rect.Move(dx, dy);
  
  var new_x = x + dx;
  var new_y = y + dy;
  var left = new_x - width / 2;
  var right = left + width;
  var top = new_y - height / 2;
  var bottom = top + height;
  
  checkRectPosition(rect, new_x, new_y, width, height, left, top, right, bottom);
});

function calcResize(coords, dx, dy) {
  coords.width += dx * 2;
  coords.height += dy * 2;
  coords.left = coords.x - coords.width / 2;
  coords.right = coords.left + coords.width;
  coords.top = coords.y - coords.height / 2;
  coords.bottom = coords.top + coords.height;
}

test("rect resize", function() {
  var coords = { x: 300, y: 400, width: 200, height: 100, };
  var rect = new Rect(TestContext, coords.x, coords.y, coords.width, coords.height);
  
  var dx = 20;
  var dy = 10;
  
  calcResize(coords, dx, dy);
  
  rect.Resize(dx, dy);
 
  checkRectPosition(rect, coords.x, coords.y, coords.width, coords.height, coords.left, coords.top, coords.right, coords.bottom);
});

test("rect resize 1px", function() {
  var coords = { x: 300, y: 400, width: 200, height: 100, };
  var rect = new Rect(TestContext, coords.x, coords.y, coords.width, coords.height);

  var dx = 1;
  var dy = 1;

  calcResize(coords, dx, dy);
  
  rect.Resize(dx, dy);
 
  checkRectPosition(rect, coords.x, coords.y, coords.width, coords.height, coords.left, coords.top, coords.right, coords.bottom);
});
