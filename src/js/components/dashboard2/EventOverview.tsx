import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply } from 'noru-utils/lib'
import periodic from 'hoc/periodic'
import { DATE_FORMAT } from 'utils/constants'
import moment from 'moment'
import Background from 'containers/dashboard2/Background'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './EventOverview.scss'

export class EventOverview extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    let to = moment().format(DATE_FORMAT)
    let conf = config.get(COMP_KEY.EventOverview)
    let from = moment().subtract(conf.month.value, 'month').format(DATE_FORMAT)
    dispatch({ type: 'dashboard2/get/event-overview', payload: { from, to } })
  }
  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.EventOverview ? undefined : COMP_KEY.EventOverview
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, data, fullscreened } = this.props
    let { toHandle, outOfWarranty, inMeasuring, inMaintain, inInspection, inPM } = data
    let eventUnit = t`event_unit`
    let unit = t`asset_unit`

    return (
      <Background className="event-overview" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`event_overview`}</h1>
        <div className="columns">
          <div className="column">
            <h3>{t`event_to_handle`}</h3>
            <p className="count"><span>{toHandle}</span><span>{eventUnit}</span></p>
          </div>
          <div className="column">
            <h3>{t`in_fixing`}</h3>
            <p className="count"><span>{inMaintain}</span><span>{eventUnit}</span></p>
          </div>
          <div className="column">
            <h3>{t`in_pm`}</h3>
            <p className="count"><span>{inPM}</span><span>{eventUnit}</span></p>
          </div>
        </div>
        <div className="columns">
          <div className="column">
            <h3>{t`in_metering`}</h3>
            <p className="count"><span>{inMeasuring}</span><span>{eventUnit}</span></p>
          </div>
          <div className="column">
            <h3>{t`in_inspection`}</h3>
            <p className="count"><span>{inInspection}</span><span>{eventUnit}</span></p>
          </div>
          <div className="column">
            <h3>{t`warrant_due`}</h3>
            <p className="count"><span>{outOfWarranty}</span><span>{unit}</span></p>
          </div>
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.EventOverview)
export default apply(
  EventOverview,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('EventOverview'),
    fullscreened: dashboard2.get('fullscreened'),
   })),
)
