import axios, { AxiosPromise } from 'axios'
import * as config from 'config'
import moment from 'moment'

const PREFIX = config.apiPrefix + '/hcapmassetservice/api/apm/asset/largeScreens/'
export const URLs = {
  assetIndex: 'lsAssetIndex',                   // 返回重要设备运营指标和质量指标
  assetInfo: 'lsAssetInfo',                     // 返回设备、类型和科室总数
  assetNum: 'lsAssetNum',                       // 返回设备维修状态，正常数量/在修数量
  assetRepairStatus: 'lsAssetRepairStatus',     // 返回设备维修状态列表
  insPm: 'lsInsPm',                             // 返回养计检计划
  insPmList: 'lsInsPmList',                     // 返回养计检计划列表
  lifeSupportAsset: 'lsLifeSupportAsset',       // 返回生命支持类设备完好率
  userPerformance: 'lsUserPerformance',         // 返回人员绩效, fromTime：开始日期，toTime: 结束日期, 格式如：2017-04-12
}
Object.keys(URLs).forEach(key => URLs[key] = PREFIX + URLs[key])

export interface Data {
  assetIndex(page: number, pageSize: number, month: number): AxiosPromise
  assetInfo(): AxiosPromise
  assetNum(): AxiosPromise
  assetRepairStatus(page: number, pageSize: number): AxiosPromise
  insPm(fromTime: string, toTime: string): AxiosPromise
  insPmList(fromTime: string, toTime: string): AxiosPromise
  lifeSupportAsset(): AxiosPromise
  userPerformance(fromTime: string, toTime: string): AxiosPromise
}

export interface AssetIndex {
  assetName: string,
  openRate: number,
  patientNum: number,
  useRate: number
}

export interface AssetInfo {
  assetDeptNum: number,
  assetNum: number,
  assetTypeNum: number
}

export interface AssetNum {
  assetOff: number,
  assetOn: number
}

export interface AssetRepairStatus {
  assetName: string,
  currentPerson: string,
  dealTime: string,
  openTime: string,
  stepId: number,
  stepName: string
}

export interface InsPm {
  date?: string,
  ins: number,
  metering: number,
  pm: number,
  quality: number
}

export interface InsPmList {
  date: string,
  ins: number,
  metering: number,
  pm: number,
  quality: number
}

export interface LifeSupportAsset {
  defibrillator: number,
  infusion: number,
  monitor: number,
  respirator: number,
  syringe: number
}

export interface UserPerformance {
  closedNum: number,
  openNum: number,
  userId: number,
  userName: string,
  workNum: number
}

const data: Data = {
  assetIndex(page = 0, pageSize = 10, month = 1) {
    let startDate = moment().subtract(month, 'months').format('YYYY-MM-DD')
    let endDate = moment().format('YYYY-MM-DD')
    return axios.get(URLs.assetIndex, { params: { page, pageSize, startDate, endDate } })
  },
  assetInfo() {
    return axios.get(URLs.assetInfo)
  },
  assetNum() {
    return axios.get(URLs.assetNum)
  },
  assetRepairStatus(page = 0, pageSize = 10) {
    return axios.get(URLs.assetRepairStatus, { params: { page, pageSize } })
  },
  insPm(fromTime, toTime) {
    return axios.get(URLs.insPm, { params: { fromTime, toTime } })
  },
  insPmList(fromTime, toTime) {
    return axios.get(URLs.insPmList, { params: { fromTime, toTime } })
  },
  lifeSupportAsset() {
    return axios.get(URLs.lifeSupportAsset)
  },
  userPerformance(fromTime, toTime) {
    return axios.get(URLs.userPerformance, { params: { fromTime, toTime } })
  },
}

export default data
