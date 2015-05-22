# 2013.01.05 #
  * huge refactoring of Control/Paper and overall structure:
    * full transition to [reguire.js](http://requirejs.org/) module infrastructure
    * get rid of all global variables/functions/handlers
    * get rid of multiple .js files inclusion in head .html, all dependencies now are managed and loaded by require.js
    * get rid of binding events in .html

# 2012.12.31 #
  * implement paper resizing

# 2012.12.16 #
  * limit minimal size of shapes, check on resize
  * Make 'About' dialog (button 'svgram')
  * Resize via drag by knotes in only left-right or up-down directions
  * Restore color base functionality

# 2012.12.15 #
  * Rearrange metro view
  * Grouping by dragging shapes on creation
    * now it is possible to drag new text to block shape, and it will be grouped with one
    * work with all shapes
    * grouped shapes are moved together when the parent shape is moved
  * Hide spec elements (resizers, knots) in normal mode. Show only when shape is selected


# 2012.12.09 #
  * Auto-connect Line when drag to rect's knot on creation
    * auto-orient and adjust connected line

# 2012.12.08 #
  * Text editing
    * use [dhtmlx-message](http://dhtmlx.github.com/message/) dialog library
  * Refactor internal structures
    * switch to new Shape abstraction
    * switch to [Jasmine](http://pivotal.github.com/jasmine/) unit testing framework

# 2012.12.01 #
  * Refactor internal structures

# 2012.11.24 #
  * Paper for diagram drawing
  * Toolbar and icons
  * Rectangular shape
  * Line shape
  * Text shape
  * Move shape
  * Change shape by drag on actor points
  * Connect lines to shapes
  * Paper size change by drag at right bottom edge
  * Save
  * Print