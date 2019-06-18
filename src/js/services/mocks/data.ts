/* tslint:disable */
import { URLs } from 'services/data'
import { randomInt } from 'noru-utils/lib/random'

export default function (mock) {
  mock
    .onGet(URLs.assetInfo).reply(function () {
      return [200, {
        "message": "Get LSAssetInfo successfully!",
        "referencesURLss": null,
        "data": {
          "assetNum": randomInt(100),
          "assetTypeNum": randomInt(100),
          "assetDeptNum": randomInt(100)
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
    .onGet(URLs.lifeSupportAsset).reply(function () {
      return [200, {
        "message": "Get LSLifeSupportAsset successfully!",
        "referencesURLss": null,
        "data": {
          "syringe": randomInt(100),
          "monitor": randomInt(100),
          "respirator": randomInt(100),
          "infusion": randomInt(100),
          "defibrillator": randomInt(100)
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
    .onGet(URLs.assetIndex).reply(200,
    {
      "message": "get LSAssetIndex successfully!",
      "referencesURLss": null,
      "data": [{
        "assetId": 90,
        "assetName": "磁共振MRI类-9090909090909",
        "patientNum": 39053,
        "useRate": 0,
        "openRate": 57
      }, {
        "assetId": 101,
        "assetName": "血液净化类-101",
        "patientNum": 40314,
        "useRate": 403,
        "openRate": -100
      }, {
        "assetId": 85,
        "assetName": "检验室设备类-85",
        "patientNum": 37820,
        "useRate": null,
        "openRate": 49
      }, {
        "assetId": 75,
        "assetName": "呼吸类-75",
        "patientNum": 37979,
        "useRate": null,
        "openRate": null
      }, {
        "assetId": 80,
        "assetName": "电刀、超声刀-80",
        "patientNum": 38066,
        "useRate": 404,
        "openRate": 51
      }, {
        "assetId": 76,
        "assetName": "麻醉类-76",
        "patientNum": 36028,
        "useRate": 512,
        "openRate": 38
      }, {
        "assetId": 96,
        "assetName": "监护类-96",
        "patientNum": 38731,
        "useRate": 431,
        "openRate": 49
      }, {
        "assetId": 10,
        "assetName": "麻醉类-10",
        "patientNum": 37711,
        "useRate": 489,
        "openRate": 42
      }, {
        "assetId": 106,
        "assetName": "消毒设备类-106",
        "patientNum": 37061,
        "useRate": 462,
        "openRate": 43
      }, {
        "assetId": 73,
        "assetName": "放疗类-73",
        "patientNum": 37174,
        "useRate": 444,
        "openRate": 45
      }, {
        "assetId": 107,
        "assetName": "检验室设备类-107",
        "patientNum": 38498,
        "useRate": 379,
        "openRate": 55
      }, {
        "assetId": 93,
        "assetName": "超声影像类(US)-93",
        "patientNum": 37905,
        "useRate": 414,
        "openRate": 50
      }, {
        "assetId": 62,
        "assetName": "消毒设备类-62",
        "patientNum": 38299,
        "useRate": 456,
        "openRate": 45
      }, {
        "assetId": 77,
        "assetName": "软式内窥镜类-77",
        "patientNum": 37748,
        "useRate": 392,
        "openRate": 52
      }, {
        "assetId": 28,
        "assetName": "核医学类(NW/PET)-28",
        "patientNum": 39627,
        "useRate": 360,
        "openRate": 60
      }, {
        "assetId": 40,
        "assetName": "消毒设备类-40",
        "patientNum": 37986,
        "useRate": 478,
        "openRate": 43
      }, {
        "assetId": 64,
        "assetName": "病理类-64",
        "patientNum": 38526,
        "useRate": 435,
        "openRate": 48
      }, {
        "assetId": 53,
        "assetName": "呼吸类-53",
        "patientNum": 38855,
        "useRate": 468,
        "openRate": 45
      }, {
        "assetId": 95,
        "assetName": "放疗类-95",
        "patientNum": 38707,
        "useRate": 411,
        "openRate": 51
      }, {
        "assetId": 48,
        "assetName": "普放类(XR)-48",
        "patientNum": 37185,
        "useRate": 531,
        "openRate": 38
      }, {
        "assetId": 55,
        "assetName": "软式内窥镜类-55",
        "patientNum": 37946,
        "useRate": 395,
        "openRate": 52
      }, {
        "assetId": 12,
        "assetName": "硬式内窥镜类-12",
        "patientNum": 38524,
        "useRate": 421,
        "openRate": 49
      }, {
        "assetId": 50,
        "assetName": "核医学类(NW/PET)-50",
        "patientNum": 37321,
        "useRate": 482,
        "openRate": 42
      }, {
        "assetId": 45,
        "assetName": "CT类-45",
        "patientNum": 37198,
        "useRate": 540,
        "openRate": 37
      }],
      "bizStatusCode": "OK",
      "rowCount": 6
    })
    .onGet(URLs.assetRepairStatus).reply(200,
    {
      "message": "get LSAssetRepairStatus successfully!",
      "referencesURLss": null,
      "data": [
        {
          "assetName": "黄埔江",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "peng",
          "dealTime": "2017-06-15 16:00:03",
          "openTime": "13"
        },
        {
          "assetName": "资产非常大大大大大大大大大的风扇",
          "stepId": 2,
          "stepName": "待派工",
          "currentPerson": "zhan",
          "dealTime": "2017-06-15 16:31:58",
          "openTime": "13"
        },
        {
          "assetName": "资产风扇",
          "stepId": 6,
          "stepName": "待关单",
          "currentPerson": "gao",
          "dealTime": "2017-06-15 15:29:27",
          "openTime": "13"
        },
        {
          "assetName": "资产非常能装水水水水水水水水水的水杯",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "gao",
          "dealTime": "2017-06-16 17:00:07",
          "openTime": "12"
        },
        {
          "assetName": "黄埔江",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "peng",
          "dealTime": "2017-06-23 17:42:20",
          "openTime": "05"
        },
        {
          "assetName": "资产水杯",
          "stepId": 4,
          "stepName": "维修中",
          "currentPerson": "zhan",
          "dealTime": "2017-06-16 16:55:25",
          "openTime": "12"
        },
        {
          "assetName": "资产风扇",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "danny",
          "dealTime": "2017-06-23 17:53:26",
          "openTime": "05"
        },
        {
          "assetName": "资产风扇",
          "stepId": 2,
          "stepName": "待派工",
          "currentPerson": "zhan",
          "dealTime": "2017-06-15 16:31:58",
          "openTime": "13"
        },
        {
          "assetName": "资产风扇",
          "stepId": 6,
          "stepName": "待关单",
          "currentPerson": "gao",
          "dealTime": "2017-06-15 15:29:27",
          "openTime": "13"
        },
        {
          "assetName": "资产水杯",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "gao",
          "dealTime": "2017-06-16 17:00:07",
          "openTime": "12"
        },
        {
          "assetName": "黄埔江",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "peng",
          "dealTime": "2017-06-23 17:42:20",
          "openTime": "05"
        },
        {
          "assetName": "资产水杯",
          "stepId": 4,
          "stepName": "维修中",
          "currentPerson": "zhan",
          "dealTime": "2017-06-16 16:55:25",
          "openTime": "12"
        },
        {
          "assetName": "资产风扇",
          "stepId": 3,
          "stepName": "待接单",
          "currentPerson": "danny",
          "dealTime": "2017-06-23 17:53:26",
          "openTime": "05"
        }
      ],
      "bizStatusCode": "OK",
      "rowCount": 7
    })
    .onGet(URLs.assetNum).reply(function () {
      return [200,
        {
          "message": "Get LSAssetNum successfully!",
          "referencesURLss": null,
          "data": {
            "assetOn": randomInt(1123),
            "assetOff": randomInt(340)
          },
          "bizStatusCode": "OK",
          "rowCount": 1
        }]
    })
    .onGet(URLs.userPerformance).reply(200, {
      "message": "get LSUserPerformance successfully!",
      "referencesURLss": null,
      "data": [
        {
          "userId": 763,
          "userName": "zhan",
          "workNum": 13.333333375,
          "openNum": 0,
          "closedNum": 2
        },
        {
          "userId": 764,
          "userName": "peng",
          "workNum": 50,
          "openNum": 2,
          "closedNum": 2
        },
        {
          "userId": 769,
          "userName": "dl",
          "workNum": 100,
          "openNum": 0,
          "closedNum": 0
        },
        {
          "userId": 762,
          "userName": "gao",
          "workNum": 0,
          "openNum": 0,
          "closedNum": 2
        },
        {
          "userId": 773,
          "userName": "danny",
          "workNum": 0,
          "openNum": 0,
          "closedNum": 1
        },
        {
          "userId": 774,
          "userName": "zjky",
          "workNum": 100,
          "openNum": 4,
          "closedNum": 0
        },
        {
          "userId": 776,
          "userName": "zjadmin",
          "workNum": 100,
          "openNum": 0,
          "closedNum": 0
        },
        {
          "userId": 779,
          "userName": "修筑",
          "workNum": 100,
          "openNum": 0,
          "closedNum": 0
        },
        {
          "userId": 780,
          "userName": "修筑2",
          "workNum": 100,
          "openNum": 0,
          "closedNum": 0
        },
        {
          "userId": 781,
          "userName": "修筑3",
          "workNum": 100,
          "openNum": 0,
          "closedNum": 0
        }
      ],
      "bizStatusCode": "OK",
      "rowCount": 8
    })
    .onGet(URLs.insPm).reply(function () {
      return [200, {
        "message": "Get LSInsPm successfully!",
        "referencesURLss": null,
        "data": {
          "date": null,
          "ins": randomInt(10),
          "quality": randomInt(10),
          "metering": randomInt(10),
          "pm": randomInt(10)
        },
        "bizStatusCode": "OK",
        "rowCount": 1
      }]
    })
    .onGet(URLs.insPmList).reply(function () {
      return [200, {
        "bizStatusCode": "OK",
        "message": "string",
        "referencesURLss": [
          {
            "comments": "string",
            "httpMethod": "string",
            "linkURLs": "string"
          }
        ],
        "rowCount": 0,
        "data": [
          {
            "date": new Date(Date.now() + randomInt(-10, 10) * 86400000).toISOString().slice(0, 10),
            "ins": randomInt(10),
            "metering": randomInt(10),
            "pm": randomInt(10),
            "quality": randomInt(10)
          },
          {
            "date": new Date(Date.now() + randomInt(-10, 10) * 86400000).toISOString().slice(0, 10),
            "ins": randomInt(10),
            "metering": randomInt(10),
            "pm": randomInt(10),
            "quality": randomInt(10)
          },
          {
            "date": new Date().toISOString().slice(0, 10),
            "ins": randomInt(10),
            "metering": randomInt(10),
            "pm": randomInt(10),
            "quality": randomInt(10)
          }
        ]
      }]
    })
  // .onAny().passThrough() //FIXME https://github.com/ctimmerm/axios-mock-adapter/issues/61


}