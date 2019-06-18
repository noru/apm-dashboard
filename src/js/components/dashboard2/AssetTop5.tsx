import * as React from 'react'
import Background from 'containers/dashboard2/Background'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { apply } from 'noru-utils/lib'
import Bar from 'components/common/Bar'
import withClientRect from 'hoc/withClientRect'
import periodic from 'hoc/periodic'
import config from 'utils/config'
import { DB2_COMP_KEY as COMP_KEY } from 'utils/constants'

const Options = (t, baseFontSize, data) => {

  if (!data) {
    return
  }

  let { totals, availables, assetGroups } = data.reduce((left, asset) => {
    if (asset) {
      let { total, available, assetGroup } = asset
      left.totals.unshift(total)
      left.availables.unshift(available)
      left.assetGroups.unshift(assetGroup)
    }
    return left
  }, { totals: [], availables: [], assetGroups: []})

  let fontSize = baseFontSize * .657
  let barWidth = fontSize / 2
  let template = {
    color: ['#176591', '#c1e2f5'],
    textStyle: {
      fontSize,
      color: '#fff',
      fontFamily: 'GE CHS',
    },
    legend: {
      data: [t`assets_total_count`, t`available_assets_count`],
      bottom: 0,
      textStyle: {
        color: '#fff',
      },
      itemWidth: fontSize,
      itemHeight: fontSize,
      itemGap: fontSize,
    },
    grid: {
      left: '3%',
      right: '4%',
      top: '3%',
      bottom: '13%',
      containLabel: true,
    },
    xAxis: {
      type: 'value',
      boundaryGap: [0, 0.01],
      splitLine: {
        show: true,
        lineStyle: {
          color: '#333',
        },
      },
      axisLabel: {
        color: '#fff',
        fontSize,
        margin: 5,
      },
    },
    yAxis: {
      type: 'category',
      data: assetGroups,
      axisLabel: {
        color: '#fff',
        fontSize,
      },
    },
    series: [
      {
        name: t`assets_total_count`,
        type: 'bar',
        barGap: 0,
        barWidth,
        data: totals,
      },
      {
        name: t`available_assets_count`,
        type: 'bar',
        barWidth,
        data: availables,
      },
    ],
  }

  return template
}

export class AssetTop5 extends React.PureComponent<any, any> {

  getData() {
    let { dispatch } = this.props
    dispatch({ type: 'dashboard2/get/asset-top5' })
  }

  _toggleFullscreen = () => {
    let { fullscreened, dispatch } = this.props
    let payload = fullscreened === COMP_KEY.AssetTop5 ? undefined : COMP_KEY.AssetTop5
    dispatch({ type: 'dashboard2/set/fullscreened', payload })
  }

  render() {
    let { t, clientRect, data, fontSize, fullscreened } = this.props
    if (fullscreened) {
      fontSize *= 3
    }
    let width = clientRect.width * .85
    let height = clientRect.height * .7
    let option = Options(t, fontSize, data)

    return (
      <Background className="asset-top5" style={{fontSize: fullscreened ? '4em' : ''}}>
        <h1 onClick={this._toggleFullscreen}>{t('asset_type_top_5')}</h1>
        <div className="bar-chart">
          <Bar id="asset-top5-chart" width={width} height={height} option={option}/>
        </div>
      </Background>
    )
  }
}

const CONF = config.get(COMP_KEY.AssetTop5)
export default apply(
  AssetTop5,
  periodic(CONF.interval, 'getData'),
  translate(['common', 'dashboard2']),
  withClientRect,
  connect(({ dashboard2 }) => ({
    data: dashboard2.get('AssetTop5'),
    fontSize: dashboard2.get('BaseFontSize'),
    fullscreened: dashboard2.get('fullscreened'),
  })),
)