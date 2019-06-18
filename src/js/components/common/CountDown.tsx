import React from 'react'
import { noop } from 'noru-utils/lib'

interface Props {
  from: number,
  interval?: number,
  onFinish?: () => void,
}

interface State {
  current: number
}
export default class CountDown extends React.Component<Props, State> {

  static defaultProps = {
    interval: 1000,
    onFinish: noop,
  }

  constructor(props) {
    super(props)
    this.state = {
      current: this.props.from,
    }
  }

  componentDidMount() {
    let intervalId = setInterval(() => {
      let { current } = this.state
      if (this.state.current <= 0) {
        clearInterval(intervalId)
        this.props.onFinish!()
      } else {
        this.setState({ current: current - 1})
      }
    }, this.props.interval)
  }

  render() {
    return <span>{this.state.current}</span>
  }
}