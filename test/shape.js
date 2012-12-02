// $Author$
// $Id$

var TestContext;

module("shapes", {
  setup: function() {
    TestContext = new ShapeContext;
    TestContext.Register(Rect);
    TestContext.root = TestMakeSvg(800, 600);
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
  var rect = new Rect(TestContext, 100, 200);
  notEqual(rect, null);
  
  equal(rect.x, 100);
  equal(rect.y, 200);
  equal("rect", rect.node.tagName);
  equal(rect.node.getAttribute("x"), 100);
  equal(rect.node.getAttribute("y"), 200);
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
  
  equal(rect.Attr("x"), 100);
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
  var rect = new Rect(TestContext, 100, 200, 800, 600);
  equal(rect.x, 100);
  equal(rect.y, 200);
  equal(rect.width, 800);
  equal(rect.height, 600);
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
