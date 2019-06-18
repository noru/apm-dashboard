import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply } from 'noru-utils/lib'
import Radar from 'components/common/Radar'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import moment from 'moment'
import { zipWith } from 'lodash-es'
import { DATE_FORMAT } from 'utils/constants'
import { Observable, Subscription } from 'rxjs'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './PersonnelPerformance.scss'

const i18nKey = {
  accept: 'accepted_order_count',
  done: 'finished_order_count',
  rate: 'service_rate',
  workHour: 'total_work_hour',
  responseTime: 'response_time',
  workerPerf: 'personnel_performance',
  average: 'dept_average',
}

const ScoreFields             = ['received', 'closed', 'effort', 'responseTime', 'rating']
const ScoreFieldsForChart     = ['received', 'closed', 'lgEffort', 'lgResponseTime', 'rating']
const DeptScoreFields         = ['avgReceived', 'avgClosed', 'avgEffort', 'avgResponseTime', 'avgRating']
const DeptScoreFieldsForChart = ['avgReceived', 'avgClosed', 'lgAvgEffort', 'lgAvgResponseTime', 'avgRating']
const MaxScoreFields          = ['maxReceived', 'maxClosed', 'lgMaxEffort', 'lgMaxResponseTime', 'maxRating']
const MinScoreFields          = ['minReceived', 'minClosed', 'lgMinEffort', 'lgMinResponseTime', 'minRating']
const DummyStaff = {
  staffName: '-',
  clinicalDeptPerformance: undefined,
}

const Options = (t, baseFontSize: number, staffScore, deptScore, maxScore, minScore) => {

  let fontSize = baseFontSize * .657
  let itemWidth = fontSize * .75
  let indicator = zipWith(
    [t(i18nKey.accept), t(i18nKey.done), t(i18nKey.workHour), t(i18nKey.responseTime), t(i18nKey.rate)],
    maxScore,
    minScore,
    (name, max, min) => {
      if (name === t(i18nKey.responseTime)) {
        return { name, max: -min, min: -max } // reverse responseTime tike for this value the less the better
      } else {
        return { name, max, min }
      }
    },
  )
  let template = {
    legend: {
      data: [t`personnel_performance`, t`dept_average`],
      top: 0,
      right: 0,
      textStyle: {
        fontSize,
        color: '#fff',
        fontFamily: ['sans-serif', 'GE CHS'],
      },
      orient: 'vertical',
      itemWidth,
      itemHeight: itemWidth,
      itemGap: itemWidth / 2,
      seletedMode: false,
    },
    radar: {
      indicator,
      name: {
        fontSize,
      },
      nameGap: 4,
      center: ['45%', '65%'],
      silent: true,
      radius: '70%',
    },
    series: {
      type: 'radar',
      silent: true,
      data : [
        {
          value: staffScore,
          name: t`personnel_performance`,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: 0,
            },
          },
          itemStyle: {
            normal: {
              color: '#ffc000',
            },
          },
          areaStyle: {
            normal: {
              opacity: 0.5,
            },
          },
        },
          {
          value: deptScore,
          name: t`dept_average`,
          symbol: 'none',
          lineStyle: {
            normal: {
              width: 0,
            },
          },
          itemStyle: {
            normal: {
              color: '#00b0f0',
            },
          },
          areaStyle: {
            normal: {
              opacity: 0.5,
            },
          },
        },
      ],
    },
  }

  return template
}
export class PersonnelPerformance extends React.PureComponent<any, any> {

  state = {
    staff: DummyStaff,
  }

  private _pagination: Subscription
  private _config: any

  getData() {
    let { dispatch } = this.props
    let to = moment().format(DATE_FORMAT)
    let from = moment().subtract(this._config.month.value, 'month').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/staff-perf', payload: { from, to } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.PersonnelPerformance ? undefined : COMP_KEY.PersonnelPerformance
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  componentDidMount() {
    this._config = config.get(COMP_KEY.PersonnelPerformance)
  }

  componentWillReceiveProps({ data }) {
    if (data !== this.props.data) {
      this._pagination && this._pagination.unsubscribe()
      this._pagination = Observable.timer(0, this._config.intervalPerPage)
        .do((i) => this.setState( { staff: data[i % data.length] || DummyStaff }))
        .subscribe()
    }
  }

  componentWillUnmount() {
    this._pagination.unsubscribe()
  }

  render() {

    let { t, clientRect, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let { staff } = this.state
    let staffScore = ScoreFields.map(key => staff[key] || 0)
    let staffScoreForChart = ScoreFieldsForChart.map(key => {
      if (key === 'lgResponseTime') {
        return -staff[key]
      }
      return staff[key] || 0
    })
    let deptPerf = staff.clinicalDeptPerformance
    let deptScore = deptPerf ? DeptScoreFields.map(key => deptPerf![key]) : []
    let deptScoreForChart = deptPerf ? DeptScoreFieldsForChart.map(key => {
      if (key === 'lgAvgResponseTime') {
        return -deptPerf![key]
      }
      return deptPerf![key]
    }) : []
    let maxScore = deptPerf ? MaxScoreFields.map(key => deptPerf![key]) : staffScore
    let minScore = deptPerf ? MinScoreFields.map(key => deptPerf![key]) : staffScore
    let labels = [i18nKey.accept, i18nKey.done, i18nKey.workHour, i18nKey.responseTime, i18nKey.rate].map(t)
    let width = clientRect.width * .45
    let height = clientRect.height * .7
    let options = Options(t, fontSize, staffScoreForChart, deptScoreForChart, maxScore, minScore)

    return (
      <Background className="personnel-performance" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`personnel_performance`}</h1>
        <div className="chart">
          <Table name={staff.staffName} deptScore={deptScore} staffScore={staffScore} labels={labels} t={t}/>
          <div className="radar-chart">
            <Radar id="pp-radar" width={width} height={height} option={options} />
          </div>
        </div>
      </Background>
    )
  }

}

const CONF = config.get(COMP_KEY.PersonnelPerformance)
export default apply(
  PersonnelPerformance,
  periodic(CONF.interval, 'getData'),
  withClientRect,
  translate(['common', 'dashboard2']),
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('StaffPerf'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)

function Table({ name, deptScore, staffScore, labels, t }) {

  let rows = zipWith(labels, deptScore, staffScore,
    (label, dept, staff) => ({ label, dept, staff }),
  )
  return (
    <div className="pp-table">

      <div className="header level">
        <div className="level-left level-item">
          <span className="pp-table-label">{t`personnel_name`}</span>
          <span>{name}</span>
        </div>
        <div className="level-right level-item">
          <span className="pp-table-label">{t`dept_average`}</span>
        </div>
      </div>

      <div className="pp-body">
        {
          rows.map(({ label, dept, staff }) => {
            return <Line key={label} label={label} value={staff} average={dept} />
          })
        }
      </div>
    </div>
  )
}

function Line({ label, value, average }) {
  return (
    <div className="pp-tr level">
      <div className="level-left level-item">
        <span className="pp-body-label">{label}</span>
        <span className="pp-body-value">{value}</span>
      </div>
      <div className="level-right level-item">
        <span className="pp-body-average">{average || '-'}</span>
      </div>
    </div>
  )
}