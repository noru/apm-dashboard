import * as React from 'react'
import { Modal } from 'antd'
import { translate } from 'react-i18next'
import { TimeConfig$, Refresh$ } from 'observables/index'
import config, { DEFAULT } from 'utils/config'
import { toMin, toSec } from 'utils/helpers'
import { inRange } from 'lodash-es'
import './TimeConfigModal.scss'

type Key =
  'asset-quantity'
  | 'asset-index'
  | 'maintenance-status'
  | 'maintenance-plan'
  | 'personnel-performance'
  | undefined

interface State {
  key: Key,
  open: boolean,
  interval: number,
  rangeInterval?: number[],
  intervalPerPage?: number,
  rangeIntervalPerPage?: number[],
  month: number,
  message: any,
  validators: any,
}

function InRange(value, range) {
  return inRange(value, range[0], range[1])
}

export class TimeConfigModal extends React.PureComponent<any, State> {

  state: State = {
    open: false,
    key: undefined,
    interval: 0,
    intervalPerPage: undefined,
    message: {},
    month: 1,
    validators: {
      interval(v) {
        let { t } = this.props
        let formatter = num => toMin(num) + t`unit_min`
        let range = DEFAULT[this.state.key].rangeInterval
        let msg = t('interval_not_in_range', { name: t`request_interval` })
          + ': ' + this._localizeRange(range, formatter)
        return {
          pass: InRange(v * 60000, range),
          msg,
        }
      },
      intervalPerPage(v) {
        let  { t } =  this.props
        let formatter = num => toSec(num) + t`unit_sec`
        let range = DEFAULT[this.state.key].rangeIntervalPerPage
        let msg = t('interval_not_in_range', { name: t`page_interval` })
          + ': ' + this._localizeRange(range, formatter)
        return {
          pass: InRange(v * 1000, range),
          msg,
        }
      },
    },
  }

  saveConfig = evt => {

    if (evt.target.hasAttribute('disabled')) {
      return
    }

    let { key, interval, intervalPerPage, month } = this.state

    if (key! in DEFAULT) {
      interval *= 60000
      if (intervalPerPage) {
        intervalPerPage *= 1000
      }
      config.set(key!, { interval, intervalPerPage, month })
      Refresh$.next(key)
    }

    this.setState({ open: false })
  }

  onTimeConfig(key: Key) {

    let { interval, intervalPerPage, rangeInterval, rangeIntervalPerPage, month } = config.get(key!)
    this.setState({
      key, open: true,
      interval: toMin(interval) || 0,
      intervalPerPage: toSec(intervalPerPage!),
      rangeInterval,
      rangeIntervalPerPage,
      month,
      message: {},
    })

  }

  onChange = (event) => {

    let { message } = this.state
    let target = event.target
    let value = target.value
    let name = target.name

    let validator = this.state.validators[name]
    if (validator) {
      let validationResult = this.state.validators[name].call(this, value)
      if (validationResult.pass) {
        delete message[name]
      } else {
        message[name] = validationResult.msg
      }
    }
    this.setState({ message, [name]: value } as any)
  }

  componentDidMount() {
    TimeConfig$.subscribe(key => this.onTimeConfig(key as Key))
  }

  render() {

    let { t } = this.props
    let { open, interval, intervalPerPage, message, month } = this.state
    let hasError = Object.keys(message).length > 0

    return (
      <Modal
        visible={open}
        className="config-modal"
        onCancel={() => this.setState({ open: false })}
        onOk={this.saveConfig}
      >

        <div className="field is-horizontal">
          <div className="field-label is-normal nowrap">
            <label className="label">{t`request_interval`}</label>
          </div>
          <div className="field-body">
            <div className="field has-addons">
              <p className="control is-expended">
                <input className="input" type="number" name= "interval"
                  value={interval} onChange={this.onChange}/>
              </p>
              <p className="control">
                <a className="button is-static">{t`unit_min`}</a>
              </p>
            </div>
          </div>
        </div>

        { intervalPerPage !== undefined &&

          <div className="field is-horizontal">
            <div className="field-label is-normal nowrap">
              <label className="label">{t`page_interval`}</label>
            </div>
            <div className="field-body">
              <div className="field has-addons">
                <p className="control is-expended">
                  <input className="input" type="number" name="intervalPerPage"
                    value={intervalPerPage} onChange={this.onChange} />
                </p>
                <p className="control">
                  <a className="button is-static">{t`unit_sec`}</a>
                </p>
              </div>
            </div>
          </div>
        }

        { month !== undefined &&

          <div className="field is-horizontal">
            <div className="field-label is-normal nowrap">
              <label className="label">{t`period_selection`}</label>
            </div>
            <div className="field-body">
              <div className="field">
                <div className="select is-fullwidth">
                  <select name="month" value={month} onChange={this.onChange}>
                    <option value="1">{t('1_month')}</option>
                    <option value="3">{t('3_month')}</option>
                    <option value="6">{t('6_month')}</option>
                    <option value="12">{t('12_month')}</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

        }

        { hasError &&
          <div className="error-messages notification is-danger">{
            Object.keys(message).map(key => <p key={key}>{message[key]}</p>)
          }</div>
        }

      </Modal>
    )
  }

  _localizeRange(range: number[], formatter: (x: number) => string = x => String(x) ): string {

    let { t } = this.props
    if (range[0] === -Infinity) {
      return t('under_x', { num: formatter(range[1]) })
    }
    if (range[1] === Infinity) {
      return t('above_x', { num: formatter(range[0]) })
    }
    return t('in_range', { num1: formatter(range[0]), num2: formatter(range[1]) })
  }
}

export default translate(['common', 'dashboard'])(TimeConfigModal)