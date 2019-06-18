import * as React from 'react'
import './RangeIndicator.scss'

interface Props {
  start?: number,
  end: number,
  base?: number,
  color?: string,
  bgColor?: string
}

export default function RangeIndicator({ end, start = 0, base = 100, color, bgColor }: Props) {

  if (start > end) {
    throw Error('"start" must not larger than "end"')
  }
  end = end > base ? base : end
  start = start < 0 ? 0 : start
  if (base !== 100) {
    start = (start / base) * 100
    end = (end / base) * 100
  }
  let width = (end - start) + '%'
  let marginLeft = start + '%'
  return (
    <div className="scroll-bar" style={{ backgroundColor: bgColor }}>
      <div className="graduation" style={{ width, marginLeft, backgroundColor: color }}></div>
    </div>
  )

}