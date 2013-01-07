
function CreateSvg(root, width, height, stroke)
{
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var toolbarWidth = 100;
  var paperOffset = 110;
  
  var svg = AddTagNS(root, svgNS, "svg", {id:"diagram", "version":"1.1" , "width": paperOffset + width + 50, "height": height + 50, draggable:"false"});
  SetAttr(svg, {"xmlns:xlink": xlinkNS, "xmlns": svgNS});

  CreateShadowFilter(svg);
  CreateToolbar(svg, toolbarWidth, height, paperColor);
  CreatePaper(svg, width, height, stroke, paperOffset, 0, paperColor, paperBorderColor);
}

function Init(root)
{
  CreateSvg(root, 800, 600, 1);
}


// $Author$
// $Id$

require.config({
  //urlArgs: "bust=" + (new Date()).getTime(), // to prevent RequireJS .js caching in development
  paths: {
    'dhtmlx' : '../lib/dhtmlx-message/codebase/message',
    'dhtmlx-css' : '../lib/dhtmlx-message/codebase/themes/message_skyblue',
  },
  shim: {
    'vkbeautify' : {
      'deps' : [],
      'exports' : 'vkbeautify',
    },
    'webtoolkit.base64' : {
      'exports' : 'Base64',
    },
    'dhtmlx' : {
      'deps' : ['css!dhtmlx-css'],
      'exports' : 'dhtmlx',
    },
  },
});

requirejs(["domReady!", "paper", "control", "toolbar_svg", "common", "uuid"],
  function (domReady, Paper, Control, Toolbar, Common, Uuid) {

  function CreateShadowFilter(svg)
  {
    var defs = Common.AddTagNS(svg, Common.svgNS, "defs");
    var filter = Common.AddTagNS(defs, Common.svgNS, "filter", {id:"shadow", width:"200%", height:"200%"});
    Common.AddTagNS(filter, Common.svgNS, "feOffset", {"in":"SourceAlpha", result:"offOut", dx:"8", dy:"8" });
    Common.AddTagNS(filter, Common.svgNS, "feGaussianBlur", {"in":"offOut", result:"blurOut", stdDeviation:"8"});
    Common.AddTagNS(filter, Common.svgNS, "feBlend", {"in":"SourceGraphic", in2:"blurOut", mode:"normal" });
  }

  
  if (navigator.appName == "Microsoft Internet Explorer")
  {
    //alert("Sorry, Internet Explorer is not fully supported now. Please use instead Chrome or Firefox.");
  }
 
  var toolbarWidth = 90;
  var paperOffset = 100;
  var width = (window.innerWidth||document.documentElement.offsetWidth) - toolbarWidth - 30;
  var height = (window.innerHeight||document.documentElement.offsetHeight) - 30;
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var stroke = 2;
  
  var root = document.body;
  var svg = Common.AddTagNS(root, Common.svgNS, "svg", {id:"diagram", "version":"1.1" , "width": paperOffset + width, "height": height, draggable:"false"});
  Common.SetAttr(svg, {"xmlns:xlink": Common.xlinkNS, "xmlns": Common.svgNS});

  var paper = new Paper();
  var control = new Control();
  var toolbar = new Toolbar();
  
  paper.Control = control;
  toolbar.Control = control;
  control.Paper = paper;
  control.Toolbar = toolbar;
  
  control.Init();

  //CreateShadowFilter(svg);
  toolbar.CreateToolbar(svg, toolbarWidth, height, paperColor);
  paper.CreatePaper(svg, width, height, stroke, paperOffset, 0, paperColor, paperBorderColor);
  
});