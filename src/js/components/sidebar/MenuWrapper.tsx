import * as React from 'react'
import { withRouter } from 'react-router'
import { translate } from 'react-i18next'
import FA from 'react-fontawesome'
import { Menu } from 'antd'
import MenuItems, { MenuItem, getSelectionByPath } from './menu'
import * as config from 'config'
import { AuthConfig } from 'utils/config'

const SubMenu = Menu.SubMenu
const Item = Menu.Item

export class MenuWrapper extends React.PureComponent<any, any> {

  _menu: MenuItem[]

  _defaultSelectedKey: string
  _defaultOpenKey: string

  _filterByRole(menuItems: MenuItem[], userRoles: string[] = []): MenuItem[] {
    let filtered = menuItems.filter(item => hasRole(item.role, userRoles))
    filtered.forEach(i => {
      if (i.subItems) {
        i.subItems = this._filterByRole(i.subItems, userRoles)
      }
    })
    return filtered
  }

  _defaultSelected(): void {
    let { pathname } = this.props.location
    let selected = getSelectionByPath(pathname, this._menu)
    if (selected) {
      this._defaultSelectedKey = selected.key
      if (selected.parent) {
        this._defaultOpenKey = selected.parent.key
      }
    }
  }

  t = (key: string) => this.props.t('menu.' + key)

  PlanItem = (item: MenuItem) => {
    return <Item key={item.key} data={item}>{this.t(item.i18n || item.key)}</Item>
  }

  onItemClick = evt => {
    let item = evt.item.props.data

    if (item.key === 'logout') {
      preLogout()
    }

    if (item.external) {
      window.location.href = concatPrefix(item.path)
    } else {
      this.props.history.push(item.path)
    }

  }

  componentWillMount() {
    this._menu = MenuItems
    let { pathname } = this.props.location
    let selected = getSelectionByPath(pathname, this._menu)
    if (selected) {
      this._defaultSelectedKey = selected.key
      if (selected.parent) {
        this._defaultOpenKey = selected.parent.key
      }
    }
    this._menu = this._filterByRole(MenuItems, getRoles())
    this._defaultSelected()
  }

  renderMenuItem(item: MenuItem) {

    let title = <Title icon={item.icon} text={this.t(item.i18n || item.key)} />

    if (item.subItems && item.subItems.length) {
      return (
        <SubMenu
          key={item.key}
          onTitleClick={this.props.onSubMenuClick}
          title={title}
        >
          { item.subItems.map(this.PlanItem) }
        </SubMenu>
      )
    }
    return (
      <Item key={item.key} data={item}>
        { title }
      </Item>
    )
  }

  render() {

    return (
      <Menu
        className="sidebar-menu"
        theme="dark"
        mode="inline"
        defaultSelectedKeys={[this._defaultSelectedKey]}
        defaultOpenKeys={[this._defaultOpenKey]}
        onClick={this.onItemClick}
        inlineIndent={12}
      >

        {this._menu.map((item) => this.renderMenuItem(item))}

      </Menu>
    )
  }
}

function Title({ icon, text }) {
  return <span>
    { icon && <FA name={icon} /> }
    <span className="hide-when-collapsed">{text}</span>
  </span>
}

function concatPrefix(path: string) {
  return config.urlPrefix + path
}

function preLogout() {
  AuthConfig.clear()
  // also clear items from old APM site
  localStorage.removeItem('hc-apm-token')
  localStorage.removeItem('hc-apm-token-expireAt')
}

function getRoles() {
  let profile = AuthConfig.get('hc-apm-profile')
  if (profile === undefined) {
    // profile = cache.get('hc-apm-token')
    // todo: parse token claim to get profile
  }
  return profile.userRoleList.map(r => r.name)
}

function hasRole(neededRole: string[] | undefined, userRole: string[]): boolean {
  if (neededRole === undefined) {
    return true
  }
  for (let i in neededRole) {
    let role = neededRole[i]
    if (userRole.indexOf(role) > -1) {
      return true
    }
  }
  return false
}

export default translate()(withRouter(MenuWrapper))