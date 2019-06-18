import React from 'react'
import PieChart from 'react-minimal-pie-chart'
import AnimatedNumber from 'react-animated-number'
import Row from './Row'
import './tile3.scss'

interface Props {
  precent: number,
  low: number,
  high: number
}
export default class Tile3 extends React.Component<Props, any> {

  render() {

    let { precent, low, high } = this.props
    return (
      <div className="tile3">
        <h1>平均开机率</h1>
        <div className="tile3-chart">
          <span className="left">0</span>
          <PieChart
            cy={80}
            lineWidth={12}
            totalValue={100}
            startAngle={-180}
            lengthAngle={180}
            radius={65}
            animate
            data={[
              { value: precent, key: 1, color: '#44d2d6' },
              { value: 100 - precent, key: 2, color: '#b8b8b8' },
            ]}
          />
          <span className="right">100</span>
          <span className="centered-text">
            <AnimatedNumber
              stepPrecision={0}
              component="text"
              initialValue={0}
              value={precent}
              duration={1000}
            />
            <span>%</span>
          </span>
        </div>
        <div className="tile3-row">
          <Row items={[
            { top: low + '%', bottom: '最低' },
            { top: high + '%', bottom: '最高' },
          ]}></Row>
        </div>
      </div>
    )
  }
}