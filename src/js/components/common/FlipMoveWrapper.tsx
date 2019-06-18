import * as React from 'react'

export default class FlipMoveWrapper extends React.Component<any, any> {
  render() {
    return <div className="flip-move-wrapper" style={{ position: 'relative' }}>{this.props.children}</div>
  }
}