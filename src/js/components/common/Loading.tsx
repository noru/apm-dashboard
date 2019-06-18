import * as React from 'react'
import { OngoingRequests$ } from 'observables/utils'
import connect from 'hoc/RxConnect'

export class Loading extends React.PureComponent<any, any> {

  render() {
    let { loading, placeholder } = this.props
    return <span className="loading-indicator">
        { loading ? <i className="loading-spinner" /> : placeholder }
      </span>
  }

}

export const GlobalAjaxLoading = connect(OngoingRequests$, map => ({ loading: map.size }))(Loading)
