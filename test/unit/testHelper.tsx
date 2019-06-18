import * as React from 'react'
import chai, { expect } from 'chai'
import 'console.table'
import { JSDOM } from 'jsdom'
import mock = require('mock-require')
mock('!file-loader?name=[hash]&emitFile=false!../assets/locales/zh/common.json', { default: 'file-hash' })

// i18next: to avoid 't' not defined issue
let mockT = (key, options) => key

function ComponentMockHelper(Clazz) {
  return class Mocked extends Clazz {
    render() {
      return <Clazz t={mockT} />
    }
  }
}

const jsdom = new JSDOM('<!doctype html><html><body></body></html>')

const { window } = jsdom

function copyProps(src, target) {
  let props = {}
  Object.getOwnPropertyNames(src)
    .filter(prop => typeof target[prop] === 'undefined')
    .forEach(prop => props[prop] = Object.getOwnPropertyDescriptor(src, prop))
  Object.defineProperties(target, props)
}

global['window'] = window
global['document'] = window.document
global['navigator'] = {
  userAgent: 'node.js',
}
global['__USE_MOCK__'] = true
copyProps(window, global)

export { expect, mockT, ComponentMockHelper }
