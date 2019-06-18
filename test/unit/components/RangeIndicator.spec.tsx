import * as React from 'react'
import { shallow, mount } from 'enzyme'
import { expect, mockT } from '../testHelper'
import { stub, spy } from 'sinon'
import config from '../../../src/js/utils/config'
import RangeIndicator from '../../../src/js/components/dashboard/RangeIndicator'
import { Refresh$, AssetInfo } from '../../../src/js/observables/index'

describe('AssetQuantity.tsx', () => {

  it('can be rendered', () => {

    let Component = <RangeIndicator end={10}/>
    let rendered = shallow(Component)
    let div = rendered.find('div.scroll-bar')
    expect(div.exists()).to.be.true

  })

  it('should throw error if end > start', () => {

    let Component = <RangeIndicator start={10} end={5} />

    expect(() => {
      shallow(Component)
    }).to.throw()

  })

  it('should override end with base if end > base', () => {

    let Component = <RangeIndicator start={2} end={6} base={5} />
    let rendered = shallow(Component)
    let style = rendered.find('.graduation').prop('style')
    expect(style.width).to.eq('60%')
    expect(style.marginLeft).to.eq('40%')

  })

  it('should render bgColor', () => {

    let Component = <RangeIndicator end={6} bgColor="#fff" />
    let rendered = shallow(Component)
    let style = rendered.find('.scroll-bar').prop('style')
    expect(style.backgroundColor).to.eq('#fff')

  })

})
