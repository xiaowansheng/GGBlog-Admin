// 模拟后端动态生成路由
import { MockMethod } from "vite-plugin-mock";

/**
 * roles：页面级别权限，这里模拟二种 "admin"、"common"
 * admin：管理员角色
 * common：普通角色
 */

const permissionRouter = [
  {
    path: "/permission",
    meta: {
      title: "menus.permission",
      icon: "lollipop",
      rank: 10
    },
    children: [
      {
        path: "/permission/role/index",
        name: "Role",
        meta: {
          title: "menus.permissionRole",
          roles: ["admin", "common"]
        }
      },
      {
        path: "/permission/menu/index",
        name: "Menu",
        meta: {
          title: "menus.permissionMenu",
          roles: ["admin", "common"]
        }
      },
      {
        path: "/permission/resource/index",
        name: "Resource",
        meta: {
          title: "menus.permissionResource",
          roles: ["admin", "common"]
        }
      },
      {
        path: "/permission/page/index",
        name: "PermissionPage",
        meta: {
          title: "menus.permissionPage",
          roles: ["admin", "common"]
        }
      },
      {
        path: "/permission/button/index",
        name: "PermissionButton",
        meta: {
          title: "menus.permissionButton",
          roles: ["admin", "common"],
          auths: ["btn_add", "btn_edit", "btn_delete"]
        }
      }
    ]
  },
];

export default [
  {
    url: "/getAsyncRoutes",
    method: "get",
    response: () => {
      return {
        success: true,
        data: permissionRouter
      };
    }
  }
] as MockMethod[];
