import * as React from 'react'
import { translate } from 'react-i18next'
import { deepMap, isNullOrEmpty, merge } from 'noru-utils/lib'
import DashboardBase, { getHospital } from 'containers/common/DashboardBase'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'
import Header from './Header'
import Layout from 'containers/common/Layout'
import AssetsOverview from 'components/dashboard2/AssetsOverview'
import EventOverview from 'components/dashboard2/EventOverview'
import WorkOrders from 'components/dashboard2/WorkOrders'
import PMIOrders from 'components/dashboard2/PMIOrders'
import LifeSupportAssets from 'components/dashboard2/LifeSupportAssets'
import PMIStatistics from 'components/dashboard2/PMIStatistics'
import PersonnelPerformance from 'components/dashboard2/PersonnelPerformance'
import DeptTop5 from 'components/dashboard2/DeptTop5'
import AssetTop5 from 'components/dashboard2/AssetTop5'
import MalfunctionType from 'components/dashboard2/MalfunctionType'
import RepairStatistics from 'components/dashboard2/RepairStatistics'
import OpenRate from 'components/dashboard2/OpenRate'
import LayoutConfig from 'components/dashboard2/LayoutConfig'
import IntervalConfig from 'components/dashboard2/IntervalConfig'
import HierarchyConfig from 'components/dashboard2/HierarchyConfig'
import config, { AuthConfig } from 'utils/config'
import { connect } from 'dva'
import { parseQuery, flow, attempt } from 'noru-utils/lib'
import { LS_KEY } from 'utils/constants'
import './Dashboard.scss'

export const COMPONENTS = {

  [COMP_KEY.AssetsOverview]       : AssetsOverview,
  [COMP_KEY.RepairStatistics]     : RepairStatistics,
  [COMP_KEY.OpenRate]             : OpenRate,
  [COMP_KEY.LifeSupportAssets]    : LifeSupportAssets,
  [COMP_KEY.WorkOrders]           : WorkOrders,
  [COMP_KEY.PMIOrders]            : PMIOrders,
  [COMP_KEY.EventOverview]        : EventOverview,
  [COMP_KEY.PMIStatistics]        : PMIStatistics,
  [COMP_KEY.DeptTop5]             : DeptTop5,
  [COMP_KEY.AssetTop5]            : AssetTop5,
  [COMP_KEY.PersonnelPerformance] : PersonnelPerformance,
  [COMP_KEY.MalfunctionType]      : MalfunctionType,

}

interface State {
  showLayoutConfig: boolean,
  showIntervalConfig: boolean,
  showHierarchyConfig: boolean,
}
export class Dashboard extends DashboardBase<any, State> {

  state: State & any = {
    showLayoutConfig: false,
    showIntervalConfig: false,
    showHierarchyConfig: false,
  }

  reload() {
    window.location.reload()
  }
  onLayoutOk = ({ layout, flyby }) => {
    let newLayout = deepMap(layout, comp => comp.key)
    let active = newLayout.slice(0, 3)
    let backup = newLayout[3]
    !isNullOrEmpty(active) && config.set('dashboard2-layout', active)
    !isNullOrEmpty(backup) && config.set('dashboard2-backup', backup)
    config.set('dashboard2-flyby', flyby || '')
    this.reload()
  }

  onIntervalOk = (key, values, isTouched) => {
    if (!isTouched) {
      this.onCancel()
      return
    }
    config.set(key, merge(config.get(key), values))
    this.reload()
  }

  onHierarchyOk = (orgs) => {
    AuthConfig.set(LS_KEY.Orgs, orgs)
    this.reload()
  }

  onCancel = () => {
    this.setState({
      showLayoutConfig: false,
      showIntervalConfig: false,
      showHierarchyConfig: false,
     })
  }

  render() {
    let { history, fullscreened } = this.props
    let { showLayoutConfig, showIntervalConfig, showHierarchyConfig, viewportHeight } = this.state
    let fixedHeight = (viewportHeight || 0) * .88
    let layout = fullscreened ? [[fullscreened]] : config.get('dashboard2-layout')
    let backupCards = config.get('dashboard2-backup')
    let flyby = config.get('dashboard2-flyby')
    let componentLayout = deepMap(layout, key => {
      let Comp = COMPONENTS[key]
      if (!Comp) return `Unknown component key: ${key}, stale localStorage?`
      return <Comp />
    })

    return (
      <div className="dashboard dashboard2" style={this.getDashboardStyle()}>

        <Header
          flyby={flyby}
          hospitalName={getHospital()} history={history}
          style={{ visibility: this.isStandalone || 'hidden' }}
          onHierachyConfig={() => this.setState({showHierarchyConfig: true})}
          onLayoutConfig={() => this.setState({showLayoutConfig: true})}
          onIntervalConfig={() => this.setState({showIntervalConfig: true})}
        />

        <Layout style={{height: fixedHeight}} config={componentLayout} />

        <LayoutConfig
          show={showLayoutConfig}
          flyby={flyby}
          layout={[...layout, backupCards]}
          onOk={this.onLayoutOk} onCancel={this.onCancel}
        />

        <IntervalConfig
          show={showIntervalConfig}
          onOk={this.onIntervalOk} onCancel={this.onCancel}
        />

        <HierarchyConfig
          show={showHierarchyConfig}
          onOk={this.onHierarchyOk}
          onCancel={this.onCancel}
        />

      </div>
    )
  }

  private getDashboardStyle: () => any = () => {
    let { viewportHeight } = this.state
    let { bg } = attempt(() => parseQuery(this.props.location.search), {})
    let url
    try {
      bg && (url = require(`assets/img/bg${bg}.png`))
    } catch (error) {
      console.error('background image does not exist: ' + bg)
    }
    return {
      height: viewportHeight,
      fontSize: this.isStandalone ? undefined : (viewportHeight * .0165 + 'px'),
      overflow: this.isStandalone ? undefined : 'hidden',
      backgroundImage: bg && url ? `url(${url}` : undefined,
    }
  }
}

function mapState2Props({dashboard2}) {
  return {
    fullscreened: dashboard2.get('fullscreened'),
  }
}

export default flow(
  Dashboard,
  translate(['common', 'dashboard2']),
  connect(mapState2Props),
)
