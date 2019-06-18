import React from 'react'
import AnimatedNumber from 'react-animated-number'
import { random, randomInt } from 'noru-utils/lib'
import moment from 'moment'
import './tile1.scss'

function getBars(): any[] {
  let bars = new Array()
  let now = moment().minute(0)
  for (let i = 0; i < 20; i++) {
    bars.unshift({
      value: random(5, 10),
      time: (now = now.clone().subtract(10, 'minute')),
    })
  }
  return bars
}

interface Props {
  title: string
  initNumber: number
  precent: number
  stepRange: [number, number]
  interval: [number, number]
}
interface State {
  bars: any[]
  delta: number
  percent: number
}
const NumberFormatter = Intl.NumberFormat()
export default class Tile1 extends React.Component<Props, State> {
  state = {
    delta: 0,
    bars: getBars(),
    percent: 0,
  }

  _id = 0

  componentDidMount() {
    setTimeout(() => {
      this.up()
    }, 1000)
  }

  componentWillUnmount() {
    clearTimeout(this._id)
  }

  up() {
    let { stepRange, interval } = this.props
    let [low, high] = stepRange
    let { bars } = this.state
    bars.shift()
    bars.push({
      value: random(5, 10),
      time: bars[bars.length - 1].time.clone().add(10, 'minute'),
    })
    let percent = random(-0.35, 0.35)
    this.setState({ delta: this.state.delta + randomInt(low, high), bars, percent })
    let [a, b] = interval
    this._id = setTimeout(() => {
      this.up()
    }, randomInt(a, b) * 1000) as any
  }

  render() {
    let { title, initNumber } = this.props
    let { delta, bars, percent } = this.state
    let num = initNumber + delta
    return (
      <div className="tile1">
        <h1>{title}</h1>
        <div className="level is-full-width">
          <span className="main-number level-left">
            <AnimatedNumber
              stepPrecision={0}
              component="span"
              initialValue={0}
              value={num}
              duration={1000}
              formatValue={NumberFormatter.format}
            />
            <span>元</span>
          </span>
          <span className="precent level-right">
            <span className={percent > 0 ? 'up' : 'down'} />
            <span>{(Math.abs(percent) * 10).toFixed(1)}</span>
            <span>%</span>
          </span>
          <span className="description">与昨日同期相比</span>
        </div>
        <FakeBars key={title} bars={bars} />
      </div>
    )
  }
}

const FakeBars = ({ bars }: { bars: any[] }) => {
  return (
    <div className="fake-bars">
      {bars.map((h, i) => (
        <>
          <span key={i} className="bar" style={{ height: h.value * 10 + '%' }}>
            {h.time.minute() === 0 && <span className="tick">{h.time.format('HH:mm')}</span>}
          </span>
        </>
      ))}
    </div>
  )
}
