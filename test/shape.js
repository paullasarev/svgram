var test_svg;

module("shapes", {
  setup: function() {
    // prepare something for all following tests
    test_svg = TestMakeSvg(800, 600);
  },
  teardown: function() {
      // clean up after each test
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
  notEqual(test_svg, null);
});

test("create rect", function() {
  var rect = new Rect(test_svg, 100, 200);
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
  var rect = new Rect(test_svg, 100, 200);
  var shape = rect.shape;
  
  equal(shape.x, 100);
  equal(shape.y, 200);
  equal(shape.node, rect.node);
  equal(shape.id, rect.id);
  equal(shape.shape_class, "rect");
  equal(rect.shape_class, "rect");
  
  equal(rect.attr("x"), 100);
  equal(shape.attr("x"), 100);
  
  shape.attr("x", 200);
  equal(shape.attr("x"), 200);
  
  rect.attr("x", 300);
  equal(shape.attr("x"), 300);
});

test("load rect", function() {
  var rect = new Rect(test_svg, 100, 200);
  var id = rect.id;
  
  var rect2 = LoadShape(id);
  notEqual(rect2, rect);
  equal(rect2.id, rect.id);
  equal(rect2.x, rect.x);
  equal(rect2.y, rect.y);
  equal(rect2.shape_class, "rect");

  //alert(rect.node.tagName);
  notEqual(rect.attr("tagName"), "rect");
  notEqual(rect2.attr("tagName"), "rect");
  notEqual(rect2.group, null);
  notEqual(rect2.shape, null);
});
