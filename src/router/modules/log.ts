import { $t } from "@/plugins/i18n";
const { VITE_HIDE_HOME } = import.meta.env;
const Layout = () => import("@/layout/index.vue");

export default {
  path: "/log",
  name:"Log",
  component: Layout,
  meta: {
    title: "日志管理",
    icon: "lollipop",
    rank: 10
  },
  children: [
    {
      path: "/log/operation",
      name: "OperationLog",
      component: () => import("@/views/log/operation/index.vue"),
      meta: {
        title: "操作日志",
        roles: ["admin", "common"]
      }
    },
    {
      path: "/log/error",
      name: "ErrorLog",
      component: () => import("@/views/log/error/index.vue"),
      meta: {
        title: "错误日志",
        roles: ["admin", "common"]
      }
    }
  ]
} as RouteConfigsTable;
