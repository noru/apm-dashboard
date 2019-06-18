import * as React from 'react'
import { Layout } from 'antd'

const { Content } = Layout

export default class ContentWrapper extends React.PureComponent<any, any> {

  render() {
    let { marginLeft, ...restProps } = this.props

    return (
      <Layout style={{ marginLeft }} {...restProps}>
        <Content id="content-wrapper">
          { this.props.children }
        </Content>
      </Layout>
    )
  }
}
