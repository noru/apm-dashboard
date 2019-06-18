import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import { CrutialAssets } from '../../../src/js/components/dashboard/CrutialAssets'
import { Refresh$ } from '../../../src/js/observables/index'

describe('CrutialAssets.tsx', () => {

  let Component
  let setStateSpy = spy(CrutialAssets.prototype, 'setState')
  beforeEach(() => {
    Component = <CrutialAssets t={mockT}/>
  })

  it('can be rendered', () => {

    let rendered = shallow(Component)
    let root = rendered.find('.crutial-assets')
    expect(root.exists()).to.be.true
    expect(root.find('> div')).to.have.length(3)

    let div = rendered.find('.crutial-assets .assets-indice')
    expect(div).to.have.length(1)
    let div2 = rendered.find('.crutial-assets .life-support-assets')
    expect(div2).to.have.length(1)

    let titles = root.find('.chart-title')
    expect(titles.at(0).text()).to.eq('key_assets_indice(last_year)')
    expect(titles.at(1).text()).to.eq('life_support_assets_perfectness_ratio')

  })

  it('chart title should respond to click event', () => {

    let configSpy = spy(CrutialAssets.prototype, 'config')
    let rendered = shallow(Component)
    let titles = rendered.find('.chart-title')

    titles.first().simulate('click')
    expect(configSpy.calledOnce).to.be.true

  })

  it('should have an onLifeSupportAssets method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onLifeSupportAssets' in instance).to.be.true

    let arg = {
      defibrillator: 1,
      infusion: 2,
      monitor: 3,
      respirator: 4,
      syringe: 5
    }
    instance.onLifeSupportAssets(arg)
    expect(setStateSpy.calledWith({ lifeSupportAssets: arg })).to.be.true
  })

  it('should have an onAssetIndice method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onAssetIndice' in instance).to.be.true

    let arg = {
      data: []
    }
    instance.onAssetIndice(arg)
    expect(setStateSpy.calledWith({ indice: [] })).to.be.true
  })

  it('should respond to obseverable Refresh$', () => {

    let refreshSpy = spy(CrutialAssets.prototype, 'refresh')
    let rendered = mount(Component)

    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next(CrutialAssets.key)
    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next('some other key')
    expect(refreshSpy.notCalled).to.be.true

  })

  it('should contain a header with 3 columns', () => {

    let rendered = shallow(Component)
    let cols = rendered.find('.header .column')
    expect(cols).to.have.length(3)

  })

  it('should contain bar chart with 5 bars', () => {

    let rendered = shallow(Component)
    let arg = {
      defibrillator: 1,
      infusion: 2,
      monitor: 3,
      respirator: 4,
      syringe: 5
    }
    rendered.setState({ lifeSupportAssets: arg })

    let bars = rendered.find('.bar')
    expect(bars).to.have.length(5)
    Object.keys(arg).forEach((key, i) => {
      let bar = bars.at(i)
      let p = bar.find('p')
      expect(p.at(0).text()).eq(arg[key] + '%')
      expect(p.at(1).text()).eq(key)
    })

  })

  it('should render items when served', () => {

    let rendered = shallow(Component)

    let indice = [
      {
        assetName: 'a',
        openRate: 1,
        patientNum: 1,
        useRate: 1
      },
      {
        assetName: 'b',
        openRate: 2,
        patientNum: 2,
        useRate: 2
      },
    ]
    rendered.setState({ indice })

    let items = rendered.find('.line-item')
    expect(items).to.have.length(2)
  })

})
