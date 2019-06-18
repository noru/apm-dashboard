import React from 'react'
import Row, { Item } from './Row'
import FA from 'react-fontawesome'
import './device.scss'

const LINK = '/pad/#/v2/login?token=bG9nWa94XehVnbppGcuVyZwZXYzN2dy9DZH1TM1IQGU=&systemid=082416010036'

interface Props {
  id: string,
  pic: string,
  color: string,
  items: Item[]
}

export default class Device extends React.Component<Props, any> {

  render() {

    let { id, pic, color, items } = this.props
    let name = ''
    if (color === 'green') {
      items.filter(i => typeof i.top !== 'string').forEach(i => i.top = '正常')
    }
    if (color === 'yellow') {
      name = 'exclamation-circle'
    }
    if (color === 'red') {
      name = 'times-circle'
      items.filter(i => i.top === '正常').forEach(i => i.top = <span style={{ color: 'red' }}>停机</span>)
    }
    return (
      <div className="device" onClick={() => window.location = LINK as any}>
        <img src={require(`../../../assets/${pic}`)} />
        <div className="device-id" >
          <FA name={name} style={{color: color || 'green'}}/>
          <span>{id}</span>
        </div>
        <Row items={items} />
      </div>
    )
  }
}