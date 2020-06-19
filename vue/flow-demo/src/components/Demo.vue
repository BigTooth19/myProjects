<template>
  <div id="sample">
    <div style="width: 100%; display: flex; justify-content: space-between">
      <div id="myPaletteDiv" style="width: 100px; margin-right: 2px;"></div>
      <div id="myDiagramDiv" style="flex-grow: 1; height: 750px;"></div>
    </div>
    <button id="SaveButton" @click="save">Save</button>
    <button @click="load">Load</button>
    Diagram Model saved in JSON format:
    <textarea id="mySavedModel" style="width:100%;height:300px">
      { "class": "go.GraphLinksModel",
        "linkFromPortIdProperty": "fromPort",
        "linkToPortIdProperty": "toPort",
        "nodeDataArray": [
          {"key":0, "loc":"-5 75", "nodeName":"上客开始", "nodeTime": "1220", "color": "#F9A328"},
          {"key":1, "loc":"175 100", "nodeName":"上客开始", "nodeTime": "1220", "color": "#4BAC59"},
          {"key":2, "loc":"175 200", "nodeName":"上客开始", "nodeTime": "1220", "color": "#3E3E46"},
          {"key":3, "loc":"175 290", "nodeName":"上客开始", "nodeTime": "1220", "color": "#4BAC59"},
          {"key":4, "loc":"175 380", "nodeName":"上客开始", "nodeTime": "1220", "color": "#F9A328"},
          {"key":5, "loc":"355 85", "nodeName":"上客开始", "nodeTime": "1220", "color": "#4BAC59"},
          {"key":6, "loc":"175 450", "nodeName":"上客开始", "nodeTime": "1220", "color": "#F9A328"},
          {"key":7, "loc":"175 515", "nodeName":"上客开始", "nodeTime": "1220", "color": "#4BAC59"},
          {"key":8, "loc":"175 585", "nodeName":"上客开始", "nodeTime": "1220", "color": "#F9A328"}
        ],
        "linkDataArray": [
          {"from":1, "to":2, "fromPort":"B", "toPort":"T"},
          {"from":2, "to":3, "fromPort":"B", "toPort":"T"},
          {"from":3, "to":4, "fromPort":"B", "toPort":"T"},
          {"from":4, "to":6, "fromPort":"B", "toPort":"T"},
          {"from":6, "to":7, "fromPort":"B", "toPort":"T"},
          {"from":7, "to":8, "fromPort":"B", "toPort":"T"},
          {"from":8, "to":-2, "fromPort":"B", "toPort":"T"},
          {"from":-1, "to":0, "fromPort":"B", "toPort":"T"},
          {"from":-1, "to":1, "fromPort":"B", "toPort":"T"},
          {"from":-1, "to":5, "fromPort":"B", "toPort":"T"},
          {"from":5, "to":4, "fromPort":"B", "toPort":"T"},
          {"from":0, "to":4, "fromPort":"B", "toPort":"T"}
      ]}
    </textarea>
  </div>
