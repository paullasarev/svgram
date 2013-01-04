define(["common", "vkbeautify", "webtoolkit.base64"], function(Common, XmlBeautify, Base64) {
  function ExportSvg() {
  }
  
  ExportSvg.prototype.Export = function()
  {
    var svg = document.getElementById('diagram');
    var copySvg = svg.cloneNode(false);
    copySvg.id = 'newDiagram';
    
    var svg_paper_root = document.getElementById('diagram.paper').cloneNode(true);
    copySvg.appendChild(svg_paper_root);	
    this.FilterSvgNodes(copySvg);	
    
    var serializer = new XMLSerializer();
    var copySvgString = XmlBeautify.xml(serializer.serializeToString(copySvg));
    var copySvgBase64 = Base64.encode(copySvgString);	
    var wnd = window.open("data:image/svg+xml;charset=utf-8;base64,\n" + copySvgBase64, "Save_Print", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
    // var wnd = window.open("data:image/svg+xml", "Svg diagram", "toolbar=yes,status=1,menubar=yes,width=" + PaperWidth + ",height=" + PaperHeight);
    // wnd.document.write(copySvgString);
  };

  ExportSvg.prototype.FilterSvgNodes = function (parent)
  {
    var attr = parent.getAttribute('cursor');
    if (attr) {
       parent.removeAttribute('cursor');
    }
    
    var attributesToRemove = {svgram:"", onmouseover:"", onmouseup:"", onmousedown:"", onmouseout:""};
    next_node:
    for (var i = parent.childNodes.length - 1 ; i >= 0 ; i--) 
    {
      var node = parent.childNodes[i];
      
      if(node.tagName == "text")
        continue;
      
      for(var name in attributesToRemove)
      {
        attr = node.getAttribute(name);
        if (attr) {
          parent.removeChild(node);
          continue next_node;
        }
      }

      this.FilterSvgNodes(parent.childNodes[i]);
    }
  };
  
  return ExportSvg;
});
