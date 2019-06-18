import React from 'react'
import { Modal, Dropdown, Menu } from 'antd'
import Form from './Form'
import FA from 'react-fontawesome'
import { translate } from 'react-i18next'
import { COMPONENTS } from 'containers/dashboard2/Dashboard'
import config from 'utils/config'
import './index.scss'

export class IntervalConfig extends React.PureComponent<any, any> {

  state = {
    component: undefined,
  }

  private _form

  onChooseComponent = ({ key }) => {
    this.setState({ component: key })
  }

  formRef = ref => this._form = ref

  onOk = () => {
    this._form.validateFields((err, values) => {
      if (err) return
      this._form.resetFields()
      values.interval = +values.interval * 60000
      values.intervalPerPage = +values.intervalPerPage * 1000
      this.props.onOk(this.state.component, values, this._form.isFieldsTouched)
    })
  }

  render() {

    let { show, t, onCancel } = this.props
    let { component } = this.state
    let componentConfig = config.get(component!) || {}

    const menu = (
      <Menu theme="dark" onClick={this.onChooseComponent}>
        {
          Object.keys(COMPONENTS).map(key => {
            return (
              <Menu.Item key={key}>
                <a>{t(key)}</a>
              </Menu.Item>
            )
          })
        }
      </Menu>
    )

    return (
      <Modal
        className="interval-config-modal"
        closable={false}
        visible={show}
        onOk={this.onOk}
        onCancel={onCancel}
        okText={t`save`}
        cancelText={t`cancel`}
        width="30%"
      >
        <div className="config-modal-content">
          <Dropdown overlay={menu}>
            <a className="ant-dropdown-link">
              <span>{component ? t(component) : t`choose_component`}</span>
              <FA name="caret-down" />
            </a>
          </Dropdown>

          {
            component &&
            <Form config={componentConfig} ref={this.formRef}/>
          }
        </div>
      </Modal>
    )
  }
}

export default translate(['common', 'dashboard2'])(IntervalConfig)
