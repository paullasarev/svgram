// $Author$
// $Id$

test("create line", function() {
  var shape = new Line(TestContext, 100, 200, 300, 400);
  notEqual(shape, null);
  
  equal(shape.x, (100 + 300)/2);
  equal(shape.y, (200 + 400)/2);
  equal(shape.left, 100);
  equal(shape.right, 300);
  equal(shape.top, 200);
  equal(shape.bottom, 400);
  equal("line", shape.node.tagName);
  equal(shape.node.getAttribute("x1"), shape.left);
  equal(shape.node.getAttribute("y1"), shape.top);
  equal(shape.node.getAttribute("x2"), shape.right);
  equal(shape.node.getAttribute("y2"), shape.bottom);
  ok(shape.id);

  notEqual(shape.group, null);
  equal(shape.group.getAttribute("id"), shape.id);
  equal(shape.group.getAttribute("shape"), "line");

  ok(shape instanceof Line); 
  ok(shape instanceof Shape); 
});

test("load line by ID", function() {
  var shape = new Line(TestContext, 100, 200, 300, 400);
  var id = shape.id;
  
  var shape2 = TestContext.LoadById(id);
  notEqual(shape2, shape);
  ok(shape2 instanceof Line); 
  ok(shape2 instanceof Shape); 
  
  equal(shape2.id, shape.id);
  equal(shape2.x, shape.x);
  equal(shape2.y, shape.y);
  equal(shape2.shape, "line");

  equal(shape.node.tagName, "line");
  equal(shape2.node.tagName, "line");
  notEqual(shape2.group, null);
});
