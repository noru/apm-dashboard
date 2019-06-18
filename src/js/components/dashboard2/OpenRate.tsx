import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import echarts from 'echarts/lib/echarts'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply } from 'noru-utils/lib'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import Bar from 'components/common/Bar'
import { maxBy } from 'lodash-es'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './OpenRate.scss'

const LeftColor = new echarts.graphic.LinearGradient(
  0, 0, 0, 1,
  [
    {offset: 0, color: '#204f68'},
    {offset: 0.5, color: '#47aae1'},
    {offset: 1, color: '#204f68'},
  ],
)

const RightColor = new echarts.graphic.LinearGradient(
  0, 0, 0, 1,
  [
    {offset: 0, color: '#0f4c49'},
    {offset: 0.5, color: '#1c8c87'},
    {offset: 1, color: '#0f4c49'},
  ],
)

const LeftOption = (t, baseFontSize: number, data: number[]) => {

  let fontSize = baseFontSize * .657
  let barWidth = fontSize
  let template = {
    title: {
      text: t`assets_total_count`,
      right: 0,
      textStyle: {
        fontSize,
        color: '#fff',
      },
    },
    textStyle: {
      fontSize,
      color: '#fff',
      fontFamily: ['GE CHS', 'sans-serif'],

    },
    color: [ LeftColor ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      silent: true,
      inverse: true,
      boundaryGap: [0, 0.01],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#fff',
        fontSize,
      },
    },
    yAxis: {
      type: 'category',
      silent: true,
      data: new Array(data.length).fill(''),
      axisTick: {
        inside: true,
      },
    },
    series: [
      {
        name: t`assets_total_count`,
        type: 'bar',
        barWidth,
        label: {
          normal: {
            show: true,
            position: 'left',
            color: '#fff',
          },
        },
        data,
      },
    ],
  }

  return template
}

const RightOption = (t, baseFontSize: number, data: number[], labels: string[]) => {

  let fontSize = baseFontSize * .657
  let barWidth = fontSize
  let maxLengthLabel = maxBy(labels, l => l.length) || ''
  labels = labels.map(l => {
    return l + ' '.repeat(maxLengthLabel.length - l.length)
  })

  const template = {
    title: {
      text: t`operation_rate`,
      left: fontSize * maxLengthLabel.length + 'px',
      textStyle: {
        fontSize,
        color: '#fff',
      },
    },
    textStyle: {
      fontSize,
      color: '#fff',
      fontFamily: 'GE CHS',
    },
    color: [ RightColor ],
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#fff',
        fontSize,
      },
      max: 100,
    },
    yAxis: {
      type: 'category',
      data: labels,
      axisLabel: {
        color: '#fff',
        fontSize,
        interval: 0,
      },
    },
    series: [
      {
        name: t`operation_rate`,
        type: 'bar',
        barWidth,
        data,
      },
    ],
  }

  return template
}

export class OpenRate extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    dispatch({ type: 'dashboard2/get/open-rate' })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.OpenRate ? undefined : COMP_KEY.OpenRate
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, clientRect, data, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let { leftData, rightData, labels } = data.reduce((result, { amount, inUseRate, assetGroup }) => {
      result.leftData.push(amount)
      result.rightData.push(Number.parseInt(inUseRate.slice(0, -1)))
      result.labels.push(assetGroup)
      return result
    }, { leftData: new Array, rightData: new Array, labels: new Array })

    let leftOption = LeftOption(t, fontSize, leftData)
    let rightOption = RightOption(t, fontSize, rightData, labels)
    let width = clientRect.width / 2
    let height = clientRect.height * .73

    return (
      <Background className="open-rate" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`crutial_assets_open_rate`}</h1>
        <div className="open-rate-chart">
          <Bar id="asset-count" width={width - fontSize * 3} height={height} option={leftOption}/>
          <Bar id="asset-open-rate" width={width + fontSize * 3} height={height} option={rightOption}/>
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.OpenRate)
export default apply(
  OpenRate,
  periodic(CONF.interval, 'getData'),
  withClientRect,
  translate(['common', 'dashboard2']),
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('OpenRate'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)