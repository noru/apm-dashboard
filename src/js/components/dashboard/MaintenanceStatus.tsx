import * as React from 'react'
import Background from 'containers/dashboard/Background'
import RangeIndicator from 'components/dashboard/RangeIndicator'
import Ellipsus from 'ellipsus'
import { Counter } from './MaintenancePlan'
import { translate } from 'react-i18next'
import * as classname from 'classname'
import * as moment from 'moment'
import Colors from 'utils/colors'
import './MaintenanceStatus.scss'
import { AssetRepairStatus, AssetNum, } from 'services/data'
import { RepairStatus as RS, RepairNumber as RN, TimeConfig$, Refresh$,
  RepairStatus$ as RS$, RepairNumber$ as RN$, config as _ } from 'observables/index'
import config from 'utils/config'
import { DATETIME_FORMAT } from 'utils/constants'
import subscribe from 'hoc/RxSubscribe'
import FlipMove from 'components/common/FlipMoveWrapper'

const PLACEHOLDER = () => (<tr key={String(Math.random())}>
                      <FlipWrapper>&zwnj;</FlipWrapper>
                      <FlipWrapper> </FlipWrapper>
                      <FlipWrapper> </FlipWrapper>
                      <FlipWrapper> </FlipWrapper>
                      <FlipWrapper> </FlipWrapper>
                    </tr >)
const EMPTY_10_ROWS = Array(10).fill(null)

interface Props { t: any, className?: string }
interface State { data: AssetRepairStatus[], count: AssetNum | {}, skip: number, total: number, top: number }

export class MaintenanceStatus extends React.PureComponent<Props, State> {

  static key = 'maintenance-status'

  state = {
    count: {
      assetOn: 0,
      assetOff: 0,
    },
    data: new Array<AssetRepairStatus>(),
    skip: 0,
    total: 0,
    top: 0,
  }

  onRS = ({ data, total, skip, top }) => {
    this.setState({ data, total, skip, top })
  }

  onRN = count => {
    this.setState({ count })
  }

  refresh() {
    let conf = config.get(MaintenanceStatus.key)
    RS$.next(_(conf.interval, 10, conf.intervalPerPage))
    RN$.next(_(conf.interval))
    this.setState({ data: [], total: 0, skip: 0, top: 0 })
  }

  config() {
    TimeConfig$.next(MaintenanceStatus.key)
  }

  componentDidMount() {
    this.refresh()
    Refresh$.subscribe(key => {
      if (key === MaintenanceStatus.key) {
        this.refresh()
      }
    })
  }

  render() {
    let { t, className, ...restProps } = this.props
    let { count, data, total, skip, top } = this.state
    let showRange = total > 0 && total > top
    return (
      <Background className={classname('maintenance-status', className)} {...restProps}>
        <div>
          <span className="chart-title config" onClick={this.config}>{t`asset_fixing_status`}</span>
        </div>
        <div className="columns is-fullwidth">
          <div className="column is-2 col-status-overview">
            <nav className="status-overview">
              {Counter(count.assetOn, Colors.turquoise, t`in_good_condition`)}
              {Counter(count.assetOff, Colors.yellow, t`in_fixing`)}
            </nav>
          </div>
          <div className="column is-fullheight">
            <Table rows={data.length ? data : EMPTY_10_ROWS} t={t} />
            { showRange && <RangeIndicator start={skip} end={skip + data.length} base={total}/> }
          </div>
        </div>
      </Background>
    )
  }
}
export default translate(['common', 'dashboard'])(subscribe({ RS, RN })(MaintenanceStatus))

function Table({rows, t}: { rows: AssetRepairStatus[], t: any}) {
  return (
    <table>
      <thead>
        <tr>
          <th>{t`status`}</th>
          <th>{t`asset_name`}</th>
          <th>{t`processor`}</th>
          <th>{t`process_time`}</th>
          <th>{t`since_open`}</th>
        </tr>
      </thead>
      <tbody>
        { rows.map((row, i) => {
          return row === null ? PLACEHOLDER() :
            (<tr key={String(i)}>
              <FlipWrapper>{StatusCell(row.stepId, row.stepName)}</FlipWrapper>
              <FlipWrapper className="asset-name"><Ellipsus>{row.assetName}</Ellipsus></FlipWrapper>
              <FlipWrapper>{row.currentPerson}</FlipWrapper>
              <FlipWrapper>{moment(row.dealTime).format(DATETIME_FORMAT)}</FlipWrapper>
              <FlipWrapper>{+row.openTime}{t('day', { count: +row.openTime })}</FlipWrapper>
            </tr>)
        })}
      </tbody>
    </table>
  )
}

function StatusCell(step: number, status: string) {
  return (
    <span>
      { StatusIndicator(step) }
      <span>{status}</span >
    </span>
  )
}

const STEPS = [2, 3, 4, 5, 6] // total 7 steps, 1 & 7 won't appear in here
function StatusIndicator(step: number) {
  return (
    <div className="status-indicator">
      { STEPS.map(i => (
        <div key={String(i)} className={step === i ? 'current' : ''}></div>
      ))}
    </div>
  )
}

function FlipWrapper({ children, className }: { children: any, className?: string }) {
  return (
    <td>
      <FlipMove duration={650} easing="ease-out" enterAnimation="fade"
        leaveAnimation="accordionVertical">
        <div key={String(Math.random())} className={className} style={{lineHeight: '1.2rem'}}>{children}</div>
      </FlipMove>
    </td>
  )
}