// $Author$
// $Id$

describe("rect shape", function() {
  beforeEach(function() {
    InitTestShapeContext();
    this.addMatchers(ShapeMatchers);
  });
  afterEach(function() {
    ClearTestShapeContext();
  });

it("should create with required coords", function() {
  var rect = new Rect(TestContext, 100, 200, 160, 120);
  expect(rect).not.toBeNull();
  
  expect(rect.x).toBe(100);
  expect(rect.y).toBe(200);
  expect(rect.left).toBe(100 - 160/2);
  expect(rect.right).toBe(100 + 160/2);
  expect(rect.top).toBe(200 - 120/2);
  expect(rect.bottom).toBe(200 + 120/2);
  expect("rect").toBe(rect.node.tagName);
  expect(rect.node.getAttribute("x")).toBeString(rect.left);
  expect(rect.node.getAttribute("y")).toBeString(rect.top);
  expect(rect.id).toBeDefined();

  expect(rect.group).not.toBe(null);
  expect(rect.group.getAttribute("id")).toBe(rect.id);
  expect(rect.group.getAttribute("shape")).toBe("rect");
});

it("should be instance of Shape", function() {
  var rect = new Rect(TestContext, 100, 200);
  expect(rect.x).toBe(100);
  expect(rect.y).toBe(200);
  expect(rect.node).toBe(rect.node);
  expect(rect.id).toBe(rect.id);
  expect(rect.shape).toBe("rect");
  
  expect(rect.Attr("x")).toBeString(rect.left);
  rect.Attr("x", 200);
  expect(rect.Attr("x")).toBeString(200);

  expect(rect instanceof Rect).toBeTruthy();
  expect(rect instanceof Shape).toBeTruthy();
});

it("should load by ID", function() {
  var rect = new Rect(TestContext, 100, 200);
  var id = rect.id;
  
  var rect2 = TestContext.LoadById(id);
  expect(rect2).not.toBe(rect);
  expect(rect2 instanceof Rect).toBeTruthy();
  expect(rect2 instanceof Shape).toBeTruthy(); 
  
  expect(rect2.id).toBe(rect.id);
  expect(rect2.x).toBe(rect.x);
  expect(rect2.y).toBe(rect.y);
  expect(rect2.shape).toBe("rect");

  expect(rect.node.tagName).toBe("rect");
  expect(rect2.node.tagName).toBe("rect");
  expect(rect2.group).not.toBeNull();
});

it("should load by group", function() {
  var rect = new Rect(TestContext, 100, 200);
  var group = rect.group;
  
  var rect2 = TestContext.LoadByGroup(group);
  expect(rect2).not.toBe(rect);
  expect(rect2 instanceof Rect).toBeTruthy();
  ok(rect2 instanceof Shape); 
  
  expect(rect2.id).toBe(rect.id);
  expect(rect2.x).toBe(rect.x);
  expect(rect2.y).toBe(rect.y);
  expect(rect2.shape).toBe("rect");

  notEqual(rect.Attr("tagName"), "rect");
  notEqual(rect2.Attr("tagName"), "rect");
  notEqual(rect2.group, null);
});

it("should adjust width and height", function() {
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

it("constructor should set stroke and fill attributes from ShapeContext", function() {
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

it("should have 'spec' node", function() {
  equal(TestContext.spec_opacity_initial, 0);
  equal(TestContext.spec_opacity, 0.15);
  TestContext.spec_opacity_initial = 0.33;

  var rect = new Rect(TestContext, 110, 200);
  notEqual(rect.spec, undefined);

  var spec = rect.spec;
  equal(spec.tagName, "rect");
  
  sequal(spec.getAttribute("x"), rect.left);
  sequal(spec.getAttribute("y"), rect.top);
  sequal(spec.getAttribute("width"), rect.width);
  sequal(spec.getAttribute("height"), rect.height);

  sequal(spec.getAttribute("fill"), TestContext.stroke_color);
  equal(spec.getAttribute("opacity"), "0.33");
  sequal(spec.getAttribute("stroke"), TestContext.stroke_color);
  sequal(spec.getAttribute("stroke-width"), TestContext.stroke_width);

  equal(spec.getAttribute("svgram"), "spec");
});

it("spec node should handle script events", function() {
  equal(MapSize(TestContext.spec_event), 0);

  TestContext.spec_event.onmousedown = "SpecMouseDown";
  TestContext.spec_event.onmouseup = "SpecMouseUp";
  TestContext.spec_event.onmousemove = "SpecMouseMove";

  var rect = new Rect(TestContext, 110, 200);

  equal(rect.spec.getAttribute("onmousedown"), "SpecMouseDown");
  equal(rect.spec.getAttribute("onmouseup"), "SpecMouseUp");
  equal(rect.spec.getAttribute("onmousemove"), "SpecMouseMove");
});

it("spec node should handle function events", function() {
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

it("shoud have 'resizer' node", function() {
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
  
  sequal(resizer.getAttribute("x"), rect.right - rsize / 2);
  sequal(resizer.getAttribute("y"), rect.bottom - rsize / 2);
  sequal(resizer.getAttribute("width"), rsize);
  sequal(resizer.getAttribute("height"), rsize);

  sequal(resizer.getAttribute("fill"), TestContext.resizer_color);
  sequal(resizer.getAttribute("opacity"), TestContext.spec_opacity);
  sequal(resizer.getAttribute("stroke"), TestContext.resizer_color);
  sequal(resizer.getAttribute("stroke-width"), TestContext.stroke_width);
  
  equal(resizer.getAttribute("id").length, 15);
  equal(resizer.getAttribute("svgram"), "resizer");
});

it("resizer node should handle script events", function() {
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

it("resizer node should handle function events", function() {
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

it("shold have 'knots' nodes", function() {
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

it("knot node should handle script events", function() {
  equal(MapSize(TestContext.knot_event), 0);

  TestContext.knot_event.onmousemove = "KnotMouseMove";
  TestContext.knot_event.onmouseup = "KnotMouseUp";

  var rect = new Rect(TestContext, 110, 200);

  checkKnotScriptEvent(rect.knots[0]);
  checkKnotScriptEvent(rect.knots[1]);
  checkKnotScriptEvent(rect.knots[2]);
  checkKnotScriptEvent(rect.knots[3]);
});

it("knot node should handle function events", function() {
  TestContext.knot_event.onmousemove = function(evt) {TestEvtCounter++;};
  TestContext.knot_event.onmouseup = function(evt) {TestEvtCounter++;};

  var rect = new Rect(TestContext, 110, 200);
  
  checkKnotFunctionEvent(rect.knots[0]);
  checkKnotFunctionEvent(rect.knots[1]);
  checkKnotFunctionEvent(rect.knots[2]);
  checkKnotFunctionEvent(rect.knots[3]);
});

it("move should set coordinates", function() {
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

it("resize should set coordinates", function() {
  var coords = { x: 300, y: 400, width: 200, height: 100, };
  var rect = new Rect(TestContext, coords.x, coords.y, coords.width, coords.height);
  
  var dx = 20;
  var dy = 10;
  
  calcResize(coords, dx, dy);
  
  rect.Resize(dx, dy);
 
  checkRectPosition(rect, coords.x, coords.y, coords.width, coords.height, coords.left, coords.top, coords.right, coords.bottom);
});

it("resize for 1px should work correct", function() {
  var coords = { x: 300, y: 400, width: 200, height: 100, };
  var rect = new Rect(TestContext, coords.x, coords.y, coords.width, coords.height);

  var dx = 1;
  var dy = 1;

  calcResize(coords, dx, dy);
  
  rect.Resize(dx, dy);
 
  checkRectPosition(rect, coords.x, coords.y, coords.width, coords.height, coords.left, coords.top, coords.right, coords.bottom);
});

});