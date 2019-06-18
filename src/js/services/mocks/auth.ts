/* tslint:disable */
import { URLs } from 'services/auth'

export default function (mock) {
  mock
    .onPost(URLs.login).reply(function ({ data }) {

      let body = JSON.parse(data)
      if (body.loginName === 'invalid') {
        return [400, {
          "message" : "This username or password is not valid!...",
          "referencesURLs" : null,
          "data" : null,
          "bizStatusCode" : "FAILED",
          "rowCount" : 0
        }]
      }

      return [200, {
        "message": "This user is valid!...",
        "referencesURLs": [
          {
            "httpMethod": "GET",
            "linkURL": "api/apm/security/users/766",
            "comments": "Get the user information via id"
          }
        ],
        "data": {
          "userProfile": {
            "userAccount": {
              "tenantUID": "e672cca0f7b24b7bb0c0e2394d1dbd71",
              "institutionUID": "af2e6cae5d7f11e7bdb152540064531b",
              "hospitalUID": "af2e6cae5d7f11e7bdb152540064531b",
              "siteUID": "af2e6cae5d7f11e7bdb152540064531b",
              "id": 766,
              "loginName": "ms",
              "name": "Man, Shuo",
              "email": "ms@ge.com",
              "telephone": "18602155218",
              "isSuperAdmin": false,
              "isSiteAdmin": false,
              "isLocalAdmin": false,
              "isActive": true,
              "orgLevel": 1,
              "isOnline": false,
              "siteId": 3,
              "hospitalId": 9,
              "lastLoginTime": "2017-07-18T08:06:52.424+0000",
              "weChatId": "oCMzbv_v0Mtbl6euYRF5ps3I_GkU",
              "leaderUserId": null,
              "passwordUpdateDate": null,
              "passwordErrorCount": 0,
              "isLocked": false,
              "wechatNickname": "满硕",
              "orgInfoId": 9
            },
            "userRoleList": [
              {
                "id": 3,
                "name": "AssetStaff",
                "roleDesc": "设备科科员",
                "homePage": "/homeAssetStaff.xhtml"
              }
            ]
          },
          "jwtToken": {
            "loginId": 766,
            "loginName": "ms",
            "expiredSeconds": 86400,
            "id_token": "Bearer fake-toke-&$%^**^&"
          }
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
    .onGet(RegExp(URLs.tenant + '/*')).reply(function () {
      return [200, {
        "message": "Done with OK...",
        "referencesURLs": null,
        "data": {
          "id": 4,
          "name": "妇幼保健医院",
          "nameEn": "",
          "aliasName": "",
          "description": "",
          "contactPerson": "",
          "contactPhone": "",
          "contactEmail": "",
          "location": "",
          "locationEn": null,
          "timeZone": null,
          "defaultLang": "zh",
          "isEnabled": true,
          "manhourPrice": 1000,
          "wfAutoStep2": false,
          "wfAutoStep3": true,
          "wfAutoStep4": false,
          "wfAutoStep5": false,
          "wfAutoStep6": false,
          "uid": "7e6136abe0a04c7c8eebb5ffdc654538",
          "passwordLifeTime": null
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
    .onGet(URLs.refresh).reply(() => {
      return [200, {
        "message": "refreshToken is done successfully!...",
        "referencesURLs": null,
        "data": {
          "loginId": 766,
          "loginName": "ms",
          "expiredSeconds": 86400,
          "id_token": "Bearer fake-token-*(D)*&(*&"
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
  // .onAny().passThrough() //FIXME https://github.com/ctimmerm/axios-mock-adapter/issues/61


}