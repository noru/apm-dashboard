import axios from 'axios'
import * as config from 'config'
import { AuthConfig } from 'utils/config'

const PREFIX = config.apiPrefix
export const URLs = {
  login: '/api/apm/security/userAccounts/authenticateBasic',
  refresh: '/api/apm/security/userAccounts/refreshToken',
  tenant: '/hcapmmasterdataservice/api/apm/masterData/tenantInfos',
}
Object.keys(URLs).forEach(key => URLs[key] = PREFIX + URLs[key])

export interface User {
  loginName: string
  password: string
}

export interface Auth {
  login(user: string, password: string): Promise<boolean>
  refresh(): Promise<number>
}

const auth: Auth = {
  login(loginName: string, password: string) {
    return axios.post(URLs.login, { loginName, password })
      .then((data: any) => {
        let expire = data.jwtToken.expiredSeconds
        cacheToken(data.jwtToken.id_token, expire)
        let tenant = axios.get(URLs.tenant + '/' + data.userProfile.userAccount.siteId)
        return Promise.all([data, tenant, expire])
      })
      .then(([data, tenant, expire]: any[]) => {
        if (tenant.name) {
          const profile = data.userProfile
          profile.tenant = tenant.name
          cacheProfile(toMin(expire), profile)
        }
        return true
        })
  },
  refresh() {
    return axios.get(URLs.refresh)
      .then((data: any) => {
        const expire = toMin(data.expiredSeconds)
        cacheToken(data.id_token, expire)
        cacheProfile(expire)
        return expire
      })
  },
}

function toMin(seconds: number): number {
  return seconds / 60
}

function toMilliSec(seconds: number): number {
  return seconds * 1000
}

function cacheToken(token: string, expiration: number) {
  let now = Date.now()
  AuthConfig.set('hc-apm-token', token, toMin(expiration))
  AuthConfig.set('hc-apm-token-expireAt', toMilliSec(expiration) + now)
  AuthConfig.set('hc-apm-token-expiration', toMilliSec(expiration))
  AuthConfig.set('hc-apm-token-refreshAt', now) // for tracing purpose
}

function cacheProfile(expire: number, profile?: any) {
  if (!profile) {
    profile = AuthConfig.get('hc-apm-profile')
  }
  AuthConfig.set('hc-apm-profile', profile, expire)
}

export default auth
