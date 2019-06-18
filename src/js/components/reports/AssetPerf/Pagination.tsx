import * as React from 'react'
import { debounce } from 'lodash-es'
import classname from 'classname'
import { Slider } from 'antd'
import { FilterUpdater } from 'observables'
import { translate } from 'react-i18next'
import './Pagination.scss'

interface Props {
  start: number,
  limit: number,
  max: number,
  [props: string]: any,
}

export class Pagination extends React.PureComponent<Props, any> {

  onRangeChange = debounce(([start, end]) => {
    return FilterUpdater(state => {
      state.range = [start - 1, end]
      return state
    })
  }, 1200)

  render() {
    let { start, limit, max, className, t } = this.props
    let [_start, _end ] = getRange(start, limit, max)
    return <div className={classname('pagination-slider level', className)}>
      <Slider
        key={[start, limit, max].toString()} // to refresh defaultValue
        className="page-range level-right"
        range
        defaultValue={[_start, _end]}
        min={1}
        max={max}
        onChange={this.onRangeChange}/>
      <span className="pagination-slider-desc level-right">
        {t('select_range_in_total', { start: _start, end: _end, max })}
      </span>
    </div>
  }
}

function getRange(start: number, limit: number, max: number) {
  return [Math.min(max, start + 1), Math.min(max, start + limit)]
}

export default translate()(Pagination)
