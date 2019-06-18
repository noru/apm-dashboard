import React, { Component } from 'react'
import { findDOMNode } from 'react-dom'
import { DragSource, DropTarget } from 'react-dnd'
import { throttle } from 'lodash-es'
import { isBetween } from 'noru-utils/lib/number'

const ItemTypes = {
  CARD: 'card',
}

const cardSource = {
  beginDrag(props) {
    return {
      id: props.id,
      index: props.index,
    }
  },
  endDrag(props, monitor) {
    const didDrop = monitor.didDrop()

    if (!didDrop) {
      props.restore()
    }
  },
}

const cardTarget = {

  drop(props, monitor, component) {
    const dragIndex = monitor.getItem().index
    const hoverIndex = props.index
    const { top, bottom, left, right } = findDOMNode(component)!.getBoundingClientRect()
    const { x, y } = monitor.getClientOffset()

    if (!isBetween(x, left, right) || !isBetween(y, top, bottom)) {
      return
    }
    props.swapCard(dragIndex, hoverIndex)
    monitor.getItem().index = hoverIndex
  },

  hover: throttle((props, monitor, component) => {
    let draggedItem = monitor.getItem()
    if (draggedItem === null) {
      return
    }
    const { index: draggedIndex, id: draggedId } = draggedItem
    const { index: hoverIndex, id: hoverId } = props

    if (draggedId === hoverId || draggedIndex[0] === hoverIndex[0]) {
      return // do nothing if it's itself or on the same column
    }

    const { top, bottom, left, right, height} = findDOMNode(component)!.getBoundingClientRect()
    const { x, y } = monitor.getClientOffset()
    let edge = height / 4
    if (!isBetween(x, left, right) || !isBetween(y, top, bottom)) {
      return
    }
    if (isBetween(y, top, top + edge)) {
      props.insertPlaceholder(hoverIndex, 0)
    }
    if (isBetween(y, bottom - edge, bottom)) {
      props.insertPlaceholder(hoverIndex, 1)
    }
  }, 1000),
}

const backupTarget = {
  drop(props, monitor) {
    const dragIndex = monitor.getItem().index
    if (dragIndex[0] !== 3) {
      props.removeCard(dragIndex)
    }
  },
}

@DropTarget(ItemTypes.CARD, cardTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
}))
@DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))
export default class Card extends Component<any, any> {

  render() {
    let {
      text,
      isDragging,
      isOver,
      connectDragSource,
      connectDropTarget,
    } = this.props
    let opacity = isDragging ? 0.5 : 1
    let hoverStyle = isOver ? {
      backgroundColor: '#054f6b',
      border: '1px dashed gray',
    } : {}

    return connectDragSource(
      connectDropTarget(
        <div className="component-card" style={{ opacity, ...hoverStyle }} >{text}</div>,
      ),
    )
  }
}

@DropTarget(ItemTypes.CARD, backupTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver({ shallow: true }),
}))
// tslint:disable-next-line:max-classes-per-file
export class BackupArea extends React.Component<any, any> {

  render() {
    let { children, connectDropTarget, isOver } = this.props
    let hoverStyle = isOver ? {
      backgroundColor: '#111',
    } : {}
    return connectDropTarget(
      <div className="backup-cards" style={hoverStyle}>
        {children}
      </div>,
    )
  }
}
