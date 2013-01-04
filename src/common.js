// $Author$
// $Id$


var xlinkNS = "http://www.w3.org/1999/xlink";
var svgNS = "http://www.w3.org/2000/svg";

function SetAttr(element, attributes)
{
  for(var name in attributes)
  {
    element.setAttribute(name, attributes[name]);
  }
}

function SetAttrNS2(element, namespace, attributes)
{
  for(var name in attributes)
  {
    element.setAttributeNS(namespace, name, attributes[name]);
  }
}

function AddTagNS(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  parent.appendChild(tag);
  SetAttr(tag, attributes);
  return tag;
}

function PrependTagNS(parent, namespace, name, attributes)
{
  var tag = document.createElementNS(namespace, name);
  if (parent.firstChild)
    parent.insertBefore(tag, parent.firstChild);
  else
    parent.appendChild(tag);
    
  SetAttr(tag, attributes);
  return tag;
}

function CreateShadowFilter(svg)
{
  var defs = AddTagNS(svg, svgNS, "defs");
  var filter = AddTagNS(defs, svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
  AddTagNS(filter, svgNS, "feOffset", {"in":"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
  AddTagNS(filter, svgNS, "feGaussianBlur", {"in":"offOut", result:"blurOut", stdDeviation:"8"});
  AddTagNS(filter, svgNS, "feBlend", {"in":"SourceGraphic", in2:"blurOut", mode:"normal" });
}

function RemoveAllChilds(node) {
  if (node.hasChildNodes())
  {
    while (node.childNodes.length >= 1)
    {
        node.removeChild(node.firstChild);
    } 
  }
}

define([], {
  
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

SetAttr: SetAttr,

SetAttrNS2: SetAttrNS2,

});

