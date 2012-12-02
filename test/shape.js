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

test("load rect", function() {
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
  TestContext.spec_opacity_initial = 0.33;

  var rect = new Rect(TestContext, 110, 200);
  notEqual(rect.spec, undefined);

  equal(rect.spec.getAttribute("x"), rect.left);
  equal(rect.spec.getAttribute("y"), rect.top);
  equal(rect.spec.getAttribute("width"), rect.width);
  equal(rect.spec.getAttribute("height"), rect.height);

  equal(rect.spec.getAttribute("fill"), TestContext.stroke_color);
  equal(rect.spec.getAttribute("opacity"), "0.33");
  equal(rect.spec.getAttribute("stroke"), TestContext.stroke_color);
  equal(rect.spec.getAttribute("stroke-width"), TestContext.stroke_width);

});

test("spec script events", function() {
  strictEqual(TestContext.spec_event.onmouseup, undefined);
  strictEqual(TestContext.spec_event.onmousedown, undefined);
  strictEqual(TestContext.spec_event.onmousemove, undefined);

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
  
  TestEvtCounter = 0;
  var event = document.createEvent ("MouseEvents");
  event.initMouseEvent("mousedown", true, false);
  rect.spec.dispatchEvent(event);
  equal(TestEvtCounter, 1);
  
  TestEvtCounter = 0;
  event = document.createEvent ("MouseEvents");
  event.initMouseEvent("mouseup", true, false);
  rect.spec.dispatchEvent(event);
  equal(TestEvtCounter, 1);

  TestEvtCounter = 0;
  event = document.createEvent ("MouseEvents");
  event.initMouseEvent("mousemove", true, false);
  rect.spec.dispatchEvent(event);
  equal(TestEvtCounter, 1);

  TestEvtCounter = 0;
  event = document.createEvent ("MouseEvents");
  event.initMouseEvent("contextmenu", true, false);
  rect.spec.dispatchEvent(event);
  equal(TestEvtCounter, 0);
});
