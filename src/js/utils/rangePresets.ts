import moment from 'moment'

const momentNow = moment()
const defaultPresets = {
  oneWeek: {
    text: '一周内',
    start: momentNow.clone().subtract(7, 'days'),
    end: momentNow,
  },
  oneMonth: {
    text: '一月内',
    start: momentNow.clone().subtract(1, 'month'),
    end: momentNow,
  },
  oneYear: {
    text: '一年内',
    start: momentNow.clone().subtract(1, 'year'),
    end: momentNow,
  },
  currentMonth: {
    text: '本月',
    start: momentNow.clone().startOf('month'),
    end: momentNow.clone().endOf('month'),
  },
  yearBeforeLast: {
    text: momentNow.clone().startOf('year').subtract(2, 'year').year(),
    start: momentNow.clone().startOf('year').subtract(2, 'year'),
    end: momentNow.clone().endOf('year').subtract(2, 'year'),
  },
  lastYear: {
    text: momentNow.clone().startOf('year').subtract(1, 'year').year(),
    start: momentNow.clone().startOf('year').subtract(1, 'year'),
    end: momentNow.clone().endOf('year').subtract(1, 'year'),
  },
  currentYear: {
    text: momentNow.clone().startOf('year').year(),
    start: momentNow.clone().startOf('year'),
    end: momentNow,
  },
  nextYear: {
    text: momentNow.clone().startOf('year').add(1, 'year').year(),
    start: momentNow.clone().startOf('year').add(1, 'year'),
    end: momentNow.clone().endOf('year').add(1, 'year'),
  },
  yearAfterNext: {
    text: momentNow.clone().startOf('year').add(2, 'year').year(),
    start: momentNow.clone().startOf('year').add(2, 'year'),
    end: momentNow.clone().endOf('year').add(2, 'year'),
  },
}

export const getRangePresets = (configs) => {
  let rangePresets: any = []
  if (!Array.isArray(configs) || (Array.isArray(configs) && !configs.length)) {
    rangePresets = Object.keys(defaultPresets).map(key => defaultPresets[key])
  } else {
    // configs filter duplicated items
    rangePresets = configs.filter((config, i, array) => {
      return i === array.indexOf(config)
    }).map((config) => {
      if (typeof config === 'string' && defaultPresets[config]) {
        return defaultPresets[config]
      }

      let key = config.key
      if (!key) { return }

      let displayText = config.displayText
      let startDateTime = config.startDateTime
      let endDateTime = config.endDateTime

      // startDateTime < endDateTime
      if (
        displayText
        && moment.isMoment(startDateTime)
        && moment.isMoment(endDateTime)
        && startDateTime < endDateTime
      ) {
        return config
      }

      if (defaultPresets[key]) {
        return defaultPresets[key]
      }
    }).filter(n => n)
  }

  return rangePresets
}

export function disabledDate(current) {
  let now = new Date()
  // can not select days after today
  // and can not select days before three years ago
  return current && (current.valueOf() > now || current < moment(now).subtract(3, 'year'))
}