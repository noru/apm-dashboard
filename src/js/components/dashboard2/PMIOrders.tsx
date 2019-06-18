import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply, isNullOrEmpty, shallowEqual } from 'noru-utils/lib'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import Background from 'containers/dashboard2/Background'
import Ellipsus from 'ellipsus'
import * as moment from 'moment'
import { DATE_FORMAT } from 'utils/constants'
import { calculateLineCount, FlipWrapper } from './WorkOrders'
import { Observable, Subscription } from 'rxjs'
import config, { Config } from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './PMIOrders.scss'

const DummyRow: Row = {
  orderType    : '',
  assetName    : '',
  clinicalDept : '',
  owner        : '',
  planStartTime: '',
  planEndTime  : '',
  status       : '',
  statusLabel  : '',
}

const StatusClassMap = {
  3: 'to-pick',
}

export class PMIOrders extends React.PureComponent<any, any> {

  state = {
    pmOrders: new Array,
    inspectionOrders: new Array,
    measuringOrders: new Array,
  }

  private _pagination: Subscription
  private _config: Config

  getData() {
    let { dispatch } = this.props
    let to = moment().add(this._config.untilNDays.value, 'day').format(DATE_FORMAT)
    let from = moment().subtract(this._config.pastNDays.value, 'day').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/pmi-orders', payload: { from, to } })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.PMIOrders ? undefined : COMP_KEY.PMIOrders
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  componentDidMount() {
    this._config = config.get(COMP_KEY.PMIOrders)
  }
  componentWillReceiveProps({ data, clientRect }) {
    if (shallowEqual(data, {})) {
      return
    }
    if (data !== this.props.data || !shallowEqual(this.props.clientRect, clientRect)) {

      this._pagination && this._pagination.unsubscribe()

      let { fontSize } = this.props
      let height = clientRect.height
      let lines = calculateLineCount(height, fontSize * 1.25)
      let { inspectionOrders, measuringOrders, pmOrders } = data

      let pageSize = (lines / splitTo(inspectionOrders, measuringOrders, pmOrders)) | 0
      this._pagination = Observable.timer(0, this._config.intervalPerPage)
        .do(i => {
          this.setState({
            pmOrders: paginate(pmOrders, pageSize, i % getPageNum(pmOrders.length, pageSize)),
            inspectionOrders: paginate(inspectionOrders, pageSize, i % getPageNum(inspectionOrders.length, pageSize)),
            measuringOrders:
              paginate(measuringOrders, lines - 2 * pageSize, i % getPageNum(measuringOrders.length, pageSize)),
          })
        })
        .subscribe()
    }
  }

  componentWillUnmount() {
    this._pagination.unsubscribe()
  }

  render() {
    let { t, fullscreened } = this.props
    let { inspectionOrders, measuringOrders, pmOrders } = this.state

    return (
      <Background className="pmi-orders" style={{fontSize: fullscreened ? '2em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`pmi_order`}</h1>
        <div className="table-container">
          <Table pm={pmOrders} inspection={inspectionOrders} meter={measuringOrders} t={t} />
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.PMIOrders)
export default apply(
  PMIOrders,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('PMIOrders'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)

interface Row {
  orderType    : string,
  assetName    : string,
  clinicalDept : string,
  owner        : string,
  planStartTime: string,
  planEndTime  : string,
  status       : string,
  statusLabel  : string,
  expired?     : boolean,
}
function Table({t, pm = new Array<Row>() , meter = new Array<Row>(), inspection = new Array<Row>()}) {
  return (
    <table>
      <thead>
        <tr>
          <th><span>{t`order_type`}</span></th>
          <th><span>{t`asset_name`}</span></th>
          <th><span>{t`sector`}/{t`dept`}</span></th>
          <th><span>{t`processor`}</span></th>
          {/* <th><span>{t`planned_start_time`}</span></th> */}
          <th><span>{t`planned_end_time`}</span></th>
          <th><span>{t`status`}</span></th>
        </tr>
      </thead>
      <tbody>
        { pm.map(Row) }
        { inspection.map(Row) }
        { meter.map(Row) }
      </tbody>
    </table>
  )
}

function Row(row: Row, i, arr) {
  return (
    <tr key={row.orderType + i} className={row.expired ? 'to-close' : StatusClassMap[row.status]}>
      { i === 0 &&
        <FlipWrapper rowSpan={arr.length} className="order-type">{row.orderType}</FlipWrapper>
      }
      <FlipWrapper className="asset-name"><Ellipsus>{row.assetName}</Ellipsus></FlipWrapper>
      <FlipWrapper>{row.clinicalDept}</FlipWrapper>
      <FlipWrapper>{row.owner}</FlipWrapper>
      {/* <FlipWrapper>{(row.planStartTime || '').replace(new RegExp('-', 'g'), '/')}</FlipWrapper> */}
      <FlipWrapper>{(row.planEndTime || '').replace(new RegExp('-', 'g'), '/')}</FlipWrapper>
      <FlipWrapper>{row.statusLabel}</FlipWrapper>
    </tr>
  )
}

function splitTo(...arrays) {
  return arrays.filter(arr => !isNullOrEmpty(arr)).length
}

function paginate(arr, pageSize, pageNum) {
  if (isNullOrEmpty(arr)) {
    return []
  }
  let start = pageSize * pageNum
  let end = start + pageSize
  let result = arr.slice(start, end)
  if (result.length < pageSize) {
    result = result.concat(new Array(pageSize - result.length).fill(DummyRow))
  }
  return result
}

function getPageNum(length, size) {
  return Math.ceil(length / size)
}