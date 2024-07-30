import { service } from '@/utils/axios'

interface LoginParams {
  username: string
  password: string
}

// User login api
export function loginApi(data: LoginParams): Promise<any> {
  return service({
    url: '/api/auth/doLogin',
    method: 'post',
    data
  })
}

// Get User info
export function getUserInfo(): Promise<any> {
  return service({
    url: '/api/system/user/getUserInfo',
    method: 'get'
  })
}

// User logout api
export function logoutApi() {
  return service({
    url: '/api/auth/logout',
    method: 'get'
  })
}

// 获取用户租户集合
export function getUserTenantList() {
  return service({
    url: '/api/system/user/getUserTenantList',
    method: 'get'
  })
}

// 获取路由
export function getRoutes() {
  return service({
    url: '/api/system/menu/getRoutes',
    method: 'get'
  })
}

// 获取菜单&权限
export function getUserPermission() {
  return service({
    url: '/api/system/user/getUserPermission',
    method: 'get'
  })
}

// 获取表单详情
export function getOnlCgformHeadDetails(params: any) {
  return service({
    url: '/api/online/onlCgformHead/getOnlCgformHeadDetails',
    method: 'get',
    params
  })
}

// 获取表单模板schema
export function getGenTemplateDetails(params: any) {
  return service({
    url: '/api/online/genTemplate/getGenTemplateById',
    method: 'get',
    params
  })
}

// 获取菜单 amis schema
export function getSchema(params: any) {
  return service({
    url: '/api/system/menu/getSchemaById',
    method: 'get',
    params
  })
}

// 更新菜单 amis schema
export function updateSchema(data: any): Promise<any> {
  return service({
    url: '/api/system/menu/updateSchemaById',
    method: 'put',
    data
  })
}

// 获取流程定义信息
export function getDefinitionById(params: any) {
  return service({
    url: '/api/flow/definition/getById',
    method: 'get',
    params
  })
}

// 获取流程定义信息XML
export function getDefinitionXmlById(params: any) {
  return service({
    url: '/api/flow/definition/xmlString',
    method: 'get',
    params
  })
}

// 保存流程定义接口
export function definitionSaveXml(data: any): Promise<any> {
  return service({
    url: '/api/flow/definition/saveXml',
    method: 'post',
    data
  })
}

// 查询角色列表
export function listRole(query: Record<string, any>) {
  return service<any, any, any>({
    url: '/api/system/role/list',
    method: 'get',
    params: query
  }).catch(() => {
    return {
      total: 7,
      rows: [
        {
          createBy: null,
          createTime: '2024-04-29 09:52:22',
          updateBy: null,
          updateTime: null,
          remark: null,
          roleId: '102',
          roleName: '项目管理员',
          roleKey: 'Project Administrator',
          roleSort: 0,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        },
        {
          createBy: null,
          createTime: '2024-05-21 07:20:57',
          updateBy: null,
          updateTime: null,
          remark: null,
          roleId: '103',
          roleName: '部门主管',
          roleKey: 'BUM',
          roleSort: 0,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        },
        {
          createBy: null,
          createTime: '2024-04-23 23:45:45',
          updateBy: null,
          updateTime: null,
          remark: '超级管理员',
          roleId: '1',
          roleName: '超级管理员',
          roleKey: 'admin',
          roleSort: 1,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: true
        },
        {
          createBy: null,
          createTime: '2024-04-23 23:45:45',
          updateBy: null,
          updateTime: null,
          remark: '普通角色',
          roleId: '2',
          roleName: '普通角色',
          roleKey: 'common',
          roleSort: 2,
          dataScope: '2',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        },
        {
          createBy: null,
          createTime: '2024-04-01 10:51:30',
          updateBy: null,
          updateTime: null,
          remark: null,
          roleId: '100',
          roleName: '领导',
          roleKey: 'leader',
          roleSort: 3,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        },
        {
          createBy: null,
          createTime: '2024-05-29 03:42:28',
          updateBy: null,
          updateTime: null,
          remark: null,
          roleId: '104',
          roleName: '王哈哈',
          roleKey: '00',
          roleSort: 3,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        },
        {
          createBy: null,
          createTime: '2024-04-01 10:52:06',
          updateBy: null,
          updateTime: null,
          remark: null,
          roleId: '101',
          roleName: '员工',
          roleKey: 'yuangong',
          roleSort: 4,
          dataScope: '1',
          menuCheckStrictly: true,
          deptCheckStrictly: true,
          status: '0',
          delFlag: '0',
          flag: false,
          menuIds: null,
          deptIds: null,
          permissions: null,
          admin: false
        }
      ],
      code: 200,
      msg: '查询成功'
    }
  })
}

