import * as React from 'react'
import * as classname from 'classname'
import './Background.scss'

export default function({ children, className }) {
  return (
    <div className={classname('chart-background', className)}>
      { children }
    </div>
  )
}