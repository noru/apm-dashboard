import React from 'react'
import { Modal, /* Select, */ TreeSelect } from 'antd'
import { translate } from 'react-i18next'
import { connect } from 'dva'
import { AuthConfig } from 'utils/config'
import { flow, isNullOrEmpty } from 'noru-utils/lib'
import { LS_KEY } from 'utils/constants'
import './index.scss'

// const Option = Select.Option
export class HierarchyConfig extends React.PureComponent<any, any> {

  static _recursivelyMapSubOrgs(orgs) {
    if (isNullOrEmpty(orgs)) {
      return []
    }
    return orgs.map(o => {
      return {
        label: o.name,
        value: String(o.id),
        key: o.id,
        children: this._recursivelyMapSubOrgs(o.subOrgList),
      }
    }).sort(((a, b) => {
      if (isNullOrEmpty(a.children) && !isNullOrEmpty(b.children)) {
        return 1
      }
      if (!isNullOrEmpty(a.children) && isNullOrEmpty(b.children)) {
        return -1
      }
      return a.label.localeCompare(b.label, 'zh')
     }))
  }

  state = {
    selectedOrgs: AuthConfig.get(LS_KEY.Orgs),
  }

  constructor(props) {
    super(props)
    props.dispatch({ type: 'dashboard2/get/org-tree' })
  }

  onOrgSelect = (selectedOrgs) => {
    this.setState({ selectedOrgs })
  }

  onCancel = () => {
    this.setState({ selectedOrgs: AuthConfig.get(LS_KEY.Orgs) })
    this.props.onCancel()
  }

  render() {
    let { show, t, onOk, orgTree } = this.props
    let { selectedOrgs } = this.state
    orgTree = HierarchyConfig._recursivelyMapSubOrgs(orgTree)

    return (
      <Modal
        className="hierarchy-config-modal"
        closable={false}
        visible={show}
        onOk={() => onOk(selectedOrgs)}
        onCancel={this.onCancel}
        okText={t`save`}
        cancelText={t`cancel`}
        width="65%"
      >
        <div className="config-modal-content">

          <h2>{t`choose_orgs`}</h2>
          <TreeSelect
            showSearch
            value={selectedOrgs || undefined}
            style={{ width: '100%' }}
            dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
            allowClear
            multiple
            treeDefaultExpandAll
            treeNodeFilterProp={'label'}
            onChange={this.onOrgSelect}
            treeData={orgTree}
          />

          {/* <h2>{t`选择科室`}</h2>
          <Select
            mode="tags"
            onChange={this.onDeptSelect}
            value={selectedDepts}
            style={{ width: '100%' }}
          >
            { deptOptions.map(i => <Option key={i}>{i}</Option>) }
          </Select> */}
        </div>

      </Modal>
    )
  }
}

function mapState2Props({ dashboard2 }) {
  return { orgTree: dashboard2.get('orgTree') }
}

export default flow(
  HierarchyConfig,
  translate(['common', 'dashboard2']),
  connect(mapState2Props),
)
