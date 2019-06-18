import * as React from 'react'
import FA from 'react-fontawesome'
import { Layout } from 'antd'
import MenuWrapper from 'components/sidebar/MenuWrapper'
import ContentWrapper from 'components/sidebar/ContentWrapper'
import './SideBarLayout.scss'
import * as logo from '../../assets/img/ge_logo.png'

const { Sider } = Layout
interface State {
  collapsed: boolean
}
export default class SideBarLayout extends React.PureComponent<any, State> {

  static InitWidth = 190
  static CollapsedWidth = 60

  state = {
    collapsed: false,
  }

  toggleCollapsed = () => {
    this.setState({ collapsed: !this.state.collapsed })
  }

  render() {
    let { collapsed } = this.state
    const { children } = this.props
    return (
      <Layout className="sidebar-layout">

        <Sider
          collapsible
          collapsed={collapsed}
          width={SideBarLayout.InitWidth}
          collapsedWidth={SideBarLayout.CollapsedWidth}
          className="sidebar-sider"
        >
          <div className="logo level">
            <div className="level-item has-text-centered">
              <figure className="image is-24x24 level-item">
                <img src={logo} />
              </figure>
              <div className="logo-text hide-when-collapsed">APM</div>
            </div>
          </div>
          <div className="has-text-centered collapse-button">
            <a onClick={this.toggleCollapsed}>
              <FA name="chevron-left" />
            </a>
          </div>

          <MenuWrapper onSubMenuClick={() => collapsed && this.toggleCollapsed()} />

        </Sider>

        <ContentWrapper
          className="sidebar-content"
          marginLeft={collapsed ? SideBarLayout.CollapsedWidth : SideBarLayout.InitWidth} >
          { children }
        </ContentWrapper>

      </Layout>

    )
  }
}
