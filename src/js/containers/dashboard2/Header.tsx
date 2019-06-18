import * as React from 'react'
import { translate } from 'react-i18next'
import config, { AuthConfig } from 'utils/config'
import FA from 'react-fontawesome'
import { Menu, Dropdown, Popover } from 'antd'
import CountDown from 'components/common/CountDown'
import Flyby from 'ellipsus/dist/components/Flyby'
import * as logo from '../../../assets/img/ge_logo.png'
import { requestFullscreen, isFullscreen, exitFullscreen, isMobile } from 'noru-utils/lib'
import './Header.scss'
import moment from 'moment'
moment.locale('zh-CN')

const NO_POPOVER = 'hc-apm-never-no-popover'

interface Props {
  hospitalName: string,
  flyby: string,
  history: any,
  location: any,
  style: any,
  onLayoutConfig: () => any,
  onIntervalConfig: () => any,
  onHierachyConfig: () => any,
  t: any,
}

export class Header extends React.PureComponent<Props, any> {

  _intervalId: NodeJS.Timer

  state = {
    dateTime: moment(),
    popOverCountDown: config.get(NO_POPOVER) ? 0 : 10,
  }

  _popover = (
    <span className="popover-actions is-flex">
      <a onClick={() => this.closePopover(true)}>{this.props.t`never_show_again`}</a>
      <a onClick={() => this.closePopover()}>
        {this.props.t`close`}({<CountDown from={this.state.popOverCountDown} onFinish={() => this.closePopover()}/>})
      </a>
    </span>
  )

  logout = () => {
    let { t, history } = this.props
    if (confirm(t`logout_confirm_message`)) {
      AuthConfig.clear()
      history.push('/login?redirect=/dashboard2')
    }
  }

  toggleFullscreen = (isFullScreen: boolean) => {
    // exitFullscreen won't work on Android chrome, use reload instead
    if (isFullScreen) {
      isMobile.Android() ? window.location.reload() : exitFullscreen()
    } else {
      requestFullscreen()
    }
  }

  switchBackground = () => {
    let { history } = this.props
    if (history.location.search.includes('bg=1')) {
      history.push('/dashboard2')
    } else {
      history.push('/dashboard2?bg=1')
    }
  }

  closePopover(forever = false) {
    this.setState({ popOverCountDown: 0 })
    forever && config.set(NO_POPOVER, true)
  }

  componentDidMount() {
    // clock
    this._intervalId = setInterval(() => {
      this.setState({ dateTime: moment() })
    }, 60 * 1000)

  }

  componentWillUnmount() {
    clearInterval(this._intervalId)
  }

  render() {

    let { style, t, hospitalName, flyby, onHierachyConfig, onLayoutConfig, onIntervalConfig } = this.props
    let { dateTime, popOverCountDown } = this.state
    let _isFullscreen = isFullscreen()

    return (
      <nav className="dashboard-header level" style={style}>

        <div className="level-left">
          <div className="level-item">
            <figure className="image is-24x24">
              <img src={logo} />
            </figure>
          </div>
          <div className="app-title level-item">{t`app_title`}</div>
        </div>

        <div className="level-item centered">
          <div className="hospital-name-bg"></div>
          <div className="hospital-name">
            <p>{hospitalName || ' - '}</p>
            <div className="flyby-area">
              <Flyby duration={9000}>{flyby}</Flyby>
            </div>
          </div>
        </div>

        <div className="level-right">
          <Popover
            visible={popOverCountDown > 0}
            placement="leftTop"
            title={<div style={{textAlign: 'center', padding: '1em'}}>{t`here_is_config`}</div>}
            content={this._popover}
          >
            <Dropdown overlay={
              <Menu className="header-menu" theme="dark">
                <Menu.Item>
                  <a onClick={onHierachyConfig}>
                    <FA name="sitemap" />
                    {t`hierarchy_config`}
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={onLayoutConfig}>
                    <FA name="cog" />
                    {t`layout_config`}
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={onIntervalConfig}>
                    <FA name="clock-o" />
                    {t`interval_config`}
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this.toggleFullscreen(_isFullscreen)} >
                    <FA name={_isFullscreen ? 'compress' : 'expand'} />
                    {_isFullscreen ? t`exit_fullscreen` : t`enter_fullscreen`}
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={() => this.switchBackground()} >
                    <FA name="picture-o" />
                    {t`change_background_image`}
                  </a>
                </Menu.Item>
                <Menu.Item>
                  <a onClick={this.logout}>
                    <FA name="sign-out" />
                    {t`logout`}
                  </a>
                </Menu.Item>
              </Menu>
            }>
              <a>
                <p>{dateTime.format('LL')}</p>
                <p>{dateTime.format('dddd')} {dateTime.format('LT')}</p>
              </a>
            </Dropdown>
          </Popover>
        </div>

      </nav>
    )
  }
}

export default translate(['common', 'dashboard2'])(Header)