import * as React from 'react'
import { Route, Redirect } from 'react-router-dom'

const PrivateRoute = ({ component: Component, ...rest }) => (
  <Route {...rest} render={props => (
    isAuthenticated() ? (
      <Component {...props}/>
    ) : (
      window.location.host.indexOf('localhost') === 0 ?
      <Redirect to={{
        pathname: '/login',
        state: { from: props.location },
      }}/> :
      (window.location = 'http://apm-uat.hcdigital.com.cn/geapm/login.xhtml')
    )
  )}/>
)

export default PrivateRoute

export function isAuthenticated() {
  return true
}
