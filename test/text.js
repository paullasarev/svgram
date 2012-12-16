// $Author$
// $Id$

describe("text shape", function() {
  beforeEach(function() {
    InitTestShapeContext();
    this.addMatchers(ShapeMatchers);
  });
  afterEach(function() {
    ClearTestShapeContext();
  });

it("new should init attributes", function() {
  var shape = new Text(TestContext, null, 100, 200);
  notEqual(shape, null);
  
  equal(shape.x, 100);
  equal(shape.y, 200);
  equal(shape.left, 100 - TestContext.text_width/2);
  equal(shape.right, 100 + TestContext.text_width/2);
  equal(shape.top, 200 - TestContext.text_height/2);
  equal(shape.bottom, 200 + TestContext.text_height/2);
  equal("text", shape.node.tagName);
  sequal(shape.node.getAttribute("x"), shape.x);
  sequal(shape.node.getAttribute("y"), shape.y);
  sequal(shape.node.getAttribute("width"), shape.width);
  sequal(shape.node.getAttribute("height"), shape.height);
  sequal(shape.node.getAttribute("font-size"), TestContext.text_font_size);
  ok(shape.id);

  notEqual(shape.group, null);
  equal(shape.group.getAttribute("id"), shape.id);
  equal(shape.group.getAttribute("shape"), "text");

  ok(shape instanceof Text); 
  ok(shape instanceof Shape); 
});

it("should load by ID", function() {
  var shape = new Text(TestContext, null, 100, 200);
  var id = shape.id;
  
  var shape2 = TestContext.LoadById(id);
  notEqual(shape2, shape);
  ok(shape2 instanceof Text);
  ok(shape2 instanceof Shape);
  
  equal(shape2.id, shape.id);
  equal(shape2.x, shape.x);
  equal(shape2.y, shape.y);
  equal(shape2.shape, "text");

  equal(shape.node.tagName, "text");
  equal(shape2.node.tagName, "text");
  notEqual(shape2.group, null);
});

it("move should set coordinates", function() {
  var x = 100,  y = 200;
  var shape = new Text(TestContext, null, x, y);
  var dx = 20, dy = 10;

  checkTextPosition(shape, x, y);
  
  shape.Move(TestContext, dx, dy);
  
  var new_x = x + dx;
  var new_y = y + dy;
  
  checkTextPosition(shape, new_x, new_y);
});


it("resize should set font size", function() {
  var x = 100,  y = 200;
  var shape = new Text(TestContext, null, x, y);
  var dx = 20, dy = 10;
  
  var font_size = parseInt(shape.node.getAttribute("font-size"));
  var height = shape.height;
  
  shape.Resize(TestContext, dx, dy);
  
  var new_height = shape.height;
  expect(new_height).toBe(height + 2 * dy);
  
  var new_font_size = parseInt(shape.node.getAttribute("font-size"));
  expect(new_font_size).toBe(Math.round(font_size * (new_height/height)));
  
  checkTextPosition(shape, x, y);
});

});