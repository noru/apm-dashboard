import React from 'react'
import './fakeTabWrapper.scss'

type HOC = (input: React.ComponentClass<any>) => React.ComponentClass<any>

export default function(active: string, clazz: string = ''): HOC {
  return Target => class Wrapped extends Target {

    componentDidMount() {
      // override sub method, otherwise it will be called twice
    }
    render() {
      return (
        <>
          <nav className={'fake-tab-wrapper ' + clazz}>
            <a className={active === '1' ? 'active' : ''} href="#/demo1">首页</a>
            <a className={active === '2' ? 'active' : ''} href="#/demo2">资产监控</a>
            <a className={active === '3' ? 'active' : ''} href="#/demo3">投入产出监控</a>
          </nav>
          <Target />
        </>
      )
    }
  }
}
