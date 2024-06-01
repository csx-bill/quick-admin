import React, { useEffect, useRef, useState } from 'react'

import LogicFlow from '@logicflow/core'
import { BPMNElements, Control, DndPanel, SelectionSelect } from '@logicflow/extension'
import { toast, ToastComponent } from 'amis-ui'
import { useSearchParams } from 'react-router-dom'
//import { useParams } from 'umi';

import { Drawer, Form, Input, Select } from 'antd'
const { TextArea } = Input

// 引入LogicFlow的样式文件
import '@logicflow/core/dist/style/index.css'
import '@logicflow/extension/lib/style/index.css'

import './common.css'

import { getDefinitionById, getDefinitionXmlById, definitionSaveXml } from '@/api'

import warmAdapter from '@/components/LogicFlow/warmAdapter'

type FieldType = {
  nodeCode?: string
  nodeName?: string
  listenerType?: string
  listenerPath?: string
}

import { Card } from 'antd'

export const FlowEditor: React.FC = () => {
  // This ref will provide direct access to the DOM element
  const containerRef = useRef<HTMLDivElement>(null)

  const [searchParams] = useSearchParams()

  const [definition, setDefinition] = useState({})
  const [definitionXml, setDefinitionXml] = useState({})

  const [startOpen, setStartOpen] = useState(false)
  const [betweenOpen, setBetweenOpen] = useState(false)
  const [endOpen, setEndOpen] = useState(false)
  const [serialOpen, setSerialOpen] = useState(false)
  const [parallelOpen, setParallelOpen] = useState(false)
  const [skipOpen, setSkipOpen] = useState(false)

  useEffect(() => {
    async function fetchFlowDefinition() {
      const resXml = await getDefinitionXmlById({ id: searchParams.get('id') })
      setDefinitionXml(resXml.data.data)
      const res = await getDefinitionById({ id: searchParams.get('id') })
      setDefinition(res.data.data)
    }
    fetchFlowDefinition()
  }, [])

  if (containerRef.current) {
    // LogicFlow配置选项
    const lf = new LogicFlow({
      container: containerRef.current,
      grid: {
        visible: true,
        type: 'mesh',
        size: 10,
        config: {
          color: '#eeeeee'
        }
      },
      height: 500,
      hoverOutline: false,
      edgeSelectedOutline: false,
      keyboard: {
        enabled: true
      },
      plugins: [BPMNElements, SelectionSelect, DndPanel, Control, warmAdapter]
    })

    // 拖拽面板
    lf.extension.dndPanel.setPatternItems([
      {
        label: '选区',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAOVJREFUOBGtVMENwzAIjKP++2026ETdpv10iy7WFbqFyyW6GBywLCv5gI+Dw2Bluj1znuSjhb99Gkn6QILDY2imo60p8nsnc9bEo3+QJ+AKHfMdZHnl78wyTnyHZD53Zzx73MRSgYvnqgCUHj6gwdck7Zsp1VOrz0Uz8NbKunzAW+Gu4fYW28bUYutYlzSa7B84Fh7d1kjLwhcSdYAYrdkMQVpsBr5XgDGuXwQfQr0y9zwLda+DUYXLaGKdd2ZTtvbolaO87pdo24hP7ov16N0zArH1ur3iwJpXxm+v7oAJNR4JEP8DoAuSFEkYH7cAAAAASUVORK5CYII=',
        callback: () => {
          lf.extension.selectionSelect.openSelectionSelect()
          lf.once('selection:selected', () => {
            lf.extension.selectionSelect.closeSelectionSelect()
          })
        }
      },
      {
        type: 'bpmn:startEvent',
        text: '开始',
        label: '开始节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAAnBJREFUOBGdVL1rU1EcPfdGBddmaZLiEhdx1MHZQXApraCzQ7GKLgoRBxMfcRELuihWKcXFRcEWF8HBf0DdDCKYRZpnl7p0svLe9Zzbd29eQhTbC8nv+9zf130AT63jvooOGS8Vf9Nt5zxba7sXQwODfkWpkbjTQfCGUd9gIp3uuPP8bZ946g56dYQvnBg+b1HB8VIQmMFrazKcKSvFW2dQTxJnJdQ77urmXWOMBCmXM2Rke4S7UAW+/8ywwFoewmBps2tu7mbTdp8VMOkIRAkKfrVawalJTtIliclFbaOBqa0M2xImHeVIfd/nKAfVq/LGnPss5Kh00VEdSzfwnBXPUpmykNss4lUI9C1ga+8PNrBD5YeqRY2Zz8PhjooIbfJXjowvQJBqkmEkVnktWhwu2SM7SMx7Cj0N9IC0oQXRo8xwAGzQms+xrB/nNSUWVveI48ayrFGyC2+E2C+aWrZHXvOuz+CiV6iycWe1Rd1Q6+QUG07nb5SbPrL4426d+9E1axKjY3AoRrlEeSQo2Eu0T6BWAAr6COhTcWjRaYfKG5csnvytvUr/WY4rrPMB53Uo7jZRjXaG6/CFfNMaXEu75nG47X+oepU7PKJvvzGDY1YLSKHJrK7vFUwXKkaxwhCW3u+sDFMVrIju54RYYbFKpALZAo7sB6wcKyyrd+aBMryMT2gPyD6GsQoRFkGHr14TthZni9ck0z+Pnmee460mHXbRAypKNy3nuMdrWgVKj8YVV8E7PSzp1BZ9SJnJAsXdryw/h5ctboUVi4AFiCd+lQaYMw5z3LGTBKjLQOeUF35k89f58Vv/tGh+l+PE/wG0rgfIUbZK5AAAAABJRU5ErkJggg=='
      },
      {
        type: 'bpmn:userTask',
        text: '用户任务',
        label: '用户任务',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABMAAAATCAYAAAEFVwZaAAAABGdBTUEAALGPC/xhBQAAAqlJREFUOBF9VM9rE0EUfrMJNUKLihGbpLGtaCOIR8VjQMGDePCgCCIiCNqzCAp2MyYUCXhUtF5E0D+g1t48qAd7CCLqQUQKEWkStcEfVGlLdp/fm3aW2QQdyLzf33zz5m2IsAZ9XhDpyaaIZkTS4ASzK41TFao88GuJ3hsr2pAbipHxuSYyKRugagICGANkfFnNh3HeE2N0b3nN2cgnpcictw5veJIzxmDamSlxxQZicq/mflxhbaH8BLRbuRwNtZp0JAhoplVRUdzmCe/vO27wFuuA3S5qXruGdboy5/PRGFsbFGKo/haRtQHIrM83bVeTrOgNhZReWaYGnE4aUQgTJNvijJFF4jQ8BxJE5xfKatZWmZcTQ+BVgh7s8SgPlCkcec4mGTmieTP4xd7PcpIEg1TX6gdeLW8rTVMVLVvb7ctXoH0Cydl2QOPJBG21STE5OsnbweVYzAnD3A7PVILuY0yiiyDwSm2g441r6rMSgp6iK42yqroI2QoXeJVeA+YeZSa47gZdXaZWQKTrG93rukk/l2Al6Kzh5AZEl7dDQy+JjgFahQjRopSxPbrbvK7GRe9ePWBo1wcU7sYrFZtavXALwGw/7Dnc50urrHJuTPSoO2IMV3gUQGNg87IbSOIY9BpiT9HV7FCZ94nPXb3MSnwHn/FFFE1vG6DTby+r31KAkUktB3Qf6ikUPWxW1BkXSPQeMHHiW0+HAd2GelJsZz1OJegCxqzl+CLVHa/IibuHeJ1HAKzhuDR+ymNaRFM+4jU6UWKXorRmbyqkq/D76FffevwdCp+jN3UAN/C9JRVTDuOxC/oh+EdMnqIOrlYteKSfadVRGLJFJPSB/ti/6K8f0CNymg/iH2gO/f0DwE0yjAFO6l8JaR5j0VPwPwfaYHqOqrCI319WzwhwzNW/aQAAAABJRU5ErkJggg=='
      },
      {
        type: 'bpmn:exclusiveGateway',
        text: '排他网关',
        label: '排他网关',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAAHeEJUAAAAABGdBTUEAALGPC/xhBQAAAvVJREFUOBGNVEFrE0EU/mY3bQoiFlOkaUJrQUQoWMGePLX24EH0IIoHKQiCV0G8iE1covgLiqA/QTzVm1JPogc9tIJYFaQtlhQxqYjSpunu+L7JvmUTU3AgmTfvffPNN++9WSA1DO182f6xwILzD5btfAoQmwL5KJEwiQyVbSVZ0IgRyV6PTpIJ81E5ZvqfHQR0HUOBHW4L5Et2kQ6Zf7iAOhTFAA8s0pEP7AXO1uAA52SbqGk6h/6J45LaLhO64ByfcUzM39V7ZiAdS2yCePPEIQYvTUHqM/n7dgQNfBKWPjpF4ISk8q3J4nB11qw6X8l+FsF3EhlkEMfrjIer3wJTLwS2aCNcj4DbGxXTw00JmAuO+Ni6bBxVUCvS5d9aa04+so4pHW5jLTywuXAL7jJ+D06sl82Sgl2JuVBQn498zkc2bGKxULHjCnSMadBKYDYYHAtsby1EQ5lNGrQd4Y3v4Zo0XdGEmDno46yCM9Tk+RiJmUYHS/aXHPNTcjxcbTFna000PFJHIVZ5lFRqRpJWk9/+QtlOUYJj9HG5pVFEU7zqIYDVsw2s+AJaD8wTd2umgSCCyUxgGsS1Y6TBwXQQTFuZaHcd8gAGioE90hlsY+wMcs30RduYtxanjMGal8H5dMW67dmT1JFtYUEe8LiQLRsPZ6IIc7A4J5tqco3T0pnv/4u0kyzrYUq7gASuEyI8VXKvB9Odytv6jS/PNaZBln0nioJG/AVQRZvApOdhjj3Jt8QC8Im09SafwdBdvIpztpxWxpeKCC+EsFdS8DCyuCn2munFpL7ctHKp+Xc5cMybeIyMAN33SPL3ZR9QV1XVwLyzHm6Iv0/yeUuUb7PPlZC4D4HZkeu6dpF4v9j9MreGtMbxMMRLIcjJic9yHi7WQ3yVKzZVWUr5UrViJvn1FfUlwe/KYVfYyWRLSGNu16hR01U9IacajXPei0wx/5BqgInvJN+MMNtNme7ReU9SBbgntovn0kKHpFg7UogZvaZiOue/q1SBo9ktHzQAAAAASUVORK5CYII='
      },
      {
        type: 'bpmn:parallelGateway',
        text: '并行网关',
        label: '并行网关',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABUAAAAVCAYAAACpF6WWAAAACXBIWXMAAC4jAAAuIwF4pT92AAAB3klEQVQ4jaXUO2hUURAG4G9lRVFEW4OKYBAMIoiIvRDxEZ8odmLhA+JmTSxTSix9QNTC2AQFOx/RGB/pLBS1sbT2ga0SUbGIxZnrHq+72UWnmTlz7/z3PzP/3Er3yKwObBBnMY6Bdi/P6wBwGBexBDVc+1/QQZyL+Eb447jyr6AFQ6jjCHrj3G8Oxq1Ac4Z1jEY8jb52jJuBDmUMzwTgZnzEIUziQMZ4tAxQBh3GhYxJAd6F5VgZ5zvYFnENY61AhzSuPITr2bNv4Wey3FPsi/gYLpdBc4Z1XCrd4F34T6X8PY0enyoYVzUfyhYszYo3hd+K71n+h9TjvbgVjL9Wukdmi5Uax9GIO1qzsBX4IA31fMH0qjTFHdgVXz6MZVlhD07jJp5l+Z8BuB4nIzdRid0fC+qwB/dLbNbiLXbjQelZD15isaTj3mJQuZAnpB7ltjp8Vym/AW8C8KHYuFxSNQ0Z3dVYSVgQfmGWW4fnUgunpdYpgxaMC709wf6IP0vD+xLnjXiNRVI7cgKq/raB+Fg/bks6nMQqvNfoYRVTUp//sFY/lN9CDiZ9AbgGrwLwMXY2K57r13dCkhtJDcN4IV15CttbFTa7fpnxfKnXxda1ZNgpKInxTPhHONiu4BfEpWWaWt6MSgAAAABJRU5ErkJggg=='
      },
      {
        type: 'bpmn:endEvent',
        text: '结束',
        label: '结束节点',
        icon: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABQAAAAUCAYAAAH6ji2bAAAABGdBTUEAALGPC/xhBQAAA1BJREFUOBFtVE1IVUEYPXOf+tq40Y3vPcmFIdSjIorWoRG0ERWUgnb5FwVhYQSl72oUoZAboxKNFtWiwKRN0M+jpfSzqJAQclHo001tKkjl3emc8V69igP3znzfnO/M9zcDcKT67azmjYWTwl9Vn7Vumeqzj1DVb6cleQY4oAVnIOPb+mKAGxQmKI5CWNJ2aLPatxWa3aB9K7/fB+/Z0jUF6TmMlFLQqrkECWQzOZxYGjTlOl8eeKaIY5yHnFn486xBustDjWT6dG7pmjHOJd+33t0iitTPkK6tEvjxq4h2MozQ6WFSX/LkDUGfFwfhEZj1Auz/U4pyAi5Sznd7uKzznXeVHlI/Aywmk6j7fsUsEuCGADrWARXXwjxWQsUbIupDHJI7kF5dRktg0eN81IbiZXiTESic50iwS+t1oJgL83jAiBupLDCQqwziaWSoAFSeIR3P5Xv5az00wyIn35QRYTwdSYbz8pH8fxUUAtxnFvYmEmgI0wYXUXcCCSpeEVpXlsRhBnCEATxWylL9+EKCAYhe1NGstUa6356kS9NVvt3DU2fd+Wtbm/+lSbylJqsqkSm9CRhvoJVlvKPvF1RKY/FcPn5j4UfIMLn8D4UYb54BNsilTDXKnF4CfTobA0FpoW/LSp306wkXM+XaOJhZaFkcNM82ASNAWMrhrUbRfmyeI1FvRBTpN06WKxa9BK0o2E4Pd3zfBBEwPsv9sQBnmLVbLEIZ/Xe9LYwJu/Er17W6HYVBc7vmuk0xUQ+pqxdom5Fnp55SiytXLPYoMXNM4u4SNSCFWnrVIzKG3EGyMXo6n/BQOe+bX3FClY4PwydVhthOZ9NnS+ntiLh0fxtlUJHAuGaFoVmttpVMeum0p3WEXbcll94l1wM/gZ0Ccczop77VvN2I7TlsZCsuXf1WHvWEhjO8DPtyOVg2/mvK9QqboEth+7pD6NUQC1HN/TwvydGBARi9MZSzLE4b8Ru3XhX2PBxf8E1er2A6516o0w4sIA+lwURhAON82Kwe2iDAC1Watq4XHaGQ7skLcFOtI5lDxuM2gZe6WFIotPAhbaeYlU4to5cuarF1QrcZ/lwrLaCJl66JBocYZnrNlvm2+MBCTmUymPrYZVbjdlr/BxlMjmNmNI3SAAAAAElFTkSuQmCC'
      }
    ])

    // 控制面板
    lf.extension.control.addItem({
      iconClass: 'lf-control-save',
      title: '',
      text: '保存',
      onClick: (lf, ev) => {
        definitionSaveXml({ id: searchParams.get('id'), xmlString: lf.getGraphData(definition) }).then(res => {
          toast.success('保存成功！', '提示')
        })
      }
    })

    // 使用预定义的数据渲染LogicFlow图
    lf.render(definitionXml)
    // 将渲染的图居中显示
    lf.translateCenter()

    // 监听被点击节点
    lf.on('node:click', data => {
      console.log('data.type', data)
      if (data.data.type === 'bpmn:startEvent') {
        setStartOpen(true)
      }
      if (data.data.type === 'bpmn:userTask') {
        setBetweenOpen(true)
      }
      if (data.data.type === 'bpmn:exclusiveGateway') {
        setSerialOpen(true)
      }
      if (data.data.type === 'bpmn:parallelGateway') {
        setParallelOpen(true)
      }
      if (data.data.type === 'bpmn:endEvent') {
        setEndOpen(true)
      }
    })

    // 监听被点击节点
    lf.on('edge:click', data => {
      setSkipOpen(true)
    })
  }

  return (
    <Card bordered={false}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '100%', height: '500px' }}>
        <div className='helloworld-app getting-started'>
          <ToastComponent theme={'antd'} key='toast' position={'top-center'} />
          <div className='app-content' ref={containerRef}></div>
          {/* start Drawer */}
          <Drawer onClose={() => setStartOpen(false)} open={startOpen}>
            <Form
              // name="basic"
              // labelCol={{ span: 8 }}
              // wrapperCol={{ span: 16 }}
              // style={{ maxWidth: 600 }}
              // initialValues={{ remember: true }}
              //onFinish={onFinish}
              //onFinishFailed={onFinishFailed}
              //autoComplete="off"
              layout='horizontal'
            >
              <Form.Item<FieldType> label='节点编码' name='nodeCode'>
                <Input />
              </Form.Item>
              <Form.Item<FieldType> label='节点名称' name='nodeName'>
                <Input />
              </Form.Item>
              <Form.Item<FieldType> label='监听器类型' name='listenerType'>
                <Select options={[{ value: 'sample', label: <span>sample</span> }]} />
              </Form.Item>

              <Form.Item<FieldType> label='监听器路径' name='listenerPath'>
                <TextArea rows={8} />
              </Form.Item>
            </Form>
          </Drawer>
          {/* between Drawer */}
          <Drawer onClose={() => setBetweenOpen(false)} open={betweenOpen}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
          {/* end Drawer */}
          <Drawer onClose={() => setEndOpen(false)} open={endOpen}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
          {/* serial Drawer */}
          <Drawer onClose={() => setSerialOpen(false)} open={serialOpen}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
          {/* parallel Drawer */}
          <Drawer onClose={() => setParallelOpen(false)} open={parallelOpen}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
          {/* skip Drawer */}
          <Drawer onClose={() => setSkipOpen(false)} open={skipOpen}>
            <p>Some contents...</p>
            <p>Some contents...</p>
            <p>Some contents...</p>
          </Drawer>
        </div>
      </div>
    </Card>
  )
}

export default FlowEditor
