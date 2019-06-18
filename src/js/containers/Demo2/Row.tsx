import React, { ReactNode } from 'react'
import './row.scss'

export interface Item {
  top: string | ReactNode,
  bottom: string | ReactNode,
}

const Item = ({ top, bottom }) => {
  return (
    <div className="row-item has-text-centered">
      <p>{top}</p>
      <p>{bottom}</p>
    </div>
  )
}

interface Props {
  items: Item[],
}
export default class Row extends React.Component<Props, any> {

  render() {

    let { items } = this.props
    return (
      <div className="demo-row">
        { items.map((i, idx) => <React.Fragment key={idx}>
            <Item top={i.top} bottom={i.bottom}/>
            <div className="separator">|</div>
          </React.Fragment>)
        }
      </div>
    )
  }
}