</template>
<script>
export default {
  name: 'Demo',
  data(){
    return {
      MAKE: go.GraphObject.make,
      myDiagram: null,
      goSamples: window.goSamples,
      myPalette: null
    }
  },
  methods: {
    init() {
      if (this.goSamples) this.goSamples();  // init for these samples -- you don't need to call this
      this.myDiagram = this.MAKE(go.Diagram,
        "myDiagramDiv",  // must name or refer to the DIV HTML element
        {
          "animationManager.initialAnimationStyle": go.AnimationManager.None,
          "LinkDrawn": this.showLinkLabel,  // this DiagramEvent listener is defined below
          "LinkRelinked": this.showLinkLabel,
          "undoManager.isEnabled": true  // enable undo & redo
        }
      );

      // when the document is modified, add a "*" to the title and enable the "Save" button
      this.myDiagram.addDiagramListener("Modified", () => {
        var button = document.getElementById("SaveButton");
        if (button) button.disabled = !this.myDiagram.isModified;
        var idx = document.title.indexOf("*");
        if (this.myDiagram.isModified) {
          if (idx < 0) document.title += "*";
        } else {
          if (idx >= 0) document.title = document.title.substr(0, idx);
        }
      });

      this.myDiagram.nodeTemplateMap.add("",  // the default category
        this.MAKE(go.Node, "Auto", this.nodeStyle(),
          {
            click: function(e, obj) {
              console.log(obj.jb);
            }
          },
          // the main object is a Panel that surrounds a TextBlock with a rectangular Shape
          this.MAKE(
            go.Shape, "Rectangle",
            {
              maxSize: new go.Size(160, 45)
            },
            new go.Binding("stroke", "color"),
            new go.Binding("fill", "color"),
            new go.Binding("figure", "figure"),
            new go.Binding("text", "nodeName")
          ),
          this.MAKE(go.Panel, "Vertical",
            {
              isEnabled: true
            },
            this.MAKE(
              go.TextBlock, this.textStyle(),
              {
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text", "nodeName")
            ),
            this.MAKE(
              go.TextBlock, this.textStyle(),
              {
                wrap: go.TextBlock.WrapFit,
                editable: true
              },
              new go.Binding("text", "nodeTime")
            )
          ),
          // four named ports, one on each side:
          this.makePort("T", go.Spot.Top, go.Spot.TopSide, false, true),
          this.makePort("L", go.Spot.Left, go.Spot.LeftSide, true, true),
          this.makePort("R", go.Spot.Right, go.Spot.RightSide, true, true),
          this.makePort("B", go.Spot.Bottom, go.Spot.BottomSide, true, false)
        ));


      // replace the default Link template in the linkTemplateMap
      this.myDiagram.linkTemplate =
        this.MAKE(go.Link,  // the whole link panel
          {
            routing: go.Link.AvoidsNodes,
            // curve: go.Link.JumpOver,
            corner: 0,
            toShortLength: 4,
            relinkableFrom: true,
            relinkableTo: true,
            reshapable: true,
            resegmentable: true,
            // mouse-overs subtly highlight links:
            mouseEnter: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
            mouseLeave: function(e, link) { link.findObject("HIGHLIGHT").stroke = "transparent"; },
            selectionAdorned: false
          },
          new go.Binding("points").makeTwoWay(),
          this.MAKE(go.Shape,  // the highlight shape, normally transparent
            { isPanelMain: true, strokeWidth: 8, stroke: "transparent", name: "HIGHLIGHT" }),
          this.MAKE(go.Shape,  // the link path shape
            { isPanelMain: true, stroke: "gray", strokeWidth: 1 },
            new go.Binding("stroke", "isSelected", function(sel) { return sel ? "dodgerblue" : "blue"; }).ofObject()),
          this.MAKE(go.Shape,  // the arrowhead
            { toArrow: "standard", strokeWidth: 0, fill: "blue" }),
          // this.MAKE(go.Panel, "Auto",  // the link label, normally not visible
          //   { visible: false, name: "LABEL", segmentIndex: 2, segmentFraction: 0.5 },
          //   new go.Binding("visible", "visible").makeTwoWay(),
          //   this.MAKE(go.Shape, "RoundedRectangle",  // the label shape
          //     { fill: "#F8F8F8", strokeWidth: 0 }),
          //   this.MAKE(go.TextBlock, "Yes",  // the label
          //     {
          //       textAlign: "center",
          //       font: "10pt helvetica, arial, sans-serif",
          //       stroke: "#333333",
          //       editable: true
          //     },
          //     new go.Binding("text").makeTwoWay())
          // )
        );

      // temporary links used by LinkingTool and RelinkingTool are also orthogonal:
      this.myDiagram.toolManager.linkingTool.temporaryLink.routing = go.Link.Orthogonal;
      this.myDiagram.toolManager.relinkingTool.temporaryLink.routing = go.Link.Orthogonal;


      this.load();  // load an initial diagram from some JSON text

      // initialize the Palette that is on the left side of the page
      this.myPalette = this.MAKE(go.Palette, "myPaletteDiv",  // must name or refer to the DIV HTML element
        {
          // Instead of the default animation, use a custom fade-down
          "animationManager.initialAnimationStyle": go.AnimationManager.None,
          nodeTemplateMap: this.myDiagram.nodeTemplateMap,  // share the templates used by myDiagram
          model: new go.GraphLinksModel([  // specify the contents of the Palette
            { text: "Step", "nodeName": "节点名称", "nodeTime": "节点时间" }
          ])
      });
    },
    showLinkLabel(e) {
      var label = e.subject.findObject("LABEL");
      if (label !== null) label.visible = (e.subject.fromNode.data.category === "Conditional");
    },
    nodeStyle() {
      return [
        new go.Binding("location", "loc", go.Point.parse).makeTwoWay(go.Point.stringify),
        {
          locationSpot: go.Spot.Center
        }
      ];
    },
    makePort(name, align, spot, output, input) {
      var horizontal = align.equals(go.Spot.Top) || align.equals(go.Spot.Bottom);
      return this.MAKE(go.Shape,
        {
          fill: "transparent",  // changed to a color in the mouseEnter event handler
          strokeWidth: 0,  // no stroke
          width: horizontal ? NaN : 8,  // if not stretching horizontally, just 8 wide
          height: !horizontal ? NaN : 8,  // if not stretching vertically, just 8 tall
          alignment: align,  // align the port on the main Shape
          stretch: (horizontal ? go.GraphObject.Horizontal : go.GraphObject.Vertical),
          portId: name,  // declare this object to be a "port"
          fromSpot: spot,  // declare where links may connect at this port
          fromLinkable: output,  // declare whether the user may draw links from here
          toSpot: spot,  // declare where links may connect at this port
          toLinkable: input,  // declare whether the user may draw links to here
          cursor: "pointer",  // show a different cursor to indicate potential link point
          mouseEnter: function(e, port) {  // the PORT argument will be this Shape
            if (!e.diagram.isReadOnly) port.fill = "rgba(255,0,255,0.5)";
          },
          mouseLeave: function(e, port) {
            port.fill = "transparent";
          }
        });
    },
    textStyle() {
      return {
        font: "bold 14px Lato, Helvetica, Arial, sans-serif",
        stroke: "#F8F8F8"
      }
    },
    // Show the diagram's model in JSON format that the user may edit
    save() {
      document.getElementById("mySavedModel").value = this.myDiagram.model.toJson();
      this.myDiagram.isModified = false;
    },
    load() {
      this.myDiagram.model = go.Model.fromJson(document.getElementById("mySavedModel").value);
    }
  },
  mounted() {
    this.init();
  }
}
</script>

