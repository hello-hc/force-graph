import React, { FC, useRef, useEffect } from "react";
import * as d3 from "d3";
import tippy, { Placement } from "tippy.js";

import styles from "./index.module.css";

import "tippy.js/dist/tippy.css";

const { forceSimulation, forceLink, forceManyBody, forceCenter, select } = d3;

interface Node {
  id: string;
  label: string;
}

interface Link {
  source: string;
  target: string;
}

type ID3GraphProps = {
  nodes: Node[];
  links: Link[];
};

const D3Graph: FC<ID3GraphProps> = (props) => {
  const containerRef = useRef<any>(null);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const isShowMenu = useRef(false);
  const oldMenuNode = useRef<any>(null);
  const oldTransform = useRef({
    x: undefined,
    y: undefined,
    k: 1,
  });
  const {
    nodes = [
      { id: "1", label: "Node 1xxxxxxxxxxxxx" },
      { id: "2", label: "Node 2" },
      { id: "3", label: "Node 3" },
      { id: "4", label: "Node 4" },
      { id: "5", label: "Node 5" },
      { id: "6", label: "Node 6" },
      { id: "7", label: "Node 7", root: true },
    ],
    links = [
      { source: "1", target: "2" },
      { source: "2", target: "3" },
      { source: "3", target: "1" },
      { source: "4", target: "5" },
      { source: "5", target: "6" },
      { source: "5", target: "4" },
      { source: "6", target: "4" },
      { source: "1", target: "7" },
      { source: "7", target: "6" },
    ],
  } = props;

  useEffect(() => {
    const graph = d3.select("#graph-svg");
    if (graph) {
      graph.remove();
    }

    const width = containerRef.current?.clientWidth;
    const height = containerRef.current?.clientHeight;
    const nodeRadius = 40;

    const container = d3.select(containerRef.current);
    const svg = container
      .append("svg")
      .attr("id", "graph-svg")
      .attr("width", width ?? 800)
      .attr("height", height ?? 600)
      .attr("viewBox", `0 0 ${width ?? 800} ${height ?? 600}`);
    svgRef.current = svg.node();

    const simulation = forceSimulation(nodes as any)
      .force(
        "link",
        forceLink(links)
          .id((d: any) => d.id)
          .distance(100)
      )
      .force("charge", forceManyBody().strength(-300))
      .force("center", forceCenter(width / 2, height / 2));

    svg.selectAll("*").remove();

    const g = svg.append("g");

    g.append("defs")
      .append("marker")
      .attr("id", "arrow")
      .attr("viewBox", "0 -5 10 10")
      .attr("refX", 15)
      .attr("refY", 0)
      .attr("markerWidth", 6)
      .attr("markerHeight", 6)
      .attr("orient", "auto")
      .append("path")
      .attr("d", "M0,-5L10,0L0,5")
      .attr("fill", "#806d9e");

    const link = g
      .append("g")
      .attr("stroke", "#806d9e")
      .selectAll("line")
      .data(links)
      .enter()
      .append("line")
      .attr("stroke-dasharray", "5,5");

    const node = g
      .append("g")
      .attr("stroke", "#525288")
      .attr("stroke-width", 0.5)
      .selectAll("circle")
      .data(nodes)
      .enter()
      .append("circle")
      .attr("r", 40)
      .attr("fill", (d) => (d.root ? "#525288" : "#d1c2d3"))
      .attr("cursor", "pointer")
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", showContextMenu)
      .call(drag(simulation) as any);

    const text = g
      .append("g")
      .selectAll("text")
      .data(nodes)
      .enter()
      .append("text")
      .attr("fill", (d) => (d.root ? "#fff" : "#333"))
      .attr("text-anchor", "middle")
      .attr("dominant-baseline", "middle")
      .attr("cursor", "pointer")
      .text((d) => d.label)
      .each(function (d) {
        const text = d3.select(this);
        const width = 80;
        // 超出节点宽度后显示...
        if ((text.node() as any)?.getComputedTextLength() > width) {
          text.text(text.text().substring(0, 5) + "...");
        }
      })
      .on("mouseover", handleMouseOver)
      .on("mouseout", handleMouseOut)
      .on("click", (event, d) => {
        showContextMenu(event, d, "label");
      });

    node.append("title").text((d) => d.id);

    function getEdgePoint(
      source: { x: number; y: number },
      target: { x: number; y: number },
      radius: number
    ) {
      const dx = target.x - source.x;
      const dy = target.y - source.y;
      const distance = Math.sqrt(dx * dx + dy * dy);
      const ratio = radius / distance;
      return {
        x: source.x + dx * ratio,
        y: source.y + dy * ratio,
      };
    }

    simulation.on("tick", () => {
      link
        .attr("x1", (d: any) => {
          const { x: x1, y: y1 } = getEdgePoint(d.source, d.target, nodeRadius);
          return x1;
        })
        .attr("y1", (d: any) => {
          const { x: x1, y: y1 } = getEdgePoint(d.source, d.target, nodeRadius);
          return y1;
        })
        .attr("x2", (d: any) => {
          const { x: x2, y: y2 } = getEdgePoint(d.target, d.source, nodeRadius);
          return x2;
        })
        .attr("y2", (d: any) => {
          const { x: x2, y: y2 } = getEdgePoint(d.target, d.source, nodeRadius);
          return y2;
        });

      node.attr("cx", (d: any) => d.x!).attr("cy", (d: any) => d.y!);

      text.attr("x", (d: any) => d.x!).attr("y", (d: any) => d.y!);
    });

    function handleMouseOver(this: any, event: any, d: any) {
      if (isShowMenu.current) return;
      const setNodeStyle = (node: any) => {
        node.attr("stroke", "#d1c2d3").attr("stroke-width", 6);
        if (d.root) {
          node.attr("fill", "#4e2a40");
        } else {
          node.attr("fill", "#c8adc4");
        }
      };

      const element = select(svgRef.current)
        .selectAll("circle")
        .filter((n: any) => n.id === d.id);

      if ((this as any).tagName === "text") {
        setNodeStyle(element);
      } else {
        setNodeStyle(select(this));
      }

      link
        .attr("stroke-dasharray", (l) => {
          if ((l.source as any).id === d.id || (l.target as any).id === d.id) {
            return "0";
          } else {
            return "5,5";
          }
        })
        .attr("stroke", (l) => {
          if ((l.source as any).id === d.id || (l.target as any).id === d.id) {
            return "#806d9e";
          } else {
            return "#d1c2d3";
          }
        })
        .attr("marker-end", (l) => {
          if ((l.source as any).id === d.id || (l.target as any).id === d.id) {
            return "url(#arrow)";
          } else {
            return "";
          }
        });
    }

    function resetNodeStyle(node: any, isRoot: boolean) {
      if (!isRoot) {
        node.attr("stroke", "#525288").attr("stroke-width", 0.5);
        node.attr("fill", "#d1c2d3");
      } else {
        node.attr("stroke", "#525288").attr("stroke-width", 0.5);
        node.attr("fill", "#525288");
      }
    }

    function resetLinkStyle() {
      link
        .attr("stroke-dasharray", (l: any) => {
          return "5,5";
        })
        .attr("stroke", (l: any) => {
          return "#806d9e";
        })
        .attr("marker-end", (l: any) => {
          return "";
        });
    }

    function handleMouseOut(this: any, event: any, d: any) {
      if (isShowMenu.current) return;
      const element = select(svgRef.current)
        .selectAll("circle")
        .filter((n: any) => n.id === d.id);

      if ((this as any).tagName === "text") {
        resetNodeStyle(element, d.root);
      } else {
        resetNodeStyle(select(this), d.root);
      }

      resetLinkStyle();
    }

    function showContextMenu(event: any, d: any, clickType = "node") {
      if (isShowMenu.current && oldMenuNode.current.id !== d.id) {
        const element = select(svgRef.current)
          .selectAll("circle")
          .filter((n: any) => n.id === oldMenuNode.current.id);
        resetNodeStyle(element, oldMenuNode.current.root);
        resetLinkStyle();
      }
      if (isShowMenu.current && oldMenuNode.current.id === d.id) {
        d3.selectAll("#context-menu-group").remove();
        isShowMenu.current = false;
        return;
      }

      isShowMenu.current = true;
      oldMenuNode.current = d;
      const contextMenus = [
        {
          id: 1,
          value: 1,
          icon: "/menu-1.svg",
          icon2: "/menu-white-1.svg",
          label: "菜单1",
        },
        {
          id: 2,
          value: 1,
          icon: "/menu-2.svg",
          icon2: "/menu-white-2.svg",
          label: "菜单2",
        },
        {
          id: 3,
          value: 1,
          icon: "/menu-3.svg",
          icon2: "/menu-white-3.svg",
          label: "菜单3",
        },
      ];

      const x = d.x;
      const y = d.y;

      // 更新当前node的背景色
      if (clickType === "node") {
        d3.select(event.target).attr("fill", "#806d9e");
      } else {
        // 如果点击的是node label，则更新node的背景色
        const element = select(svgRef.current)
          .selectAll("circle")
          .filter((n: any) => n.id === d.id);
        element.attr("fill", "#806d9e");
      }

      d3.selectAll(".context-menu").remove();

      const data = contextMenus;
      const pie = d3.pie();
      const arc: any = d3.arc().innerRadius(40).outerRadius(80);
      const menuGroup = g
        .append("g")
        .attr("class", "context-menu")
        .attr("id", "context-menu-group")
        .attr("transform", `translate(${x}, ${y})`);

      menuGroup
        .selectAll("path")
        .data(pie(data.map((d) => d.value)))
        .enter()
        .append("path")
        .attr("d", arc)
        .attr("class", "context-menu")
        .attr("index", (d) => d.index)
        .attr("id", (d) => `context-menu-item-${d.index}`)
        .attr("fill", "#d1c2d3")
        .attr("stroke", "#fff")
        .attr("cursor", "pointer")
        .on("click", (d, i) => {
          console.log(`Click node `, d, i);
          // d3.selectAll(".context-menu").remove();
        })
        .on("mouseover", function (d, i: any) {
          d3.select(this).attr("fill", "#525288");
          const image = (d3.select(this) as any)?.node?.()?.parentNode
            ?.childNodes?.[i.index + 3];
          d3.select(image).attr("xlink:href", data[i.index].icon2);
          const content = data[i.index].label;
          let placement: Placement = "right";
          let offset: any = [-10, -10];
          if (i.index === 1) {
            placement = "bottom";
            offset = [0, -10];
          } else if (i.index === 2) {
            placement = "left";
          }
          tippy(`#context-menu-item-${i.index}` as any, {
            content: content ?? `菜单${i.index + 1}`,
            arrow: false,
            placement,
            offset,
          });
        })
        .on("mouseout", function (d, i: any) {
          d3.select(this).attr("fill", "#d1c2d3");
          const image = (d3.select(this) as any)?.node?.()?.parentNode
            ?.childNodes?.[i.index + 3];
          d3.select(image).attr("xlink:href", data[i.index].icon);
        });

      menuGroup
        .selectAll("image")
        .data(pie(data.map((d) => d.value)))
        .enter()
        .append("image")
        .attr("xlink:href", (d, i) => data[i].icon)
        .attr("width", 12)
        .attr("height", 12)
        .attr("transform", (d, i) => {
          const [cx, cy] = arc.centroid(d);
          return `translate(${d.index !== 2 ? cx - 10 : cx}, ${cy - 10})`; // Adjust the position to center the icon
        })
        .attr("cursor", "pointer")
        .attr("class", "context-menu")
        .on("mouseover", function (d, i: any) {
          // hover 时 -> 更改path菜单项背景色 and icon颜色
          const path = (d3.select(this) as any)?.node?.()?.parentNode
            ?.childNodes?.[i.index];
          path && d3.select(path).attr("fill", "#525288");
          d3.select(this).attr("xlink:href", data[i.index].icon2);
        })
        .on("mouseout", function (d, i: any) {
          // hover 时 -> 更改path菜单项背景色 and icon颜色
          const path = (d3.select(this) as any)?.node?.()?.parentNode
            ?.childNodes?.[i.index];
          path && d3.select(path).attr("fill", "#d1c2d3");
          d3.select(this).attr("xlink:href", data[i.index].icon);
        })
        .on("click", (d, i) => {
          console.log(`Click node label `, d, i);
          // d3.selectAll(".context-menu").remove();
        });

      d.fx = d.x;
      d.fy = d.y;

      event.preventDefault();
      event.stopPropagation();
    }

    svg.on("click", (e) => {
      if (
        isShowMenu.current &&
        (e.target.tagName === "circle" ||
          e.target.tagName === "text" ||
          e.target.tagName === "path" ||
          e.target.tagName === "image" ||
          e.target.classList.contains("context-menu"))
      ) {
        return;
      }

      d3.selectAll("#context-menu-group").remove();
      if (oldMenuNode.current) {
        const element = select(svgRef.current)
          .selectAll("circle")
          .filter((n: any) => n.id === oldMenuNode.current?.id);
        resetNodeStyle(element, oldMenuNode.current?.root);
        resetLinkStyle();
      }
      isShowMenu.current = false;
    });

    const handleZoom = (event: any) => {
      if (event.sourceEvent === null) {
        return g.attr("transform", event.transform as any);
      } else if ((event.sourceEvent as any).type === "mousemove") {
        // 移动
        const newTransform = d3.zoomIdentity
          .translate(event.transform.x, event.transform.y)
          .scale(oldTransform.current.k);
        g.attr("transform", newTransform as any);
        if (oldTransform.current.x !== event.transform.x) {
          oldTransform.current.x = event.transform.x;
        }
        if (oldTransform.current.y !== event.transform.y) {
          oldTransform.current.y = event.transform.y;
        }
      } else if (
        ((event.sourceEvent as any).ctrlKey ||
          (event.sourceEvent as any).metaKey) &&
        (event.sourceEvent as any).type === "wheel"
      ) {
        if (oldTransform.current.k !== event.transform.k) {
          oldTransform.current = event.transform;
        }
        g.attr("transform", event.transform as any);
      }
    };

    const initialTransform = d3.zoomIdentity
      .translate(width / 2, height / 2)
      .scale(1)
      .translate(-width / 2, -height / 2);

    const zoom = d3
      .zoom()
      .extent([
        [0, 0],
        [width, height],
      ])
      .scaleExtent([0.1, 10])
      .on("zoom", handleZoom);

    svg.call(zoom as any).call(zoom.transform as any, initialTransform);
  }, [nodes, links]);

  /**
   * 节点拖拽
   * @param simulation 力导向图模拟器
   */
  const drag = (simulation: any) => {
    function dragStarted(event: any, d: any) {
      if (isShowMenu.current) return;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      if (isShowMenu.current) return;
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragEnded(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    return d3
      .drag()
      .on("start", dragStarted)
      .on("drag", dragged)
      .on("end", dragEnded);
  };

  return <div ref={containerRef} className={styles["d3-graph-container"]} />;
};

export default D3Graph;
