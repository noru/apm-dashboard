import * as React from 'react'
import SideBar from 'containers/SideBarLayout'
import { Route, Switch, Redirect } from 'react-router-dom'
import dynamic from 'dva/dynamic'
// import IframeWrapper from './IframeWrapper'
// import config from 'config'
import app from '../index'

// const PATH = config.publicPath

export class App extends React.PureComponent<any, any> {

  render() {
    const Dashboard = dynamic({
      app, models: () => [],
      component: () => import(/* webpackChunkName: "dashboard" */'containers/dashboard/Dashboard'),
    } as any)
    const AssetPerf = dynamic({
      app, models: () => [],
      component: () => import(/* webpackChunkName: "asset-perf" */'containers/reports/AssetPerf/AssetPerf'),
    } as any)

    return (
        <SideBar>
          <Switch>
            <Route exact path="/v2" >
              <Redirect to={{ pathname: '/v2/Reports/AssetPerf' }}/>
            </Route>
            <Route path="/v2/Dashboard" component={Dashboard} />
            <Route path="/v2/Reports/AssetPerf" component={AssetPerf} />
          </Switch>
        </SideBar>
    )
  }
}

export default App
