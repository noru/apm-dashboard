import * as React from 'react'
import numeral from 'numeral'
import classname from 'classname'
import 'numeral/locales/chs'
import { sumBy } from 'lodash-es'
import { ellipsis } from 'noru-utils/lib/string'
import { Item } from './AssetPerf'
numeral.locale('chs')

const balanceLegend = require('../../../../assets/img/profit-legend.svg')

// const BarColorDark = [colors.blue7, colors.yellow7, colors.green6, colors.red7]
// const BarColorLight = [colors.blue3, colors.yellow3, colors.green3, colors.red3]

const TableColumns: any = [
  {
    headerI18n: 'name',
    accessor: 'name',
    className: 'name-col',
    headerClassName: 'name-th',
  },
  {
    headerI18n: 'revenue',
    accessor: 'revenue',
    className: 'number-col',
    headerClassName: 'number-th',
    Footer: (col) => <span className="table-footer">{sumBy(col.data, d => d.revenue)}</span>,
  },
  {
    headerI18n: 'cost',
    accessor: 'cost',
    className: 'number-col',
    headerClassName: 'number-th',
    Footer: (col) => <span className="table-footer">{sumBy(col.data, d => d.cost)}</span>,
  },
  {
    id: 'balance',
    headerI18n: 'balance',
    className: 'number-col',
    headerClassName: 'number-th',
    accessor: d => d.revenue - d.cost,
    Cell: row => <span className={row.value >= 0 ? 'positive' : 'negative'}>{row.value}</span> ,
    Footer: (col) => {
      let sum = sumBy(col.data, d => d.balance)
      return <span className={classname('table-footer', sum >= 0 ? 'positive' : 'negative')}>{sum}</span>
    },
  },
]

const DEFAULT_DATA_LABEL_FORMATTER = ({ value }) => value ? currencyFormatter(value) : ''
const HIDE_LABEL_FORMATTER = (_input: any) => ''

// TODO: move for global use
function currencyFormatter(amount: number, format: string = '0.0a'): string {
  return numeral(amount).format(format)
}

function getPoint(amount: number, formatter: (params: any) => string,
                  positiveColor?: string, negativeColor?: string) {
  return {
    value: amount,
    label: {
      normal: {
        formatter,
      },
    },
    itemStyle: {
      normal: {
        color: amount > 0 ? positiveColor : negativeColor,
      },
    },
  }
}

function getChartOption(items: Item[], root?: Item) {
  if (root) {
    items = [root].concat(items)
  }
  // let colorSet = BarColorDark
  let xAxisData: any[] = []
  let revenue: any[] = []
  let cost: any[] = []
  let balance: any[] = []
  let xAxisFormatter, pointFormatter
  if (items.length > 13) {
    xAxisFormatter = pointFormatter = HIDE_LABEL_FORMATTER
  } else {
    xAxisFormatter = value => ellipsis(value, 9)
    pointFormatter = DEFAULT_DATA_LABEL_FORMATTER
  }
  items.forEach((item, i) => {
    let isRoot = root && i === 0
    xAxisData.push(item.name)
    revenue.push(getPoint(item.revenue, pointFormatter, isRoot ? 'red' : undefined))
    cost.push(getPoint(-item.cost, pointFormatter, isRoot ? 'red' : undefined))
    balance.push(getPoint(item.revenue - item.cost, pointFormatter, isRoot ? 'red' : undefined, 'red'))
    ChartOption.xAxis[0].axisLabel.formatter = xAxisFormatter
  })
  // ChartOption.color = colorSet
  ChartOption.xAxis[0].data = xAxisData
  ChartOption.series[0].data = revenue
  ChartOption.series[1].data = cost
  ChartOption.series[2].data = balance

  return ChartOption
}
const ChartOption: any = {
  title: {
    left: '2%',
    top: '-2%',
  },
  tooltip: {
    trigger: 'axis',
    axisPointer: {
      type: 'shadow',
    },
  },
  toolbox: {
    show: true,
    feature: {
      dataZoom: {
        yAxisIndex: 'none',
      },
      restore: {},
      saveAsImage: {},
    },
  },
  legend: {
    right: '14%',
    top: '1%',
    data: [{ name: 'revenue' }, { name: 'cost' }, { name: 'balance', icon: 'image://' + balanceLegend }],
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    top: '12%',
    containLabel: true,
  },
  yAxis: [
    {
      type: 'value',
      axisLabel: {
        formatter: (value) => currencyFormatter(value, '0a'),
      },
    },
  ],
  xAxis: [
    {
      type: 'category',
      axisTick: {
        show: false,
      },
      axisLabel: {
        interval: 0,
      },
      data: [],
    },
  ],
  series: [
    {
      name: 'revenue',
      type: 'bar',
      stack: 'revenue-cost',
      label: {
        normal: {
          show: true,
          position: 'top',
        },
      },
      data: [],
    },
    {
      name: 'cost',
      type: 'bar',
      stack: 'revenue-cost',
      label: {
        normal: {
          show: true,
          position: 'bottom',
        },
      },
      data: [],
    },
    {
      name: 'balance',
      type: 'bar',
      barGap: '15%',
      barCategoryGap: '30%',
      barMaxWidth: '20%',
      label: {
        normal: {
          show: true,
          position: 'inside',
          rotate: '90',
        },
      },
      data: [],
    },
  ],
}

export { TableColumns, ChartOption, getChartOption, getPoint }