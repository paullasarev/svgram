// Common module
// $Author$
// $Id$

define([], {
  
svgNS: "http://www.w3.org/2000/svg",

xlinkNS: "http://www.w3.org/1999/xlink",

AddListener: function (node, selector, eventName, handler)
{
  var nodeList = node.querySelectorAll(selector);
  for (var i = 0; i < nodeList.length; ++i) {
    var item = nodeList[i];
    item.addEventListener(eventName, handler, false);
  }
},

Select: function (node, selector)
{
  var nodeList = node.querySelectorAll(selector);
  var result = {};
  for (var i = 0; i < nodeList.length; ++i) {
    var item = nodeList[i];
    result[i] = item;
  }
  
  return result;
},

Bind: function(node, eventName, object, propertyName) 
{
  node.addEventListener(eventName, object[propertyName].bind(object), false);
},

SetAttr: function(element, attributes)
{
  for(var name in attributes)
  {
    element.setAttribute(name, attributes[name]);
  }
},

SetAttrNS2: function(element, namespace, attributes)
{
  for(var name in attributes)
  {
    element.setAttributeNS(namespace, name, attributes[name]);
  }
},

AddTagNS: function(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  parent.appendChild(tag);
  this.SetAttr(tag, attributes);
  
  return tag;
},

RemoveAllChilds: function (node) {
  if (node.hasChildNodes())
  {
    while (node.childNodes.length >= 1)
    {
        node.removeChild(node.firstChild);
    } 
  }
},

PrependTagNS: function(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  if (parent.firstChild)
    parent.insertBefore(tag, parent.firstChild);
  else
    parent.appendChild(tag);
    
  this.SetAttr(tag, attributes);

  return tag;
},

CreateShadowFilter: function(svg)
{
  var defs = this.AddTagNS(svg, this.svgNS, "defs");
  var filter = this.AddTagNS(defs, this.svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
  this.AddTagNS(filter, this.svgNS, "feOffset", {"in":"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
  this.AddTagNS(filter, this.svgNS, "feGaussianBlur", {"in":"offOut", result:"blurOut", stdDeviation:"8"});
  this.AddTagNS(filter, this.svgNS, "feBlend", {"in":"SourceGraphic", in2:"blurOut", mode:"normal" });
},

});

