import React, { PureComponent } from 'react'
import moment from 'moment'
import { translate } from 'react-i18next'
import { pick } from 'lodash-es'
import { DatePicker, Radio } from 'antd'
import { getRangePresets, disabledDate } from 'utils/rangePresets'
import { Filter, Filter$, FilterUpdater } from 'observables'
import connect from 'hoc/RxConnect'
import { DATE_FORMAT } from 'utils/constants'
import './FilterBar.scss'

const RangePicker = DatePicker.RangePicker
const DatePresets = getRangePresets([
  'oneWeek', 'oneMonth', 'oneYear', 'currentMonth',
  'yearBeforeLast', 'lastYear', 'currentYear',
])

const Ranges = DatePresets.reduce((prev, cur) => {
  prev[cur.text] = [
    cur.start,
    cur.end,
  ]
  return prev
}, {})

export class FilterBar extends PureComponent<any, any> {

  onPeriodChange = ([from, to]) => {
    return FilterUpdater(state => {
      state.from = from.format(DATE_FORMAT)
      state.to = to.format(DATE_FORMAT)
      return state
    })
  }

  onGroupByChange = evt => {
    return FilterUpdater(state => {
      state.groupby = evt.target.value
      state.drillDownId = undefined
      return state
    })
  }

  render() {
    let { t } = this.props
    let { from, to, groupby } = this.props.subject.getValue()
    return (
      <nav className="asset-perf-filter-bar level">
        <div className="nav-left">
          <div className="nav-item">
            <RangePicker
              showTime
              format="YYYY-MM-DD"
              ranges={Ranges}
              disabledDate={disabledDate}
              defaultValue={[moment(from), moment(to)]}
              onChange={(_dates, range) => this.onPeriodChange(range)}
            />
          </div>
          <div className="nav-item">
            <Radio.Group value={groupby} onChange={this.onGroupByChange}>
              <Radio.Button value="dept">{t`dept`}</Radio.Button>
              <Radio.Button value="type">{t`asset`}</Radio.Button>
              <Radio.Button value="month">{t`month`}</Radio.Button>
            </Radio.Group>
          </div>
        </div>
      </nav>
    )
  }

}

function mapState2Props(state: Filter) {
  return pick(state, 'from', 'to', 'groupby')
}
export default translate()(connect(Filter$, mapState2Props)(FilterBar))