import * as cache from 'lscache'
import { DB2_COMP_KEY as COMP_KEY } from './constants'

const HALF_HOUR = 30 * 60 * 1000
const ONE_MIN = 1 * 60 * 1000
const TEN_SEC = 10 * 1000
const FIVE_SEC = 5 * 1000

export const DEFAULT = {
  ['asset-quantity']: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },
  ['asset-index']: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: TEN_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
  },
  ['maintenance-status']: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: TEN_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
  },
  ['maintenance-plan']: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },
  ['personnel-performance']: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: FIVE_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
  },

  ['dashboard2-layout']: [
    [COMP_KEY.AssetsOverview, COMP_KEY.RepairStatistics, COMP_KEY.OpenRate, COMP_KEY.LifeSupportAssets],
    [COMP_KEY.WorkOrders, COMP_KEY.PMIOrders],
    [COMP_KEY.EventOverview, COMP_KEY.PMIStatistics, COMP_KEY.DeptTop5, COMP_KEY.PersonnelPerformance],
  ],

  ['dashboard2-backup']: [
    COMP_KEY.AssetTop5,
    COMP_KEY.MalfunctionType,
  ],

  ['dashboard2-flyby']: '',

  [COMP_KEY.AssetsOverview]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },

  [COMP_KEY.RepairStatistics]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    groupBy: {
      value: 'm',
      type: 'enum',
      enum: ['m', 'q'],
    },
  },

  [COMP_KEY.OpenRate]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },

  [COMP_KEY.LifeSupportAssets]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },

  [COMP_KEY.WorkOrders]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: TEN_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
    showWarning: { type: 'number', value: 3 },
    showAlert: { type: 'number', value: 6 },
  },

  [COMP_KEY.PMIOrders]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: TEN_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
    pastNDays: { type: 'number', value: 30 },
    untilNDays: { type: 'number', value: 0 },
  },

  [COMP_KEY.EventOverview]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
  },

  [COMP_KEY.PMIStatistics]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
  },

  [COMP_KEY.DeptTop5]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },

  [COMP_KEY.AssetTop5]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
  },

  [COMP_KEY.PersonnelPerformance]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    intervalPerPage: TEN_SEC,
    rangeIntervalPerPage: [FIVE_SEC, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
  },

  [COMP_KEY.MalfunctionType]: {
    interval: HALF_HOUR,
    rangeInterval: [ONE_MIN, Infinity],
    month: { type: 'enum', value: 1, enum: [1, 3, 6, 12]},
  },

}

export interface Config {
  interval: number,
  rangeInterval?: number[],
  intervalPerPage?: number,
  rangeIntervalPerPage?: number[],
  [others: string]: ConfigItem | any,
}

export interface ConfigItem {
  type: 'enum' | 'number' | 'text' | 'datetime',
  value: any,
  enum?: any[],
  [others: string]: any,
}

type Result = Config & any

function config(interval, intervalPerPage?): Result {
  return { interval, intervalPerPage }
}

function resetBucket(type: string = 'config') {
  cache.setBucket(type)
}

export default {

  $conf: config,

  get(key: string): Result {
    resetBucket()
    return cache.get(key) || DEFAULT[key]
  },

  set(key: string, conf: Config | any) {
    resetBucket()
    cache.set(key, conf)
  },

  clear() {
    resetBucket()
    cache.flush()
  },

}

export const AuthConfig = {

  get(key: string): any {
    resetBucket('auth')
    return cache.get(key)
  },

  set(key: string, conf: any, expire?: number) {
    resetBucket('auth')
    cache.set(key, conf, expire)
  },

  clear() {
    resetBucket('auth')
    cache.flush()
  },
}