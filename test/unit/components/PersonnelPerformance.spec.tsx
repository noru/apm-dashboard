import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import { PersonnelPerformance } from '../../../src/js/components/dashboard/PersonnelPerformance'
import { Refresh$ } from '../../../src/js/observables/index'
import * as ifv from 'ifvisible.js'

describe('PersonnelPerformance.tsx', () => {

  let Component, ifvStub
  let setStateSpy = spy(PersonnelPerformance.prototype, 'setState')
  beforeEach(() => {
    Component = <PersonnelPerformance t={mockT}/>
    ifvStub = stub(ifv, 'now')
    ifvStub.returns(false)
  })

  afterEach(() => {
    ifvStub.restore()
  })

  it('can be rendered', () => {

    let rendered = shallow(Component)
    let root = rendered.find('.personnel-performance')
    expect(root.exists()).to.be.true
    expect(root.find('.legend').exists()).to.be.true

  })

  it('chart title should respond to click event', () => {

    let configSpy = spy(PersonnelPerformance.prototype, 'config')
    let rendered = shallow(Component)
    let titles = rendered.find('.chart-title')

    titles.first().simulate('click')
    expect(configSpy.calledOnce).to.be.true

  })

  it('should have an onPP method, it calls setState()', () => {

    let rendered = shallow(Component)
    let instance = rendered.instance()
    expect('onPP' in instance).to.be.true

    let arg = {
      data: []
    }
    instance.onPP(arg)

    expect(setStateSpy.calledWith({ data: arg.data })).to.be.true
  })

  it('should respond to obseverable Refresh$', () => {

    let refreshSpy = spy(PersonnelPerformance.prototype, 'refresh')
    let rendered = mount(Component)

    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next(PersonnelPerformance.key)
    expect(refreshSpy.calledOnce).to.be.true

    refreshSpy.reset()
    Refresh$.next('some other key')
    expect(refreshSpy.notCalled).to.be.true

  })

  it('should render content correctly', () => {

    let rendered = mount(Component)
    rendered.setState({
      data: [
        {
          closedNum: 1,
          openNum: 2,
          userId: 0,
          userName: 'a',
          workNum: 3
        },
        {
          closedNum: 4,
          openNum: 5,
          userId: 6,
          userName: 'b',
          workNum: 7
        }
      ]
    })
    let items = rendered.find('.line-item')
    expect(items).to.have.length(2)
    let first = items.at(0)
    expect(first.find('.user-name').text()).to.eq('a')
    expect(first.find('.work-num').text()).to.eq('3%')
    expect(first.find('.closed-num').text()).to.eq('1')
    expect(first.find('.open-num').text()).to.eq('2')
    let progresses = first.find('progress')
    expect(progresses).to.have.length(2)

    expect(progresses.at(0).prop('value')).to.eq(3)
    expect(progresses.at(1).prop('value')).to.eq(1)

  })

})
