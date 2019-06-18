import React from 'react'
import AnimatedNumber from 'react-animated-number'
import './tile2.scss'
const NumberFormatter = Intl.NumberFormat()

interface Props {
  number1: number,
  number2: number,
}
export default class Tile2 extends React.Component<Props, any> {

  render() {

    let { number1, number2 } = this.props

    return (
      <div className="tile2">
        <h1>总成本</h1>
        <div className="tile2-number">
          <AnimatedNumber
            stepPrecision={0}
            component="span"
            initialValue={0}
            value={number1}
            duration={1000}
            formatValue={NumberFormatter.format}
          />
          <span>元</span>
        </div>
        <h1>预测节约成本</h1>
        <div className="tile2-number">
          <AnimatedNumber
            stepPrecision={0}
            component="span"
            initialValue={0}
            value={number2}
            duration={1000}
            formatValue={NumberFormatter.format}
          />
          <span>元</span>
        </div>
      </div>
    )
  }
}