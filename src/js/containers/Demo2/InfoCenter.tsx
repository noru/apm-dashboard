import React from 'react'
import Animate from 'rc-animate'
import velocity from 'velocity-animate'
import FA from 'react-fontawesome'
import './infoCenter.scss'

const Message = ({ id, color, msg, date }) => {
  let name = 'check-circle'
  if (color === 'yellow') {
    name = 'exclamation-circle'
  }
  if (color === 'red') {
    name = 'times-circle'
  }
  return (
    <div className="message-tile">
      <p>
        <FA style={{color}} name={name}/>
        <span>{id}</span>
      </p>
      <p>
        <FA style={{ visibility: 'hidden' }} name={name}/>
        <span>{msg}</span>
      </p>
      <p>
        <FA style={{ visibility: 'hidden' }} name={name} />
        <span className="date">{date}</span>
      </p>
    </div>
  )
}

export default class InfoCenter extends React.Component<any, any> {

  animEnter(node, done) {
    let ok = false

    function complete() {
      if (!ok) {
        ok = true
        done()
      }
    }
    velocity(node, 'slideDown', {
      duration: 1000,
      complete,
    })
    return {
      stop() {
        velocity(node, 'finish')
        complete()
      },
    }
  }

  animLeave(node, done) {
    let ok = false

    function complete() {
      if (!ok) {
        ok = true
        done()
      }
    }

    velocity(node, 'slideUp', {
      duration: 1000,
      complete,
    })
    return {
      stop() {
        velocity(node, 'finish')
        complete()
      },
    }
  }

  render() {

    let { messages } = this.props
    return (
      <div className="info-center">

        <h1>信息中心</h1>
        <div className="message-wrapper">
          <Animate
            animation={{
              enter: this.animEnter,
              leave: this.animLeave,
            }}
          >
            {
              messages.map((m) => {
                return <Message key={m.key} {...m} />
              })
            }
          </Animate>
        </div>
      </div>
    )
  }
}