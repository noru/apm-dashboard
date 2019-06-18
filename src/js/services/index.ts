import data, { Data } from './data'
import auth, { Auth } from './auth'
import networkhealth, { NetworkHealth } from './networkhealth'
import report, { ReportService } from './report'
import dashboard2, { DashboardInterface } from './dashboard2'
import { load } from './mocks/helper'
import './interceptors'

if (__USE_MOCK__) {
  load('./auth')
  load('./data')
  load('./network')
  load('./report')
  load('./dashboard2')
}

interface Services {
  data: Data,
  auth: Auth,
  networkhealth: NetworkHealth,
  report: ReportService,
  dashboard2: DashboardInterface,
}
const service: Services = {
  data,
  auth,
  networkhealth,
  report,
  dashboard2,
}

export default service
