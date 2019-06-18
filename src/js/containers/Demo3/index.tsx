import React from 'react'
import FakeTabWrapper from '../Demo2/FakeTabWrapper'
import './index.scss'
import { Header } from '../Demo2'
import { Loading } from 'components/common/Loading'

const prefix = location.host.indexOf('localhost') > -1 ? 'http://apm-uat.hcdigital.com.cn' : ''
const Style = document.createElement('style')
Style.type = 'text/css'
Style.innerText = `
  html {
    overflow: hidden;
  }
  html,
  body,
  .layout-main {
    background: transparent !important;
  }
  .layout-main {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    z-index: 9999999999999;
    margin-left: 0 !important;
  }

  .layout-profile,
  #menuform,
  .layout-main > device-operational-perf > data-filter-bar,
  .layout-main .filter-bar {
    display: none !important;
  }

  .chart-body.parallel-coordinates-chart text.parallel-coordinates-chart {
    fill: white !important;
  }
  .link.bubble-radial-chart {
    stroke: white;
  }
  .sorting-dropdown.parallel-coordinates-chart {
    display:none;
  }
  parallel-coordinates-chart.style-scope.device-operational-perf {
    padding-top: 0;
  }
  .loading-container__1C09J {
    background: rgba(0,0,0,.5);
    color: white;
  }
`
export class Demo3 extends React.Component<any, any> {

  state = {
    style: Style,
    loading: [true, true, true],
    activeFrame: 1,
  }

  iframeReady(index: number) {
    let { style, loading } = this.state
    loading[index] = false
    this.setState({ loading: [...loading] })
    frames[index].document.body.appendChild((style as any).cloneNode(true))
  }

  render() {

    let { loading, activeFrame } = this.state
    return (
      <div className="demo3">
        <Header />
        <div className="demo3-row">
          <div
            className={'iframe-wrapper ' + (activeFrame === 0 ? 'active' : '')}
            onMouseEnter={() => this.setState({ activeFrame : 0 })}
          >
            <Loading loading={loading[0]}/>
            <h1>收入/利润</h1>
            <iframe
              style={{ visibility: loading[0] ? 'hidden' : 'visible', overflow: 'hidden' }}
              src={prefix + '/geapm/portal/analysis/reports.xhtml#/AssetPerf'}
              onLoad={() => this.iframeReady(0)}
              frameBorder="0"
              />
          </div>
          <div
            className={'iframe-wrapper ' + (activeFrame === 1 ? 'active' : '')}
            onMouseEnter={() => {this.setState({ activeFrame : 1, loading: [false, true, false] }); frames[1].location.reload()}}
          >
            <Loading loading={loading[1]}/>
            <h1>设备使用时间统计</h1>
            <iframe
              style={{ visibility: loading[1] ? 'hidden' : 'visible', overflow: 'hidden' }}
              src={prefix + '/geapm/portal/analysis/assetOperationalPerf.xhtml'}
              onLoad={() => this.iframeReady(1)}
              frameBorder="0"
              />
          </div>
          <div
            className={'iframe-wrapper ' + (activeFrame === 2 ? 'active' : '')}
            onMouseEnter={() => this.setState({ activeFrame : 2 })}
          >
            <Loading loading={loading[2]}/>
            <h1>维修工单</h1>
            <iframe
              style={{ visibility: loading[2] ? 'hidden' : 'visible', overflow: 'hidden' }}
              src={prefix + '/geapm/portal/analysis/deviceStatusMonitor.xhtml'}
              onLoad={() => this.iframeReady(2)}
              frameBorder="0"
            />
          </div>
        </div>
      </div >
    )
  }
}

export default FakeTabWrapper('3')(Demo3)