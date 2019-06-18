/* tslint:disable */
import { URLs } from 'services/networkhealth'

export default function (mock) {
  mock
    .onGet(URLs.networkHealth).reply(function() {
      let error = [500, {
        "description": "Spring Cloud Eureka Discovery Client",
        "status": "DOWN"
      }]

      let ok = [200, {
        "description": "Spring Cloud Eureka Discovery Client",
        "status": "UP"
      }]

      return Math.random() > .7 ? error : ok
    })
  // .onAny().passThrough() //FIXME https://github.com/ctimmerm/axios-mock-adapter/issues/61


}