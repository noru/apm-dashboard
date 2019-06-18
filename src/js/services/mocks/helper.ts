import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'

let mock
export function load(routeFile: string) {

  mock = mock || new MockAdapter(axios, { delayResponse: 800 })
  require(`${routeFile}`).default(mock) // use string template to suppress warning

}