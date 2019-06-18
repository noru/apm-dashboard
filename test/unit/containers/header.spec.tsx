import * as React from 'react'
import { render, shallow } from 'enzyme'
import * as sinon from 'sinon'
import { expect, mockT } from '.././testHelper'
import { Header } from '../../../src/js/containers/dashboard/Header'

describe('Header.tsx', () => {

  let identity = i => i
  let pushSpy = sinon.spy(identity)
  let mockHistory = { push: pushSpy }

  let header

  beforeEach(() => {
    header = Header({ hospitalName: 'seattle grace hospital', t: mockT, history: mockHistory, style: {} })
  })

  it('can be rendered', () => {

    let rendered = shallow(header)
    let nav = rendered.find('nav')
    expect(nav).to.have.length(1)
    expect(nav.hasClass('app-header')).to.be.true

  })

  it('should have logo & title & hospital name', () => {

    let rendered = shallow(header)
    let logo = rendered.find('img')
    expect(logo).to.have.length(1)
    expect(logo.prop('src')).is.not.undefined

    let title = rendered.find('div.app-title')
    expect(title.text()).eq('app_title')

    let hospital = rendered.find('.hospital-name')
    expect(hospital.text()).eq('seattle grace hospital')

  })

  it('should redirect to /login after logout', () => {

    let confirmStub = sinon.stub(global, 'confirm')
    confirmStub.returns(true)

    let rendered = shallow(header)
    rendered.find('a').simulate('click')

    expect(confirmStub.calledOnce).to.eq(true)
    expect(pushSpy.calledWith('/login')).to.be.true

  })

})