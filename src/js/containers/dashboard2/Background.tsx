import * as React from 'react'
import * as classname from 'classname'
import Fullsize from 'components/common/Fullsize'
import './Background.scss'

interface Props {
  children: any,
  className: string,
  fullSize?: boolean,
  style?: any,
}
export default function({ children, className, fullSize = false, style = {} }: Props) {
  return (
    <Fullsize className={classname('chart-background-2', className)} enabled={fullSize} style={style}>
      { children }
    </Fullsize>
  )
}