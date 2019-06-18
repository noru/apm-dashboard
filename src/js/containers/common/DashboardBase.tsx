import * as React from 'react'
import { AuthConfig } from 'utils/config'
import { debounce } from 'lodash-es'
import { Auth$, Auth } from 'observables/index'
import * as ifv from 'ifvisible.js'

const ONE_HOUR = 3600000

interface State {
  viewportWidth: number,
  viewportHeight: number,
}

export default abstract class DashboardBase<P = any, S = any> extends React.PureComponent<P & any, S & State> {

  state: any = {
    viewportWidth: 0,
    viewportHeight: 0,
  }

  reloadOnResize = debounce(() => {
    let viewport = getViewport()
    let fontSize = this.getBaseFontSize(viewport)
    this.setState(viewport)
    this.html!.setAttribute('style', `font-size:${fontSize}px;overflow:hidden;`)
  }, 100)

  protected isStandalone: boolean
  private html
  private tokenRefreshSubscription

  getBaseFontSize = ({ viewportWidth, viewportHeight }: State) => {
    let ratio = viewportWidth / viewportHeight
    let fontSize = ratio > 1.333 ? viewportHeight * .0165 : viewportWidth * .0105
    let { dispatch } = this.props
    if (dispatch) {
      dispatch({ type: 'dashboard2/set/font-size', payload: fontSize })
    }
    return fontSize
  }

  componentDidMount() {
    this.refreshToken()
    this.isStandalone = isStandalone()
    this.html = document.querySelector('html')
    let viewport = getViewport()
    let fontSize = this.getBaseFontSize(viewport)
    this.setState(viewport)
    if (this.isStandalone) {
      this.html!.setAttribute('style', `font-size:${fontSize}px;overflow:hidden;`)
      window.addEventListener('resize', this.reloadOnResize)
    }
  }

  refreshToken() {
    const interval = ONE_HOUR
    this.tokenRefreshSubscription = Auth.connect() // make observable hot
    Auth$.next({ due: 0, interval })
  }

  componentWillUnmount() {
    this.html!.removeAttribute('style')
    window.removeEventListener('resize', this.reloadOnResize)
    if (this.tokenRefreshSubscription) {
      this.tokenRefreshSubscription.unsubscribe()
    }
  }

}

function getViewport(): State {

  return {
    viewportWidth: window.innerWidth,
    viewportHeight: window.innerHeight,
  }
}

function getHospital(): string {
  let profile = AuthConfig.get('hc-apm-profile')
  return profile && profile.tenant
}

function isStandalone(): boolean {
  // try {
  //   let dashboard = document.querySelector('.dashboard')

  //   // if in an iframe, no
  //   if (window.self !== window.top) {
  //     return false
  //   }

  //   if (dashboard === null) { // not yet mounted
  //     let container = document.querySelector('#app')
  //     return container!.parentElement!.tagName === 'BODY' &&
  //            container!.childElementCount === 0
  //   } else {
  //     return dashboard!.parentElement!.id === 'app' &&
  //            dashboard!.parentElement!.parentElement!.tagName === 'BODY'
  //   }
  // } catch (error) {
  //   return false
  // }
  return true
}

function isAnimationDisabled(): boolean {

  const query = 'animation=true'
  let { search, hash } = window.location
  if (search.indexOf(query) > -1 || hash.indexOf(query) > -1) {
    return false
  } else {
    return !ifv.now()
  }

}

export { getHospital, isStandalone, isAnimationDisabled }