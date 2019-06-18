import * as React from 'react'
import Background from 'containers/dashboard//Background'
import Ellipsus from 'ellipsus'
import { translate } from 'react-i18next'
import Colors from 'utils/colors'
import Pie from 'react-minimal-pie-chart'
import './CrutialAssets.scss'
import subscribe from 'hoc/RxSubscribe'
import * as classname from 'classname'
import FlipMove from 'components/common/FlipMoveWrapper'
import config from 'utils/config'
import {
  LifeSupportAssets, AssetIndice,
  LifeSupportAssets$, AssetIndice$, TimeConfig$, Refresh$, config as _,
} from 'observables/index'
import { LifeSupportAsset, AssetIndex } from 'services/data'

interface Props { t: any }
interface State { lifeSupportAssets: LifeSupportAsset | {}, indice: AssetIndex[] }

export class CrutialAssets extends React.PureComponent<Props, State> {

  static key = 'asset-index'

  state = {
    indice: new Array<AssetIndex>(),
    lifeSupportAssets: {},
  }

  onLifeSupportAssets = lifeSupportAssets => {
    this.setState({ lifeSupportAssets })
  }

  onAssetIndice = incoming => {
    this.setState({ indice: incoming.data })
  }

  refresh() {
    let conf = config.get(CrutialAssets.key)
    AssetIndice$.next(_(conf.interval, 9, conf.intervalPerPage, undefined, { month: conf.month.value }))
    LifeSupportAssets$.next(_(conf.interval))
    this.setState({ indice: [] })
  }

  config() {
    TimeConfig$.next(CrutialAssets.key)
  }

  componentDidMount() {
    this.refresh()
    Refresh$.subscribe(key => {
      if (key === CrutialAssets.key) {
        this.refresh()
      }
    })
  }

  render() {
    let { t } = this.props
    let { lifeSupportAssets, indice } = this.state
    return (
      <Background className="crutial-assets tile is-vertical">
        <div className="tile is-child assets-indice">
          <div>
            <span className="chart-title config" onClick={this.config}>{t`key_assets_indice`}</span>
          </div>
          { Header(t) }
          <FlipMove duration={650} easing="ease-out" enterAnimation="accordionVertical" leaveAnimation="fade">
            { indice.map(LineItem) }
          </FlipMove>
        </div>
        <div className="saperator"></div>
        <div className="tile is-child life-support-assets">
          <div className="chart-title">{t`life_support_assets_perfectness_ratio`}</div>
          <div className="has-text-centered is-fullheight columns">
            {Object.keys(lifeSupportAssets)
              .filter(type => type !== 'syringe') // as per request, syringe & infusion are the same, hide one
              .map(key => Bar({
              name: t(key), percentage: lifeSupportAssets[key],
            }))}
          </div>
        </div>
      </Background>
    )
  }
}

export default translate(['common', 'dashboard'])(subscribe({ LifeSupportAssets, AssetIndice })(CrutialAssets))

const colors = [Colors.turquoise, Colors.yellow, Colors.purple]
function Header(t: any) {
  return (
    <div className="columns header">
      {[t`patient_number`, t`operation_rate`, t`utilization`]
        .map((text, i) => (<div key={text} className="column has-text-centered nowrap" style={{ color: colors[i] }}>
          {text}
        </div>))
      }
    </div>
  )
}

const PieGray = '#2B3E44'
function LineItem(item) {
  let $item = item || {}
  let { assetId, assetName, patientNum, useRate, openRate } = $item
  useRate = useRate || 0
  openRate = openRate || 0

  return (
    <div key={assetId || Math.random().toString()}
      className={classname('line-item columns normal-text', item ? '' : 'placeholder')}>
      <div className="column has-text-centered is-one-third">
        <p className="nowrap">
          <Ellipsus className="asset-name">{assetName || ''}</Ellipsus>
        </p>
        <span className="color-turquoise">{patientNum}</span>
      </div>
      <div className="column has-text-centered is-one-third">
        <span className="color-yellow">{getRateText(openRate)}</span>
        { !isInvalidRate(openRate) &&
          <Pie className="pie-chart" startAngle={-90} data={[
            { value: openRate, color: Colors.yellow },
            { value: noNegative(100 - openRate), color: PieGray },
          ]} />
        }
      </div>
      <div className="column has-text-centered is-one-third">
        <span className="color-purple">{getRateText(useRate)}</span>
        { !isInvalidRate(useRate) &&
          <Pie className="pie-chart" startAngle={-90} data={[
            { value: useRate, color: Colors.purple },
            { value: noNegative(100 - useRate), color: PieGray },
          ]} />
        }
      </div>
    </div>
  )
}

function getRateText(rate: number): string {
  return isInvalidRate(rate) ? '--' : rate + '%'
}

function isInvalidRate(num: any) {
  return num === undefined || num === null || num <= 0
}

function noNegative(num: number) {
  return num > 0 ? num : 0
}

function Bar(data: any) {
  let height = 100 - data.percentage + '%' // set to maxHeight to animate
  return (
    <div key={data.name} className="bar column has-text-centered">
      <p className="normal-text nowrap">{data.percentage || 0}%</p>
      <div className="bar-container">
        <div className="bar-value-rest" style={{ maxHeight: height }} />
      </div>
      <p className="nowrap">{data.name}</p>
    </div>
  )
}
