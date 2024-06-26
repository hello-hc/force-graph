import React, { useEffect, useRef } from "react";
import cytoscape from "cytoscape";
import cxtmenu from "cytoscape-cxtmenu";
import cytoscapePopper from "cytoscape-popper";
import COSEBilkent from "cytoscape-cose-bilkent";
import tippy from "tippy.js";

// import cytoscapeExpandCollapse from "cytoscape-expand-collapse";
// import d3Force from "cytoscape-d3-force";
// import cise from "cytoscape-cise";
// import fcose from "cytoscape-fcose";

import styles from "./index.module.css";

function popperFactory(
  ref: { getBoundingClientRect: any },
  content: any,
  opts: any
) {
  // Since tippy constructor requires DOM element/elements, create a placeholder
  let dummyDomEle = document.createElement("div");

  let tip = tippy(dummyDomEle, {
    getReferenceClientRect: ref.getBoundingClientRect,
    trigger: "manual", // mandatory
    // dom element inside the tippy:
    content: content,
    // your own preferences:
    arrow: true,
    placement: "bottom",
    hideOnClick: false,
    sticky: "reference",

    // if interactive:
    interactive: true,
    appendTo: document.body, // or append dummyDomEle to document.body
  });

  return tip;
}

// cytoscape.use(cise);
// cytoscape.use(fcose);
// cytoscape.use(d3Force);
// cytoscapeExpandCollapse(cytoscape);
cytoscape.use(COSEBilkent);
cytoscape.use(cxtmenu);
cytoscape.use(cytoscapePopper(popperFactory));

