import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import { MaintenanceStatus } from '../../../src/js/components/dashboard/MaintenanceStatus'
import { Refresh$ } from '../../../src/js/observables/index'

describe('MaintenanceStatus.tsx', () => {

  let Component
  let setStateSpy = spy(MaintenanceStatus.prototype, 'setState')
  beforeEach(() => {
    Component = <MaintenanceStatus t={mockT}/>
  })

  it('can be rendered correctly', () => {

    let rendered = shallow(Component)
    let root = rendered.find('.maintenance-status')
    expect(root.exists()).to.be.true
    expect(root.find('> div')).to.have.length(2)

    let cols = rendered.find('.columns .column')
    expect(cols).to.have.length(2)

    let status = rendered.find('.status-overview > div')
    expect(status).to.have.length(2)

    let table = rendered.find('Table')
    expect(table.exists()).to.be.true
  })

  it('chart title should respond to click event', () => {

    let configSpy = spy(MaintenanceStatus.prototype, 'config')
    let rendered = shallow(Component)
    let titles = rendered.find('.chart-title')

    titles.first().simulate('click')
    expect(configSpy.calledOnce).to.be.true

  })

  it('should have an onRS method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onRS' in instance).to.be.true

    let arg = {
      data: [],
      total: 1,
      skip: 2,
      top: 3,
    }
    instance.onRS(arg)
    expect(setStateSpy.calledWith({ ...arg })).to.be.true
  })

  it('should have an onRN method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onRN' in instance).to.be.true

    let count = {
      assetOn: 1,
      assetoff: 2,
    }
    instance.onRN(count)
    expect(setStateSpy.calledWith({ count })).to.be.true
  })

  it('should respond to obseverable Refresh$', () => {

    let refreshSpy = spy(MaintenanceStatus.prototype, 'refresh')
    let rendered = mount(Component)

    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next(MaintenanceStatus.key)
    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next('some other key')
    expect(refreshSpy.notCalled).to.be.true

  })

  it('should render content correctly', () => {

    let rendered = mount(Component)
    rendered.setState({
      count: {
        assetOn: 1,
        assetOff: 2,
      },
      data: [
        {
          assetName: 'a',
          currentPerson: 'batman',
        },
        {
          assetName: 'b',
          currentPerson: 'superman',
        },
      ],
      skip: 0,
      total: 100,
      top: 2,
    })

    expect(rendered.find('p.normal-number').at(0).text()).to.eq('1')
    expect(rendered.find('p.normal-number').at(1).text()).to.eq('2')

    expect(rendered.find('tbody tr')).to.have.length(2)

    expect(rendered.find('RangeIndicator').exists()).to.be.true

  })

})
