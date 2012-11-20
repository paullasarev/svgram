test("create diagram", function() {
  var fixture = document.getElementById("qunit-fixture");
  var svgNS = "http://www.w3.org/2000/svg";
  
  equal(document.getElementById("diagram"), null, "diagram should be empty before create");
  
  CreateSvg(fixture, 600, 800, 2);
  
  var diagram = document.getElementById("diagram");
  notEqual( diagram, null, "diagram should be not empty");
  equal(diagram.tagName, "svg", "diagram should be SVG tag");

  equal(diagram.namespaceURI, svgNS, "diagram should be SVG namespace");
  
  equal(diagram.getAttribute("version"), "1.1", "version should be 1.1");
  //equal(diagram.getAttribute("width"), "600", "should have width");
  //equal(diagram.getAttribute("height"), "800", "should have height");

  paper = document.getElementById("diagram.paper");
  notEqual(paper, null, "diagram should have paper");
  equal(paper.tagName, "g", "paper should be a group");
  
  border = paper.getElementsByTagName("rect")[0];
  notEqual(border, null, "diagram should have border");
  
  equal(border.getAttribute("id"), "diagram.paper.border", "border");
  equal(border.getAttribute("x"), "2", "border.x");
  equal(border.getAttribute("y"), "32", "border.y");
  equal(border.getAttribute("width"), "596", "border.width");
  equal(border.getAttribute("height"), "796", "border.hight");
  
  grid = document.getElementById("diagram.paper.grid");
  notEqual(grid, null, "paper should have grid ");
  grids = grid.getElementsByTagName("line");
  notEqual(grids.length, 0, "grid should have lines");
  
});

test("init tests", function() {
  var fixture = document.getElementById("qunit-fixture");
  
  Init(fixture);
  
  notEqual(fixture.getElementsByTagName("svg")[0], null, "init should created SVG element");
 
});