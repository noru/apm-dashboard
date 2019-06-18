import axios from 'axios'
import * as config from 'config'

const PREFIX = config.apiPrefix + '/hcapmreportservice/api/apm/report/largeScreenBasic/'
export const URLs = {

  PMIOrders       : 'PMIOrders',
  PMIStats        : 'PMIStats',
  AssetOverview   : 'assetOverview',
  DeptTop5        : 'clinicalDeptTop5',
  AssetTop5       : 'assetGroupTop5',
  EventOverview   : 'eventOverview',
  LifeSupportUsage: 'lifeSupportDeviceUsage',
  MaintenanceStats: 'maintenanceStats',
  StaffPerf       : 'staffPerformance',
  WorkOrders      : 'workOrders',
  MalfuncType     : 'assetFaultStats',
  OpenRate        : 'keyDeviceUsage',
  Hierarchy       : 'orgTree',

}

for (const key in URLs) {
  if (URLs.hasOwnProperty(key)) {
    URLs[key] = PREFIX + URLs[key]
  }
}

export interface DashboardInterface {
  OrgTree         : () => Promise<any>,
  PMIOrders       : (from: any, to: any) => Promise<any>,
  PMIStats        : (from: any, to: any) => Promise<any>,
  AssetOverview   : () => Promise<any>,
  DeptTop5        : () => Promise<any>,
  AssetTop5       : () => Promise<any>,
  EventOverview   : (from: any, to: any) => Promise<any>,
  LifeSupportUsage: () => Promise<any>,
  MaintenanceStats: (groupBy: string) => Promise<any>,
  MalfunctionType : (from: any, to: any) => Promise<any>,
  OpenRate        : () => Promise<any>,
  StaffPerf       : (from: any, to: any) => Promise<any>,
  WorkOrders      : (from: any, to: any) => Promise<any>,
}

const Dashboard: DashboardInterface = {

  OrgTree() {
    return axios.get(URLs.Hierarchy)
  },

  PMIOrders(from, to) {
    return axios.get(URLs.PMIOrders, { params: { from, to } })
  },

  PMIStats(from, to) {
    return axios.get(URLs.PMIStats, { params: { from, to } })
  },

  AssetOverview() {
    return axios.get(URLs.AssetOverview)
  },

  DeptTop5() {
    return axios.get(URLs.DeptTop5)
  },

  AssetTop5() {
    return axios.get(URLs.AssetTop5)
  },

  EventOverview(from , to) {
    return axios.get(URLs.EventOverview, { params: { from, to } })
  },

  LifeSupportUsage() {
    return axios.get(URLs.LifeSupportUsage)
  },

  MaintenanceStats(groupBy) {
    return axios.get(URLs.MaintenanceStats, { params: { groupBy }})
  },

  OpenRate() {
    return axios.get(URLs.OpenRate)
  },

  StaffPerf(from , to) {
    return axios.get(URLs.StaffPerf, { params: { from, to } })
  },

  WorkOrders(from, to) {
    return axios.get(URLs.WorkOrders, { params: { from, to } })
  },

  MalfunctionType(from: any, to: any) {
    return axios.get(URLs.MalfuncType, { params: { from, to } })
  },

}

export default Dashboard