// 查询用户列表
export function listUser(query: Record<string, any>) {
  return service<any, any, any>({
    url: '/api/system/user/list',
    method: 'get',
    params: query
  }).catch(() => {
    return {
      total: 10,
      rows: [
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:45',
          updateBy: null,
          updateTime: null,
          remark: '管理员',
          userId: '1',
          deptId: '103',
          userName: 'admin',
          nickName: '若依',
          email: 'ry@163.com',
          phonenumber: '15888888888',
          sex: '1',
          avatar: '/profile/avatar/2024/05/17/logo_20240517135850A001.png',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '110.87.119.154',
          loginDate: '2024-06-06 23:10:36',
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '103',
            parentId: null,
            ancestors: null,
            deptName: '研发部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: true
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:45',
          updateBy: null,
          updateTime: null,
          remark: '测试员',
          userId: '2',
          deptId: '105',
          userName: 'ry',
          nickName: '若依',
          email: 'ry@qq.com',
          phonenumber: '15666666666',
          sex: '1',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '110.178.211.126',
          loginDate: '2024-04-24 10:11:39',
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '105',
            parentId: null,
            ancestors: null,
            deptName: '测试部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-04-01 10:54:23',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '100',
          deptId: null,
          userName: 'leader',
          nickName: '领导',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '58.49.184.50',
          loginDate: '2024-04-26 14:22:03',
          dept: null,
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-04-01 10:54:35',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '101',
          deptId: null,
          userName: 'yuangong',
          nickName: '员工',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '218.74.8.235',
          loginDate: '2024-04-30 23:20:53',
          dept: null,
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-04-29 09:50:38',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '102',
          deptId: '104',
          userName: '奥运',
          nickName: '项目管理员',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '',
          loginDate: null,
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '104',
            parentId: null,
            ancestors: null,
            deptName: '市场部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-05-07 21:33:43',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '103',
          deptId: '105',
          userName: 'testzz',
          nickName: '组长',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '58.247.23.242',
          loginDate: '2024-06-06 10:46:04',
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '105',
            parentId: null,
            ancestors: null,
            deptName: '测试部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-05-15 14:35:28',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '104',
          deptId: '107',
          userName: 'xiangzl',
          nickName: 'xiangzl',
          email: '',
          phonenumber: '18919066816',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '',
          loginDate: null,
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '107',
            parentId: null,
            ancestors: null,
            deptName: '运维部门',
            orderNum: null,
            leader: '若依',
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-05-17 01:36:39',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '105',
          deptId: '202',
          userName: 'md',
          nickName: '门店店长',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '',
          loginDate: null,
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '202',
            parentId: null,
            ancestors: null,
            deptName: '门店',
            orderNum: null,
            leader: null,
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-05-21 09:14:36',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '106',
          deptId: '202',
          userName: 'xuyt1',
          nickName: 'xuyt1',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '',
          loginDate: null,
          dept: {
            createBy: null,
            createTime: null,
            updateBy: null,
            updateTime: null,
            remark: null,
            deptId: '202',
            parentId: null,
            ancestors: null,
            deptName: '门店',
            orderNum: null,
            leader: null,
            phone: null,
            email: null,
            status: null,
            delFlag: null,
            parentName: null,
            children: []
          },
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        },
        {
          createBy: 'admin',
          createTime: '2024-05-21 09:15:23',
          updateBy: null,
          updateTime: null,
          remark: null,
          userId: '107',
          deptId: null,
          userName: 'xuyt2',
          nickName: 'xuyt2',
          email: '',
          phonenumber: '',
          sex: '0',
          avatar: '',
          password: null,
          status: '0',
          delFlag: '0',
          loginIp: '',
          loginDate: null,
          dept: null,
          roles: [],
          roleIds: null,
          postIds: null,
          roleId: null,
          admin: false
        }
      ],
      code: 200,
      msg: '查询成功'
    }
  })
}

// 查询部门列表
export function listDept(query: Record<string, any>) {
  return service<any, any, any>({
    url: '/api/system/dept/list',
    method: 'get',
    params: query
  }).catch(() => {
    return {
      msg: '操作成功',
      code: 200,
      data: [
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '100',
          parentId: '0',
          ancestors: '0',
          deptName: '若依科技',
          orderNum: 0,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '101',
          parentId: '100',
          ancestors: '0,100',
          deptName: '深圳总公司',
          orderNum: 1,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-29 06:12:52',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '205',
          parentId: '100',
          ancestors: '0,100',
          deptName: '1',
          orderNum: 1,
          leader: null,
          phone: null,
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '102',
          parentId: '100',
          ancestors: '0,100',
          deptName: '长沙分公司',
          orderNum: 2,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-17 01:35:23',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '202',
          parentId: '100',
          ancestors: '0,100',
          deptName: '门店',
          orderNum: 2,
          leader: null,
          phone: null,
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-17 01:35:48',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '203',
          parentId: '100',
          ancestors: '0,100',
          deptName: '供应商',
          orderNum: 2,
          leader: null,
          phone: null,
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-17 01:36:15',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '204',
          parentId: '100',
          ancestors: '0,100',
          deptName: '事业部',
          orderNum: 2,
          leader: null,
          phone: null,
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-15 14:31:19',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '201',
          parentId: '100',
          ancestors: '0,100',
          deptName: 'xzl的部门',
          orderNum: 3,
          leader: 'xzl',
          phone: '18919000000',
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '103',
          parentId: '101',
          ancestors: '0,100,101',
          deptName: '研发部门',
          orderNum: 1,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '104',
          parentId: '101',
          ancestors: '0,100,101',
          deptName: '市场部门',
          orderNum: 2,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '105',
          parentId: '101',
          ancestors: '0,100,101',
          deptName: '测试部门',
          orderNum: 3,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '106',
          parentId: '101',
          ancestors: '0,100,101',
          deptName: '财务部门',
          orderNum: 4,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '107',
          parentId: '101',
          ancestors: '0,100,101',
          deptName: '运维部门',
          orderNum: 5,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '108',
          parentId: '102',
          ancestors: '0,100,102',
          deptName: '市场部门',
          orderNum: 1,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-04-23 23:45:44',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '109',
          parentId: '102',
          ancestors: '0,100,102',
          deptName: '财务部门',
          orderNum: 2,
          leader: '若依',
          phone: '15888888888',
          email: 'ry@qq.com',
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        },
        {
          createBy: 'admin',
          createTime: '2024-05-09 08:31:35',
          updateBy: null,
          updateTime: null,
          remark: null,
          deptId: '200',
          parentId: '103',
          ancestors: '0,100,101,103',
          deptName: 'gggg',
          orderNum: 0,
          leader: null,
          phone: null,
          email: null,
          status: '0',
          delFlag: '0',
          parentName: null,
          children: []
        }
      ]
    }
  })
}
