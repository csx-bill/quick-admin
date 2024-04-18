import React, { useEffect, useRef, useState } from 'react';

import LogicFlow from '@logicflow/core';
import { BPMNElements, Control, DndPanel, SelectionSelect } from '@logicflow/extension';
import { toast, ToastComponent } from 'amis-ui';
import { useParams } from 'umi';

// 引入LogicFlow的样式文件
import '@logicflow/core/dist/style/index.css';
import '@logicflow/extension/lib/style/index.css';

import './common.scss';

import { getById, getByIdXml, saveXml } from '@/api/flow';

import warmAdapter from './warmAdapter';

export const FlowChart: React.FC = () => {
  // This ref will provide direct access to the DOM element
  const containerRef = useRef<HTMLDivElement>(null);

  const params = useParams();

  const [definition, setDefinition] = useState({});
  const [definitionXml, setDefinitionXml] = useState({});

  useEffect(() => {
    async function fetchFlowDefinition() {
      const resXml = await getByIdXml({ id: params.id });
      setDefinitionXml(resXml.data);
      const res = await getById({ id: params.id });
      setDefinition(res.data);
    }
    fetchFlowDefinition();
  }, []);

  if (containerRef.current) {
    // LogicFlow配置选项
    const lf = new LogicFlow({
      container: containerRef.current,
      grid: {
        visible: true,
        type: 'mesh',
        size: 10,
        config: {
          color: '#eeeeee',
        },
      },
      height: 500,
      hoverOutline: false,
      edgeSelectedOutline: false,
      keyboard: {
        enabled: true,
      },
      plugins: [BPMNElements, SelectionSelect, DndPanel, Control, warmAdapter],
    });

    // 拖拽面板
    lf.extension.dndPanel.setPatternItems([
      {
        label: '选区',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII=',
        callback: () => {
          lf.extension.selectionSelect.openSelectionSelect();
          lf.once('selection:selected', () => {
            lf.extension.selectionSelect.closeSelectionSelect();
          });
        },
      },
      {
        type: 'bpmn:startEvent',
        text: '开始',
        label: '开始节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg==',
      },
      {
        type: 'bpmn:userTask',
        text: '用户任务',
        label: '用户任务',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg==',
      },
      {
        type: 'bpmn:exclusiveGateway',
        text: '排他网关',
        label: '排他网关',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=',
      },
      {
        type: 'bpmn:parallelGateway',
        text: '并行网关',
        label: '并行网关',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII=',
      },
      {
        type: 'bpmn:endEvent',
        text: '结束',
        label: '结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAA1BJREFUOBFtVE1IVUEYPXOf+tq40Y3vPcmFIdSjIorWoRG0ERWUgnb5FwVhYQSl72oUoZAboxKNFtWiwKRN0M+jpfSzqJAQclHo001tKkjl3emc8V69igP3znzfnO/M9zcDcKT67azmjYWTwl9Vn7Vumeqzj1DVb6cleQY4oAVnIOPb+mKAGxQmKI5CWNJ2aLPatxWa3aB9K7/fB+/Z0jUF6TmMlFLQqrkECWQzOZxYGjTlOl8eeKaIY5yHnFn486xBustDjWT6dG7pmjHOJd+33t0iitTPkK6tEvjxq4h2MozQ6WFSX/LkDUGfFwfhEZj1Auz/U4pyAi5Sznd7uKzznXeVHlI/Aywmk6j7fsUsEuCGADrWARXXwjxWQsUbIupDHJI7kF5dRktg0eN81IbiZXiTESic50iwS+t1oJgL83jAiBupLDCQqwziaWSoAFSeIR3P5Xv5az00wyIn35QRYTwdSYbz8pH8fxUUAtxnFvYmEmgI0wYXUXcCCSpeEVpXlsRhBnCEATxWylL9+EKCAYhe1NGstUa6356kS9NVvt3DU2fd+Wtbm/+lSbylJqsqkSm9CRhvoJVlvKPvF1RKY/FcPn5j4UfIMLn8D4UYb54BNsilTDXKnF4CfTobA0FpoW/LSp306wkXM+XaOJhZaFkcNM82ASNAWMrhrUbRfmyeI1FvRBTpN06WKxa9BK0o2E4Pd3zfBBEwPsv9sQBnmLVbLEIZ/Xe9LYwJu/Er17W6HYVBc7vmuk0xUQ+pqxdom5Fnp55SiytXLPYoMXNM4u4SNSCFWnrVIzKG3EGyMXo6n/BQOe+bX3FClY4PwydVhthOZ9NnS+ntiLh0fxtlUJHAuGaFoVmttpVMeum0p3WEXbcll94l1wM/gZ0Ccczop77VvN2I7TlsZCsuXf1WHvWEhjO8DPtyOVg2/mvK9QqboEth+7pD6NUQC1HN/TwvydGBARi9MZSzLE4b8Ru3XhX2PBxf8E1er2A6516o0w4sIA+lwURhAON82Kwe2iDAC1Watq4XHaGQ7skLcFOtI5lDxuM2gZe6WFIotPAhbaeYlU4to5cuarF1QrcZ/lwrLaCJl66JBocYZnrNlvm2+MBCTmUymPrYZVbjdlr/BxlMjmNmNI3SAAAAAElFTkSuQmCC',
      },
    ]);

    // 控制面板
    lf.extension.control.addItem({
      iconClass: 'lf-control-save',
      title: '',
      text: '保存',
      onClick: (lf, ev) => {
        saveXml({ id: params.id, xmlString: lf.getGraphData() }).then((res) => {
          if (res.status === 0) {
            toast.success('保存成功！', '提示');
          } else {
            toast.error('保存失败！', '提示');
          }
        });
      },
    });

    //   let xmlDoc = null;
    //   if (window.DOMParser) {
    //     const parser = new DOMParser();
    //     xmlDoc = parser.parseFromString(xml, 'text/xml');
    //   } else {
    //     // Internet Explorer
    //     // eslint-disable-next-line no-undef
    //     xmlDoc = new ActiveXObject('Microsoft.XMLDOM');
    //     xmlDoc.async = false;
    //     xmlDoc.loadXML(xml);
    //   }
    //   return xmlDoc;
    // };

    // /**
    //  * 将warm-flow的定义文件转成LogicFlow支持的数据格式
    //  * @param {*} xml
    //  * @returns
    //  */
    // const warmXml2LogicFlowJson = (xml) => {
    //   const graphData = {
    //     nodes: [],
    //     edges: [],
    //   };
    //   const xmlDoc = parseXml2Dom(xml);
    //   const definitionDom = xmlDoc.getElementsByTagName('definition');
    //   if (!definitionDom.length) {
    //     return graphData;
    //   }
    //   let value = null;
    //   // 解析definition属性
    //   DEFINITION_KEYS.forEach((key) => {
    //     value = definitionDom[0].getAttribute(key);
    //     if (value) {
    //       graphData[key] = value;
    //     }
    //   });
    //   let nodeEles = null;
    //   let node = null;
    //   let lfNode = {};
    //   // 解析节点
    //   nodeEles = definitionDom[0].getElementsByTagName('node');
    //   if (nodeEles.length) {
    //     for (var i = 0, len = nodeEles.length; i < len; i++) {
    //       node = nodeEles[i];
    //       lfNode = {
    //         text: {},
    //         properties: {},
    //       };
    //       // 处理节点
    //       NODE_ATTR_KEYS.forEach((attrKey) => {
    //         value = node.getAttribute(attrKey);
    //         if (value) {
    //           if (attrKey === 'nodeType') {
    //             lfNode.type = value;
    //           } else if (attrKey === 'nodeCode') {
    //             lfNode.id = value;
    //           } else if (attrKey === 'coordinate') {
    //             const attr = value.split('|');
    //             const nodeXy = attr[0].split(',');
    //             lfNode.x = parseInt(nodeXy[0]);
    //             lfNode.y = parseInt(nodeXy[1]);
    //             if (attr.length === 2) {
    //               const textXy = attr[1].split(',');
    //               lfNode.text.x = parseInt(textXy[0]);
    //               lfNode.text.y = parseInt(textXy[1]);
    //             }
    //           } else if (attrKey === 'nodeName') {
    //             lfNode.text.value = value;
    //           } else {
    //             lfNode.properties[attrKey] = value;
    //           }
    //         }
    //       });
    //       graphData.nodes.push(lfNode);
    //       // 处理边
    //       let skipEles = null;
    //       let skipEle = null;
    //       let edge = {};
    //       skipEles = node.getElementsByTagName('skip');
    //       for (var j = 0, lenn = skipEles.length; j < lenn; j++) {
    //         skipEle = skipEles[j];
    //         edge = {
    //           text: {},
    //           properties: {},
    //         };
    //         edge.id = skipEle.getAttribute('id');
    //         edge.type = 'skip';
    //         edge.sourceNodeId = lfNode.id;
    //         edge.targetNodeId = skipEle.textContent;
    //         edge.text = {
    //           value: skipEle.getAttribute('skipName'),
    //         };
    //         edge.properties.skipCondition = skipEle.getAttribute('skipCondition');
    //         edge.properties.skipName = skipEle.getAttribute('skipName');
    //         edge.properties.skipType = skipEle.getAttribute('skipType');
    //         const expr = skipEle.getAttribute('expr');
    //         if (expr) {
    //           edge.properties.expr = expr;
    //         }
    //         const coordinate = skipEle.getAttribute('coordinate');
    //         if (coordinate) {
    //           const coordinateXy = coordinate.split('|');
    //           edge.pointsList = [];
    //           coordinateXy[0].split(';').forEach((item) => {
    //             const pointArr = item.split(',');
    //             edge.pointsList.push({
    //               x: parseInt(pointArr[0]),
    //               y: parseInt(pointArr[1]),
    //             });
    //           });
    //           edge.startPoint = edge.pointsList[0];
    //           edge.endPoint = edge.pointsList[edge.pointsList.length - 1];
    //           if (coordinateXy.length > 1) {
    //             let textXy = coordinateXy[1].split(',');
    //             edge.text.x = parseInt(textXy[0]);
    //             edge.text.y = parseInt(textXy[1]);
    //           }
    //         }
    //         graphData.edges.push(edge);
    //       }
    //     }
    //   }

    //   return graphData;
    // };

    // 这里把Warm转换为LogicFlow支持的格式
    // lf.adapterIn = function (warmData) {
    //   const logicFlowData = warmXml2LogicFlowJson(warmData);
    //   console.log('logicFlowData', logicFlowData);
    //   return logicFlowData;
    // };

    // // 这里把LogicFlow生成的数据转换为Warm需要的格式。
    // lf.adapterOut = function (logicFlowData) {
    //   const nodeMap = new Map();
    //   const warmData = {
    //     flowElementList: [],
    //   };
    //   // nodes 节点
    //   logicFlowData.nodes.forEach((node) => {
    //     const flowElement = convertNodeToWarmElement(node);
    //     // edges 连接线
    //     flowElement.skip = logicFlowData.edges
    //       .filter((edge) => {
    //         return edge.sourceNodeId === node.id;
    //       })
    //       .map((edge) => {
    //         let coordinate = '';
    //         for (let i = 0; i < edge.pointsList.length; i++) {
    //           coordinate =
    //             coordinate + parseInt(edge.pointsList[i].x) + ',' + parseInt(edge.pointsList[i].y);
    //           if (i !== edge.pointsList.length - 1) {
    //             coordinate = coordinate + ';';
    //           }
    //         }
    //         if (edge.text) {
    //           coordinate = coordinate + '|' + parseInt(edge.text.x) + ',' + parseInt(edge.text.y);
    //         }
    //         return {
    //           skipType: edge.properties.skipType,
    //           skipCondition: edge.properties.skipCondition,
    //           skipName: edge.properties.skipName,
    //           textContent: edge.targetNodeId, // 目地节点id
    //           coordinate: coordinate,
    //         };
    //       });
    //     warmData.flowElementList.push(flowElement);
    //     nodeMap.set(node.id, flowElement);
    //   });
    //   return warmData;
    // };

    // const WarmType = {
    //   // 开始
    //   START: 'start',
    //   // 中间节点
    //   BETWEEN: 'between',
    //   // 结束
    //   END: 'end',
    //   // 互斥网关 （排他网关）
    //   SERIAL: 'serial',
    //   // 并行网关
    //   PARALLEL: 'parallel',
    //   // 连接线
    //   SKIP: 'skip',
    // };
    // // 转换Warm识别的类型
    // function getWarmType(type) {
    //   switch (type) {
    //     case 'bpmn:startEvent':
    //       return WarmType.START;
    //     case 'bpmn:userTask':
    //       return WarmType.BETWEEN;
    //     case 'bpmn:endEvent':
    //       return WarmType.END;
    //     case 'bpmn:exclusiveGateway':
    //       return WarmType.SERIAL;
    //     case 'bpmn:parallelGateway':
    //       return WarmType.PARALLEL;
    //     case 'bpmn:sequenceFlow':
    //       return WarmType.SKIP;
    //     default:
    //       return type;
    //   }
    // }

    // // 将LogicFlow中的Node数据转换为Warm元素数据
    // function convertNodeToWarmElement(node) {
    //   const { id, nodeType, nodeName, coordinate, x, y, text = '' } = node;
    //   return {
    //     nodeType: getWarmType(node.type),
    //     nodeCode: id,
    //     nodeName: text.value,
    //     // node x,y|text x,y
    //     coordinate: x + ',' + y + '|' + text.x + ',' + text.y,
    //   };
    // }

    // 如果需要额外的参数，你也可以这样定义
    // lf.adapterOut = function (logicFlowData, params, ...rest) {
    // console.log(params, ...rest);
    // return userData;
    // };

    // 使用预定义的数据渲染LogicFlow图
    lf.render(definitionXml);
    // 将渲染的图居中显示
    lf.translateCenter();
  }

  return (
    <div className="helloworld-app getting-started">
      <ToastComponent theme={'antd'} key="toast" position={'top-center'} />
      <div className="app-content" ref={containerRef}></div>
    </div>
  );
};

export default FlowChart;