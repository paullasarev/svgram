// $Author$
// $Id$

var TestContext;
var TestEvtCounter;

module("shapes", {
  setup: function() {
    TestContext = new ShapeContext;
    TestContext.Register(Rect);
    TestContext.Register(Line);
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

function checkKnotScriptEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), "KnotMouseMove");
  equal(knot.getAttribute("onmouseup"), "KnotMouseUp");
}

function checkKnotFunctionEvent(knot)
{
  equal(knot.getAttribute("onmousemove"), null);
  equal(knot.getAttribute("onmouseup"), null);
  
  testEvent(knot, "mousemove", 1);
  testEvent(knot, "mouseup", 1);
  testEvent(knot, "contextmenu", 0);
}

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
function calcResize(coords, dx, dy) {
  coords.width += dx * 2;
  coords.height += dy * 2;
  coords.left = coords.x - coords.width / 2;
  coords.right = coords.left + coords.width;
  coords.top = coords.y - coords.height / 2;
  coords.bottom = coords.top + coords.height;
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

