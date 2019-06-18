import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply, shallowEqual, isBetween } from 'noru-utils/lib'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import Background from 'containers/dashboard2/Background'
import Ellipsus from 'ellipsus'
import * as moment from 'moment'
import { Subscription, Observable } from 'rxjs'
import config, { Config } from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY, DATE_FORMAT } from 'utils/constants'
import './WorkOrders.scss'

const CONF = config.get(COMP_KEY.WorkOrders)
const WARN = CONF.showWarning.value
const ALERT = CONF.showAlert.value
function getColorByDays(days: number) {
  if (isBetween(days, 0, WARN, [true, false])) {
    return ''
  }
  if (isBetween(days, WARN, ALERT, [true, false])) {
    return 'warn'
  }
  if (days >= ALERT) {
    return 'alert'
  }
}

export class WorkOrders extends React.PureComponent<any, any> {

  state = {
    rows: new Array(),
  }

  private _pagination: Subscription
  private _config: Config

  getData() {
    let { dispatch } = this.props
    let to = moment().format(DATE_FORMAT)
    let from = moment().subtract(this._config.month.value, 'month').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/work-orders', payload: { from, to } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.WorkOrders ? undefined : COMP_KEY.WorkOrders
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  componentDidMount() {
    this._config = config.get(COMP_KEY.WorkOrders)
  }

  componentWillReceiveProps({ data, clientRect }) {
    if (shallowEqual(data, {})) {
      return
    }
    if (data !== this.props.data || !shallowEqual(this.props.clientRect, clientRect)) {
      let { fontSize } = this.props
      let height = clientRect.height
      let lines = calculateLineCount(height, fontSize * 1.25)
      this._pagination && this._pagination.unsubscribe()
      this._pagination = Observable.timer(0, this._config.intervalPerPage)
        .do((i) => {
          let pages = Math.ceil(data.length / lines)
          let start = i % pages  * lines
          let end = start + lines
          this.setState( { rows: data.slice(start, end)})
        })
        .subscribe()
    }
  }

  componentWillUnmount() {
    this._pagination.unsubscribe()
  }

  render() {
    let { t, fullscreened } = this.props
    let { rows } = this.state

    return (
      <Background className="maintenance-status-2" style={{fontSize: fullscreened ? '2em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`work_order`}</h1>
        <div className="table-container">
          <Table rows={rows} t={t} />
        </div>
      </Background>
    )
  }
}

export default apply(
  WorkOrders,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('WorkOrders'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)

export function calculateLineCount(height, fontSize, lineHeight?, min = 12) {

  lineHeight = lineHeight || fontSize * 1.62
  const offset = 80
  let lines = height > offset ? ((height - offset) / lineHeight) | 0 : 0
  return Math.max(lines, min)

}

function Table({rows, t}: { rows: any[], t: any }) {
  return (
    <table>
      <thead>
        <tr>
          <th><span>{t`asset_name`}</span></th>
          <th><span>{t`sector`}/{t`dept`}</span></th>
          <th><span>{t`reporter`}</span></th>
          <th><span>{t`process_time`}</span></th>
          <th><span>{t`processor`}</span></th>
          <th><span>{t`since_open`}</span></th>
          <th><span>{t`status`}</span></th>
        </tr>
      </thead>
      <tbody>
        { rows.map((row, i) => {
          return (
            <tr key={String(i)} className={getColorByDays(+row.daysSinceReported.replace('天', ''))}>
              <FlipWrapper className="asset-name"><Ellipsus>{row.assetName}</Ellipsus></FlipWrapper>
              <FlipWrapper>{row.clinicalDept}</FlipWrapper>
              <FlipWrapper>{row.reporter}</FlipWrapper>
              <FlipWrapper>
                {row.updateDate && row.updateDate.substr(0, 16).replace(new RegExp('-', 'g'), '/')}
              </FlipWrapper>
              <FlipWrapper>{row.worker}</FlipWrapper>
              <FlipWrapper>{row.daysSinceReported}</FlipWrapper>
              <FlipWrapper>{row.statusLabel}</FlipWrapper>
            </tr>
          )
        })}
      </tbody>
    </table>
  )
}

export function FlipWrapper({ rowSpan, children, className }: { rowSpan?: number, children: any, className?: string }) {
  return (
    <td rowSpan={rowSpan}>
      <div
        key={String(Math.random())}
        className={className}
        style={{ lineHeight: '1.3em', minHeight: '1.3em' }}
      >
        {children}
      </div>
    </td>
  )
}
