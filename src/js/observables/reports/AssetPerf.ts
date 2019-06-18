import moment from 'moment'
import { BehaviorSubject } from '../rxjs'
import { DATE_FORMAT } from 'utils/constants'

export interface Filter {
  from: string,
  to: string,
  groupby: string,
  range: [number, number],
  drillDownId?: string,
}

export const Filter$ = new BehaviorSubject<Filter>({
  from: moment(new Date().getFullYear(), 'YYYY').format(DATE_FORMAT),
  to: moment().format(DATE_FORMAT),
  groupby: 'dept',
  range: [0, 10],
})

export function FilterUpdater(func: (state: Filter) => Filter) {
  let newState = func(Filter$.getValue())
  Filter$.next(newState)
}
