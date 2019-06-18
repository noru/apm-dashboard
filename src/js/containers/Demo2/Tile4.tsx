import React from 'react'
import PieChart from 'react-minimal-pie-chart'
import { sumBy } from 'lodash-es'
import AnimatedNumber from 'react-animated-number'
import './tile4.scss'

const NumberFormatter = Intl.NumberFormat()

const ColItem = ({ color, name, precent }) => {
  return (
    <div className="col-item">
      <p>
        <i style={{color}}>●</i>
        <span>{precent}%</span>
      </p>
      <p>
        <i style={{visibility: 'hidden'}}>●</i>
        <span className="col-name">{name}</span>
      </p>
    </div>
  )
}

interface Item {
  name: string,
  count: number,
}
interface Props {
  items: Item[],
}
export default class Tile4 extends React.Component<Props, any> {

  render() {

    let { items } = this.props
    let [a, b, c, ] = items
    let total = a.count + b.count + c.count

    return (
      <div className="tile4">
        <h1>问题预测数</h1>
        <div className="tile4-content">
          <div className="tile4-chart">
            <PieChart
              lineWidth={12}
              totalValue={total}
              animate
              data={[
                { value: a.count, key: 1, color: '#de5d46' },
                { value: b.count, key: 2, color: '#44d3d4' },
                { value: c.count, key: 3, color: '#b843d1' },
              ]}
            />
            <div className="centered-text has-text-centered">
              <AnimatedNumber
                stepPrecision={0}
                component="p"
                initialValue={0}
                value={sumBy(items, i => i.count)}
                duration={1000}
                formatValue={NumberFormatter.format}
              />
              <p>个</p>
            </div>
          </div>
          <div className="tile4-col">
            <ColItem color="#de5d46" name="CT" precent={(a.count * 100 / total).toFixed(2)}/>
            <ColItem color="#44d3d4" name="MR" precent={(b.count * 100 / total).toFixed(2)}/>
            <ColItem color="#b843d1" name="IGS" precent={(c.count * 100 / total).toFixed(2)}/>
          </div>
        </div>
      </div>
    )
  }
}