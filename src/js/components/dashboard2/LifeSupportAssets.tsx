import React from 'react'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import periodic from 'hoc/periodic'
import { apply, toPercentage } from 'noru-utils/lib'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import Background from 'containers/dashboard2/Background'
import PieChart from 'react-minimal-pie-chart'
import './LifeSupportAssets.scss'

export class LifeSupportAssets extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    dispatch({ type: 'dashboard2/get/life-support-usage' })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.LifeSupportAssets ? undefined : COMP_KEY.LifeSupportAssets
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, data, fullscreened } = this.props

    return (
      <Background className="life-support-assets" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t`life_support_assets_perfectness_ratio`}</h1>
        <div className="columns">
          {
            data.map((d, i) => <Ring key={i}
                                     name={d.assetGroup}
                                     total={d.total}
                                     available={d.available}
                                     unit={t`asset_unit`} />)
          }
        </div>
      </Background>
    )
  }
}
const CONF = config.get(COMP_KEY.LifeSupportAssets)
export default apply(
  LifeSupportAssets,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('LifeSupportUsage'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)

function Ring({ name, total, available, unit }) {
  // -- MONKEY PATCH START --
  // AS REQUESTED, life support assets must be always available, hard code it
  total = available
  // -- MONKEY PATCH END --
  return (
    <div className="chart column has-text-centered">
      <p>{toPercentage(available / total)}</p>
      <div className="donut-chart">
        <p className="count">{available}{unit}</p>
        <PieChart
          lineWidth={7}
          rounded
          totalValue={total}
          startAngle={-90}
          data={[
            { value: available, key: 1, color: '#00b0f0' },
            { value: total - available, key: 2, color: 'transparent' },
          ]}
        />
      </div>
      <p>{name}</p>
    </div>
  )
}