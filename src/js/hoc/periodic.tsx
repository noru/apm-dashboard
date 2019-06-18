import * as React from 'react'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'

type HOC = (input: React.ComponentClass<any>) => React.ComponentClass<any>

export default function periodic(period: number, action: string): HOC {

  return Target => class Subscribed extends Target {

    runner: Subscription

    componentDidMount() {
      super.componentDidMount && super.componentDidMount()
      this.runner = Observable.timer(0, period)
        .do(() => this[action] && this[action]())
        .subscribe()
    }

    componentWillUnmount() {
      this.runner && this.runner.unsubscribe()
    }

  }
}