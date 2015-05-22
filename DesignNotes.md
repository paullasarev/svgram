# DOM creation #

The testability requirement satisfaction is much easier when we fill the DOM model programmatically. In this case the application structure resembles standard one, such as MVC model and other.

# Shape abstraction #

The Shape abstraction level should be separated and designed as JS class.

Each Shape object should have reference to SVG DOM node.

To connect Shapes to svg each shape node must have unique identifier - attribute id="generated-on-creation-uid".

Shape operations
**construct** move
**resize** export

Shape properties
**style** Knot collection

Inter-Lines connection
**LineSplitter shape**

# Line abstraction #

Line properties:
**style**

Line operations:
**construct** move
**resize** export

# Diagram abstraction #

Diagram have
**collection of Shapes** collection of Lines
**collection of Shape/Knot|Line/Side**

Diagram operations:
**create Shape** create Line
