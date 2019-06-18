
import * as i18n from 'i18next'
import * as XHR from 'i18next-xhr-backend'
import * as Cache from 'i18next-localstorage-cache'
import * as LanguageDetector from 'i18next-browser-languagedetector'
import { hashOf } from 'noru-utils/lib'

let hash = hashOf(
  require('!file-loader?name=[hash]&emitFile=false!../assets/locales/zh/common.json') +
  require('!file-loader?name=[hash]&emitFile=false!../assets/locales/zh/dashboard.json') +
  require('!file-loader?name=[hash]&emitFile=false!../assets/locales/zh/dashboard2.json'),
)
let instance = i18n
  .use(XHR)
  .use(Cache)
  .use(LanguageDetector)
  .init({
    fallbackLng: 'zh',
    ns: ['common'],
    defaultNS: 'common',
    debug: false,
    cache: {
      enabled: true,
      versions: {
        'zh': hash, // use content hash as version, so everytime content changes the cache got renewed
        'zh-CN': hash,
      },
    },
    backend: {
      // Options: https://github.com/i18next/i18next-xhr-backend
      loadPath: 'assets/locales/{{lng}}/{{ns}}.json',
    },
    interpolation: {
      escapeValue: false, // not needed for react
      formatSeparator: ',',
      format(value, format, _lng) {
        if (format === 'uppercase') {
          return value.toUpperCase()
        }
        return value
      },
    },
  })

export default instance