import React from 'react'
import { Form } from 'antd'
import { translate } from 'react-i18next'
import { toMin, toSec } from 'utils/helpers'
import { apply, isBetween } from 'noru-utils/lib'
import { ConfigItem } from 'src/js/utils/config'
const FormItem = Form.Item

export class IntervalForm extends React.PureComponent<any, any> {

  render() {

    let { t, form,
      config: { interval, rangeInterval, intervalPerPage, rangeIntervalPerPage, ...others },
    } = this.props
    const { getFieldDecorator } = form

    return (
      <Form className="interval-config-form" >
        <FormItem label={t`request_interval`}>
          {getFieldDecorator('interval', {
            initialValue: toMin(interval),
            rules: [
              { required: true, message: t`msg.err.required`},
              { validator: (_rule, value, cb) => {
                let [low, high] = rangeInterval
                let msg
                if (!isBetween(+value * 60000, low || -Infinity, high || Infinity)) {
                  msg = t('interval_not_in_range', { name: t`request_interval` })
                    + ': ' + this._localizeRange(rangeInterval, num => toMin(num) + t`unit_min`)
                }
                cb(msg)
              }},
            ],
          })
          (
            <input className="material-input dark is-fullwidth" type="number" />,
          )}
          <span>{t`unit_min`}</span>
        </FormItem>

        { intervalPerPage &&
          <FormItem label={t`page_interval`}>
            {getFieldDecorator('intervalPerPage', {
              initialValue: toSec(intervalPerPage),
              rules: [
                { required: true, message: t`msg.err.required`},
                { validator: (_rule, value, cb) => {
                  let [low, high] = rangeIntervalPerPage
                  let msg
                  if (!isBetween(+value * 1000, low || -Infinity, high || Infinity)) {
                    msg = t('interval_not_in_range', { name: t`request_interval` })
                      + ': ' + this._localizeRange(rangeIntervalPerPage, num => toSec(num) + t`unit_sec`)
                  }
                  cb(msg)
                }},
              ],
            })(
              <input className="material-input dark is-fullwidth" type="number" />,
            )}
            <span>{t`unit_sec`}</span>
          </FormItem>
        }

        { Object.keys(others).map(key => {
            let item: ConfigItem = others[key]
            switch (item.type) {
              case 'enum':
                return (
                  <FormItem key={key} label={t(`config.${key}.title`)}>
                    {getFieldDecorator(key, {
                      initialValue: item,
                      getValueFromEvent: (e) => {
                        return { ...item, value: e.target.value }
                      },
                      rules: [
                        { required: true, message: t`msg.err.required`},
                      ],
                    })(
                      <div className="is-fullwidth">
                        <select className="material-input dark" defaultValue={item.value}>
                          {
                            (item.enum || []).map(e => {
                              return <option key={e} value={e}>
                                {t(`config.${key}.values.${e}`)}
                              </option>
                            })
                          }
                        </select>
                      </div>,
                    )}
                  </FormItem>
                )
              case 'number':
                return (
                  <FormItem key={key} label={t(`config.${key}.title`)}>
                    {getFieldDecorator(key, {
                      initialValue: item.value,
                      getValueProps: value => { // fuxking stupid form lib
                        if (typeof value === 'object') {
                          return { value: value.value }
                        } else {
                          return { value }
                        }
                      },
                      normalize: (value) => {
                        if (typeof value === 'number') {
                          return { ...item, value}
                        }
                        return value
                      },
                      getValueFromEvent: (e) => {
                        return { ...item, value: +e.target.value }
                      },
                      rules: [
                        { required: true, message: t`msg.err.required` },
                      ],
                    })(
                      <input className="material-input dark is-fullwidth" type="number" />,
                    )}
                    <span>{t(`config.${key}.unit`)}</span>
                  </FormItem>
                )
              default:
                return null
            }

          })

        }
      </Form>
    )
  }
  private _localizeRange(range: number[], formatter: (x: number) => string = x => String(x) ): string {

    let { t } = this.props
    let [low, high] = range
    if (low === -Infinity || low == null) {
      return t('under_x', { num: formatter(range[1]) })
    }
    if (high === Infinity || high == null) {
      return t('above_x', { num: formatter(range[0]) })
    }
    return t('in_range_x_y', { num1: formatter(range[0]), num2: formatter(range[1]) })
  }
}

export default apply(IntervalForm, translate(['common', 'dashboard2']), Form.create())