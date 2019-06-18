import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import Line from 'components/common/Line'
import { apply, Try } from 'noru-utils/lib'
import { sumBy } from 'lodash-es'
import { connect } from 'dva'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import { translate } from 'react-i18next'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './RepairStatistics.scss'

const COLORS = ['#004d86', '#023c56', '#035124', '#ac4600', '#aa0a52', '#8a578b']
const ORDER_COUNT_CORLOR = '#fff'
const LineSeriesTemplate = (name, data) => {
  return {
    name,
    type: 'line',
    stack: 'total',
    areaStyle: { normal: {} },
    showSymbol: false,
    lineStyle: {
      normal: {
        width: 0,
      },
    },
    smooth: true,
    data,
  }
}

const Options = (t, baseFontSize: number, data: any) => {

  let { topGroups, stats: { ...allMonths } } = data

  if (topGroups === undefined || allMonths === undefined) {
    return
  }
  const fontSize   = baseFontSize * .6
  const itemWidth  = fontSize * .75
  const barWidth   = fontSize / 2
  const textStyle  = { fontSize, color: '#fff', fontFamily: ['sans-serif', 'GE CHS'] }

  let { closedBar, lines, xAxisData } =
    Object.keys(allMonths)
      .sort()
      .reduce((result, key) => {
        let monthlyData = allMonths[key]
        let totalClosed = sumBy(monthlyData, i => i ? i.closed : 0)
        result.closedBar.push(totalClosed)
        result.xAxisData.push({ value: key, textStyle })
        result.lines.push(monthlyData.map(i => i ? i.closed : 0))
        return result
      }, { closedBar: new Array, lines: new Array, xAxisData: new Array })
  const { legendData, series } = topGroups.reduce((result, { name }, i) => {
    result.legendData.push({ name, icon: 'roundRect'})
    result.series.push(LineSeriesTemplate(name, lines.map(l => l[i])))
    return result
  }, { legendData: new Array, series: new Array })

  let colors = COLORS.slice(0, legendData.length).concat([ORDER_COUNT_CORLOR])
  const template = {

    textStyle,
    legend: {
      data: [ ...legendData, { name: t`closed_orders_count`, icon: 'roundRect' } ],
      bottom: 0,
      textStyle,
      itemWidth,
      itemHeight: itemWidth,
      itemGap: itemWidth / 2,
    },
    color: colors,
    grid: {
      left: '3%',
      top: fontSize + 2,
      bottom: '12%',
      containLabel: true,
    },
    xAxis: [
      {
        type: 'category',
        boundaryGap: false,
        data: xAxisData,
      },
    ],
    yAxis: {
      show: false,
    },

    series: [
      ...series,
      {
        name: t`closed_orders_count`,
        type: 'bar',
        barWidth,
        label: {
          normal: {
            show: true,
            position: 'top',
            distance: 1,
            fontSize,
          },
        },
        data: closedBar,
      },
    ],
  }

  return template
}

export class RepairStatistics extends React.PureComponent<any, any> {

  state = {
    fullSize: false,
  }

  getData() {
    let { dispatch } = this.props
    let groupBy = Try(() => config.get(COMP_KEY.RepairStatistics).groupBy.value, 'm')
    dispatch({ type: 'dashboard2/get/maintenance-stats', payload: { groupBy } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.RepairStatistics ? undefined : COMP_KEY.RepairStatistics
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {

    let { t, clientRect, data, fontSize, fullscreened } = this.props
    fontSize = fullscreened ? fontSize * 3 : fontSize
    let width = clientRect.width + fontSize * 2.5
    let height = clientRect.height - fontSize * 4
    let option = Options(t, fontSize, data)

    return (
      <Background className="repair-statistics" style={{fontSize}}>
        <h1 onClick={this._toggleFullscreen}>{t`repire_statistics`}</h1>
        <div className="repair-statistics-chart">
          <Line id="repair-statistics-chart" width={width} height={height} option={option} />
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.RepairStatistics)
export default apply(
  RepairStatistics,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('MaintenanceStats'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)