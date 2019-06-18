import React from 'react'
import { isMobile } from 'noru-utils/lib/env'
import { DragDropContext } from 'react-dnd'
import HTML5Backend from 'react-dnd-html5-backend'
import TouchBackend from 'react-dnd-touch-backend'
import Layout from 'containers/common/Layout'
import Card, { BackupArea } from './Cards'
import { remove } from 'lodash-es'
import FA from 'react-fontawesome'
import { translate } from 'react-i18next'
import { deepMap } from 'noru-utils/lib/array'
import { recursiveCopy, swap } from 'noru-utils/lib'
import { message } from 'antd'

@translate()
@DragDropContext(isMobile.any() ? TouchBackend({ enableMouseEvents: true }) : HTML5Backend)
export default class DnDArea extends React.PureComponent<any, any> {

  state = {
    initialCards: new Array,
    initialFlyby: '',
    cards: new Array,
    flyby: '',
  }

  componentDidMount() {

    let { layout, flyby } = this.props
    this.setState({
      initialCards: layout,
      cards: recursiveCopy(layout),
      flyby,
      initialFly: flyby,
    })
  }

  flybyChange = e => {
    let flyby = e.target.value
    this.setState({ flyby })
    this.props.onFlybyChange(flyby)
  }

  removeCard = ([pos1, pos2]) => {
    let { cards } = this.state
    if (pos2 !== 3 && cards[pos1].length === 1) {
      message.warn(this.props.t`error.remove_last`)
      return
    }
    let [ val ] = cards[pos1].splice(pos2, 1)
    cards[3].push(val)
    cards = new Array().concat(cards)
    this.setState({ cards }, () => this.props.onLayoutChange(cards))
  }

  swapCard = (dragIndex, hoverIndex) => {
    let { cards } = this.state
    swap(cards, hoverIndex, dragIndex)
    cards = new Array().concat(cards)
    this.removePlaceholder(cards)
    this.setState({ cards }, () => { this.props.onLayoutChange(cards) })
  }

  insertPlaceholder = (hoverIndex, offset) => {
    let { cards } = this.state
    if (cards[hoverIndex[0]].length === 4) {
      message.destroy() // hover is called too frequently
      message.warn(this.props.t`error.at_most_4`)
      return
    }
    this.removePlaceholder(cards)
    cards[hoverIndex[0]].splice(hoverIndex[1] + offset, 0, { key: 'placeholder' })
    cards = new Array().concat(cards)
    this.setState({ cards }, () => this.props.onLayoutChange(cards))
  }

  restoreCard = () => {
    this.setState({ cards: recursiveCopy(this.state.initialCards) })
  }

  removePlaceholder = (cards) => {
    cards.forEach(column => {
      remove(column, row => row.key === 'placeholder')
    })
  }

  config2Card = ({ key, title }, pos) =>
    <Card
      key={key}
      id={key}
      index={pos}
      text={title}
      swapCard={this.swapCard}
      insertPlaceholder={this.insertPlaceholder}
      restore={this.restoreCard}
    />

  render() {
    const { cards, flyby } = this.state
    let layoutConfig = deepMap(cards, this.config2Card)
    return (
      <div className="dnd-area columns">
        <div className="fake-monitor column is-three-quarters">
          <div className="header-area">
            <input
              className="flyby-text-input"
              type="text"
              value={flyby}
              onChange={this.flybyChange}
            />
            <a onClick={this.restoreCard}>
              <FA name="refresh" />
            </a>
          </div>
          <Layout config={layoutConfig.slice(0, 3)} />
        </div>
        <div className="column">
          <h2><FA name="exchange" /></h2>
          <BackupArea removeCard={this.removeCard}>
            { layoutConfig[3] }
          </BackupArea>
        </div>
      </div>
    )
  }
}
