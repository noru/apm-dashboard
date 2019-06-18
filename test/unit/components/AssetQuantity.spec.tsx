import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import config from '../../../src/js/utils/config'
import { AssetQuantity } from '../../../src/js/components/dashboard/AssetQuantity'
import { Refresh$, AssetInfo } from '../../../src/js/observables/index'

describe('AssetQuantity.tsx', () => {
  let Component
  beforeEach(() => {
    Component = <AssetQuantity t={mockT}/>
  })

  it('can be rendered', () => {

    let rendered = shallow(Component)
    let nav = rendered.find('nav')
    expect(nav.children()).to.have.length(3)

  })

  it('should display 3 numbers', () => {

    let rendered = shallow(Component)
    rendered.setState({
      assets: 1,
      types: 2,
      departments: 3
    })

    let items = rendered.find('div.level-item')

    expect(items.at(0).find('.chart-title').text()).eq('total_assets')
    expect(items.at(0).find('.major-number').text()).eq('1')
    expect(items.at(1).find('.chart-title').text()).eq('total_types')
    expect(items.at(1).find('.major-number').text()).eq('2')
    expect(items.at(2).find('.chart-title').text()).eq('total_depts')
    expect(items.at(2).find('.major-number').text()).eq('3')

  })

  it('chart title should respond to click event', () => {

    let configSpy = spy(AssetQuantity.prototype, 'config')
    let rendered = shallow(Component)
    let titles = rendered.find('.chart-title')

    titles.at(0).simulate('click')
    titles.at(1).simulate('click')
    titles.at(2).simulate('click')

    expect(configSpy.calledThrice).to.be.true

  })

  it('should respond to obseverable Refresh$', () => {

    let refreshSpy = spy(AssetQuantity.prototype, 'refresh')
    let rendered = mount(Component)

    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next(AssetQuantity.key)
    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next('some other key')
    expect(refreshSpy.notCalled).to.be.true

  })

  it('should have an onAssetInfo method, it calls setState()', () => {

    let setStateSpy = spy(AssetQuantity.prototype, 'setState')
    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onAssetInfo' in instance).to.be.true

    let arg = {
      assetNum: 1,
      assetTypeNum: 2,
      assetDeptNum: 3
    }
    instance.onAssetInfo(arg)
    expect(setStateSpy.calledWith({
      assets: 1,
      types: 2,
      departments: 3
    })).to.be.true
  })

})
