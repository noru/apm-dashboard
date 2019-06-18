import React from 'react'
import './index.scss'
import logo from 'assets/img/ge_logo.png'
import Tile1 from './Tile1'
import Tile2 from './Tile2'
import Tile3 from './Tile3'
import Tile4 from './Tile4'
import Device from './Device'
import InfoCenter from './InfoCenter'
import TabWrapper from './FakeTabWrapper'
import moment from 'moment'

const DEVICES = [
  {
    id: 'CT33YDSU',
    pic: 'img/demo/CT1.png',
    items: [
      { top: '72%', bottom: '影像存储空间' },
      { top: '正常', bottom: '系统监控状态' },
      { top: '29', bottom: '当日病人量' },
    ],
  },
  {
    id: 'CT853FR53',
    pic: 'img/demo/CT2.png',
    items: [
      { top: '75%', bottom: '影像存储空间' },
      { top: '正常', bottom: '系统监控状态' },
      { top: '21', bottom: '当日病人量' },
    ],
  },
  {
    id: 'CT843GRF',
    pic: 'img/demo/CT3.png',
    items: [
      { top: '69%', bottom: '影像存储空间' },
      { top: '正常', bottom: '系统监控状态' },
      { top: '31', bottom: '当日病人量' },
    ],
  },
  {
    id: 'CT442FGDF',
    pic: 'img/demo/CT4.png',
    items: [
      { top: '69%', bottom: '影像存储空间' },
      { top: '正常', bottom: '系统监控状态' },
      { top: '31', bottom: '当日病人量' },
    ],
  },
  {
    id: 'CT979JJ8SJ',
    pic: 'img/demo/CT5.png',
    items: [
      { top: '正常', bottom: '压缩机状态' },
      { top: '82.77%', bottom: '液氮液面高度' },
      { top: '28', bottom: '当日病人量' },
    ],
  },
  {
    id: '1.5T HDX ECHOSPEED',
    pic: 'img/demo/MR1.png',
    items: [
      { top: '正常', bottom: '压缩机状态' },
      { top: '85.12%', bottom: '液氮液面高度' },
      { top: '17', bottom: '当日病人量' },
    ],
  },
  {
    id: 'Signa HDXT 3.0T',
    pic: 'img/demo/MR2.png',
    items: [
      { top: '正常', bottom: '压缩机状态' },
      { top: '82.77%', bottom: '液氮液面高度' },
      { top: '28', bottom: '当日病人量' },
    ],
  },
  {
    id: 'IGS 1234R4W',
    pic: 'img/demo/IGS1.png',
    items: [
      { top: '99.94%', bottom: '开机保障率' },
      { top: '74%', bottom: '影像存储空间' },
      { top: '9', bottom: '当日病人量' },
    ],
  },
]

const MESSAGES = [
  ['1.5T HDX ECHOSPEED', 'red', '设备因故障停机'],
  ['1.5T HDX ECHOSPEED', 'yellow', '设备即将维修, 维修时间在2018年12月19日'],
  ['1.5T HDX ECHOSPEED', 'green', '维修已完成'],
  ['CT853FR53', 'yellow', '设备即将维修, 维修时间在2018年12月22日'],
  ['CT853FR53', 'green', '维修已完成'],
  ['IGS 1234R4W', 'red', '辐射校准未通过'],
  ['IGS 1234R4W', 'green', '辐射校准通过'],
]
const START_DATE = moment().subtract('1', 'day').startOf('day').add('8', 'hour')
let CURRENT_DATE = START_DATE.clone()
const DATE_FORMAT = 'YYYY年MM月DD日 HH:mm:ss'

export const Header = () => (
  <nav className="demo-header level">
    <div className="level-left">
      <div className="level-item">
        <figure className="image is-48x48">
          <img src={logo} />
        </figure>
      </div>
      <div className="level-item">某某资产云管家</div>
    </div>
  </nav>
)

export class Demo2 extends React.Component<any, any> {

  state = {
    deviceColor: {},
    messages: new Array,
  }
  id: any = 0
  componentDidMount() {
    this.generateMsg()
  }

  componentWillUnmount() {
    clearTimeout(this.id)
  }

  generateMsg() {
    this.id = setTimeout(() => {
      let { messages, deviceColor } = this.state
      if (messages.length >= 5) {
        messages.length = 4
      }
      let msgSample = MESSAGES[0]
      MESSAGES.push(MESSAGES.shift()!)
      let newMsg = {
        id: msgSample[0],
        key: Math.random(),
        msg: msgSample[2],
        color: msgSample[1],
        date: CURRENT_DATE.add(30, 'minutes').format(DATE_FORMAT),
      }
      if (CURRENT_DATE.isAfter(moment())) {
        CURRENT_DATE.subtract(1, 'day')
      }
      deviceColor[newMsg.id] = newMsg.color
      messages.unshift(newMsg)
      this.setState({ messages, deviceColor })
      this.generateMsg()
    }, 5 * 1000)
  }

  render() {
    let { deviceColor, messages } = this.state

    return (
      <div className="demo">
        {/* <Header /> */}
        <div className="row1">
          <Tile1 title="总收入" initNumber={637870} precent={3.1} stepRange={[8000, 10000]} interval={[10, 10]}/>
          <Tile1 title="总维修费用" initNumber={17890} precent={-3.1} stepRange={[600, 900]} interval={[10, 10]}/>
          <Tile1 title="总保养费用" initNumber={27890} precent={4.5} stepRange={[600, 900]} interval={[10, 10]}/>
          <Tile3 precent={97.34} low={93.35} high={99.94}/>
          <Tile4 items={[
            { name: 'CT', count: 52 },
            { name: 'MR', count: 78 },
            { name: 'CT', count: 34 },
          ]}/>
          <Tile2 number1={12637847} number2={29838}/>
        </div>

        <div className="row2">

          <div className="devices">
            {
              DEVICES.map(d => (
                <Device key={d.id} id={d.id} pic={d.pic} items={d.items} color={deviceColor[d.id]}/>
              ))
            }
          </div>

          <InfoCenter messages={messages}/>
        </div>
      </div>
    )
  }
}

export default TabWrapper('2')(Demo2)