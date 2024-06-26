import React, { useEffect, useRef } from "react";
import G6 from "@antv/g6";

interface GraphProps {
  data?: {
    nodes: Array<{
      id: string;
      label?: string;
      [key: string]: any;
    }>;
    edges: Array<{
      source: string;
      target: string;
      label?: string;
      [key: string]: any;
    }>;
  };
}

const globalFontSize = 14;

const G6Graph: React.FC<GraphProps> = ({
  data = {
    nodes: [
      { id: "node1", label: "node label 1", type: "company" },
      { id: "node2", label: "node label 2", type: "project" },
      { id: "node3", label: "node label 3", type: "project" },
      { id: "node4", label: "node label 4", type: "project" },
      { id: "node5", label: "node label 5", type: "project" },
    ],
    edges: [
      { source: "node1", target: "node2", label: "link" },
      { source: "node1", target: "node3", label: "link" },
      { source: "node1", target: "node4", label: "link" },
      { source: "node1", target: "node5", label: "link" },
      { source: "node5", target: "node1", label: "notLink" },
      { source: "node4", target: "node1", label: "notLink" },
      { source: "node3", target: "node1", label: "notLink" },
    ],
  },
}) => {
  const graphRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);

  /**
   * format the string
   * @param {string} str The origin string
   * @param {number} maxWidth max width
   * @param {number} fontSize font size
   * @return {string} the processed result
   */
  const fittingString = (
    str: string | undefined,
    maxWidth: number,
    fontSize: number
  ) => {
    const ellipsis = "...";
    const ellipsisLength = G6.Util.getTextSize(ellipsis, fontSize)[0];
    let currentWidth = 0;
    let res = str;
    const pattern = new RegExp("[\u4E00-\u9FA5]+"); // distinguish the Chinese charactors and letters
    str?.split("").forEach((letter: string, i: any) => {
      if (currentWidth > maxWidth - ellipsisLength) return;
      if (pattern.test(letter)) {
        // Chinese charactors
        currentWidth += fontSize;
      } else {
        // get the width of single letter according to the fontSize
        currentWidth += G6.Util.getLetterWidth(letter, fontSize);
      }
      if (currentWidth > maxWidth - ellipsisLength) {
        res = `${str?.substring(0, i)}${ellipsis}`;
      }
    });
    return res;
  };

  useEffect(() => {
    if (!containerRef.current || !data) return;
    const width = containerRef.current?.clientWidth;
    const height = containerRef.current?.clientHeight - 10 || 500;

    const toolbar = new G6.ToolBar({
      getContent() {
        return `
          <ul>
            <li code='focus'>聚焦</li>
            <li code='reset'>重置</li>
            <li code='zoomIn'>放大</li>
            <li code='zoomOut'>缩小</li>
          </ul>
        `;
      },
      handleClick(code, graph) {
        console.log(code, graph, "code");
        switch (code) {
          case "zoomIn":
            graph.zoom(1.2);
            break;
          case "zoomOut":
            graph.zoom(0.8);
            break;
          case "reset":
            graph.fitView();
            break;
          case "focus":
            graph.fitCenter();
            break;
          default:
            break;
        }
      },
    });
    const tooltip = new G6.Tooltip({
      offsetX: 10,
      offsetY: 20,
      getContent(e: any) {
        const outDiv = document.createElement("div");
        outDiv.style.width = "180px";
        // const currentId = e?.item.getModel().id;
        // const currentItem =
        //   data.nodes.find((node) => node.id === currentId) ??
        //   e?.item.getModel().label;

        outDiv.innerHTML = `
            <h4>tooltip</h4>
            <ul>
              <li>Label: ${
                e?.item.getModel()?.oldLabel || e?.item.getModel().id
              }</li>
            </ul>`;
        return outDiv;
      },
      itemTypes: ["node"],
    });
    const menu = new G6.Menu({
      offsetX: 6,
      offsetY: 10,
      itemTypes: ["node"],
      getContent(e) {
        const outDiv = document.createElement("div");
        outDiv.style.width = "180px";
        outDiv.innerHTML = `<ul>
              <li>测试01</li>
              <li>测试01</li>
              <li>测试01</li>
              <li>测试01</li>
              <li>测试01</li>
            </ul>`;
        return outDiv;
      },
      handleMenuClick(target, item) {
        console.log(target, item);
      },
    });
    const graph = new G6.Graph({
      container: containerRef.current,
      width: width || 1200, // 指定图表宽度
      height: height || 800, // 指定图表高度
      //   fitView: true,
      fitCenter: true,
      modes: {
        default: [
          "drag-canvas",
          "zoom-canvas",
          "drag-node",
          "activate-relations",
          // {
          //   type: "tooltip", // 提示框
          //   formatText(model) {
          //     // 提示框文本内容
          //     const text =
          //       "label: " + model?.oldLabel + "<br/> class: " + model.class;
          //     return text;
          //   },
          // },
          {
            type: "edge-tooltip", // 边提示框
            formatText(model) {
              // 边提示框文本内容
              const text =
                "source: " +
                model.source +
                "<br/> target: " +
                model.target +
                "<br/> weight: " +
                model.weight;
              return text;
            },
          },
        ],
      },
      // plugins: [toolbar, menu],
      plugins: [toolbar, tooltip, menu],
      nodeStateStyles: {
        // hover: {
        //   fill: "#EBF0FE",
        //   "text-shape": {
        //     fill: "#000",
        //   },
        // },
        click: {
          stroke: "#EBF0FE",
          lineWidth: 8,
        },
        highlight: {
          opacity: 1,
        },
        dark: {
          opacity: 0.2,
        },
      },
      edgeStateStyles: {
        // hover: {
        //   stroke: "#EBF0FE",
        // },
        click: {
          stroke: "steelblue",
        },
        highlight: {
          stroke: "#999",
          // "text-shape": {
          //   fill: "#0f0",
          // },
        },
      },
      layout: {
        type: "force",
        // edgeStrength: 0.7,
        // begin: [0, 0], // 布局起始点
        preventOverlap: true, // 防止节点重叠
        // preventOverlapPadding: 60, // 防止节点重叠的间距
        // center: [200, 200],
        linkDistance: 120,
        nodeStrength: 30,
        edgeStrength: 0.1,
        // collideStrength: 0.8,
        nodeSize: 60,
        nodeSpacing: 30,
        // alpha: 0.3,
        // alphaDecay: 0.028,
        // alphaMin: 0.01,
        // forceSimulation: null,
      },
      defaultNode: {
        size: 60,
        style: {
          fill: "#4F7AFD",
          stroke: "#4F7AFD",
        },
        labelCfg: {
          // refY: 20,
          style: {
            fill: "#fff",
            fontSize: globalFontSize,
          },
        },
      },
      defaultEdge: {
        type: "quadratic",
        labelCfg: {
          autoRotate: true,
        },
        style: {
          endArrow: true,
        },
      },
      minZoom: 0.5,
      animate: true,
    });

    data.nodes.forEach(function (node) {
      const label = firstRender.current ? node.label : node.oldLabel;
      node.oldLabel = label;
      node.label = fittingString(label, node.size, globalFontSize);

      switch (node.type) {
        case "Company":
          node.style = {
            fill: "#4F7AFD",
            stroke: "#4F7AFD",
          };
          node.labelCfg = {
            style: {
              fill: "#fff",
              fontSize: globalFontSize,
            },
          };
          break;
        case "Person":
          node.style = {
            fill: "#fdc212",
            stroke: "#fdc212",
          };
          node.labelCfg = {
            style: {
              fill: "#fff",
              fontSize: globalFontSize,
            },
          };
          break;
        case "InvestProject":
          node.style = {
            fill: "#7a4efd",
            stroke: "#7a4efd",
          };
          node.labelCfg = {
            style: {
              fill: "#fff",
              fontSize: globalFontSize,
            },
          };
          break;
        case "InvestFund":
          node.style = {
            fill: "#4efd7a",
            stroke: "#4efd7a",
          };
          node.labelCfg = {
            style: {
              fill: "#fff",
              fontSize: globalFontSize,
            },
          };
          break;
        case "InvestEvent":
          node.style = {
            fill: "#fd4e7a",
            stroke: "#fd4e7a",
          };
          node.labelCfg = {
            style: {
              fill: "#fff",
              fontSize: globalFontSize,
            },
          };
          break;
        default:
          break;
      }
    });

    data.edges.forEach(function (edge) {
      const label = firstRender.current ? edge.label : edge.oldLabel;
      edge.oldLabel = label;
      edge.label = fittingString(edge.label, 120, globalFontSize);
    });

    graph.on("node:mouseenter", (e) => {
      const nodeItem = e.item;
      if (!nodeItem) return;
      // graph.setItemState(nodeItem, "hover", true);
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node) {
        graph.clearItemStates(node);
        graph.setItemState(node, "dark", true);
      });
      graph.setItemState(nodeItem, "dark", false);
      graph.setItemState(nodeItem, "highlight", true);
      graph.getEdges().forEach(function (edge) {
        if (edge.getSource() === nodeItem) {
          graph.setItemState(edge.getTarget(), "dark", false);
          graph.setItemState(edge.getTarget(), "highlight", true);
          graph.setItemState(edge, "highlight", true);
          edge.toFront();
        } else if (edge.getTarget() === nodeItem) {
          graph.setItemState(edge.getSource(), "dark", false);
          graph.setItemState(edge.getSource(), "highlight", true);
          graph.setItemState(edge, "highlight", true);
          edge.toFront();
        } else {
          graph.setItemState(edge, "highlight", false);
        }
      });
      graph.paint();
      graph.setAutoPaint(true);
    });

    function clearAllStats() {
      graph.setAutoPaint(false);
      graph.getNodes().forEach(function (node) {
        graph.clearItemStates(node);
      });
      graph.getEdges().forEach(function (edge) {
        graph.clearItemStates(edge);
      });
      graph.paint();
      graph.setAutoPaint(true);
    }

    graph.on("node:mouseleave", clearAllStats);
    graph.on("canvas:click", clearAllStats);

    graph.on("node:click", (e) => {
      const clickNodes = graph.findAllByState("node", "click");
      clickNodes.forEach((cn) => {
        graph.setItemState(cn, "click", false);
      });
      const nodeItem = e.item;
      if (!nodeItem) return;
      graph.setItemState(nodeItem, "click", true);
    });

    graph.on("edge:click", (e) => {
      const clickEdges = graph.findAllByState("edge", "click");
      clickEdges.forEach((ce) => {
        graph.setItemState(ce, "click", false);
      });
      const edgeItem = e.item;
      if (!edgeItem) return;
      graph.setItemState(edgeItem, "click", true);
    });

    graphRef.current = graph;
    graph.data(data);
    graph.render();
    if (firstRender.current) {
      firstRender.current = false;
    }

    return () => graph.destroy();
  }, [data]);

  return (
    <div
      ref={containerRef}
      style={{
        width: "100%",
        height: "100vh",
      }}
      id="chart-container"
    />
  );
};

export default G6Graph;
