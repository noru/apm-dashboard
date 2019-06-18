import * as React from 'react'
import echarts from 'echarts/lib/echarts'
import { debounce } from 'lodash-es'

interface Props {
  id: string,
  width: number | string,
  height: number | string,
  option?: any
  chart?(chart: any): void,
}

export abstract class EChartBase extends React.PureComponent<Props, any> {

  static isSizeValid(width: number, height: number) {
    return width > 0 && height > 0
  }

  private _chart
  private _onResize = debounce(() => this._chart && this._chart.resize(), 800)

  componentDidMount() {
    this._initChart()
    window.addEventListener('resize', this._onResize)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this._onResize)
  }

  componentDidUpdate() {
    this._initChart()
  }

  render() {
    let { id, width, height } = this.props
    this._onResize()
    return <div id={id} style={{ width: getCssValue(width), height: getCssValue(height) }} />
  }

  private _initChart = () => {
    let { id, option, chart } = this.props
    let container = document.getElementById(id)
    if (container === null
      || !EChartBase.isSizeValid(container.clientWidth, container.clientHeight)
    ) {
      return
    }
    if (this._chart === undefined) {
      this._chart = echarts.init(container)
    }
    if (chart) {
      chart(this._chart)
    }
    if (option) {
      this._chart.setOption(option)
    }
  }

}

export default EChartBase

function getCssValue(value: number | string) {
  if (typeof value === 'number') {
    return value + 'px'
  }
  return value
}