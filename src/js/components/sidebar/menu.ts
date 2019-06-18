
export interface MenuItem {
  key: string,
  i18n?: string,
  icon?: string,
  role?: string[],
  path?: string,
  external?: boolean,
  parent?: MenuItem,
  subItems?: MenuItem[]
}

export const MenuItems: MenuItem[] = [
  {
    key: 'homepage',
    i18n: 'homepage',
    icon: 'home',
    path: '/homeAssetHead.xhtml',
    external: true,
  },
  {
    key: 'asset_archives',
    i18n: 'asset_archives',
    icon: 'folder-open-o',
    role: ['SuperAdmin', 'HospitalHead', 'AssetHead', 'AssetStaff'],
    subItems: [
      {
        key: 'basic_info',
        path: '/portal/asset/info/List.xhtml',
        external: true,
      },
      {
        key: 'asset_inventory',
        path: '/portal/asset/AssetInventory.xhtml',
        external: true,
      },
      {
        key: 'asset_browser',
        path: '/v2/AssetBrowser',
      },
      {
        key: 'contract_management',
        path: '/portal/asset/contract/List.xhtml',
        external: true,
      },
      {
        key: 'supplier_management',
        path: '/portal/supplier/List.xhtml',
        external: true,
      },
      {
        key: 'asset_termination',
        path: '/portal/asset/info/List.xhtml?terminate=true',
        external: true,
      },
      {
        key: 'asset_file_creation',
        path: '/portal/asset/createAsset/RequestsList.xhtml',
        external: true,
      },
      {
        key: 'application_list',
        path: '/portal/asset/ApplicationList.xhtml',
        role: ['AssetHead', 'DeptHead'],
        external: true,
      },
      {
        key: 'asset_import',
        path: '/portal/asset/assetImport/assetImport.xhtml',
        external: true,
      },
    ],
  },
  {
    key: 'maintenance_process',
    i18n: 'maintenance_process',
    icon: 'wrench',
    role: ['SuperAdmin', 'HospitalHead', 'AssetHead', 'AssetStaff', 'DeptHead', 'ClinicalStaff'],
    subItems: [
      {
        key: 'order_management',
        path: '/portal/wo/woList.xhtml',
        external: true,
      },
      {
        key: 'event_subscription',
        path: '/portal/asset/assetTag/TagSubscribeList.xhtml',
        external: true,
      },
    ],
  },
  {
    key: 'asset_monitor',
    icon: 'bell-o',
    subItems: [
      {
        key: 'device_status_monitor',
        path: '/v2/AssetStatus',
      },
      {
        key: 'failure_analysis',
        path: '/v2/FailureAnalysis',
      },
      {
        key: 'staff_performance',
        path: '/v2/StaffPerf',
      },
      {
        key: 'process_analysis',
        path: '/v2/ProcessAnalysis',
        role: ['SuperAdmin', 'HospitalHead', 'AssetHead', 'AssetStaff'],
      },
      {
        key: 'maintenance_costs',
        path: '/v2/MaintenanceCost',
      },
      {
        key: 'scan_details',
        path: '/v2/ScanDetails',
        role: ['SuperAdmin', 'HospitalHead', 'AssetHead', 'AssetStaff', 'DeptHead'],
      },
      {
        key: 'dashboard',
        path: '/v2/Dashboard',
      },
    ],
  },
  {
    key: 'preventive_maintenance',
    icon: 'check-square-o',
    subItems: [
      {
        key: 'inspection_order',
        path: '/portal/insp/InspOrderList.xhtml',
        external: true,
      },
      {
        key: 'maintenence_record',
        path: '/portal/pm/List.xhtml',
        external: true,
      },
      {
        key: 'maintenence_statistics',
        path: '/v2/MaintenanceStats',
      },
      {
        key: 'metrology_order',
        path: '/portal/insp/MetrologyOrderList.xhtml',
        external: true,
      },
      {
        key: 'inspection_counting',
        path: '/portal/insp/checkListList.xhtml',
        external: true,
      },
    ],
  },
  {
    key: 'documents',
    icon: 'book',
    subItems: [
      {
        key: 'document_management',
        path: '/portal/asset/fileAttachment/List.xhtml',
        external: true,
      },
    ],
  },
  {
    key: 'performance_analysis',
    role: ['SuperAdmin', 'HospitalHead', 'AssetHead'],
    icon: 'bar-chart',
    subItems: [
      {
        key: 'finacial_analyisis_forecast',
        path: '/v2/AssetPerf',
      },
      {
        key: 'finacial_analyisis_forecast_v2',
        i18n: 'finacial_analyisis_forecast',
        path: '/v2/Reports/AssetPerf',
      },
      {
        key: 'operation_performance',
        path: '/v2/AssetOperationalPerf',
      },
      {
        key: 'decision_making',
        path: '/v2/DecisionMaking',
      },
    ],
  },
  {
    key: 'settings',
    role: ['SuperAdmin', 'ITAdmin'],
    path: '',
    subItems: [
      {
        key: 'site-admin',
        role: ['SuperAdmin'],
        path: '',
      },
      {
        key: 'org-admin',
        role: ['!SuperAdmin'],
        path: '',
      },
      {
        key: 'user-admin',
        role: ['!SuperAdmin'],
        path: '',
      },
    ],
  },
  {
    key: 'my_account',
    icon: 'user-o',
    path: '/portal/profile.xhtml',
    external: true,
  },
  {
    key: 'logout',
    icon: 'power-off',
    path: '/logout.xhtml',
    external: true,
  },
]

export function getSelectionByPath(pathname: string, items: MenuItem[], parent?: MenuItem): MenuItem | undefined {
  for (let i of items) {
    if (i.external) {
      continue
    }
    if (pathname === i.path) {
      i.parent = parent
      return i
    }
    if (i.subItems) {
      let sub = getSelectionByPath(pathname, i.subItems, i)
      if (sub) {
        return sub
      }
    }
  }
}

export default MenuItems
