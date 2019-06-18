import * as React from 'react'
import { translate } from 'react-i18next'
import { Checkbox } from 'antd'
import Table from 'components/common/Table'
import Bar from 'components/common/Bar'
import { GlobalAjaxLoading as Loading } from 'components/common/Loading'
import Pagination from 'components/reports/AssetPerf/Pagination'
import subscribe from 'hoc/RxSubscribe'
import services from 'services/index'
import { Filter$, Filter as TypeFilters, FilterUpdater } from 'observables'
import Filters from 'components/reports/AssetPerf/FilterBar'
import { pick } from 'lodash-es'
import { getChartOption, TableColumns, ChartOption } from './ChartOptions'
import './AssetPerf.scss'
const API = services.report

export interface Item {
  id?: string,
  name?: string,
  hasParent?: boolean,
  type: string,
  revenue: number,
  cost: number
}

interface State {
  from: string,
  to: string,
  start: number,
  limit: number,
  max: number,
  showRoot: boolean,
  root: Item,
  items: Item[],
}

class AssetPerf extends React.PureComponent<any, State> {

  state: State = {
    from: '',
    to: '',
    start: 0,
    limit: 0,
    max: 100,
    showRoot: false,
    root: {
      id: '',
      name: '',
      type: '',
      revenue: 0,
      cost: 0,
    },
    items: new Array<Item>(),
  }

  private _chart

  onFilter$(filters: TypeFilters) {
    let { from, to, groupby, range: [start, end], drillDownId } = filters
    let params: any = { from, to, start, limit: end - start}
    let { root } = this.state
    if (drillDownId) {
      params[root.type] = drillDownId
    } else {
      params.groupby = groupby
    }
    API.profit(params)
      .then(d => this._receiveData(d))
      .then(() => this.setState({ from, to }))
  }

  onShowRoot = (evt) => {
    this.setState({ showRoot: evt.target.checked })
  }

  onBackToRoot() {
    FilterUpdater(state => {
      state.drillDownId = undefined
      return state
    })
  }

  onDrillDown(index: number) {
    let { items, showRoot } = this.state
    let { drillDownId } = Filter$.getValue()
    if (showRoot && index === 0) {
      if (drillDownId) {
        this.onBackToRoot()
      }
      return
    }
    if (drillDownId) {
      return
    }
    let item = items[showRoot ? index + 1 : index]
    FilterUpdater(state => {
      state.drillDownId = item.id
      return state
    })
  }

  componentDidMount() {
    let { t } = this.props
    TableColumns.forEach((col, i) => {
      col.Header = t(col.headerI18n)
      if (i === 0) {
        col.Footer = <span className="table-footer">{t`footer_total`}</span>
      }
      if (i > 0) {
        col.Header += ` (${t`yuan`})`
      }
    })
    ChartOption.title.subtext = `${t`currency`}: ${t`yuan`}`
    ChartOption.legend.data.forEach((d, i) => {
      let localized = t(d.name)
      d.name = ChartOption.series[i].name = localized // must keep series/legend name in sync
    })
    if (this._chart) {
      this._chart.on('click', params => {
        this.onDrillDown(params.dataIndex)
      })
    }
  }

  render() {

    let { drillDownId } = Filter$.getValue()
    let { t } = this.props
    let { start, limit, max, items, root, showRoot } = this.state
    if (this._chart) {
      this._chart.setOption(getChartOption(items, showRoot ? root : undefined))
    }
    return <div className="asset-perf-classic">

      <div className="filter-bar">
        <Filters />
      </div>
      <div className="chart-header level">
        <nav className="breadcrumb has-succeeds-separator level-left" aria-label="breadcrumbs">
          <ul>
            <li>
              <a onClick={() => drillDownId && this.onBackToRoot()}>{t(getRootBreadcrumb(root.type))}</a>
            </li>
            { drillDownId && <li className="is-active"><a>{root.name}</a></li> }
          </ul>
          <Loading />
        </nav>

        < div className="chart-controls level-right">
          <Pagination start={start} limit={limit} max={max} />
          <Checkbox onChange={this.onShowRoot} disabled={max === 0} >{t`show_total`}</Checkbox>
        </div>
      </div>
      <div className="bar-chart-wrapper">
        <Bar id="bar-chart" width="100%" height="300px" chart={chart => this._chart = chart}/>
      </div>

      <div className="table-wrapper">
        <Table
          data={items}
          noDataText={t`no_data`}
          columns={TableColumns}
          pageSize={items.length || 5}
          showPagination={false}
          className="asset-perf-table -striped -highlight"
        />
      </div>

    </div>
  }

  private _receiveData = (d) => {
    let newItems = d.items.map(_ => pick(_, 'id', 'name', 'type', 'revenue', 'cost'))
    let root = pick(d.root, 'id', 'name', 'type', 'revenue', 'cost')

    this.setState({
      start: d.pages.start,
      limit: d.pages.limit,
      max: d.pages.total,
      root,
      items: newItems,
    })
  }
}

export default translate()(subscribe({ Filter$ })(AssetPerf))

function getRootBreadcrumb(groupby: string): string {
  switch (groupby) {
    case 'dept':
      return 'by_dept'
    case 'type':
      return 'by_type'
    case 'month':
      return 'by_month'
    default:
      return ''
  }
}
