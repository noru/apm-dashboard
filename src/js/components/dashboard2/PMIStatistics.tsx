import React from 'react'
import { translate } from 'react-i18next'
import { apply } from 'noru-utils/lib'
import { connect } from 'dva'
import periodic from 'hoc/periodic'
import Background from 'containers/dashboard2/Background'
import Pie from 'components/common/Pie'
import moment from 'moment'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY, DATE_FORMAT } from 'utils/constants'
import './PMIStatistics.scss'

/* tslint:disable-next-line */
const FillPattern = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAwAAAANCAYAAACdKY9CAAAAAXNSR0IArs4c6QAAAVFJREFUKBVdkjtOw0AURQ92/AlO+DRIFFBQ0CNWQJyIPQCBrWQJlFDwaWAFIIEj0bEgJAQkzof7ZuwQ4e5pzty59z6vcPk+p7UBLzcw/oFuH5otzbcwKaF3DlEMxb07DxZw+R8e+8tRAq+CZ1PIzwhJ0gEGa6C5pkNTNljKSar5TvDEz+1NAkaCOwa3dShb5cgrJ80/2Gw1ZOvpShfyU8gq5QW86l+aSrmGh7IlJwGZBZYNB0spzTw8qWyYsrNlGfrLGep25HnRTpVhPvM2Je4z6KarcjlwJLiwwILNVhjB8zUN3456N7hUOz1djitll+ECgobfg9pThjpw1XtsgaVscFewKRcKXNkKiZOBU7YNJ0vt2B4ssNlysOZsXS9YwKMTwerdlGyjHVVtv8NQs3221CB0GQIOctjZh7cH+PqAwx5s7/n5+1PzMWztan501f8C1ZCZhGHyJB8AAAAASUVORK5CYII='
const FillImg = new Image()
FillImg.src = FillPattern

const Charts = [
  {
    i18n: 'maintenance_order',
    keys: ['pmInPlan', 'pmClosed', 'pmClosedInTime', 'pmInTimeRate'],
  },
  {
    i18n: 'metering_order',
    keys: ['measuringInPlan', 'measuringClosed', 'measuringClosedInTime', 'measuringInTimeRate'],
  },
  {
    i18n: 'inspection_order',
    keys: ['inspectionInPlan', 'inspectionClosed', 'inspectionClosedInTime', 'inspectionInTimeRate'],
  },
]

export class PMIStatistics extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    let conf = config.get(COMP_KEY.PMIStatistics)
    let to = moment().add(1, 'month').format(DATE_FORMAT) // YHAAO-1001
    let from = moment().subtract(conf.month.value, 'month').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/pmi-stats', payload: { from, to } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.PMIStatistics ? undefined : COMP_KEY.PMIStatistics
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, data, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let baseRadius = fontSize * 4

    return (
      <Background className="mmi-statistics" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`pmi_statistics`}</h1>
        <div className="columns">
          {
            Charts.map(({i18n, keys}, i) => {
              let plan = data[keys[0]]
              let closed = data[keys[1]]
              let closedOnTime = data[keys[2]]
              let rate = data[keys[3]]
              return <Chart key={i} baseRadius={baseRadius}
                  name={t(i18n)} plan={plan || 0} closed={closed || 0} closedOnTime={closedOnTime || 0} rate={rate}
                />
            })
          }
        </div>
        <div className="legend">
          <span className="legend-1">{t`planned_orders_count`}</span>
          <span className="legend-2">{t`closed_on_time_orders_count`}</span>
          {/* <span className="legend-3">{t`closed_orders_count`}</span>
          <span> ({t`pmi_statistics_legend_unit`})</span> */}
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.PMIStatistics)
export default apply(
  PMIStatistics,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('PMIStats'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)

const LeftPieOpt = {
  series: [{
    type: 'pie',
    silent: true,
    radius: ['80%', '95%'],
    labelLine: {
      normal: {
        show: false,
      },
    },
    data: [
      {value: 100 },
    ],
    itemStyle: {
      normal: {
        color: '#00b0f0AA',
        borderWidth: 1,
        borderColor: '#00b0f0',
      },
    },
  }],
}

const RightPieOpt = (closed, closedOnTime) => ({
  series: [{
    type: 'pie',
    silent: true,
    radius: ['80%', '95%'],
    labelLine: {
      normal: {
        show: false,
      },
    },
    data: [
      { value: closedOnTime },
      { value: closed - closedOnTime, itemStyle: { normal: { color: 'transparent' }}},
    ],
    itemStyle: {
      normal: {
        color: {
          image: FillImg,
          repeat: 'repeat',
        },
        borderWidth: 1,
        borderColor: '#92d050',
      },
    },
  }],
})

function Chart({ name, baseRadius, plan, closed, closedOnTime, rate }) {

  let leftRadius, rightRadius
  leftRadius = rightRadius = baseRadius
  if (closed > plan) {
    leftRadius *= .87
  } else {
    rightRadius *= .87
  }

  return (
    <div className="chart column">
      <h2>{name}</h2>
      <div className="chart-container">
        <div className="donut-chart">
          <div className="centered" style={{ left: leftRadius / 2 + 'px'}}>
            <p>{plan}</p>
          </div>
          <Pie id={name + 'all'} width={leftRadius} height={leftRadius} option={LeftPieOpt}/>
        </div>
        <div className="donut-chart">
          <div className="centered" style={{ left: rightRadius / 2 + 'px'}}>
            <p>{closed}</p>
            <p>{rate}</p>
          </div>
          <Pie
            id={name + 'closed'}
            width={rightRadius}
            height={rightRadius}
            option={RightPieOpt(closed, closedOnTime)}
          />
        </div>
      </div>
    </div>
  )
}