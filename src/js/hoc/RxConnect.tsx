import * as React from 'react'
import { Observable } from '../observables/rxjs'
import { Subscription } from 'rxjs/Subscription'

type HOC = (input: React.ComponentClass) => React.ComponentClass
export default function connect<T = any>(observable: Observable<T>, propsSelector: (state: T) => any): HOC {

  return Target => class Subscribed extends Target {

    state: any
    private _subscription: Subscription

    componentDidMount() {
      this._subscription = observable.subscribe(this._subscribeValue)
      // in case of behavior subject
      if ('getValue' in observable) {
        this._subscribeValue(observable['getValue']())
      }
    }

    componentWillUnmount() {
      this._subscription.unsubscribe()
    }

    render() {
      return <Target {...this.state} {...this.props} subject={observable} />
    }

    private _subscribeValue = (value: T) => {
      this.setState(propsSelector(value))
    }

  }
}