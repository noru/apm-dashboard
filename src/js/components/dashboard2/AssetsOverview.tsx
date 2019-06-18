import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply } from 'noru-utils/lib'
import periodic from 'hoc/periodic'
import Background from 'containers/dashboard2/Background'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import './AssetsOverview.scss'

export class AssetsOverview extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    dispatch({ type: 'dashboard2/get/asset-overview'})
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.AssetsOverview ? undefined : COMP_KEY.AssetsOverview
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, data, fullscreened } = this.props

    let { overall, largeScreen } = data
    overall = overall || {}
    largeScreen = largeScreen || {}
    let unit = t`asset_unit`
    return (
      <Background className="asset-quantity-2" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`assets_overview`}</h1>
        <h2>{t`all_assets`}</h2>
        <div className="columns">
          <div className="column">
            <h3>{t`assets_total_count`}</h3>
            <p className="count"><span>{overall.total}</span><span>{unit}</span></p>
          </div>
          <div className="column">
            <h3>{t`available_assets_count`}</h3>
            <p className="count"><span>{overall.available}</span><span>{unit}</span></p>
          </div>
          <div className="column">
            <h3>{t`halt_assets_count`}</h3>
            <p className="count"><span>{overall.down}</span><span>{unit}</span></p>
          </div>
        </div>
        <h2>{t`dafang_assets`}</h2>
        <div className="columns">
          <div className="column">
            <h3>{t`assets_total_count`}</h3>
            <p className="count"><span>{largeScreen.total}</span><span>{unit}</span></p>
          </div>
          <div className="column">
            <h3>{t`available_assets_count`}</h3>
            <p className="count"><span>{largeScreen.available}</span><span>{unit}</span></p>
          </div>
          <div className="column">
            <h3>{t`halt_assets_count`}</h3>
            <p className="count"><span>{largeScreen.down}</span><span>{unit}</span></p>
          </div>
        </div>
      </Background>
    )
  }
}

function mapState2Props({ dashboard2 }) {
  return {
    data: dashboard2.get('AssetOverview'),
    fullscreened: dashboard2.get('fullscreened'),
  }
}

const CONF = config.get(COMP_KEY.AssetsOverview)
export default apply(
  AssetsOverview,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  connect(mapState2Props),
)
