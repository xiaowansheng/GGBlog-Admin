import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/permission",
  name: "Permission",
  component: Layout,
  meta: {
    title: $t("menus.permission"),
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/permission/role",
      name: "Role",
      component: () => import("@/views/permission/role/index.vue"),
      meta: {
        title: $t("menus.permissionRole"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/menu",
      name: "Menu",
      component: () => import("@/views/permission/menu/index.vue"),
      meta: {
        title: $t("menus.permissionMenu"),
        roles: ["admin", "common"]
      }
    },
    {
      path: "/permission/resource",
      name: "Resource",
      component: () => import("@/views/permission/resource/index.vue"),
      meta: {
        title: $t("menus.permissionResource"),
        roles: ["admin", "common"]
      }
    }
  ]
} as RouteConfigsTable;
