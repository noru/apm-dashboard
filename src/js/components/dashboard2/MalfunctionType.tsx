import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import { translate } from 'react-i18next'
import { apply } from 'noru-utils/lib'
import { connect } from 'dva'
import Pie from 'components/common/Pie'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import moment from 'moment'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY, DATE_FORMAT } from 'utils/constants'

const COLORS = ['rgb(255,152,0)', 'rgb(255,87,34)', 'rgb(121,85,74)', 'rgb(158,158,158)', 'rgb(96,125,139)']

const Options = (baseFontSize, data) => {

  if (!data) {
    return
  }

  let legendData = new Array, seriesData = new Array
  data.forEach(item => {
    legendData.push({ name: item.faultName, icon: 'circle' })
    seriesData.push({ name: item.faultName, value: item.count })
  })

  let fontSize = baseFontSize * .63

  let template = {
    color: COLORS,
    legend: {
      selectedMode: false,
      orient: 'vertical',
      right: '15%',
      top: '10%',
      textStyle: {
        color: '#fff',
      },
      data: legendData,
      itemWidth: fontSize,
      itemHeight: fontSize,
      itemGap: fontSize,
    },
    textStyle: {
      fontSize,
      color: '#fff',
      fontFamily: 'GE CHS',
    },
    series : [
      {
        type: 'pie',
        radius : '75%',
        center: ['25%', '50%'],
        silent: true,
        data: seriesData,
        label: {
          normal: {
            formatter: '{c}',
          },
        },
        labelLine: {
          normal: {
            show: false,
            length: 5,
            length2: 0,
          },
        },
        itemStyle: {
          emphasis: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
      },
    ],
  }
  return template
}

export class MalfunctionType extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    let conf = config.get(COMP_KEY.MalfunctionType)
    let to = moment().format(DATE_FORMAT)
    let from = moment().subtract(conf.month.value, 'month').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/malfunction-type', payload: { from, to } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.MalfunctionType ? undefined : COMP_KEY.MalfunctionType
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, clientRect, data, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let width = clientRect.width * .85
    let height = clientRect.height * .7
    let options = Options(fontSize, data)
    return (
      <Background className="malfunc-type" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`malfunction_type`}</h1>
        <div className="malfunc-chart">
          <Pie id="malfunc-chart" width={width} height={height} option={options} />
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.MalfunctionType)
export default apply(
  MalfunctionType,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('MalfuncType'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)