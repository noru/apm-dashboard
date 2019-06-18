import React from 'react'
import { Modal } from 'antd'
import { translate } from 'react-i18next'
import DnDArea from '../DnD/DnDArea'
import './index.scss'
import { deepMap } from 'noru-utils/lib/array'

export class LayoutConfig extends React.PureComponent<any, any> {

  private _config = {
    layout: [],
    flyby: '',
  }

  render() {

    let { show, flyby, layout, t, onOk, onCancel } = this.props

    return (
      <Modal
        className="layout-config-modal"
        closable={false}
        visible={show}
        onOk={() => onOk(this._config)}
        onCancel={onCancel}
        okText={t`save`}
        cancelText={t`cancel`}
        width="65%"
      >
        <div className="config-modal-content">
          <DnDArea
            flyby={flyby}
            layout={deepMap(layout, key => ({ key, title: t(key)}))}
            onLayoutChange={newLayout => this._config.layout = newLayout}
            onFlybyChange={newFlyby => this._config.flyby = newFlyby}
          />
        </div>

      </Modal>
    )
  }
}

export default translate(['common', 'dashboard2'])(LayoutConfig)
