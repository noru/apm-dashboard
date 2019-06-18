import * as React from 'react'
import services from 'services/index'
import { translate } from 'react-i18next'
import { withRouter } from 'react-router'
import classname from 'classname'
import { parseQuery } from 'noru-utils/lib'
import './index.scss'

class Login extends React.PureComponent<any, any> {

  state = {
    message: '',
    loading: false,
  }

  username: HTMLInputElement
  password: HTMLInputElement

  bindEnter = (e) => {
    if (e.keyCode === 13) {
      this.login()
    }
  }

  login = () => {
    let username = this.username.value.trim()
    let password = this.password.value.trim()
    let { t } = this.props
    if (username && password) {
      this.setState({ message: '', loading: true })
      services.auth.login(username, password)
        .then(this.redirect)
        .catch(res => {
            let msg = 'msg.err.invalid_login_info'
            if (res.response.status >= 500) {
              msg = 'msg.err.internal_server_error'
            }
            this.setState({ message: t(msg), loading: false })
          },
        )
    } else {
      this.setState({ message: t`msg.err.enter_id_and_password` })
    }
  }

  redirect = () => {
    let { location: { state }, history } = this.props
    let from = (state && state.from) || parseQuery(history.location.search).redirect
    history.push(from || '/')
  }

  componentDidMount() {
    this.username.focus()
  }

  render() {
    const { t } = this.props
    let { message, loading } = this.state
    return (
      <div className="login-page">
        <div className="login-form column is-one-third">
          <h4 className="subtitle is-4">{t`login_title`}</h4>
          <div>
            <div className="field">
              <p className="control">
                <input className="input is-medium" type="text"
                  placeholder={t`login_name`}
                  onKeyDown={this.bindEnter}
                  ref={input => { this.username = input as HTMLInputElement }}
                />
              </p>
            </div>
            <div className="field">
              <p className="control">
                <input className="input is-medium" type="password"
                  placeholder={t`login_password`}
                  onKeyDown={this.bindEnter}
                  ref={input => { this.password = input as HTMLInputElement }}
                />
              </p>
              { message &&
                <p className="message help is-danger">{message}</p>
              }
            </div>
          </div>
          <div className="field">
            <p className="control">
              <button
                className={classname('button is-primary is-medium', loading ? 'is-loading' : '')}
                onClick={this.login}>
                {t`login`}
              </button>
            </p>
          </div>
        </div>
      </div>
    )
  }
}

export default translate()(withRouter(Login))
