import * as React from 'react'
import Background from 'containers/dashboard/Background'
import { translate } from 'react-i18next'
import './PersonnelPerformance.scss'
import { UserPerformance } from 'services/data'
import * as classname from 'classname'
import config from 'utils/config'
import { PersonnelPerformance as PP, PersonnelPerformance$ as PP$,
  TimeConfig$, Refresh$, config as _} from 'observables/index'
import subscribe from 'hoc/RxSubscribe'
import FlipMove from 'components/common/FlipMoveWrapper'

interface Props { t: any }
interface State { data: UserPerformance[] }

export class PersonnelPerformance extends React.PureComponent<Props, State> {

  static key = 'personnel-performance'

  state = {
    data: new Array<UserPerformance>(),
  }
  onPP = income => {
    let { data } = this.state
    // todo: refactor observable to avoid such case
    if (data.find(d => d.userId === income.data[0].userId) === undefined) {
      data = data.concat(income.data)
    }
    if (data.length > 9) {
      data.shift()
    }
    this.setState({ data })
  }

  refresh() {
    let conf = config.get('personnel-performance')
    PP$.next(_(conf.interval, 1, conf.intervalPerPage, 9))
    this.setState({ data: [] })
  }

  config() {
    TimeConfig$.next(PersonnelPerformance.key)
  }

  componentDidMount() {
    this.refresh()
    Refresh$.subscribe(key => {
      if (key === PersonnelPerformance.key) {
        this.refresh()
      }
    })
  }

  render() {
    let { t } = this.props
    let { data } = this.state
    return (
      <Background className="personnel-performance tile is-child">
        <div>
          <span className="chart-title config" onClick={this.config}>
            {t`personnel_performance`}({t('last_30days')})
          </span>
        </div>
        <div className="legend small-text">
          <div className="color-green">{t`workload`}</div>
          <div>
            <span className="color-purple">{t`closed_tickets`}</span>
            <span> | </span>
            <span className="color-turquoise">{t`openning_tickets`}</span>
          </div>
        </div>
        <FlipMove duration={300} easing="ease-out" >
          { data.map(LineItem) }
        </FlipMove>
      </Background>
    )
  }
}
export default translate(['common', 'dashboard'])(subscribe({ PP })(PersonnelPerformance))

function LineItem(item: UserPerformance | null) {
  return (
    <div key={item ? item.userId : String(Math.random())} className={classname('line-item', item || 'placeholder')} >
      <div className="user-name">{item && item.userName}</div>
      <div className="is-fullwidth has-text-right">
        <span className="color-green work-num">{item && Number(item.workNum).toFixed(1)}%</span>
        <progress className="progress percentage" value={item ? item.workNum : 0} max="100"></progress>
      </div>
      <div className="is-fullwidth has-text-right">
        <span className="color-purple closed-num">{item && item.closedNum}</span>
          <span> | </span>
        <span className="color-turquoise open-num">{item && item.openNum}</span>
        <progress className="progress tickets"
          value={item ? item.closedNum : 0}
          max={item ? item.openNum + item.closedNum : 0}/>
      </div>
    </div>
  )
}