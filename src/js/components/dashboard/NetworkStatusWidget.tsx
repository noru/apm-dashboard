import * as React from 'react'
import { translate } from 'react-i18next'
import { NetworkStatus$, NetworkStatus } from 'observables/index'
import subscribe from 'hoc/RxSubscribe'
import './NetworkStatusWidget.scss'

export const enum Status {
  Online,
  Offline,
}

interface State { status: Status }

export class NetworkStatusWidget extends React.PureComponent<any, State> {

  state = {
    status: Status.Online,
  }

  private _connection

  onNetworkStatus$ = (data) => {
    if (data && data.isOnline) {
      this.setState({
        status: Status.Online,
      })
    } else {
      this.setState({
        status: Status.Offline,
      })
    }
  }

  // todo: avoid connect this
  componentDidMount() {
    this._connection = NetworkStatus.connect()
  }

  componentWillUnmount() {
    this._connection.unsubscribe()
  }

  render() {
    let { status } = this.state
    let { t } = this.props
    const statusClassName = status === Status.Offline ? 'offline' : 'online'
    return (
      <div id="network-status-widget" className={`${statusClassName}`}>
        <i className="fa fa-exclamation-triangle error" aria-hidden="true">&nbsp;{t`network_error`}</i>
      </div>
    )
  }
}

export default translate(['common', 'dashboard'])(subscribe({ NetworkStatus$ })(NetworkStatusWidget))
