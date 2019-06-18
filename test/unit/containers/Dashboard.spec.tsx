import * as React from 'react'
import { expect, mockT, ComponentMockHelper } from '../testHelper'
import { Auth$ } from '../../../src/js/observables'
import { shallow, mount, render } from 'enzyme'
import { stub, spy } from 'sinon'
import mock = require('mock-require')

let getStub = stub()
function resetGetStub() {
  getStub.withArgs('hc-apm-token').returns('I am a token')
  getStub.withArgs('hc-apm-token-expireAt').returns(Date.now() + 10000)
}
mock('lscache', { get: getStub, setBucket: () => undefined })

describe('Dashboard.tsx', () => {

  let Dashboard

  after(() => {
    mock.stopAll()
  })

  beforeEach(() => {
    mock('react-i18next', { translate: () => ComponentMockHelper })
    Dashboard = require('../../../src/js/containers/dashboard/Dashboard').Dashboard
    resetGetStub()
  })

  it('can be rendered', () => {

    let dashboard = <Dashboard t={mockT} history={{ push: () => undefined }} />
    let rendered = mount(dashboard)
    let header = rendered.find('.app-header')
    expect(header).to.have.length(1)
    let aq = rendered.find('.asset-quantity')
    expect(aq).to.have.length(1)
    let ca = rendered.find('.crutial-assets')
    expect(ca).to.have.length(1)
    let ms = rendered.find('.maintenance-status')
    expect(ms).to.have.length(1)
    let mp = rendered.find('.maintenance-plan')
    expect(mp).to.have.length(1)
    let pp = rendered.find('.personnel-performance')
    expect(pp).to.have.length(1)
    let tcm = rendered.find('TimeConfigModal')
    expect(tcm).to.have.length(1)

  })

  /** commented this test case. implement new cases with standalone mode on/off */
  // it('should set global font-size, unset after unmount', () => {

  //   let dashboard = <Dashboard t={mockT} history={{ push: () => undefined }} />
  //   let rendered = mount(dashboard)

  //   let style = document.querySelector('html')!.getAttribute('style')
  //   expect(style).contains('font-size:')
  //   expect(style).contains('overflow:hidden')

  //   unmount(rendered)
  //   style = document.querySelector('html')!.getAttribute('style')
  //   expect(style).to.be.null

  // })

  it('should attach "resize" listener, remove it after unmount', () => {

    let addSpy = spy(window, 'addEventListener')
    let removeSpy = spy(window, 'removeEventListener')
    let dashboard = <Dashboard t={mockT} history={{ push: () => undefined }} />
    let rendered = mount(dashboard)

    expect(addSpy.calledWith('resize')).to.be.true

    unmount(rendered)

    expect(removeSpy.calledWith('resize')).to.be.true

  })

  it('should refresh token after mounted', () => {

    let refreshSpy = spy(Dashboard.prototype, 'refreshToken')
    let dashboard = <Dashboard t={mockT} history={{ push: () => undefined }} />
    let rendered = mount(dashboard)

    expect(refreshSpy.called).to.be.true

  })

  it('should call Auth$ subject to invoke toke refreshment', () => {

    let authSpy = spy(Auth$, 'next')
    let dashboard = <Dashboard t={mockT} history={{ push: () => undefined }} />
    mount(dashboard)

    expect(authSpy.calledOnce).to.be.true

  })

  // describe('static methods', () => {

  //   it ('detects query parameter "animation=false"', () => {

  //     expect(isAnimationDisabled()).to.be.false

  //     location.search = '?animation=false'
  //     expect(isAnimationDisabled()).to.be.true

  //     location.search = ''
  //     location.hash = '#/animation=false'
  //     expect(isAnimationDisabled()).to.be.true

  //   })

  // })

})

function unmount(wrapper) {
  try {
    wrapper.unmount()
  } catch (e) {
    // to get around Invariant Violation Error
    // https://github.com/airbnb/enzyme/issues/395
  }
}