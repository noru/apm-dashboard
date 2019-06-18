import * as React from 'react'
import { render } from 'enzyme'
import { expect } from '.././testHelper'
import Background from '../../../src/js/containers/dashboard/Background'

describe('Background.tsx', () => {

  it('should contain class: chart-background', () => {
    let bg = Background({ children: null, className: undefined})
    let rendered = render(bg)
    let div = rendered.find('div')
    expect(div.hasClass('chart-background')).equal(true)
  })

  it('should contain correct content and classes', () => {
    let bg = Background({
      children: <div>content</div>,
      className: 'custom-class',
    })
    let rendered = render(bg)
    expect(rendered.find('div div').text()).equal('content')
    expect(rendered.find('div').hasClass('custom-class')).to.equal(true)
  })

})
