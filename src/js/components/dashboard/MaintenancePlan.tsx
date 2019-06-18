import * as React from 'react'
import Background from 'containers/dashboard/Background'
import { translate } from 'react-i18next'
import * as classname from 'classname'
import BigCalendar from 'react-big-calendar'
import DateUtil from 'react-big-calendar/lib/utils/dates'
import * as moment from 'moment'
import Colors from 'utils/colors'
import config from 'utils/config'
import { InsPm, InsPmList } from 'services/data'
import { InspectionPlanList as Ipl, InspectionPlanOverview as Ipo,
  InspectionPlanList$ as IPL$, InspectionPlanOverview$ as IPO$,
  TimeConfig$, Refresh$, config as _ } from 'observables/index'
import subscribe from 'hoc/RxSubscribe'
import './MaintenancePlan.scss'
import 'react-big-calendar/lib/css/react-big-calendar.css'
import i18n from '../../i18n'

BigCalendar.momentLocalizer(moment)
const locale = i18n.services.languageDetector.detect()
moment.locale(locale === 'zh' ? 'zh-CN' : locale)
const DATE_FORMAT = locale.startsWith('zh') ? 'MMMDo' : 'MMM. Do'

// HACK: by default the calendar show entire month regardless current day position
// Overwrite this method to get 'today' centered
let old = DateUtil.visibleDays
DateUtil.visibleDays = (date, culture) => {
  let month = old(date, culture)
  prependWeeks(month, 2)
  appendWeeks(month, 2)
  let start = month[0]
  let today = moment()
  let diff = today.diff(start, 'days')
  let redundant = Math.ceil(diff / 7) - 3
  month.splice(0, redundant * 7)
  month.splice(35)
  return month
}
function appendWeeks(month: Date[], weekCount: number) {
  let lastDay = moment(month[month.length - 1])
  let i = 7 * weekCount
  while (i--) {
    month.push(lastDay.add(1, 'days').toDate())
  }
}
function prependWeeks(month: Date[], weekCount: number) {
  let firstDay = moment(month[0])
  let i = 7 * weekCount
  while (i--) {
    month.unshift(firstDay.subtract(1, 'days').toDate())
  }
}

interface Props { t: any, className?: string }
interface State { IPO: InsPm, IPL: InsPmList[] }
export class MaintenancePlan extends React.PureComponent<Props, State> {

  static key = 'maintenance-plan'

  state = {
    IPO: {
      ins: 0,
      quality: 0,
      metering: 0,
      pm: 0,
    },
    IPL: new Array<InsPmList>(),
  }

  onIpl = IPL => {
    this.setState({ IPL })
  }

  onIpo = ({ resp }) => {
    this.setState({ IPO: resp })
  }

  refresh() {
    let conf = config.get(MaintenancePlan.key)
    IPO$.next(_(conf.interval))
    IPL$.next(_(conf.interval))
  }

  config() {
    TimeConfig$.next(MaintenancePlan.key)
  }

  componentDidMount() {
    this.refresh()
    Refresh$.subscribe(key => {
      if (key === MaintenancePlan.key) {
        this.refresh()
      }
    })
  }

  render() {
    let { t, className, ...restProps } = this.props
    let { IPL, IPO } = this.state
    let events = IPL.map(eventBuilder)

    return (
      <Background className={classname('maintenance-plan', className)} {...restProps}>
        <div>
          <span className="chart-title config" onClick={this.config}>{t`maintenance_plan`}</span>
        </div>
        <div className="columns is-fullwidth is-fullheight">
          <div className="column is-2 is-fullheight">
            <nav className="plan-overview">
              { Counter(IPO.ins, Colors.blue, t`inspection`)}
              { Counter(IPO.quality, Colors.green, t`quality_control`)}
              {/* { Counter(IPO.metering, Colors.red,t`counting`)} */}
              { Counter(IPO.pm, Colors.yellow, t`maintenance`)}
            </nav>
          </div>
          <div className="column is-fullheight">
            <BigCalendar
              events={events}
              defaultView="month"
              views={['month']}
              components={{
                event: DayEvent,
              }}
              toolbar={false}
              formats={{ dateFormat: (date) => {
                let d = date.getDate()
                return d === 1 ? moment(date).format(DATE_FORMAT) : String(d)
              }}}
            />
          </div>
        </div>
      </Background>
    )
  }
}
export default translate(['common', 'dashboard'])(subscribe({ Ipl, Ipo })(MaintenancePlan))

export function Counter(num: number, color: string, text: string) {
  return (
    <div className="has-text-centered">
      <div>
        <p className="normal-number" style={{color}}>{num || 0}</p>
        <p className="small-text">{text}</p>
      </div>
    </div>
  )
}

function Ball(numb: number, color: string) {
  if (!numb) {
    return null
  }
  return (
    <div style={{backgroundColor: color}}>{numb}</div>
  )
}
function eventBuilder(data) {
  let date = new Date(data.date)
  return {
    title: '',
    allDay: true,
    start: date,
    end: date,
    data,
  }
}
function DayEvent({ event }) {

  let data = event.data
  return (
    <div className="plan-day-event">
      { Ball(data.ins, Colors.blue) }
      { Ball(data.quality, Colors.green) }
      {/* { Ball(data.metering, Colors.red) } */}
      { Ball(data.pm, Colors.yellow) }
    </div>
  )
}