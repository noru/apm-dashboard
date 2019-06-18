import axios from 'axios'
import * as config from 'config'

const PREFIX = config.apiPrefix
export const URLs = {
  AssetPerf_Profit: '/hcapmreportservice/api/apm/report/profit',
}
Object.keys(URLs).forEach(key => URLs[key] = PREFIX + URLs[key])

export interface ReportService {
  profit(params: any): Promise<any>
}

const report: ReportService = {

  profit: (params: any) => {
    return axios.get(URLs.AssetPerf_Profit, { params })
      .then(resp => resp.data)
  },
}

export default report