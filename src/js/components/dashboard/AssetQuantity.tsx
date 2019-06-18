import * as React from 'react'
import { translate } from 'react-i18next'
import { AssetInfo, AssetInfo$, TimeConfig$, Refresh$, config as _ } from 'observables/index'
import config from 'utils/config'
import subscribe from 'hoc/RxSubscribe'
import './AssetQuantity.scss'

interface State { assets: number, types: number, departments: number }

export class AssetQuantity extends React.PureComponent<any, State> {
  static key = 'asset-quantity'

  state = {
    assets: 0,
    types: 0,
    departments: 0,
  }

  onAssetInfo = ({ assetNum, assetTypeNum, assetDeptNum }) => {
    this.setState({
      assets: assetNum,
      types: assetTypeNum,
      departments: assetDeptNum,
    })
  }

  refresh() {
    let conf = config.get(AssetQuantity.key)
    AssetInfo$.next(_(conf.interval))
  }

  componentDidMount() {
    this.refresh()
    Refresh$.subscribe(key => {
      if (key === AssetQuantity.key) {
        this.refresh()
      }
    })
  }

  config() {
    TimeConfig$.next(AssetQuantity.key)
  }

  render() {
    let { t } = this.props
    let { assets, types, departments } = this.state
    return (
      <nav className="asset-quantity level">
        <div className="level-item">
          <span className="chart-title config" onClick={this.config}>{t`total_assets`}</span>
          <span className="major-number">{assets || 0}</span>
        </div>
        <div className="level-item has-text-centered">
          <span className="chart-title config" onClick={this.config}>{t`total_types`}</span>
          <span className="major-number">{types || 0}</span>
        </div>
        <div className="level-item has-text-centered">
          <span className="chart-title config" onClick={this.config}>{t`total_depts`}</span>
          <span className="major-number">{departments || 0}</span>
        </div>
      </nav>
    )
  }
}
export default translate(['common', 'dashboard'])(subscribe({ AssetInfo })(AssetQuantity))