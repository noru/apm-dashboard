import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import { MaintenancePlan } from '../../../src/js/components/dashboard/MaintenancePlan'
import { Refresh$ } from '../../../src/js/observables/index'
import BigCalendar from 'react-big-calendar'

describe('MaintenancePlan.tsx', () => {

  let Component
  let setStateSpy = spy(MaintenancePlan.prototype, 'setState')
  beforeEach(() => {
    Component = <MaintenancePlan t={mockT}/>
  })

  it('can be rendered correctly', () => {

    let rendered = shallow(Component)
    let root = rendered.find('.maintenance-plan')
    expect(root.exists()).to.be.true
    expect(root.find('> div')).to.have.length(2)

    let cols = rendered.find('.columns .column')
    expect(cols).to.have.length(2)
    expect(rendered.find(BigCalendar)).to.have.length(1)
    let IPO = {
      ins: 1,
      quality: 2,
      pm: 3
    }
    rendered.setState({ IPO })
    let numbers = rendered.find('nav.plan-overview .small-text')
    expect(numbers).to.have.length(3)

  })

  it('chart title should respond to click event', () => {

    let configSpy = spy(MaintenancePlan.prototype, 'config')
    let rendered = shallow(Component)
    let titles = rendered.find('.chart-title')

    titles.first().simulate('click')
    expect(configSpy.calledOnce).to.be.true

  })

  it('should have an onIpl method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onIpl' in instance).to.be.true

    let arg = []
    instance.onIpl(arg)
    expect(setStateSpy.calledWith({ IPL: arg })).to.be.true
  })

  it('should have an onIpo method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onIpo' in instance).to.be.true

    let arg = {
      ins: 0,
      quality: 0,
      metering: 0,
      pm: 0
    }
    instance.onIpo(arg)
    expect(setStateSpy.calledWith({ IPO: arg })).to.be.true
  })

  it('should respond to obseverable Refresh$', () => {

    let refreshSpy = spy(MaintenancePlan.prototype, 'refresh')
    let rendered = mount(Component)

    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next(MaintenancePlan.key)
    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next('some other key')
    expect(refreshSpy.notCalled).to.be.true

  })

})
