
import * as React from 'react'
import * as classname from 'classname'

// const BGImage = require('assets/img/dashboard2-bg.png')

const DEFAULT = {
  transition: 'min-width .5s, min-height .5s, top .5s, left .5s, font-size .5s',
  minHeight: 0,
  minWidth: 0,
  top: 'initial',
  left: 'initial',
}
const COMMON = {
  position: 'absolute',
  zIndex: 999999,
  minWidth: '100vw',
  minHeight: '100vh',
  top: 0,
  left: 0,
  padding: '1em',
  background: `url(${require('assets/img/dashboard2-bg.png')})`,
  backgroundSize: 'cover',
  backgroundColor: '#1C1E22',
}

interface Props {
  enabled?: boolean,
  style?: object,
  className?: string,
  [prop: string]: any,
}

export default class Fullsize extends React.PureComponent<Props, any> {

  static defaultProps = {
    enabled: false,
    style: {},
    className: '',
  }

  _ref

  componentWillReceiveProps(nextProps) {
    if (this.props.enabled !== nextProps.enabled) {
      setTimeout(() => {
        window.dispatchEvent(new Event('resize-custom'))
      }, 0)
    }
  }

  render() {
    let { style, enabled, className, children } = this.props
    let appliedStyles = enabled ? {...COMMON, ...style} : style

    return (
      <div className="fullsize-placeholder" ref={ref => this._ref = ref}>
        <div
          className={classname(className, 'fullsize', enabled && 'fullsize-enabled')}
          style={{ ...DEFAULT, ...appliedStyles }}
        >
          { children }
        </div>
      </div>
    )
  }

}
