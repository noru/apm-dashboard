import * as React from 'react'
import { Observable } from 'rxjs/Observable'
import { Subscription } from 'rxjs/Subscription'
import { upperFirst } from 'lodash-es'

interface Observables {
  [key: string]: Observable<any>
}

type HOC = (input: React.ComponentClass<any>) => React.ComponentClass<any>

export default function subscribe(observables: Observables): HOC {

return Target => class Subscribed extends Target {

    mounted = false

    protected subscriptions: Subscription[] = []

    componentDidMount() {

      this.mounted = true
      for (let key in observables) {
        let observable = observables[key]
        if (typeof observable.subscribe === 'function') {
          let subscription = observables[key].subscribe(this.dispatcher(key))
          this.subscriptions.push(subscription)
        }
      }
      super.componentDidMount && super.componentDidMount()

    }

    componentWillUnmount() {

      this.mounted = false
      super.componentWillUnmount && super.componentWillUnmount()
      this.subscriptions.forEach(sub => sub.unsubscribe())

    }

    private dispatcher(key: string) {
      return {
        next: data => {
          let handlerName = 'on' + upperFirst(key)
          if (handlerName in this && this.mounted) {
            this[handlerName](data)
          }
        },
        error: error => {
          let handlerName = 'on' + upperFirst(key) + 'Error'
          if (handlerName in this && this.mounted) {
            this[handlerName](error)
          }
        },
        complete: () => {
          let handlerName = 'on' + upperFirst(key) + 'Complete'
          if (handlerName in this && this.mounted) {
            this[handlerName]()
          }
        },
      }
    }
  }
}