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

requirejs(["domReady!", "colorpicker", "paper", "control", "metro_toolbar", "common", "uuid"],
  function (domReady, colorPicker, Paper, Control, Toolbar, Common, Uuid) {

  if (navigator.appName == "Microsoft Internet Explorer")
  {
    //alert("Sorry, Internet Explorer is not fully supported now. Please use instead Chrome or Firefox.");
  }
 
  colorPicker.PrepareColorPicker(document.getElementById('colorPicker'));

  var width = (window.innerWidth||document.documentElement.offsetWidth) - 200;
  var height = (window.innerHeight||document.documentElement.offsetHeight) - 20;
  var paperBorderColor = "blue";
  var paperColor = "GhostWhite";
  var stroke = 2;
  
  var root = document.body;
  var svg = document.getElementById("diagram");
  Common.SetAttr(svg, {"width" : width, "height" : height});

  var paper = new Paper();
  var control = new Control();
  var toolbar = new Toolbar();
  
  paper.Control = control;
  toolbar.Control = control;
  control.Paper = paper;
  control.Toolbar = toolbar;
  
  control.Init();
  paper.CreatePaper(svg, width, height, stroke, 0, 0, paperColor, paperBorderColor);
  toolbar.CreateToolbar(root, 160, height, paperColor);
  
});