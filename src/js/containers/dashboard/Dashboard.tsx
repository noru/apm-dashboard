import * as React from 'react'
import { translate } from 'react-i18next'
import DashboardBase, { getHospital, isStandalone } from 'containers/common/DashboardBase'
import './Dashboard.scss'
import AssetQuantity from 'components/dashboard/AssetQuantity'
import CrutialAssets from 'components/dashboard/CrutialAssets'
import PersonnelPerformance from 'components/dashboard/PersonnelPerformance'
import MaintenanceStatus from 'components/dashboard/MaintenanceStatus'
import MaintenancePlan from 'components/dashboard/MaintenancePlan'
import TimeConfigModal from 'components/dashboard/TimeConfigModal'
import Header from './Header'

export class Dashboard extends DashboardBase {

  render() {
    let { history } = this.props
    let { viewportHeight } = this.state
    let fixedHeight = viewportHeight * .9
    let columnHeight = fixedHeight * .985

    return (
      <div className="dashboard dashboard1" style={this.getDashboardStyle()}>

        <Header hospitalName={getHospital()} history={history}
          style={{ visibility: isStandalone() || 'hidden' }}
        />

        <AssetQuantity />
        <div className="app-chart-container columns">
          <div className="column is-3 left-side-col" style={{ height: columnHeight }} >
            <CrutialAssets />
          </div>
          <div className="column is-7 middle-col" style={{ height: columnHeight }}>
            <div className="maintenance-chart-container">
              <MaintenanceStatus />
              <MaintenancePlan />
            </div>
          </div>
          <div className="column is-2 right-side-col" style={{ height: columnHeight }}>
            <PersonnelPerformance />
          </div>
        </div>

        <TimeConfigModal />

      </div>
    )
  }

  private getDashboardStyle: () => any = () => {
    let { viewportHeight } = this.state
    return {
      height: viewportHeight,
      fontSize: this.isStandalone ? undefined : (viewportHeight * .0165 + 'px'),
      overflow: this.isStandalone ? undefined : 'hidden',
    }
  }
}

export default translate(['common', 'dashboard'])(Dashboard)
