import services from 'services/index'
import { Map } from 'immutable'
import { LS_KEY } from 'utils/constants'

const API = services.dashboard2

export default {

  namespace: 'dashboard2',
  state: Map({
    fullscreened: localStorage.getItem(LS_KEY.FullscreenedWidget),
    orgTree         : [],
    BaseFontSize    : 14,
    AssetOverview   : {},
    DeptTop5        : [],
    AssetTop5       : [],
    LifeSupportUsage: [],
    MaintenanceStats: {},
    PMIOrders       : {},
    PMIStats        : {},
    EventOverview   : {},
    StaffPerf       : [],
    WorkOrders      : [],
    MalfuncType     : [],
    OpenRate        : [],
  }),

  effects: {
    *'get/org-tree'({}, { put, call }) {
      const { data } = yield call(API.OrgTree)
      yield put({
        type: 'set/org-tree',
        payload: [ data ] || [],
      })
    },
    *'get/asset-overview'({}, { put, call }) {
      const { data } = yield call(API.AssetOverview)
      yield put({
        type: 'set/asset-overview',
        payload: data || {},
      })
    },
    *'get/dept-top5'({}, { put, call }) {
      const { data } = yield call(API.DeptTop5)
      yield put({
        type: 'set/dept-top5',
        payload: data,
      })
    },
    *'get/asset-top5'({}, { put, call }) {
      const { data } = yield call(API.AssetTop5)
      yield put({
        type: 'set/asset-top5',
        payload: data,
      })
    },
    *'get/life-support-usage'({}, { put, call }) {
      const { data } = yield call(API.LifeSupportUsage)
      yield put({
        type: 'set/life-support-usage',
        payload: data,
      })
    },
    *'get/maintenance-stats'({ payload: { groupBy }}, { put, call }) {
      const { data } = yield call(API.MaintenanceStats, groupBy)
      yield put({
        type: 'set/maintenance-stats',
        payload: data,
      })
    },
    *'get/malfunction-type'({ payload: { from, to }}, { put, call }) {
      const { data } = yield call(API.MalfunctionType, from, to)
      yield put({
        type: 'set/malfunction-type',
        payload: data,
      })
    },
    *'get/event-overview'({ payload: { from, to } }, { put, call }) {
      const { data } = yield call(API.EventOverview, from, to)
      yield put({
        type: 'set/event-overview',
        payload: data,
      })
    },
    *'get/work-orders'({ payload: { from, to } }, { put, call }) {
      const { data } = yield call(API.WorkOrders, from, to)
      yield put({
        type: 'set/work-orders',
        payload: data,
      })
    },
    *'get/pmi-orders'({ payload: { from, to } }, { put, call }) {
      const { data } = yield call(API.PMIOrders, from, to)
      yield put({
        type: 'set/pmi-orders',
        payload: data,
      })
    },
    *'get/pmi-stats'({ payload: { from, to } }, { put, call }) {
      const { data } = yield call(API.PMIStats, from, to)
      yield put({
        type: 'set/pmi-stats',
        payload: data,
      })
    },
    *'get/open-rate'({}, { put, call }) {
      const { data } = yield call(API.OpenRate)
      yield put({
        type: 'set/open-rate',
        payload: data.reverse(),
      })
    },
    *'get/staff-perf'({ payload: { from, to } }, { put, call }) {
      const { data } = yield call(API.StaffPerf, from, to)
      yield put({
        type: 'set/staff-perf',
        payload: data.map(staff => {
          staff.responseTime = (staff.responseTime / 60).toFixed(1)
          if (staff.clinicalDeptPerformance) {
            let avgResponseTime = staff.clinicalDeptPerformance.avgResponseTime
            staff.clinicalDeptPerformance.avgResponseTime = (avgResponseTime / 60).toFixed(1)
          }
          return staff
        }),
      })
    },
  },

  reducers: {
    'set/org-tree'(state, { payload }) {
      return state.set('orgTree', payload)
    },
    'set/fullscreened'(state, { payload }) {
      if (!!payload) {
        localStorage.setItem(LS_KEY.FullscreenedWidget, payload)
      } else {
        localStorage.removeItem(LS_KEY.FullscreenedWidget)
      }
      return state.set('fullscreened', payload)
    },
    'set/font-size'(state, { payload }) {
      return state.set('BaseFontSize', payload)
    },
    'set/asset-overview'(state, { payload }) {
      return state.set('AssetOverview', payload)
    },
    'set/dept-top5'(state, { payload }) {
      return state.set('DeptTop5', payload)
    },
    'set/asset-top5'(state, { payload }) {
      return state.set('AssetTop5', payload)
    },
    'set/life-support-usage'(state, { payload }) {
      return state.set('LifeSupportUsage', payload)
    },
    'set/maintenance-stats'(state, { payload }) {
      return state.set('MaintenanceStats', payload)
    },
    'set/malfunction-type'(state, { payload }) {
      return state.set('MalfuncType', payload)
    },
    'set/event-overview'(state, { payload }) {
      return state.set('EventOverview', payload)
    },
    'set/work-orders'(state, { payload }) {
      return state.set('WorkOrders', payload)
    },
    'set/pmi-orders'(state, { payload }) {
      return state.set('PMIOrders', payload)
    },
    'set/pmi-stats'(state, { payload }) {
      return state.set('PMIStats', payload)
    },
    'set/staff-perf'(state, { payload }) {
      return state.set('StaffPerf', payload)
    },
    'set/open-rate'(state, { payload }) {
      return state.set('OpenRate', payload)
    },
  },

}