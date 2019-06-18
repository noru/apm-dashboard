import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import Modal from 'react-modal'
import config from '../../../src/js/utils/config'
import { TimeConfigModal } from '../../../src/js/components/dashboard/TimeConfigModal'
import { TimeConfig$ } from '../../../src/js/observables/index'

/*
   BE WARE: react-modal render its children on the <body />, not in-place
  verification should involve DOM operations
*/
describe('TimeConfigModal.tsx', () => {

  let Component, configStub
  function removeRoot() {
    let modal = document.querySelector('.ReactModalPortal')
    document.body.removeChild(modal!)
  }
  beforeEach(() => {
    Component = <TimeConfigModal t={mockT}/>
    configStub = stub(config, 'get')
    configStub.returns({
      interval: 100,
      intervalPerPage: 50,
      rangeInterval: [1, 2],
      rangeIntervalPerPage: [3, 4],
    })
  })
  afterEach(() => {
    configStub.restore()
  })

  it('can be rendered', () => {

    let rendered = mount(Component)
    let modal = rendered.find(Modal)
    expect(modal.exists()).to.be.true
    expect(modal.prop('isOpen')).to.be.false

    rendered.setState({ open: true })
    // modal content is mount somewhere else, not as children
    let button = document.querySelector('button.ok-button')
    expect(button).to.not.be.null

    removeRoot()
  })

  it('should respond to obseverable TimeConfig$', () => {

    let onTimeConfigSpy = spy(TimeConfigModal.prototype, 'onTimeConfig')
    let rendered = mount(Component)

    expect(onTimeConfigSpy.notCalled).to.be.true

    TimeConfig$.next('key')
    expect(onTimeConfigSpy.calledTwice).to.be.true
    expect(rendered.state().open).to.be.true

    removeRoot()
  })

  it('should be able to show error message', () => {

    let rendered = mount(Component)
    let message = {
      msg1: 'some error',
      msg2: 'other error',
    }
    rendered.setState({ open: true, message })
    let div = document.querySelector('.error-messages')
    expect(div).to.not.be.null
    let msgs = div!.querySelectorAll('p')
    expect(msgs).to.have.length(2)

    removeRoot()
  })

  it('should hide intervalPerPage field for non-paging config', () => {

    let rendered = mount(Component)
    rendered.setState({ open: true, intervalPerPage: undefined })
    let input = document.querySelector('input[name=intervalPerPage]')
    expect(input).to.be.null

    rendered.setState({ intervalPerPage: 2000 })
    input = document.querySelector('input[name=intervalPerPage]')
    expect(input).to.not.be.null

    removeRoot()
  })

  it ('should call saveConfig() when ok button got clicked', () => {

    let rendered = mount(Component)
    rendered.setState({ open: true })

    let click = document.createEvent('MouseEvent')
    click.initEvent('click', true, true)
    click['synthetic'] = true
    document.querySelector('button.ok-button')!.dispatchEvent(click)

    expect(rendered.state().open).to.be.false

  })
})
