import React from 'react'
import ReactDOM from 'react-dom'
import { debounce } from 'lodash-es'

export interface BoundingClientRect {

  width: number,
  height: number,
  left: number,
  right: number,
  top: number,
  bottom: number,

}

export default
Target => class Composed extends React.Component {

  state: BoundingClientRect = {
    width: 0,
    height: 0,
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  }

  calcRect = debounce(() => {
    let node: Element = ReactDOM.findDOMNode(this) as Element

    // ! to get correct client rect, have to remove all children
    // then append them back after the calculation !
    let children: any[] = []
    while (node.firstChild) {
      children.push(node.removeChild(node.firstChild!))
    }
    setTimeout(() => {
      const rect = node.getBoundingClientRect()
      children.forEach(e => node.appendChild(e))

      this.setState({
        width: rect.width,
        height: rect.height,
        left: rect.left,
        right: rect.right,
        top: rect.top,
        bottom: rect.bottom,
      })
    }, 1500)

  }, 200)

  componentDidMount() {
    setTimeout(() => this.calcRect())
    window.addEventListener('resize', this.calcRect)
    window.addEventListener('resize-custom', this.calcRect)
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.calcRect)
    window.removeEventListener('resize-custom', this.calcRect)
  }

  render() {
    return <Target {...this.props} clientRect={{...this.state}}/>
  }

}