const CytoscapeGraph = () => {
  const containerRef = useRef<any>(null);
  const cyRef = useRef<any>(null);

  useEffect(() => {
    if (!containerRef.current) return;
    const cy = cytoscape({
      container: document.getElementById("graph-canvas"),
      elements: [
        // 你的节点和边的定义
        { data: { id: "a" } },
        { data: { id: "b" } },
        { data: { id: "c" } },
        { data: { id: "d" } },
        { data: { id: "e" } },
        { data: { id: "ab", source: "a", target: "b" } },
        { data: { id: "ac", source: "a", target: "c" } },
        { data: { id: "bd", source: "b", target: "d" } },
        { data: { id: "ce", source: "c", target: "e" } },
      ],

      style: [
        {
          selector: "rootNode",
          style: {
            "background-color": "#4F7AFD",
            color: "#fff",
            label: "data(id)",
          },
        },
        {
          selector: "node",
          style: {
            width: 40,
            height: 40,
            "background-color": "#EBF0FE",
            "border-width": 0.5,
            "border-color": "#7294FD",
            color: "#333",
            label: "data(id)",
            "text-halign": "center",
            "text-valign": "center",
            "font-size": 8,
            "text-wrap": "wrap",
            "overlay-opacity": 0,
          },
        },
        {
          selector: "edge",
          style: {
            width: 0.5,
            "line-color": "#BBCCFF",
            "line-style": "dashed",
            label: "",
            "overlay-opacity": 0,
          },
        },
        {
          selector: ":active",
          style: {
            "overlay-opacity": 0, // 禁用默认 active 效果
          },
        },
        {
          selector: ".hoverNode", // hover 其他节点
          style: {
            "border-width": 3,
            "border-style": "solid",
            "border-color": "#EBF0FE",
            "background-color": "#BBCCFF",
            color: "#333",
          },
        },
        {
          selector: ".hoverNodeRoot", // hover 主节点
          style: {
            "border-width": 3,
            "border-style": "solid",
            "border-color": "#EBF0FE",
            "background-color": "#4368D7",
            color: "#fff",
          },
        },
        {
          selector: ".highlightedNode",
          style: {
            "background-color": "#BBCCFF",
            color: "#333",
          },
        },
        {
          selector: ".highlightedNodeRoot",
          style: {
            "background-color": "#4368D7",
            color: "#fff",
          },
        },
        {
          selector: ".highlightedEdge",
          style: {
            width: 0.5,
            "line-color": "#4F7AFD",
            "line-style": "solid",
            "target-arrow-color": "#4F7AFD",
            "target-arrow-shape": "triangle",
            "curve-style": "bezier",
          },
        },
        {
          selector: ".selected",
          style: {
            "border-width": 0,
          },
        },
      ],
      layout: {
        name: "cose-bilkent",
        nodeDimensionsIncludeLabels: true,
        idealEdgeLength: 100,
      } as any,
      zoom: 1,
      pan: { x: 0, y: 0 },

      // 互动选项
      minZoom: 1e-50,
      maxZoom: 1e50,
      zoomingEnabled: true,
      userZoomingEnabled: true,
      panningEnabled: true,
      userPanningEnabled: true,
      boxSelectionEnabled: true,
      selectionType: "single",
      touchTapThreshold: 8,
      desktopTapThreshold: 4,
      autolock: false,
      autoungrabify: false,
      autounselectify: false,

      // 渲染选项
      headless: false,
      styleEnabled: true,
      hideEdgesOnViewport: false,
      textureOnViewport: false,
      motionBlur: false,
      motionBlurOpacity: 0.2,
      wheelSensitivity: 1,
      pixelRatio: "auto",
    });

    cy.on("mouseover", "node", function (event) {
      const node = event.target;
      console.log(node, "node");
      node.addClass("hoverNode");
      node.connectedEdges().addClass("highlightedEdge");
      node.connectedEdges().connectedNodes().addClass("highlightedNode");
    });

    cy.on("mouseout", "node", function (event) {
      const node = event.target;
      node.removeClass("hoverNode");
      node.connectedEdges().removeClass("highlightedEdge");
      node.connectedEdges().connectedNodes().removeClass("highlightedNode");
    });

    cy.on("click", "node", function (event) {
      const node = event.target;
      node.removeClass("hoverNode");
      node.addClass("selected");
      // node.connectedEdges().removeClass("highlightedEdge");
      // node.connectedEdges().connectedNodes().removeClass("highlightedNode");
    });

    cy.on("grab", "node", () => {
      document.body.style.cursor = "grabbing";
    });

    cy.on("grabStart", "node", () => {
      document.body.style.cursor = "grabbing";
    });

    cy.on("grabEnd", "node", () => {
      document.body.style.cursor = "grab";
    });

    cy.on("free", "node", () => {
      document.body.style.cursor = "default";
    });

    cy.on("zoom", () => {
      document.body.style.cursor = "grab";
    });

    cy.on("pan", () => {
      document.body.style.cursor = "grab";
    });

    const getMenuConfigs = (
      configs?: cytoscapeCxtmenu.Options
    ): cytoscapeCxtmenu.Options => {
      const commands: cxtmenu.Command[] | any = [
        {
          content: "1",
          select: function (ele: any) {
            console.log(ele, "菜单1");
          },
          // fillColor: "rgba(102, 102, 102, 0.8)",
        },
        {
          content: "2",
          select: function (ele: any) {
            console.log(ele, "菜单2");
          },
        },
        {
          content: "3",
          select: function (ele: any) {
            console.log(ele, "菜单3");
          },
        },
      ];

      return {
        itemColor: "#fff",
        itemTextShadowColor: "transparent", // 文本阴影颜色
        selector: "node", // 触发菜单的元素
        openMenuEvents: "click", // 触发菜单事件
        outsideMenuCancel: 1, // 点击节点外部取消菜单
        // maxSpotlightRadius: 200, // 最大半径
        // minSpotlightRadius: 20, // 最小半径
        menuRadius: 40, // 菜单半径
        fillColor: "rgba(0, 0, 0, 0.5)", // 菜单背景颜色
        activeFillColor: "rgba(114, 148, 253, 1)", // 选中菜单背景颜色
        activePadding: 10, // 选中菜单的额外大小
        indicatorSize: 0, // 指示器大小
        separatorWidth: 2, // 分割线宽度
        spotlightPadding: 0, // 菜单和元素之间的间距
        adaptativeNodeSpotlightRadius: true, // 自适应节点半径
        commands: configs?.commands ?? commands,
        ...configs,
      };
    };

    cy.cxtmenu(getMenuConfigs());
    cyRef.current = cy;

    return () => {
      cy?.destroy?.();
    };
  }, []);

  return (
    <div
      id="graph-canvas"
      className={styles["cytoscape-graph-container"]}
      ref={containerRef}
    />
  );
};

export default CytoscapeGraph;
