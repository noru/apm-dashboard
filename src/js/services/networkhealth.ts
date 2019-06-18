import axios, { AxiosPromise } from 'axios'
import * as config from 'config'

const PREFIX = config.apiPrefix
export const URLs = {
  networkHealth: '/management/health',
}
Object.keys(URLs).forEach(key => URLs[key] = PREFIX + URLs[key])

export interface NetworkHealth {
  heartBeatTest(): AxiosPromise
}

const networkhealth: NetworkHealth = {

  heartBeatTest() {
    return axios.get(URLs.networkHealth)
  },

}

export default networkhealth
