import { URLs } from 'services/report'
import {
  ProfitByDept, ProfitByType, ProfitByMonth, ProfitMonth, ProfitDept, ProfitType,
 } from 'services/mocks/data/assetPerf'

export default function(mock) {
  mock.onGet(URLs.AssetPerf_Profit).reply(({ params }) => {
    let { start, limit, groupby, month, type, dept } = params
    if (month) {
      return [200, simulatePaging(ProfitMonth, start, limit)]
    }
    if (type) {
      return [200, simulatePaging(ProfitType, start, limit)]
    }
    if (dept) {
      return [200, simulatePaging(ProfitDept, start, limit)]
    }
    if (groupby === 'dept') {
      return [200, simulatePaging(ProfitByDept, start, limit)]
    }
    if (groupby === 'type') {
      return [200, simulatePaging(ProfitByType, start, limit)]
    }
    return [200, simulatePaging(ProfitByMonth, start, limit)]
  })
}

function simulatePaging(profit: any, start: number, limit: number) {

  let items = profit.items.slice(start, start + limit)
  return {
    ...profit,
    pages: {
      total: profit.pages.total,
      start,
      limit: Math.max(items.length, limit),
    },
    items,
  }
}