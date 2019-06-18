import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import { connect } from 'dva'
import { translate } from 'react-i18next'
import { apply } from 'noru-utils/lib'
import periodic from 'hoc/periodic'
import Bar from 'components/common/Bar'
import withClientRect from 'hoc/withClientRect'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './DeptTop5.scss'

const Options = (t, baseFontSize, data) => {

  let { totals, availables, clinicalDepts } = data.reduce((left, dept) => {
    if (dept) {
      let { total, available, clinicalDept } = dept
      left.totals.unshift(total)
      left.availables.unshift(available)
      left.clinicalDepts.unshift(clinicalDept)
    }
    return left
  }, { totals: [], availables: [], clinicalDepts: []})

  let fontSize = baseFontSize * .657
  let barWidth = fontSize / 2
  let template = {
    color: ['#176591', '#c1e2f5'],
    textStyle: {
      fontSize,
      color: '#fff',
      fontFamily: 'GE CHS',
    },
    legend: {
      data: [t`assets_total_count`, t`available_assets_count`],
      bottom: 0,
      textStyle: {
        color: '#fff',
      },
      itemWidth: fontSize,
      itemHeight: fontSize,
      itemGap: fontSize,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '13%',
      top: '3%',
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
        margin: 5,
      },
    },
    yAxis: {
      type: 'category',
      data: clinicalDepts,
      axisLabel: {
        color: '#fff',
        fontSize,
      },
    },
    series: [
      {
        name: t`assets_total_count`,
        type: 'bar',
        barWidth,
        data: totals,
      },
      {
        name: t`available_assets_count`,
        type: 'bar',
        barGap: 0,
        barWidth,
        data: availables,
        barCategoryGap: 0 ,
      },
    ],
  }

  return template
}

export class DeptTop5 extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    dispatch({ type: 'dashboard2/get/dept-top5' })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.DeptTop5 ? undefined : COMP_KEY.DeptTop5
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, clientRect, data, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let width = clientRect.width * .85
    let height = clientRect.height * .7
    let options = Options(t, fontSize, data)

    return (
      <Background className="dept-top5" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t('dept_top_5')}</h1>
        <div className="bar-chart">
          <Bar id="dept-top5-chart" width={width} height={height} option={options}/>
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.DeptTop5)
export default apply(
  DeptTop5,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('DeptTop5'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)