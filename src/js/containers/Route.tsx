import * as React from 'react'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { I18nextProvider } from 'react-i18next'
import i18n from 'js/i18n'
import Login from 'containers/Login'
import NotFound from 'containers/common/NotFound'
import PrivateRoute from 'containers/PrivateRoute'
import * as config from 'config'
import dynamic from 'dva/dynamic'

export default function({ app }) {

    const Dashboard = dynamic({
      app,
      models: () => [],
      component: () => import(/* webpackChunkName: "dashboard" */'containers/dashboard/Dashboard'),
    } as any)
    const Dashboard2 = dynamic({
      app,
      models: () => [ import( /* webpackChunkName: "dashboard2-model" */'../models/dashboard2') ],
      component: () => import( /* webpackChunkName: "dashboard2" */'./dashboard2/Dashboard'),
    } as any)
    const App = dynamic({
      app,
      models: () => [],
      component: () => import(/* webpackChunkName: "v2" */'containers/App'),
    } as any)

    const Demo1 = dynamic({
      app,
      models: () => [ import( /* webpackChunkName: "dashboard2-model" */'../models/dashboard2') ],
      component: () => import(/* webpackChunkName: "demo1" */'containers/Demo1'),
    } as any)

    const Demo2 = dynamic({
      app,
      models: () => [],
      component: () => import(/* webpackChunkName: "demo2" */'containers/Demo2'),
    } as any)

    const Demo3 = dynamic({
      app,
      models: () => [],
      component: () => import(/* webpackChunkName: "demo3" */'containers/Demo3'),
    } as any)

    return (
      <I18nextProvider i18n={i18n}>
        <Router basename={config.basename}>
          <Switch>
            <Route exact path="/login" component={Login} />
            <PrivateRoute exact path="/" component={Dashboard} />
            <PrivateRoute exact path="/dashboard" component={Dashboard} />
            <PrivateRoute exact path="/dashboard2" component={Dashboard2} />
            <PrivateRoute path="/v2" component={App} />
            <PrivateRoute path="/demo1" component={Demo1} />
            <PrivateRoute path="/demo2" component={Demo2} />
            <PrivateRoute path="/demo3" component={Demo3} />
            <Route exact path="*" component={NotFound} />
          </Switch>
        </Router>
      </I18nextProvider>
    )

}
