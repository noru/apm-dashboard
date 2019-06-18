import * as React from 'react'
import classname from 'classname'
import './Layout.scss'

interface Props {
  config: any[],
  [prop: string]: any,
}

export default class DashboardLayout extends React.PureComponent<Props, any> {

  render() {

    let { style, className, config } = this.props

    return (
      <div className={classname('dashboard-layout', className)} style={style} >
        <div className="columns">

          {
            config.map((colConfig, i) => {
              return <Column key={i} config={colConfig} className={`column-${i}`} />
            })
          }

        </div>

      </div>
    )
  }

}

function Column({ config, className }) {
  return (
    <div className={classname('column', className)}>
      <div className="row-container">
        {
          config.map((c, i) => {
            return React.cloneElement(c, { key: i, className: `row-${i}` })
          })
        }
      </div>
    </div>
  )
}
