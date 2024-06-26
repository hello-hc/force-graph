import React, { useEffect, useMemo, useRef, useState } from "react";
import { Network, DataSet } from "vis-network/standalone/umd/vis-network.min";

// import IconOne from "public/menu-1.svg";
// import IconTwo from "public/menu-2.svg";
// import IconThree from "public/menu-3.svg";

import styles from "./index.module.css";

const VisNetworkGraph = () => {
  const containerRef = useRef<any>(null);
  const visNetworkRef = useRef<any>(null);
  const [nodeBoxInfo, setNodeBoxInfo] = useState<any>(null);
  const [hoverIcon, setHoverIcon] = useState<any>(null);

  function hideCircle() {
    let circle = document.getElementById("circle-option");
    if (circle === null) {
      return;
    }
    // circle.style = `display:none;`;
    circle.style.display = "none";
  }

  // 定位div
  function setCirclePosition(
    x: number,
    y: number,
    scale: number,
    nodeInfo: any
  ) {
    const copyCircle = document.getElementById("circle-copy");
    if (copyCircle && nodeInfo.color.background) {
      copyCircle.style.backgroundColor = nodeInfo.color.background;
    }

    let circle = document.getElementById("circle-option");
    if (circle === null) {
      return;
    }
    // circle.style = `left: ${x}px; top: ${y}px;transform:scale(${scale});display:block;`;
    circle.style.left = x + "px";
    circle.style.top = y + "px";
    circle.style.transform = `scale(${scale})`;
    circle.style.display = "block";
    // circle.style.display = "flex";
    // circle.style.justifyContent = "center";
    // circle.style.alignItems = "center";
    // display: flex;
    // justify-content: center;
    // align-items: center;
  }

  useEffect(() => {
    if (containerRef.current === null) {
      return;
    }

    const data = {
      nodes: new DataSet([
        {
          id: 0,
          label: "111",
          // color: { background: "#fd91b7" },
        },
        {
          id: 1,
          label: "222",
          // color: { background: "#7ed6df" },
        },
        {
          id: 2,
          label: "333",
          // color: { background: "#d294e2" },
        },
        {
          id: 3,
          label: "444",
          // color: { background: "#ffb300" },
        },
      ]),
      edges: new DataSet([
        { id: "e1", from: 0, to: 1, label: "ddd" },
        { id: "e2", from: 1, to: 0, label: "aaa" },
        { id: "e3", from: 0, to: 2, label: "step1" },
        { id: "e4", from: 0, to: 3, label: "step1" },
      ]),
    };

    console.log(data, "data");

    const options = {
      autoResize: true, //网络将自动检测其容器的大小调整，并相应地重绘自身
      // locale: "cn", //语言设置：工具栏显示中文
      //设置语言
      // locales: {
      //   cn: {
      //     //工具栏中文翻译
      //     edit: "编辑",
      //     del: "删除当前节点或关系",
      //     back: "返回",
      //     addNode: "添加节点",
      //     addEdge: "添加连线",
      //     editNode: "编辑节点",
      //     editEdge: "编辑连线",
      //     addDescription: "点击空白处可添加节点",
      //     edgeDescription: "点击某个节点拖拽连线可连接另一个节点",
      //     editEdgeDescription: "可拖拽连线改变关系",
      //     createEdgeError: "无法将边连接到集群",
      //     deleteClusterError: "无法删除集群.",
      //     editClusterError: "无法编辑群集'",
      //   },
      // },
      // 设置节点样式
      nodes: {
        shape: "dot", //节点的外观。为circle时label显示在节点内，为dot时label显示在节点下方
        size: 30, //节点的大小，
        shadow: false, //如果为true，则节点使用默认设置投射阴影。
        font: {
          //字体配置
          size: 20,
          color: "rgb(0,0,0)",
          align: "center",
        },
        color: {
          border: "transparent", //节点边框颜色
          background: "rgba(235, 240, 254, 1)", //节点背景颜色
          highlight: {
            //节点选中时状态颜色
            border: "rgb(187, 204, 255)",
            background: "rgb(187, 204, 255)",
          },
          hover: {
            //节点鼠标滑过时状态颜色
            border: "rgba(235, 240, 254, 1)",
            background: "rgb(187, 204, 255)",
          },
        },
        // margin: 5, //当形状设置为box、circle、database、icon、text；label的边距
        widthConstraint: 100, //设置数字，将节点的最小和最大宽度设为该值,当值设为很小的时候，label会换行，节点会保持一个最小值，里边的内容会换行
        borderWidth: 1, //节点边框宽度，单位为px
        borderWidthSelected: 3, //节点被选中时边框的宽度，单位为px
        labelHighlightBold: false, //确定选择节点时标签是否变为粗体
      },
      // 边线配置
      edges: {
        width: 1,
        length: 200,
        color: {
          color: "rgba(79, 122, 253, 1)",
          highlight: "rgba(79, 122, 253, 1)",
          hover: "rgba(79, 122, 253, 1)",
          inherit: "from",
          opacity: 1.0,
        },
        font: {
          color: "#333",
          size: 18, // px
          face: "arial",
          background: "none",
          strokeWidth: 2, // px
          strokeColor: "#ffffff",
          align: "horizontal",
          multi: false,
          adjust: 0,
          // vadjust: 0,
          bold: {
            color: "#333",
            size: 14, // px
            face: "arial",
            // vadjust: 0,
            adjust: 0,
            mod: "bold",
          },
          ital: {
            color: "#333",
            size: 14, // px
            face: "arial",
            // vadjust: 0,
            adjust: 0,
            mod: "italic",
          },
          boldital: {
            color: "#333",
            size: 14, // px
            face: "arial",
            // vadjust: 0,
            adjust: 0,
            mod: "bold italic",
          },
          mono: {
            color: "#333",
            size: 15, // px
            face: "courier new",
            // vadjust: 2,
            adjust: 2,
            mod: "",
          },
        },
        shadow: false,
        // smooth: {
        //   //设置两个节点之前的连线的状态
        //   enabled: true, //默认是true，设置为false之后，两个节点之前的连线始终为直线，不会出现贝塞尔曲线
        // },
        arrows: { to: true }, //箭头指向to
      },
      // 布局
      layout: {
        randomSeed: 1, //配置每次生成的节点位置都一样，参数为数字1、2等
        // hierarchical: {
        // direction: "LR", //UD:上下 DU:下上 LR:左右 RL:右左
        // sortMethod: "directed",
        // }, //层级结构显示}
      },
      //计算节点之前斥力，进行自动排列的属性
      physics: {
        enabled: true, //默认是true，设置为false后，节点将不会自动改变，拖动谁谁动。不影响其他的节点
        barnesHut: {
          gravitationalConstant: -4000,
          centralGravity: 0.3,
          springLength: 120,
          springConstant: 0.04,
          damping: 0.09,
          avoidOverlap: 0,
        },
      },
      //用于所有用户与网络的交互。处理鼠标和触摸事件以及导航按钮和弹出窗口
      interaction: {
        dragNodes: true, //是否能拖动节点
        dragView: true, //是否能拖动画布
        hover: true, //鼠标移过后加粗该节点和连接线
        multiselect: true, //按 ctrl 多选
        selectable: true, //是否可以点击选择
        selectConnectedEdges: true, //选择节点后是否显示连接线
        hoverConnectedEdges: true, //鼠标滑动节点后是否显示连接线
        zoomView: true, //是否能缩放画布
      },
      //操作模块:包括 添加、删除、获取选中点、设置选中点、拖拽系列、点击等等
      manipulation: {
        enabled: true, //该属性表示可以编辑，出现编辑操作按钮
        addNode: true,
        addEdge: true,
        // editNode: undefined,
        editEdge: true,
        deleteNode: true,
        deleteEdge: true,
      },
    };
    const network = new Network(containerRef.current, data, options);

    // 点击鼠标事件
    network.on("click", (e: { nodes: string | any[] }) => {
      console.log(e);
      console.log(network);
      if (e.nodes.length) {
        // 获取节点canvas坐标
        let p = network.getPosition(e.nodes[0]);

        let nodeId = e.nodes[0];
        let boundingBox = network.getBoundingBox(nodeId);
        let width = boundingBox.right - boundingBox.left;
        let height = boundingBox.bottom - boundingBox.top;
        const info: any = data.nodes.get(nodeId);

        console.log(
          info,
          boundingBox,
          "Node " + nodeId + " width: " + width + ", height: " + height
        );

        let nodePosition = network.getPositions([nodeId])[nodeId];
        let nodeRadius = (network as any)?.canvas?.body?.nodes?.[nodeId]?.shape
          ?.radius;
        let width1 = nodeRadius * 2;
        let height1 = nodeRadius * 2;

        console.log(nodePosition, nodeRadius, width1, height1, "hhhhhh");

        console.log(p, e, "eee");
        // 获取缩放尺寸
        let scale = network.getScale();
        console.log(scale);
        // canvas->dom 坐标转化
        console.log(network.canvasToDOM({ x: p.x, y: p.y }));
        let domPosition = network.canvasToDOM({ x: p.x, y: p.y });
        // 设置环形位置
        setCirclePosition(
          domPosition.x - width1 / 2,
          domPosition.y - height1 / 2,
          scale,
          info
        );
        setNodeBoxInfo({
          width: width1,
          height: height1,
          scale,
          color: info?.color,
        });
        // setNodeBoxInfo({ width, height, scale });
      } else {
        hideCircle();
        setNodeBoxInfo(null);
      }
    });
    network.on("dragStart", function (e: any) {
      console.log(e);
      hideCircle();
    });
    network.on("dragging", function (e: any) {
      console.log(e);
    });
    network.on("dragEnd", function (e: any) {
      console.log(e);
    });
    network.on("controlNodeDragging", function (e: any) {
      console.log(e);
      hideCircle();
    });
    network.on("zoom", function (e: any) {
      console.log(e);
      hideCircle();
    });

    visNetworkRef.current = network;
  }, []);

  /* 节点周围的圆环选项配置 */
  // const renderCircleMenu = useMemo(() => {
  //   const { width = 60, height = 60, scale = 1 } = nodeBoxInfo || {};
  //   const menuList = [
  //     {
  //       icon: <IconOne />,
  //       text: "1",
  //     },
  //     {
  //       icon: <IconTwo />,
  //       text: "2",
  //     },
  //     {
  //       icon: <IconThree />,
  //       text: "3",
  //     },
  //   ];

  //   return (
  //     <div
  //       className={styles["circle-menu"]}
  //       id="circle-option"
  //       style={{
  //         width,
  //         height,
  //         ...(scale ? { transform: `scale(${scale})` } : {}),
  //       }}
  //     >
  //       {menuList.map((item, index) => {
  //         const itemDeg = 360 / (menuList.length * 3);
  //         const indexLength1 = itemDeg * (index * 3) + itemDeg * 0;
  //         const indexLength2 = itemDeg * (index * 3) + itemDeg * 1;
  //         const indexLength3 = itemDeg * (index * 3) + itemDeg * 2;

  //         let style = {};

  //         // 缩放比例计算实际位置
  //         let newScale = 1;
  //         if (scale > 1) {
  //           newScale = scale - 1;
  //         } else if (scale < 1) {
  //           newScale = 1 - scale;
  //         }
  //         // 按缩放比例0.1计算每0.1的偏移量
  //         const offset = newScale !== 1 ? width * newScale : 0;

  //         console.log(offset, newScale, width, height, "offset");

  //         if (index === 0) {
  //           style = {
  //             // left: -width / 2 + 10,
  //             left: width + (newScale !== 1 ? 16 / 2 : 0),
  //             top: 0,
  //             // left: -((width - offset) / 2) + 10,
  //             // top: -((height - offset) / 2) + 30,
  //             // ...(scale ? { transform: `scale(${scale})` } : {}),
  //           };
  //         } else if (index === 1) {
  //           style = {
  //             // left: width,
  //             left: width / 2 - 16 / 2,
  //             top: height + 16 / 2,
  //             // ...(scale ? { transform: `scale(${scale})` } : {}),
  //           };
  //         } else if (index === 2) {
  //           style = {
  //             // top: height + 5,
  //             // left: width / 2 - 10,
  //             left: -16,
  //             top: 0,
  //             // ...(scale ? { transform: `scale(${scale})` } : {}),
  //           };
  //         }

  //         return (
  //           <div
  //             key={item.text}
  //             className={styles["circle-container"]}
  //             onClick={() => {
  //               console.log(item, "item:click");
  //               // setHoverIcon(item.text);
  //             }}
  //             onMouseEnter={() => {
  //               setHoverIcon(item.text);
  //             }}
  //             onMouseLeave={() => {
  //               setHoverIcon(null);
  //             }}
  //           >
  //             <div
  //               className={styles["circle-icon"]}
  //               style={{
  //                 ...style,
  //               }}
  //             >
  //               {item.icon}
  //             </div>
  //             <div className={styles["circle-all"]}>
  //               <div
  //                 className={styles["circle-menu_item"]}
  //                 key={item.text + index + 1}
  //                 style={{
  //                   backgroundColor:
  //                     hoverIcon === item.text ? "#7294FD" : "#EBF0FE",
  //                   width: width * 2 + offset,
  //                   height: height * 2 + offset,
  //                   left: -((width + offset) / 2),
  //                   top: -((height + offset) / 2),
  //                   // ...(scale
  //                   //   ? {
  //                   //       transform: `scale(${scale}) rotate(${indexLength1}deg)`,
  //                   //     }
  //                   //   : { transform: `rotate(${indexLength1}deg)` }),
  //                   transform: `rotate(${indexLength1}deg)`,
  //                 }}
  //               ></div>
  //               <div
  //                 className={styles["circle-menu_item"]}
  //                 key={item.text + index + 2}
  //                 style={{
  //                   backgroundColor:
  //                     hoverIcon === item.text ? "#7294FD" : "#EBF0FE",
  //                   width: width * 2 + offset,
  //                   height: height * 2 + offset,
  //                   left: -((width + offset) / 2),
  //                   top: -((height + offset) / 2),
  //                   // ...(scale
  //                   //   ? {
  //                   //       transform: `scale(${scale}) rotate(${indexLength2}deg)`,
  //                   //     }
  //                   //   : { transform: `rotate(${indexLength2}deg)` }),
  //                   transform: `rotate(${indexLength2}deg)`,
  //                 }}
  //               ></div>
  //               <div
  //                 className={styles["circle-menu_item"]}
  //                 key={item.text + index + 3}
  //                 style={{
  //                   backgroundColor:
  //                     hoverIcon === item.text ? "#7294FD" : "#EBF0FE",
  //                   width: width * 2 + offset,
  //                   height: height * 2 + offset,
  //                   left: -((width + offset) / 2),
  //                   top: -((height + offset) / 2),
  //                   // ...(scale
  //                   //   ? {
  //                   //       transform: `scale(${scale}) rotate(${indexLength3}deg)`,
  //                   //     }
  //                   //   : { transform: `rotate(${indexLength3}deg)` }),
  //                   transform: `rotate(${indexLength3}deg)`,
  //                 }}
  //               ></div>
  //             </div>
  //           </div>
  //         );
  //       })}

  //       <div
  //         className={styles["inner-circle"]}
  //         style={{
  //           width,
  //           height,
  //           ...(nodeBoxInfo?.color?.background
  //             ? { backgroundColor: nodeBoxInfo?.color?.background }
  //             : {}),
  //         }}
  //         onClick={() => {
  //           hideCircle();
  //           // console.log('inner-circle')
  //         }}
  //       ></div>
  //     </div>
  //   );
  // }, [nodeBoxInfo, hoverIcon]);

  return (
    <div>
      <div
        id="network_id"
        className={styles["network"]}
        style={{ height: "80vh" }}
        ref={containerRef}
      />
      {/* {renderCircleMenu} */}
    </div>
  );
};

export default VisNetworkGraph;
