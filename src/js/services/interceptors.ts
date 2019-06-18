import axios from 'axios'
import { AuthConfig } from 'utils/config'
import { OutgoingRequest$, CompleteRequest$ } from 'observables/utils'
import { LS_KEY } from 'utils/constants'
import qs from 'qs'

function AuthTokenInjector(config) {
  config.headers['Authorization'] = AuthConfig.get('hc-apm-token')
  return config
}

function ParamsSerializer(config) {
  config.paramsSerializer = params => qs.stringify(params, { arrayFormat: 'repeat' })
  return config
}

function OrgParamInjector(config) {
  config.params = Object.assign({}, config.params, { org: AuthConfig.get(LS_KEY.Orgs) || undefined })
  return config
}

// todo: replace with transformResponse
// todo: code smell 1, side effect
function BodyTransform(res) {
  if (res && res.data && res.data.data) {
    return res.data.data
  } else {
    return res
  }
}

function RequestRegister(config) {
  let req = {
    key: config.__key = Date.now(),
    config,
  }
  OutgoingRequest$.next(req)
  return config
}

const RequestDeRegister = {
  resolve(response) {
    let { config } = response
    if (config) { // todo: damn BodyTransform interceptor
      CompleteRequest$.next({ key: config.__key, config })
    }
    return response
  },
  reject(err) {
    let { config } = err
    if (config) {
      CompleteRequest$.next({ key: config.__key, config })
    }
    return Promise.reject(err)
  },
}

const RequestInterceptors = [
  ParamsSerializer,
  AuthTokenInjector,
  RequestRegister,
  OrgParamInjector,
]
const ResponseInterceptors = [
  BodyTransform,
  RequestDeRegister,
]

RequestInterceptors.forEach(i => _use(i, axios.interceptors.request))
ResponseInterceptors.forEach(i => _use(i, axios.interceptors.response))

function _use(interceptor: any, port: any) {

  if (typeof interceptor === 'function') {
    port.use(interceptor)
  } else {
    port.use(interceptor.resolve, interceptor.reject)
  }

}