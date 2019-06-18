import * as React from 'react'
import { translate } from 'react-i18next'
import { AuthConfig } from 'utils/config'
import FA from 'react-fontawesome'
import NetworkStatus from 'components/dashboard/NetworkStatusWidget'
import { toggleFullscreen, isFullscreen } from 'noru-utils/lib/dom'
import './Header.scss'
import * as logo from '../../../assets/img/ge_logo.png'

interface Props {
  hospitalName: string,
  history: any,
  style: any,
  t: any,
}

export function Header({ hospitalName, history, style, t = i => i }: Props) {

  function logout() {
    if (confirm(t`logout_confirm_message`)) {
      AuthConfig.clear()
      history.push('/login')
    }
  }
  return (
    <nav className="app-header level" style={style}>
      <div className="level-left">
        <div className="level-item">
          <figure className="image is-24x24">
            <img src={logo} />
          </figure>
        </div>
        <div className="app-title level-item">{t`app_title`}</div>
      </div>
      <NetworkStatus />
      <div className="level-right">
        <a onClick={logout}>
          <p className="level-item hospital-name">{hospitalName || ' - '}</p>
        </a>
        <a className="toggle-fullscreen" onClick={toggleFullscreen}>
          <FA name={isFullscreen() ? 'compress' : 'expand'} />
        </a>
      </div>
    </nav>
  )
}

export default translate(['common', 'dashboard'])(Header)
