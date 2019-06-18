import { Observable } from './rxjs'
import { BehaviorSubject } from './rxjs'
import { Subject } from './rxjs'
import * as moment from 'moment'
import services from 'services/index'

const AssetAPI = services.data
const NetworkHealthAPI = services.networkhealth

const RETRY_DELAY = 10 * 1000
const DATE_FORMAT = 'YYYY-MM-DD'

// todo: code smell #2: readability
/**
 * Actions:
 * Naming: Observable name + '$'
 * Usage: action$.next(config: Config) to trigger a new observable
 */
interface AuthTiming {
  due: number,
  interval: number
}

interface Config {
  interval: number,
  bufferCount?: number,
  durationPerPage?: number
  itemPerPage?: number,
  [others: string]: any,
}

/* a helper to build args */
export function config(interval, bufferCount?, durationPerPage?, itemPerPage?, others?: {}): Config {
  return { interval, bufferCount, durationPerPage, itemPerPage, ...others }
}

export const Auth$: Subject<AuthTiming> = new Subject()
export const TimeConfig$: Subject<string> = new Subject()
export const Refresh$: Subject<string> = new Subject()
export const AssetIndice$: Subject<Config> = new Subject()
export const RepairStatus$: Subject<Config> = new Subject()
export const PersonnelPerformance$: Subject<Config> = new Subject()
export const InspectionPlanOverview$: Subject<Config> = new Subject()
export const RepairNumber$: Subject<Config> = new Subject()
export const InspectionPlanList$: Subject<Config> = new Subject()
export const AssetInfo$: Subject<Config> = new Subject()
export const LifeSupportAssets$: Subject<Config> = new Subject()

/**
 * Observables
 */
export const Auth = Auth$
  .switchMap(({due, interval}) => Observable.timer(due, interval).map(() => interval))
  .flatMap((interval) => Observable.fromPromise(services.auth.refresh()).retryWhen(errors => _retry(errors, interval)))
  .publish()

export const AssetIndice = AssetIndice$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(conf => Observable.fromPromise(AssetAPI.assetIndex(0, 200, conf.month.value))
                             .map(resp => ({ resp, conf }))
                             .retryWhen(errors => _retry(errors, conf.interval)))
  .switchMap(({ resp, conf }) => _slice(resp, conf.interval, conf.bufferCount!, conf.durationPerPage!))
  .share()

export const RepairStatus = RepairStatus$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(conf => Observable.fromPromise(AssetAPI.assetRepairStatus(0, 200))
                             .map(resp => ({ resp, conf }))
                             .retryWhen(errors => _retry(errors, conf.interval)))
  .switchMap(({ resp, conf }) => _slice(resp, conf.interval, conf.bufferCount!, conf.durationPerPage!))
  .share()

export const PersonnelPerformance = PersonnelPerformance$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(conf => {
    let to = moment().format(DATE_FORMAT)
    let from = moment().subtract(30, 'days').format(DATE_FORMAT)
    return Observable.fromPromise(AssetAPI.userPerformance(from, to))
                     .map(resp => ({ resp, conf }))
                     .retryWhen(errors => _retry(errors, conf.interval))
  })
  .switchMap(({ resp, conf }) => _slice(
    resp, conf.interval, conf.bufferCount!, conf.durationPerPage!, conf.itemPerPage,
  ))
  .share()

export const InspectionPlanOverview = InspectionPlanOverview$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(conf => {
    let to = moment().add(15, 'days').format(DATE_FORMAT)
    let from = moment().subtract(15, 'days').format(DATE_FORMAT)
    return Observable.fromPromise(AssetAPI.insPm(from, to))
                     .map(resp => ({ resp, conf }))
                     .retryWhen(errors => _retry(errors, conf.interval))
  })
  .share()

export const RepairNumber = RepairNumber$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(({ interval }) => Observable.fromPromise(AssetAPI.assetNum()).retryWhen(errors => _retry(errors, interval)))
  .share()

export const InspectionPlanList = InspectionPlanList$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(({ interval }) => {
    let to = moment().add(15, 'days').format(DATE_FORMAT)
    let from = moment().subtract(15, 'days').format(DATE_FORMAT)
    return Observable.fromPromise(AssetAPI.insPmList(from, to))
                     .retryWhen(errors => _retry(errors, interval))
  })
  .share()

export const AssetInfo = AssetInfo$
  .switchMap(conf => Observable.timer(0, conf.interval).map(() => conf))
  .flatMap(conf => Observable.fromPromise(AssetAPI.assetInfo()).retryWhen(errors => _retry(errors, conf.interval)))
  .share()

export const LifeSupportAssets = LifeSupportAssets$
  .switchMap(({interval}) => {
    return Observable.timer(0, interval)
      .flatMap(() => Observable.fromPromise(AssetAPI.lifeSupportAsset()))
      .retryWhen(errors => _retry(errors, interval))
  })
  .share()

export const NetworkStatus$ = new BehaviorSubject({
  isOnline: true,
})

export const NetworkStatus = Observable.timer(0, 60000)
  .switchMap(() => Observable.fromPromise(NetworkHealthAPI.heartBeatTest())
    .catch(error => {
      console.error(error)
      return Observable.of(error)
    }))
  .map(response => ({ isOnline: !(response instanceof Error) })) // temp
  .multicast(NetworkStatus$)

/**
 * A helper to slice an array and service each section with a delay
 * to simulate a "stream" like data source
 */
interface Sliced {
  data: any,
  total: number,
  skip: number,
  top: number,
  [key: string]: any,
}

function _slice(
  array: any,
  interval: number,
  count: number,
  delayPerPage: number,
  maxPerPage?: number): Observable<Sliced> {

  maxPerPage = maxPerPage || count

  // fill last page with null element if not full
  let originalLength = array.length
  let residule = originalLength % count

  if (residule > 0) {
    array = array.concat(Array(count - residule).fill(null))
  }

  // within one page, return it directly
  if (array.length <= maxPerPage!) {
    return Observable.of({
      data: array,
      total: originalLength,
      skip: 0,
      top: maxPerPage!,
    })
  }

  let pageCount = Math.ceil(array.length / maxPerPage!)
  let repeatCount = Math.ceil(interval / (delayPerPage * pageCount))

  return Observable.from(array).repeat(repeatCount).bufferCount(count)
    .concatMap((buffered, i) => Observable.of([buffered]).delay(i && delayPerPage))
    .flatMap(e => e)
    .map((e, i) => ({
      data: e,
      total: originalLength,
      skip: (i % pageCount) * maxPerPage!,
      top: maxPerPage!,
    }))
}

function _retry(errors: Observable<any>, originalInterval: number): Observable<any> {
  let { isOnline } = NetworkStatus$.getValue()
  let delay = isOnline ? RETRY_DELAY : originalInterval
  return errors.do(_logError).delay(delay)
}

function _logError(e) {
  console.error(e)
  if (e.response) {
    console.error(e.response)
  }
}