// $Author$
// $Id$

define(["shape_context", "common", "shape", "rect", "line", "text"], 
function(ShapeContext, Common, Shape, Rect, Line, Text) {

describe("line shape", function() {
  beforeEach(function() {
    InitTestShapeContext(ShapeContext, Common, Shape, Rect, Line, Text);
    this.addMatchers(ShapeMatchers);
  });
  afterEach(function() {
    ClearTestShapeContext();
  });

it("new should init attributes", function() {
  var shape = new Line(TestContext, null, 100, 200, 300, 400);
  notEqual(shape, null);
  
  equal(shape.x, (100 + 300)/2);
  equal(shape.y, (200 + 400)/2);
  equal(shape.left, 100);
  equal(shape.right, 300);
  equal(shape.top, 200);
  equal(shape.bottom, 400);
  equal("line", shape.node.tagName);
  sequal(shape.node.getAttribute("x1"), shape.left);
  sequal(shape.node.getAttribute("y1"), shape.top);
  sequal(shape.node.getAttribute("x2"), shape.right);
  sequal(shape.node.getAttribute("y2"), shape.bottom);
  ok(shape.id);

  notEqual(shape.group, null);
  equal(shape.group.getAttribute("id"), shape.id);
  equal(shape.group.getAttribute("shape"), "line");

  ok(shape instanceof Line); 
  ok(shape instanceof Shape); 
});

it("should load by ID", function() {
  var shape = new Line(TestContext, null, 100, 200, 300, 400);
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

it("move should set coordinates", function() {
  var x = 100,  y = 200;
  var x1 = 300, y1 = 400;
  
  var line = new Line(TestContext, null, x, y, x1, y1);
  
  var dx = 20, dy = 10;
  
  line.Move(TestContext, dx, dy);
  
  var new_x = x + dx;
  var new_y = y + dy;
  var new_x1 = x1 + dx;
  var new_y1 = y1 + dy;
  
  checkLinePosition(line, new_x, new_y, new_x1, new_y1);
});


it("resize by first resizer should move x1,y1", function() {
  var x = 100,  y = 200;
  var x1 = 300, y1 = 400;
  var line = new Line(TestContext, null, x, y, x1, y1);
  
  var dx = 20, dy = 10;
  
  line.Resize(TestContext, dx, dy, line.resizers[0]);
  
  var new_x = x + dx;
  var new_y = y + dy;
  var new_x1 = x1;
  var new_y1 = y1;
  
  checkLinePosition(line, new_x, new_y, new_x1, new_y1);
});

it("resize by second resizer should move x2,y2", function() {
  var x = 100,  y = 200;
  var x1 = 300, y1 = 400;
  var line = new Line(TestContext, null, x, y, x1, y1);
  
  var dx = 20, dy = 10;
  
  line.Resize(TestContext, dx, dy, line.resizers[1]);
  
  var new_x = x;
  var new_y = y;
  var new_x1 = x1 + dx;
  var new_y1 = y1 + dy;
  
  checkLinePosition(line, new_x, new_y, new_x1, new_y1);
});

});

});